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
  const response = await fetch(`${API_URL}/generate-tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to generate tasks");
  }

  const data = await response.json();
  return data.tasks;
};
