import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useUserInputStore } from "../lib/stores/userInputStore";
import { generateTasks } from "../lib/services/api";

interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface ProjectPlanProps {
  projectName?: string;
  description?: string;
}

const ProjectPlan = ({
  projectName = "Our plan to build OMNI.ai",
  description = "I've generated a plan for us to build OMNI.ai MVP. We haven't gotten started yet. Move a task to In Progress to kick off the project or let me know if you want to adjust the plan!",
}: ProjectPlanProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userInput, tasks, setTasks } = useUserInputStore();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
    
      try {
        // Use the existing userInput from the store
        const generatedTasks = await generateTasks(userInput);
        
        // Sort tasks by order if available
        const sortedTasks = generatedTasks.sort((a, b) => a.order - b.order);
        
        // Update the store with the new tasks
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch tasks if we have a description and requirements
    if (userInput.description && userInput.requirements.content) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [userInput, setTasks]);

  const handleStartTask = (taskId: string) => {
    // TODO: Implement task status management
    console.log("Starting task:", taskId);
  };

  return (
    <div className="min-h-screen bg-[#0D0D1F] text-white">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-3">{projectName}</h1>
              <p className="text-gray-400 text-lg">{description}</p>
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading tasks...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Tasks Section */}
          {!loading && !error && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
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
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-center gap-4 p-4 bg-[#13132B]/50 rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-[70px] text-sm text-purple-400 font-mono bg-purple-500/10 px-2 py-1 rounded">
                          {task.id}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-gray-300 font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-gray-400 text-sm">{task.description}</div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
                        onClick={() => handleStartTask(task.id)}
                      >
                        Start task
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      {userInput.description 
                        ? "No tasks generated yet. Please check your input requirements."
                        : "Enter project details to generate tasks."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPlan;