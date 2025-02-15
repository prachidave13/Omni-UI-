import React from "react";
import { Button } from "./ui/button";
import { HelpCircle, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FooterActionsProps {
  onHelp?: () => void;
  onContinue?: () => void;
  helpTooltip?: string;
  continueTooltip?: string;
  isLoading?: boolean;
}

const FooterActions = ({
  onHelp = () => console.log("Help clicked"),
  onContinue = () => console.log("Continue clicked"),
  helpTooltip = "Need help? Click here",
  continueTooltip = "Continue to next step",
  isLoading = false,
}: FooterActionsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0D0D1F] border-t border-purple-900/20 px-6 flex justify-between items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-900/20"
              onClick={onHelp}
            >
              <HelpCircle className="h-6 w-6 text-purple-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{helpTooltip}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 gap-2"
              onClick={onContinue}
              disabled={isLoading}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{continueTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FooterActions;
