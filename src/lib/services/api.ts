import { UserInput, ProcessedTask } from "../types/userInput";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const processImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/process-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process image");
  }

  const data = await response.json();
  return data.text;
};

export const processDocument = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/process-document`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process document");
  }

  const data = await response.json();
  return data.text;
};

export const generateTasks = async (
  input: UserInput,
): Promise<ProcessedTask[]> => {
  // Transform frontend state to match backend expectations
  const formattedInput = {
    description: input.description,
    requirements: input.requirements.content, // Convert object to string
    inspiration_text: input.inspiration.processedText || "", // Convert optional field
    integrations: input.integrations || [],
  };

  console.log("Formatted request:", formattedInput); // Debugging

  const response = await fetch(`${API_URL}/generate-tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedInput), // Use formatted input
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response from server:", errorText);
    throw new Error(`Failed to generate tasks: ${errorText}`);
  }

  const data = await response.json();
  return data.tasks;
};
