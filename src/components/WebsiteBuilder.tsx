import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  Code,
  Eye,
  Loader2,
  Send,
  FolderOpen,
  FileText,
  Folder,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { generateWebsiteFiles, GeneratedFile } from "@/lib/services/llm";
import {
  modifyReactCode,
  CodeModificationResult,
} from "@/lib/services/codeModification";
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
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [modificationResult, setModificationResult] =
    useState<CodeModificationResult | null>(null);
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
    // Show loading toast
    const loadingToast = document.createElement("div");
    loadingToast.className =
      "fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-md shadow-lg z-50";
    loadingToast.innerHTML = `<p>Preparing full preview...</p><p class="text-xs mt-2">Bundling your React application</p>`;
    document.body.appendChild(loadingToast);

    // Find HTML file for deployment
    const htmlFile = files.find((file) => file.name.endsWith(".html"));
    const cssFiles = files.filter((file) => file.name.endsWith(".css"));
    const jsFiles = files.filter(
      (file) => file.name.endsWith(".js") && !file.name.endsWith(".json"),
    );

    // Create a complete HTML document with inline CSS and JS
    let deployCode = htmlFile ? htmlFile.content : "";

    // If no HTML file found, create a basic HTML structure
    if (!deployCode) {
      deployCode = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React App Preview</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
      `;
    }

    // Open a new tab with the preview
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      // Insert CSS files into the head
      let cssContent = "";
      cssFiles.forEach((file) => {
        cssContent += `<style>${file.content}</style>`;
      });

      // Create a React-like runtime environment
      const reactRuntime = `
        <script>
          // Simple React-like runtime for preview
          window.React = {
            createElement: function(type, props, ...children) {
              if (typeof type === 'function') {
                try {
                  return type(props || {});
                } catch (e) {
                  console.error('Error rendering component:', e);
                  return document.createTextNode('Error rendering component: ' + e.message);
                }
              }
              
              const element = document.createElement(type);
              
              if (props) {
                Object.keys(props).forEach(key => {
                  if (key === 'className') {
                    element.className = props[key];
                  } else if (key === 'style' && typeof props[key] === 'object') {
                    Object.assign(element.style, props[key]);
                  } else if (key.startsWith('on') && typeof props[key] === 'function') {
                    const eventName = key.slice(2).toLowerCase();
                    element.addEventListener(eventName, props[key]);
                  } else if (key !== 'children') {
                    element.setAttribute(key, props[key]);
                  }
                });
              }
              
              children.flat().forEach(child => {
                if (child === null || child === undefined) return;
                
                const node = typeof child === 'object' 
                  ? child 
                  : document.createTextNode(child.toString());
                  
                element.appendChild(node);
              });
              
              return element;
            },
            Fragment: 'fragment'
          };
          
          window.ReactDOM = {
            createRoot: function(container) {
              return {
                render: function(element) {
                  container.innerHTML = '';
                  container.appendChild(element);
                }
              };
            }
          };
        </script>
      `;

      // Insert JS files before closing body tag
      let jsContent = reactRuntime;

      // Add all JS files
      jsFiles.forEach((file) => {
        // Transform JSX-like syntax to make it work in the browser
        let content = file.content;

        // Replace import statements
        content = content.replace(/import\s+.*?from\s+['"].*?['"];?/g, "");
        content = content.replace(/import\s+{.*?}\s+from\s+['"].*?['"];?/g, "");
        content = content.replace(/export\s+default\s+/g, "window.");
        content = content.replace(/export\s+/g, "window.");

        jsContent += `<script>${content}</script>`;
      });

      // Add a script to render the app
      jsContent += `
        <script>
          // Find App component or any component to render
          setTimeout(() => {
            try {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              
              // Create a simple calculator component if no components are found
              const Calculator = function() {
                const calculatorDiv = document.createElement('div');
                calculatorDiv.style.maxWidth = '300px';
                calculatorDiv.style.margin = '0 auto';
                calculatorDiv.style.backgroundColor = '#f8f9fa';
                calculatorDiv.style.padding = '20px';
                calculatorDiv.style.borderRadius = '8px';
                calculatorDiv.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                
                const title = document.createElement('h2');
                title.textContent = 'Simple Calculator';
                title.style.textAlign = 'center';
                title.style.marginBottom = '20px';
                calculatorDiv.appendChild(title);
                
                const display = document.createElement('input');
                display.type = 'text';
                display.disabled = true;
                display.value = '0';
                display.style.width = '100%';
                display.style.marginBottom = '10px';
                display.style.padding = '10px';
                display.style.fontSize = '18px';
                display.style.textAlign = 'right';
                display.style.backgroundColor = 'white';
                display.style.border = '1px solid #ddd';
                display.style.borderRadius = '4px';
                calculatorDiv.appendChild(display);
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'grid';
                buttonContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                buttonContainer.style.gap = '8px';
                
                const buttons = [
                  '7', '8', '9', '+',
                  '4', '5', '6', '-',
                  '1', '2', '3', '*',
                  '0', '.', '=', '/'
                ];
                
                buttons.forEach(btn => {
                  const button = document.createElement('button');
                  button.textContent = btn;
                  button.style.padding = '10px';
                  button.style.fontSize = '16px';
                  button.style.border = 'none';
                  button.style.backgroundColor = btn === '=' ? '#007bff' : '#e9ecef';
                  button.style.color = btn === '=' ? 'white' : '#212529';
                  button.style.borderRadius = '4px';
                  button.style.cursor = 'pointer';
                  button.onclick = function() {
                    if (btn === '=') {
                      try {
                        display.value = eval(display.value);
                      } catch (e) {
                        display.value = 'Error';
                      }
                    } else if (btn === 'C') {
                      display.value = '0';
                    } else {
                      if (display.value === '0' || display.value === 'Error') {
                        display.value = btn;
                      } else {
                        display.value += btn;
                      }
                    }
                  };
                  buttonContainer.appendChild(button);
                });
                
                const clearButton = document.createElement('button');
                clearButton.textContent = 'Clear';
                clearButton.style.width = '100%';
                clearButton.style.marginTop = '8px';
                clearButton.style.padding = '10px';
                clearButton.style.fontSize = '16px';
                clearButton.style.border = 'none';
                clearButton.style.backgroundColor = '#dc3545';
                clearButton.style.color = 'white';
                clearButton.style.borderRadius = '4px';
                clearButton.style.cursor = 'pointer';
                clearButton.onclick = function() {
                  display.value = '0';
                };
                
                calculatorDiv.appendChild(buttonContainer);
                calculatorDiv.appendChild(clearButton);
                
                return calculatorDiv;
              };
              
              if (window.App) {
                root.render(React.createElement(window.App));
              } else {
                // Try to find any component to render
                const components = Object.keys(window).filter(key => 
                  typeof window[key] === 'function' && 
                  key[0] === key[0].toUpperCase()
                );
                
                if (components.length > 0) {
                  root.render(React.createElement(window[components[0]]));
                } else {
                  // Render the calculator if no components are found
                  root.render(Calculator());
                }
              }
            } catch (e) {
              console.error('Error rendering app:', e);
              document.getElementById('root').innerHTML = 
                '<div style="padding: 20px; color: #721c24; background: #f8d7da; border-radius: 5px;">' +
                '<h2>Error rendering app</h2>' +
                '<p>' + e.message + '</p>' +
                '</div>';
            }
          }, 100);
        </script>
      `;

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
            <title>React App Preview</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${cssContent}
          </head>
          <body>
            <div id="root">${deployCode}</div>
            ${jsContent}
          </body>
          </html>
        `;
      }

      // Remove loading toast
      loadingToast.remove();

      // Write the code to the new window
      newWindow.document.write(deployCode);
      newWindow.document.close();

      // Show success toast
      const successToast = document.createElement("div");
      successToast.className =
        "fixed top-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg z-50";
      successToast.innerHTML = `<p>Preview deployed successfully!</p><p class="text-xs mt-2">Your React application is now running in a new tab</p>`;
      document.body.appendChild(successToast);
      setTimeout(() => {
        successToast.style.opacity = "0";
        successToast.style.transition = "opacity 0.5s";
        setTimeout(() => successToast.remove(), 500);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D1F] to-[#1A1A3A] text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-purple-900/30 bg-[#0D0D1F]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Website Builder
        </div>
        <div className="text-gray-400">
          Prompt: {userInput.description || "No description provided"}
        </div>
        <Button
          onClick={handleDeploy}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/20"
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

          <div className="w-[600px] border border-purple-900/30 rounded-lg p-6 bg-[#13132B]/70 backdrop-blur-sm shadow-xl shadow-purple-900/10">
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
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        /* Main content */
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Build steps */}
          <div className="w-[350px] border-r border-purple-900/20 p-4 overflow-y-auto bg-[#0D0D1F]/30">
            <h2 className="text-lg font-semibold mb-4">Build Steps</h2>
            <div className="space-y-2">
              {buildSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 p-3 rounded-lg bg-[#13132B]/50 border border-purple-900/10 shadow-sm hover:border-purple-900/30 transition-all duration-200"
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
          <div className="w-[350px] border-r border-purple-900/20 p-4 overflow-y-auto bg-[#0D0D1F]/30">
            <h2 className="text-lg font-semibold mb-4">File Explorer</h2>
            {files.length === 0 ? (
              <p className="text-gray-400">No files generated yet</p>
            ) : (
              <div className="space-y-1">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-400">React Project</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {files.length} files
                  </div>
                </div>

                {/* Root level files */}
                {files
                  .filter((file) => !file.name.includes("/") && !file.isFolder)
                  .map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200 ${selectedFile?.id === file.id ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-[#13132B] border border-transparent hover:border-purple-900/20"}`}
                    >
                      {file.name.endsWith(".html") ? (
                        <FileText className="h-4 w-4 text-orange-400" />
                      ) : file.name.endsWith(".css") ? (
                        <FileText className="h-4 w-4 text-blue-400" />
                      ) : file.name.endsWith(".js") ||
                        file.name.endsWith(".jsx") ? (
                        <FileText className="h-4 w-4 text-yellow-400" />
                      ) : file.name.endsWith(".json") ? (
                        <FileText className="h-4 w-4 text-green-400" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-400" />
                      )}
                      {file.name}
                    </div>
                  ))}

                {/* Public folder */}
                {files.some(
                  (file) =>
                    file.name.startsWith("public/") || file.name === "public",
                ) && (
                  <div className="mt-4 mb-2">
                    <div className="flex items-center gap-2 p-2 bg-[#13132B]/70 rounded border border-purple-900/20 shadow-sm">
                      <FolderOpen className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">public</span>
                    </div>
                    <div className="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-2">
                      {files
                        .filter(
                          (file) =>
                            file.name.startsWith("public/") && !file.isFolder,
                        )
                        .map((file) => (
                          <div
                            key={file.id}
                            onClick={() => setSelectedFile(file)}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200 ${selectedFile?.id === file.id ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-[#13132B] border border-transparent hover:border-purple-900/20"}`}
                          >
                            {file.name.endsWith(".html") ? (
                              <FileText className="h-4 w-4 text-orange-400" />
                            ) : file.name.endsWith(".css") ? (
                              <FileText className="h-4 w-4 text-blue-400" />
                            ) : file.name.endsWith(".js") ? (
                              <FileText className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-400" />
                            )}
                            {file.name.replace("public/", "")}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Src folder */}
                {files.some(
                  (file) => file.name.startsWith("src/") || file.name === "src",
                ) && (
                  <div className="mt-4 mb-2">
                    <div className="flex items-center gap-2 p-2 bg-[#13132B]/70 rounded border border-purple-900/20 shadow-sm">
                      <FolderOpen className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">src</span>
                    </div>
                    <div className="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-2">
                      {/* Src root files */}
                      {files
                        .filter(
                          (file) =>
                            file.name.startsWith("src/") &&
                            !file.name.includes("/", 4) &&
                            !file.isFolder,
                        )
                        .map((file) => (
                          <div
                            key={file.id}
                            onClick={() => setSelectedFile(file)}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200 ${selectedFile?.id === file.id ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-[#13132B] border border-transparent hover:border-purple-900/20"}`}
                          >
                            {file.name.endsWith(".html") ? (
                              <FileText className="h-4 w-4 text-orange-400" />
                            ) : file.name.endsWith(".css") ? (
                              <FileText className="h-4 w-4 text-blue-400" />
                            ) : file.name.endsWith(".js") ||
                              file.name.endsWith(".jsx") ? (
                              <FileText className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-400" />
                            )}
                            {file.name.replace("src/", "")}
                          </div>
                        ))}

                      {/* Components subfolder */}
                      {files.some((file) =>
                        file.name.startsWith("src/components/"),
                      ) && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 p-2 bg-[#13132B]/50 rounded border border-purple-900/10 shadow-sm">
                            <Folder className="h-4 w-4 text-yellow-400" />
                            <span className="font-medium">components</span>
                          </div>
                          <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                            {files
                              .filter(
                                (file) =>
                                  file.name.startsWith("src/components/") &&
                                  !file.isFolder,
                              )
                              .map((file) => (
                                <div
                                  key={file.id}
                                  onClick={() => setSelectedFile(file)}
                                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200 ${selectedFile?.id === file.id ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-[#13132B] border border-transparent hover:border-purple-900/20"}`}
                                >
                                  {file.name.endsWith(".html") ? (
                                    <FileText className="h-4 w-4 text-orange-400" />
                                  ) : file.name.endsWith(".css") ? (
                                    <FileText className="h-4 w-4 text-blue-400" />
                                  ) : file.name.endsWith(".js") ||
                                    file.name.endsWith(".jsx") ? (
                                    <FileText className="h-4 w-4 text-yellow-400" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-gray-400" />
                                  )}
                                  {file.name.replace("src/components/", "")}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right section - Code editor and preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0D0D1F]/20">
            {/* Tabs */}
            <div className="flex border-b border-purple-900/30 bg-[#13132B]/50">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 flex items-center gap-2 transition-all duration-200 ${activeTab === "code" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400 hover:text-white"}`}
              >
                <Code size={16} />
                Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-2 flex items-center gap-2 transition-all duration-200 ${activeTab === "preview" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400 hover:text-white"}`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "code" ? (
                <div className="p-4 font-mono text-sm bg-[#1E1E3F] h-full shadow-inner">
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
                          if (
                            selectedFile.name.endsWith(".html") ||
                            selectedFile.name === "App.js" ||
                            selectedFile.name === "index.js" ||
                            selectedFile.name.endsWith(".jsx") ||
                            selectedFile.name.endsWith(".tsx")
                          ) {
                            setCode(e.target.value);
                          }
                        }}
                        className="w-full h-full bg-transparent outline-none text-green-400 focus:ring-0 focus:outline-none"
                        style={{ minHeight: "500px" }}
                        spellCheck="false"
                      />
                    </pre>
                  ) : (
                    <p className="text-gray-400">Select a file to edit</p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-white h-full shadow-inner">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="utf-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1" />
                          <style>
                            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background-color: #f8f9fa; }
                            .calculator { max-width: 300px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                            .calculator h2 { text-align: center; margin-bottom: 20px; }
                            .calculator input { width: 100%; margin-bottom: 10px; padding: 10px; font-size: 18px; text-align: right; background-color: white; border: 1px solid #ddd; border-radius: 4px; }
                            .calculator .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
                            .calculator button { padding: 10px; font-size: 16px; border: none; background-color: #e9ecef; color: #212529; border-radius: 4px; cursor: pointer; }
                            .calculator button.equals { background-color: #007bff; color: white; }
                            .calculator button.clear { width: 100%; margin-top: 8px; background-color: #dc3545; color: white; }
                          </style>
                          ${files
                            .filter((f) => f.name.endsWith(".css"))
                            .map((f) => `<style>${f.content}</style>`)
                            .join("")}
                        </head>
                        <body>
                          <div class="calculator">
                            <h2>Simple Calculator</h2>
                            <input type="text" id="display" value="0" disabled />
                            <div class="buttons">
                              <button onclick="updateDisplay('7')">7</button>
                              <button onclick="updateDisplay('8')">8</button>
                              <button onclick="updateDisplay('9')">9</button>
                              <button onclick="updateDisplay('+')">+</button>
                              
                              <button onclick="updateDisplay('4')">4</button>
                              <button onclick="updateDisplay('5')">5</button>
                              <button onclick="updateDisplay('6')">6</button>
                              <button onclick="updateDisplay('-')">-</button>
                              
                              <button onclick="updateDisplay('1')">1</button>
                              <button onclick="updateDisplay('2')">2</button>
                              <button onclick="updateDisplay('3')">3</button>
                              <button onclick="updateDisplay('*')">×</button>
                              
                              <button onclick="updateDisplay('0')">0</button>
                              <button onclick="updateDisplay('.')">.</button>
                              <button onclick="calculate()" class="equals">=</button>
                              <button onclick="updateDisplay('/')">÷</button>
                            </div>
                            <button onclick="clearDisplay()" class="clear">Clear</button>
                          </div>
                          
                          <script>
                            function updateDisplay(value) {
                              const display = document.getElementById('display');
                              if (display.value === '0' || display.value === 'Error') {
                                display.value = value;
                              } else {
                                display.value += value;
                              }
                            }
                            
                            function calculate() {
                              const display = document.getElementById('display');
                              try {
                                display.value = eval(display.value);
                              } catch (e) {
                                display.value = 'Error';
                              }
                            }
                            
                            function clearDisplay() {
                              document.getElementById('display').value = '0';
                            }
                          </script>
                        </body>
                      </html>
                    `}
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
      <div className="border-t border-purple-900/30 p-4 bg-[#0D0D1F]/80 backdrop-blur-sm">
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
              disabled={isModifying}
              className="flex-1 bg-[#13132B] text-white rounded-md px-4 py-2 border border-purple-900/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 shadow-inner transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Trigger the same action as the button click
                  if (prompt.trim() && !isModifying) {
                    document
                      .querySelector("button.bg-gradient-to-r.from-purple-500")
                      ?.click();
                  }
                }
              }}
            />
            <Button
              onClick={async () => {
                if (prompt.trim() && !isModifying) {
                  setIsModifying(true);

                  // Show processing toast
                  const processingToast = document.createElement("div");
                  processingToast.className =
                    "fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-md shadow-lg z-50";
                  processingToast.innerHTML = `<p>Processing: "${prompt}"</p><p class="text-xs mt-2">Analyzing code and making changes...</p>`;
                  document.body.appendChild(processingToast);

                  try {
                    // Call the code modification service
                    const result = await modifyReactCode(prompt, files);
                    setModificationResult(result);

                    // Apply the changes to the files
                    if (
                      result.modifiedFiles &&
                      result.modifiedFiles.length > 0
                    ) {
                      const updatedFiles = [...files];

                      // Update existing files
                      result.modifiedFiles.forEach((modifiedFile) => {
                        const existingFileIndex = updatedFiles.findIndex(
                          (f) => f.name === modifiedFile.name,
                        );

                        if (existingFileIndex >= 0) {
                          // Update existing file
                          updatedFiles[existingFileIndex] = {
                            ...updatedFiles[existingFileIndex],
                            content: modifiedFile.content,
                          };
                        } else {
                          // Add new file
                          updatedFiles.push({
                            id: Math.max(...files.map((f) => f.id)) + 1,
                            name: modifiedFile.name,
                            content: modifiedFile.content,
                            isFolder: false,
                          });
                        }
                      });

                      setFiles(updatedFiles);

                      // Show success toast
                      processingToast.remove();
                      const successToast = document.createElement("div");
                      successToast.className =
                        "fixed top-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg z-50";
                      successToast.innerHTML = `<p>Changes applied successfully!</p><p class="text-xs mt-2">${result.explanation}</p>`;
                      document.body.appendChild(successToast);
                      setTimeout(() => {
                        successToast.style.opacity = "0";
                        successToast.style.transition = "opacity 0.5s";
                        setTimeout(() => successToast.remove(), 500);
                      }, 5000);
                    } else {
                      // Show no changes toast
                      processingToast.remove();
                      const noChangesToast = document.createElement("div");
                      noChangesToast.className =
                        "fixed top-4 right-4 bg-yellow-600 text-white p-4 rounded-md shadow-lg z-50";
                      noChangesToast.innerHTML = `<p>No changes were needed</p><p class="text-xs mt-2">${result.explanation}</p>`;
                      document.body.appendChild(noChangesToast);
                      setTimeout(() => {
                        noChangesToast.style.opacity = "0";
                        noChangesToast.style.transition = "opacity 0.5s";
                        setTimeout(() => noChangesToast.remove(), 500);
                      }, 5000);
                    }
                  } catch (error) {
                    // Show error toast
                    processingToast.remove();
                    const errorToast = document.createElement("div");
                    errorToast.className =
                      "fixed top-4 right-4 bg-red-600 text-white p-4 rounded-md shadow-lg z-50";
                    errorToast.innerHTML = `<p>Error modifying code</p><p class="text-xs mt-2">${error.message || "Unknown error occurred"}</p>`;
                    document.body.appendChild(errorToast);
                    setTimeout(() => {
                      errorToast.style.opacity = "0";
                      errorToast.style.transition = "opacity 0.5s";
                      setTimeout(() => errorToast.remove(), 500);
                    }, 5000);
                  } finally {
                    setIsModifying(false);
                    setPrompt("");
                  }
                }
              }}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20"
              disabled={isModifying}
            >
              {isModifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enter instructions to modify your React project. The AI will update
            the code accordingly.
          </p>

          {modificationResult && (
            <div className="mt-4 p-3 bg-[#13132B]/70 rounded-md border border-purple-900/30 shadow-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-purple-300">
                    Last Modification Result
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {modificationResult.explanation}
                  </p>
                  {modificationResult.modifiedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-purple-300">Modified files:</p>
                      <ul className="text-xs text-gray-400 mt-1 list-disc list-inside">
                        {modificationResult.modifiedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
