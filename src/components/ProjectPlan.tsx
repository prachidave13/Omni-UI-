import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
}

interface ProjectPlanProps {
  projectName?: string;
  description?: string;
}

const defaultTasks: Task[] = [
  {
    id: "OMN-1",
    title: "Create a modern landing page with voice assistant preview",
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

const ProjectPlan = ({
  projectName = "Our plan to build OMNI.ai",
  description = "I've generated a plan for us to build OMNI.ai MVP. We haven't gotten started yet. Move a task to In Progress to kick off the project or let me know if you want to adjust the plan!",
}: ProjectPlanProps) => {
  return (
    <div className="min-h-screen bg-[#0D0D1F] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{projectName}</h1>
            <p className="text-gray-400">{description}</p>
          </div>
          <Button
            variant="secondary"
            className="bg-[#1E1E3F] text-purple-400 hover:bg-[#2A2A4F]"
          >
            Discuss the plan
          </Button>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <h2 className="text-lg font-semibold">IN PROGRESS</h2>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <h2 className="text-lg font-semibold">TO DO</h2>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {defaultTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 p-4 bg-[#13132B] rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer"
              >
                <div className="text-sm text-purple-400 font-mono">
                  {task.id}
                </div>
                <div className="text-gray-200 flex-1">{task.title}</div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white hover:bg-purple-700 transition-opacity"
                >
                  Start task
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="text-lg font-semibold">DONE (0)</h2>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="fixed bottom-0 right-0 w-96 p-4">
          <div className="bg-[#13132B] rounded-lg p-4 border border-purple-900/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                D
              </div>
              <div>
                <div className="text-sm font-semibold">DATABUTTON</div>
                <div className="text-xs text-gray-400">a few seconds ago</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              Thought for a moment
            </div>
            <p className="text-sm text-gray-200 mb-4">
              Hello Prachi! I'm excited to help you bring OMNI.ai to life! I've
              created an implementation plan that breaks down your vision into
              manageable tasks, focusing on delivering a high-quality MVP as
              efficiently as possible.
            </p>
            <p className="text-sm text-gray-200 mb-4">
              Would you mind taking a look at the task list I've prepared? I
              suggest we start with{" "}
              <span className="bg-purple-900/30 text-purple-400 px-1 rounded">
                OMN-1
              </span>{" "}
              to create a modern landing page that showcases your vision. This
              will give us a strong foundation and something tangible to build
              upon. The landing page will incorporate your preferred dark theme
              and futuristic design elements.
            </p>
            <p className="text-sm text-gray-200">
              Would you like me to start working on{" "}
              <span className="bg-purple-900/30 text-purple-400 px-1 rounded">
                OMN-1
              </span>
              , or would you prefer to discuss the implementation plan first?
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Ask me a question about #Home..."
                className="w-full bg-[#0D0D1F] text-white rounded-lg px-4 py-2 text-sm border border-purple-900/20 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlan;
