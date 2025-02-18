import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  reset: () => void;
}

const initialState = {
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
};

export const useUserInputStore = create(
  persist<UserInputStore>(
    (set) => ({
      ...initialState,
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
            inspiration: {
              ...state.userInput.inspiration,
              images: images.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
              })),
            },
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
      reset: () => set(initialState),
    }),
    {
      name: "user-input-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userInput: {
          ...state.userInput,
          inspiration: {
            ...state.userInput.inspiration,
            images: state.userInput.inspiration.images.map((img) => ({
              name: img.name,
              type: img.type,
              size: img.size,
              lastModified: img.lastModified,
            })),
          },
        },
        tasks: state.tasks,
      }),
    },
  ),
);
