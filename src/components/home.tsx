import React, { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import NavigationPills from "./NavigationPills";
import FooterActions from "./FooterActions";
import FileUpload from "./FileUpload";
import ProjectPlan from "./ProjectPlan";
import { useUserInputStore } from "@/lib/stores/userInputStore";
import {
  processDocument,
  processImage,
  generateTasks,
} from "@/lib/services/api";

interface HomeProps {
  initialStep?: number;
  showHelpDialog?: boolean;
}

const Home = ({ initialStep = 0, showHelpDialog = false }: HomeProps) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectPlan, setShowProjectPlan] = useState(false);

  const {
    userInput,
    setDescription,
    setRequirements,
    setInspiration,
    setInspirationText,
    setIntegrations,
    setTasks,
  } = useUserInputStore();

  const handleFileUpload = async (files: File[]) => {
    setIsLoading(true);
    try {
      const file = files[0];
      if (activeStep === 1) {
        // Requirements step
        const text = await processDocument(file);
        setRequirements(text, file.type);
      } else if (activeStep === 2) {
        // Inspiration step
        const text = await processImage(file);
        setInspiration(files);
        setInspirationText(text);
      }
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (activeStep === 3) {
      // Generate tasks before showing project plan
      setIsLoading(true);
      try {
        const tasks = await generateTasks(userInput);
        setTasks(tasks);
        setShowProjectPlan(true);
      } catch (error) {
        console.error("Error generating tasks:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  if (showProjectPlan) {
    return <ProjectPlan />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D1F] flex flex-col">
      <Header />
      <HeroSection />
      <NavigationPills
        activePillIndex={activeStep}
        onPillClick={setActiveStep}
      />

      <div className="flex-1 flex items-center justify-center p-8">
        {activeStep === 0 && (
          <div className="w-full max-w-2xl">
            <textarea
              className="w-full h-48 bg-[#13132B] text-white rounded-lg p-4 border border-purple-900/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
              placeholder="Describe your software project..."
              value={userInput.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div className="w-full max-w-2xl">
            <FileUpload onUpload={handleFileUpload} allowedTypes={["document"]}>
              <div className="text-center">
                <p className="text-purple-400 mb-2 text-lg">
                  Upload your requirements document
                </p>
                <p className="text-purple-400/60 text-sm">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </FileUpload>
          </div>
        )}

        {activeStep === 2 && (
          <div className="w-full max-w-2xl">
            <FileUpload onUpload={handleFileUpload} allowedTypes={["image"]}>
              <div className="text-center">
                <p className="text-purple-400 mb-2 text-lg">
                  Upload inspiration images
                </p>
                <p className="text-purple-400/60 text-sm">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </FileUpload>
          </div>
        )}

        {activeStep === 3 && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                "Firebase",
                "Supabase",
                "MongoDB",
                "PostgreSQL",
                "Auth0",
                "Stripe",
                "SendGrid",
                "Twilio",
              ].map((integration) => (
                <button
                  key={integration}
                  onClick={() =>
                    setIntegrations(
                      userInput.integrations.includes(integration)
                        ? userInput.integrations.filter(
                            (i) => i !== integration,
                          )
                        : [...userInput.integrations, integration],
                    )
                  }
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    userInput.integrations.includes(integration)
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-[#13132B] border-purple-900/20 text-purple-400 hover:border-purple-500/40"
                  }`}
                >
                  {integration}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterActions onContinue={handleContinue} isLoading={isLoading} />
    </div>
  );
};

export default Home;
