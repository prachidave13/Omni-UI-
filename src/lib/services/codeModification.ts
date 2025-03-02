import { GeneratedFile } from "./llm";

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface CodeModificationResult {
  modifiedFiles: GeneratedFile[];
  explanation: string;
}

export const modifyReactCode = async (
  prompt: string,
  files: Array<{ name: string; content: string; isFolder?: boolean }>,
): Promise<CodeModificationResult> => {
  try {
    // Filter out folder entries
    const codeFiles = files.filter((file) => !file.isFolder);

    // Create a simplified representation of the codebase for the LLM
    const codebaseRepresentation = codeFiles
      .map((file) => {
        return `File: ${file.name}\n\n${file.content}\n\n---\n\n`;
      })
      .join("");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are an expert React developer. You will be given a codebase and a request to modify it. Analyze the code and make the requested changes. Return a JSON object with modifiedFiles array and explanation string.",
          },
          {
            role: "user",
            content: `I have a React project with the following files:\n\n${codebaseRepresentation}\n\nI want to: ${prompt}\n\nPlease modify the necessary files to implement this feature. Return a JSON object with the following structure:\n{\n  "modifiedFiles": [\n    {\n      "name": "filename",\n      "content": "updated file content"\n    }\n  ],\n  "explanation": "Explanation of the changes made"\n}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON object from response
    const jsonMatch = content.match(/\{[\s\S]*\}/m);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        modifiedFiles: result.modifiedFiles || [],
        explanation: result.explanation || "Changes applied successfully.",
      };
    }

    throw new Error("Failed to parse LLM response");
  } catch (error) {
    console.error("Error modifying code:", error);
    return {
      modifiedFiles: [],
      explanation: `Error: ${error.message || "Unknown error occurred"}`,
    };
  }
};
