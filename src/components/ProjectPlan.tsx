import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  lastUpdated?: string;
}

interface ProjectPlanProps {
  projectName?: string;
  description?: string;
}

const defaultTasks: Task[] = [
  {
    id: "OMN-1",
    title: "Create a modern landing page with voice assistant preview",
    description:
      "Design and implement a landing page (App.tsx) that introduces OMNI.ai with a preview of the voice assistant interface. Include a hero section showcasing the 3D avatar placeholder, key features, and a clear value proposition for tech professionals. Add a prominent call-to-action for signing up. Use dark theme with glassmorphic elements and floating UI components for a futuristic feel.",
    lastUpdated: "a minute ago",
  },
  {
    id: "OMN-2",
    title: "Set up Firebase authentication with custom profile flow",
  },
  {
    id: "OMN-3",
    title: "Build the core voice interaction interface with WebRTC",
  },
  {
    id: "OMN-4",
    title: "Create the base 3D avatar system with basic animations",
  },
  {
    id: "OMN-5",
    title: "Implement the general assistant agent with OpenAI integration",
  },
  { id: "OMN-6", title: "Build the permissions management system" },
  { id: "OMN-7", title: "Develop the specialized agent selection interface" },
  { id: "OMN-8", title: "Add basic task automation and calendar integration" },
];

import { Dialog, DialogContent } from "./ui/dialog";
import { X } from "lucide-react";

const ProjectPlan = ({
  projectName = "Our plan to build OMNI.ai",
  description = "I've generated a plan for us to build OMNI.ai MVP. We haven't gotten started yet. Move a task to In Progress to kick off the project or let me know if you want to adjust the plan!",
}: ProjectPlanProps) => {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  return (
    <div className="min-h-screen bg-[#0D0D1F] text-white">
      {/* Top Navigation Bar */}
      <div className="bg-[#13132B]/90 backdrop-blur-sm border-b border-purple-900/20">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
            <div className="flex items-center gap-6">
              <button className="text-white font-medium px-3 py-2 rounded-md hover:bg-white/5">
                Plan
              </button>
              <button className="text-gray-400 font-medium px-3 py-2 rounded-md hover:bg-white/5">
                Preview
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Add Firebase
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Settings
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12H21M3 12L7 8M3 12L7 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Restore
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Deploy
            </button>
            <button className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm">
              P
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-3">{projectName}</h1>
              <p className="text-gray-400 text-lg">{description}</p>
            </div>
            <Button
              variant="secondary"
              className="bg-[#1E1E3F]/50 text-purple-400 hover:bg-[#2A2A4F] px-6"
            >
              Discuss the plan
            </Button>
          </div>

          {/* In Progress Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
              <h2 className="text-xl font-semibold">IN PROGRESS</h2>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 pl-5">
              {/* Tasks will appear here when in progress */}
            </div>
          </div>

          {/* To Do Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
              <h2 className="text-xl font-semibold">TO DO</h2>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 pl-5">
              {defaultTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-4 p-4 bg-[#13132B]/50 rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="min-w-[70px] text-sm text-purple-400 font-mono bg-purple-500/10 px-2 py-1 rounded">
                      {task.id}
                    </div>
                    <div className="text-gray-300 font-medium">
                      {task.title}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
                  >
                    Start task
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Done Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <h2 className="text-xl font-semibold">DONE (0)</h2>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="fixed bottom-6 right-6 w-[400px]">
            <div className="bg-[#13132B]/90 backdrop-blur-sm rounded-lg p-4 border border-purple-900/20 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  D
                </div>
                <div>
                  <div className="font-semibold">DATABUTTON</div>
                  <div className="text-xs text-gray-400">a few seconds ago</div>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                Thought for a moment
              </div>
              <div className="space-y-4 text-sm text-gray-300">
                <p>
                  Hello Prachi! I'm excited to help you bring OMNI.ai to life!
                  I've created an implementation plan that breaks down your
                  vision into manageable tasks, focusing on delivering a
                  high-quality MVP as efficiently as possible.
                </p>
                <p>
                  Would you mind taking a look at the task list I've prepared? I
                  suggest we start with{" "}
                  <span className="bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded">
                    OMN-1
                  </span>{" "}
                  to create a modern landing page that showcases your vision.
                  This will give us a strong foundation and something tangible
                  to build upon. The landing page will incorporate your
                  preferred dark theme and futuristic design elements.
                </p>
                <p>
                  Would you like me to start working on{" "}
                  <span className="bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded">
                    OMN-1
                  </span>
                  , or would you prefer to discuss the implementation plan
                  first?
                </p>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Ask me a question about #Home..."
                  className="w-full bg-[#0D0D1F]/80 text-white rounded-lg px-4 py-2.5 text-sm border border-purple-900/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Task Details Dialog */}
          <Dialog
            open={!!selectedTask}
            onOpenChange={() => setSelectedTask(null)}
          >
            <DialogContent className="bg-[#0D0D1F] border-purple-900/20 p-0 gap-0">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-purple-400 font-mono bg-purple-500/10 px-2 py-1 rounded">
                      {selectedTask?.id}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last updated {selectedTask?.lastUpdated}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setSelectedTask(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Title</h2>
                  <p className="text-gray-300">{selectedTask?.title}</p>

                  <h2 className="text-xl font-semibold">Description</h2>
                  <p className="text-gray-300">{selectedTask?.description}</p>

                  <h2 className="text-xl font-semibold">Activity</h2>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
                    No history yet. Agent will document progress and key
                    decisions here.
                  </div>

                  <div className="mt-6">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full bg-[#13132B] text-white rounded-lg p-4 min-h-[100px] text-sm border border-purple-900/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="destructive"
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      Delete task
                    </Button>
                    <Button className="bg-purple-600 text-white hover:bg-purple-700">
                      Start task
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlan;
