import { UserInput, ProcessedTask } from "../types/userInput";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000";

export const processImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/process-image`, {
    method: "POST",
    body: formData,
  });

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

  const data = await response.json();
  return data.tasks;
};
