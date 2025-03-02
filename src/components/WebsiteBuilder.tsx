import React, { useState, useEffect, useRef } from "react";
import { Check, Code, Eye, Loader2, Send } from "lucide-react";
import { Button } from "./ui/button";
import { generateWebsiteFiles, GeneratedFile } from "@/lib/services/llm";
import { useUserInputStore } from "@/lib/stores/userInputStore";

interface WebsiteBuilderProps {
  initialCode?: string;
}

const WebsiteBuilder = ({
  initialCode = "<div>Loading...</div>",
}: WebsiteBuilderProps) => {
  const { userInput } = useUserInputStore();
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [buildSteps, setBuildSteps] = useState<
    Array<{ id: number; name: string; completed: boolean }>
  >([]);
  const [files, setFiles] = useState<
    Array<{ id: number; name: string; content: string; isFolder?: boolean }>
  >([]);
  const [selectedFile, setSelectedFile] = useState<{
    id: number;
    name: string;
    content: string;
    isFolder?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const generateFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the description from the user input store
        const description =
          userInput.description ||
          "Create a simple React app with a header, main content, and footer";

        // Generate initial build steps for React project
        const initialBuildSteps = [
          { id: 1, name: "Initializing project", completed: false },
          { id: 2, name: "Creating package.json", completed: false },
          { id: 3, name: "Setting up React environment", completed: false },
          { id: 4, name: "Creating public directory", completed: false },
          { id: 5, name: "Setting up HTML entry point", completed: false },
          { id: 6, name: "Creating src directory", completed: false },
          { id: 7, name: "Setting up React components", completed: false },
          { id: 8, name: "Adding styles", completed: false },
          {
            id: 9,
            name: "Implementing features from description",
            completed: false,
          },
          { id: 10, name: "Finalizing project", completed: false },
        ];
        setBuildSteps(initialBuildSteps);
        setCurrentStepIndex(0);

        // Process steps one by one with visual feedback
        const processStepByStep = async () => {
          // Step 1: Initialize project
          await completeStep(0, 800);

          // Step 2: Create package.json
          await completeStep(1, 1200);

          // Step 3: Set up React environment
          await completeStep(2, 1500);

          // Step 4: Create public directory
          await completeStep(3, 1000);

          // Step 5: Set up HTML entry point
          await completeStep(4, 1200);

          // Step 6: Create src directory
          await completeStep(5, 800);

          // Generate files after some initial steps to make it seem like we're building the project
          const generatedFiles = await generateWebsiteFiles(description, true);

          // Process the generated files
          const processedFiles = generatedFiles.map((file, index) => ({
            id: index + 1,
            name: file.name,
            content: file.content,
            isFolder: file.isFolder,
          }));

          // Step 7: Set up React components
          await completeStep(6, 1500);

          // Step 8: Add styles
          await completeStep(7, 1200);

          // Step 9: Implement features from description
          await completeStep(8, 2000);

          // Find index.js or App.js to show in preview
          const mainFile = processedFiles.find(
            (file) =>
              file.name === "App.js" ||
              file.name === "App.jsx" ||
              file.name === "index.js" ||
              file.name === "index.jsx" ||
              file.name === "App.tsx" ||
              file.name === "index.tsx",
          );

          if (mainFile) {
            setCode(mainFile.content);
          } else {
            // Fallback to any HTML file
            const htmlFile = processedFiles.find((file) =>
              file.name.endsWith(".html"),
            );
            if (htmlFile) {
              setCode(htmlFile.content);
            }
          }

          // Set the files and select the first one
          setFiles(processedFiles);
          setSelectedFile(processedFiles[0] || null);

          // Step 10: Finalize project
          await completeStep(9, 1000);
        };

        // Helper function to complete a step with delay
        const completeStep = (
          stepIndex: number,
          delay: number,
        ): Promise<void> => {
          return new Promise((resolve) => {
            setCurrentStepIndex(stepIndex);
            setTimeout(() => {
              setBuildSteps((prev) =>
                prev.map((step, idx) =>
                  idx === stepIndex ? { ...step, completed: true } : step,
                ),
              );
              resolve();
            }, delay);
          });
        };

        // Start the step-by-step process
        await processStepByStep();
      } catch (err) {
        console.error("Error generating files:", err);
        setError("Failed to generate website files. Please try again.");
        // Clear any pending timeouts
        if (stepTimeoutRef.current) {
          clearTimeout(stepTimeoutRef.current);
        }
      } finally {
        setIsLoading(false);
      }
    };

    generateFiles();

    // Cleanup function to clear any pending timeouts
    return () => {
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, [userInput.description]);

  const handleDeploy = () => {
    // Find HTML file for deployment
    const htmlFile = files.find((file) => file.name.endsWith(".html"));
    const cssFiles = files.filter((file) => file.name.endsWith(".css"));
    const jsFiles = files.filter(
      (file) => file.name.endsWith(".js") && !file.name.endsWith(".json"),
    );

    // Create a complete HTML document with inline CSS and JS
    let deployCode = htmlFile ? htmlFile.content : code;

    // Open a new tab with the preview
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      // Insert CSS files into the head
      let cssContent = "";
      cssFiles.forEach((file) => {
        cssContent += `<style>${file.content}</style>`;
      });

      // Insert JS files before the closing body tag
      let jsContent = "";
      jsFiles.forEach((file) => {
        jsContent += `<script>${file.content}</script>`;
      });

      // If we have a full HTML document, inject the CSS and JS
      if (deployCode.includes("<html") && deployCode.includes("</html>")) {
        // Insert CSS into head
        deployCode = deployCode.replace("</head>", `${cssContent}</head>`);
        // Insert JS before closing body
        deployCode = deployCode.replace("</body>", `${jsContent}</body>`);
      } else {
        // If it's just a fragment, wrap it in a complete HTML document
        deployCode = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Deployed Website</title>
            ${cssContent}
          </head>
          <body>
            ${deployCode}
            ${jsContent}
          </body>
          </html>
        `;
      }

      newWindow.document.write(deployCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1F] text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="text-xl font-bold">Website Builder</div>
        <div className="text-gray-400">
          Prompt: {userInput.description || "No description provided"}
        </div>
        <Button
          onClick={handleDeploy}
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading || files.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Deploy"
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-xl">Generating your React project...</p>
            <p className="text-gray-400 mt-2">This may take a few moments</p>
          </div>

          <div className="w-[600px] border border-gray-800 rounded-lg p-6 bg-gray-900/50">
            <h3 className="text-lg font-medium mb-4">Build Progress</h3>
            <div className="space-y-3">
              {buildSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${index === currentStepIndex ? "bg-purple-900/30 border border-purple-500/30" : "bg-gray-800/30"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500/20" : index === currentStepIndex ? "bg-purple-500/20" : "bg-gray-700"}`}
                  >
                    {step.completed ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : index === currentStepIndex ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : null}
                  </div>
                  <span
                    className={
                      index === currentStepIndex
                        ? "text-purple-300"
                        : step.completed
                          ? "text-green-300"
                          : "text-gray-400"
                    }
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p className="text-xl mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        /* Main content */
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Build steps */}
          <div className="w-[350px] border-r border-gray-800 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Build Steps</h2>
            <div className="space-y-2">
              {buildSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500/20" : "bg-gray-700"}`}
                  >
                    {step.completed && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <span>{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle section - File explorer */}
          <div className="w-[350px] border-r border-gray-800 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">File Explorer</h2>
            {files.length === 0 ? (
              <p className="text-gray-400">No files generated yet</p>
            ) : (
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => !file.isFolder && setSelectedFile(file)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedFile?.id === file.id ? "bg-blue-500/20" : "hover:bg-gray-800"}`}
                  >
                    {file.isFolder ? (
                      <span className="text-yellow-500">📁</span>
                    ) : file.name.endsWith(".html") ? (
                      <span className="text-orange-400">📄</span>
                    ) : file.name.endsWith(".css") ? (
                      <span className="text-blue-400">📄</span>
                    ) : file.name.endsWith(".js") ? (
                      <span className="text-yellow-400">📄</span>
                    ) : (
                      <span className="text-gray-400">📄</span>
                    )}
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right section - Code editor and preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 flex items-center gap-2 ${activeTab === "code" ? "border-b-2 border-purple-500" : ""}`}
              >
                <Code size={16} />
                Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-2 flex items-center gap-2 ${activeTab === "preview" ? "border-b-2 border-purple-500" : ""}`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "code" ? (
                <div className="p-4 font-mono text-sm bg-[#1E1E3F] h-full">
                  {selectedFile ? (
                    <pre className="whitespace-pre-wrap">
                      <textarea
                        value={selectedFile.content}
                        onChange={(e) => {
                          const updatedFiles = files.map((f) =>
                            f.id === selectedFile.id
                              ? { ...f, content: e.target.value }
                              : f,
                          );
                          setFiles(updatedFiles);
                          setSelectedFile({
                            ...selectedFile,
                            content: e.target.value,
                          });
                          if (selectedFile.name.endsWith(".html")) {
                            setCode(e.target.value);
                          }
                        }}
                        className="w-full h-full bg-transparent outline-none text-green-400"
                        style={{ minHeight: "500px" }}
                      />
                    </pre>
                  ) : (
                    <p className="text-gray-400">Select a file to edit</p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-white h-full">
                  <iframe
                    srcDoc={code}
                    title="preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat input for LLM interaction */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-medium mb-2 text-center text-purple-300">
            Modify Your React Project
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Add a dark mode toggle, Create a contact form, Add a navigation menu..."
              className="flex-1 bg-gray-800 text-white rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Handle prompt submission
                  if (prompt.trim()) {
                    // TODO: Implement LLM interaction for code modifications
                    alert("Feature coming soon: " + prompt);
                    setPrompt("");
                  }
                }
              }}
            />
            <Button
              onClick={() => {
                if (prompt.trim()) {
                  // TODO: Implement LLM interaction for code modifications
                  alert("Feature coming soon: " + prompt);
                  setPrompt("");
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enter instructions to modify your React project. The AI will update
            the code accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
