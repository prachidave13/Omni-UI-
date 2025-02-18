import React, { useState } from "react";
import FileUpload from "./FileUpload";
import Header from "./Header";
import HeroSection from "./HeroSection";
import NavigationPills from "./NavigationPills";
import FooterActions from "./FooterActions";
import ProjectPlan from "./ProjectPlan";
import { Dialog, DialogContent } from "./ui/dialog";
import { useUserInputStore } from "@/lib/stores/userInputStore";
import {
  processImage,
  processDocument,
  generateTasks,
} from "@/lib/services/api";

interface HomeProps {
  initialStep?: number;
  showHelpDialog?: boolean;
}

const Home = ({ initialStep = 0, showHelpDialog = false }: HomeProps) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isHelpOpen, setIsHelpOpen] = useState(showHelpDialog);
  const [showProjectPlan, setShowProjectPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get store actions
  const {
    userInput,
    setDescription,
    setRequirements,
    setInspiration,
    setInspirationText,
    setIntegrations,
    setTasks,
  } = useUserInputStore();

  // Handle file uploads for requirements and inspiration
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
    } else if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleHelp = () => {
    setIsHelpOpen(true);
  };

  if (showProjectPlan) {
    return <ProjectPlan />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D1F] text-white">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <HeroSection />

        <div className="mt-12">
          <NavigationPills
            activePillIndex={activeStep}
            onPillClick={setActiveStep}
          />
        </div>

        <div className="min-h-[400px] flex p-8 border border-purple-900/20 rounded-lg">
          {/* Content for each step */}
          {activeStep === 0 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                Describe your app, what it does, and who it's for.
              </h2>
              <textarea
                className="flex-1 bg-[#1A1A2E] text-white border border-purple-900/20 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your app description here..."
                value={userInput.description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}
          {activeStep === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  Upload what you have so far
                </h2>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                    Requirements
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                    User stories
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                    Specification
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                    Quotes
                  </span>
                </div>
                <FileUpload
                  onUpload={handleFileUpload}
                  allowedTypes={["requirements"]}
                />
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div className="flex-1">
              <div className="max-w-md mx-auto text-center mb-8">
                <div className="bg-[#13132B] rounded-lg p-6 space-y-2">
                  <div className="text-xs uppercase tracking-wider text-purple-400/80">
                    RECOMMENDED
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Share your design inspiration
                  </h2>
                  <p className="text-sm text-gray-400">
                    Upload screenshots of apps or designs that inspire you
                  </p>
                  <FileUpload
                    className="mt-4"
                    onUpload={handleFileUpload}
                    allowedTypes={["inspiration"]}
                  />
                </div>
              </div>
            </div>
          )}
          {activeStep === 3 && (
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {/* Authentication */}
                <div className="bg-[#13132B] rounded-lg p-6 border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Authentication
                  </h3>
                  <p className="text-sm text-gray-400">
                    User authentication and authorization
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Auth0
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Clerk
                    </span>
                  </div>
                </div>

                {/* Database */}
                <div className="bg-[#13132B] rounded-lg p-6 border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Database
                  </h3>
                  <p className="text-sm text-gray-400">
                    Data storage and management
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Supabase
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      MongoDB
                    </span>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-[#13132B] rounded-lg p-6 border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-400">
                    Track user behavior and metrics
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Mixpanel
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      PostHog
                    </span>
                  </div>
                </div>

                {/* Payments */}
                <div className="bg-[#13132B] rounded-lg p-6 border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Payments
                  </h3>
                  <p className="text-sm text-gray-400">
                    Process payments and subscriptions
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Stripe
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      PayPal
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-[#13132B] rounded-lg p-6 border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Email
                  </h3>
                  <p className="text-sm text-gray-400">
                    Send emails and notifications
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Resend
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      SendGrid
                    </span>
                  </div>
                </div>

                {/* Storage */}
                <div className="bg-[#13132B] rounded-lg p-6 border border-purple-900/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Storage
                  </h3>
                  <p className="text-sm text-gray-400">Store files and media</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      S3
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                      Cloudinary
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterActions
        onHelp={handleHelp}
        onContinue={handleContinue}
        isLoading={isLoading}
      />

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="bg-[#1A1A2E] text-white border-purple-900/20">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-300">
              This is a step-by-step guide to help you create your project. Each
              section will guide you through different aspects of your project
              setup. Use the navigation pills above to move between sections, or
              click the Continue button to proceed to the next step.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
