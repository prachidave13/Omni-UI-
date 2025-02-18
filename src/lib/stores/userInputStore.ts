import { create } from "zustand";
import { UserInput, ProcessedTask } from "../types/userInput";

interface UserInputStore {
  userInput: UserInput;
  tasks: ProcessedTask[];
  setDescription: (description: string) => void;
  setRequirements: (content: string, fileType?: string) => void;
  setInspiration: (images: File[]) => void;
  setInspirationText: (text: string) => void;
  setIntegrations: (integrations: string[]) => void;
  setTasks: (tasks: ProcessedTask[]) => void;
}

export const useUserInputStore = create<UserInputStore>((set) => ({
  userInput: {
    description: "",
    requirements: {
      content: "",
      fileType: undefined,
    },
    inspiration: {
      images: [],
      processedText: undefined,
    },
    integrations: [],
  },
  tasks: [],
  setDescription: (description) =>
    set((state) => ({
      userInput: { ...state.userInput, description },
    })),
  setRequirements: (content, fileType) =>
    set((state) => ({
      userInput: {
        ...state.userInput,
        requirements: { content, fileType },
      },
    })),
  setInspiration: (images) =>
    set((state) => ({
      userInput: {
        ...state.userInput,
        inspiration: { ...state.userInput.inspiration, images },
      },
    })),
  setInspirationText: (processedText) =>
    set((state) => ({
      userInput: {
        ...state.userInput,
        inspiration: { ...state.userInput.inspiration, processedText },
      },
    })),
  setIntegrations: (integrations) =>
    set((state) => ({
      userInput: { ...state.userInput, integrations },
    })),
  setTasks: (tasks) => set({ tasks }),
}));
