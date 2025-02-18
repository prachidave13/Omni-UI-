export interface UserInput {
  description: string;
  requirements: {
    content: string;
    fileType?: string;
  };
  inspiration: {
    images: File[];
    processedText?: string;
  };
  integrations: string[];
}

export interface ProcessedTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  order: number;
}
