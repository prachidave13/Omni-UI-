import React from "react";
import { cn } from "@/lib/utils";

interface NavigationPill {
  number: number;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavigationPillsProps {
  pills?: NavigationPill[];
  activePillIndex?: number;
  onPillClick?: (index: number) => void;
}

const defaultPills = [
  { number: 1, label: "Description" },
  { number: 2, label: "Requirements" },
  { number: 3, label: "Inspiration" },
  { number: 4, label: "Integrations" },
];

const NavigationPills = ({
  pills = defaultPills,
  activePillIndex = 0,
  onPillClick = () => {},
}: NavigationPillsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0D0D1F] p-4">
      <div className="flex justify-center items-center space-x-4">
        {pills.map((pill, index) => (
          <button
            key={pill.number}
            onClick={() => onPillClick(index)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
              "hover:bg-purple-700/20",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0D0D1F]",
              index === activePillIndex
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300",
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium",
                index === activePillIndex
                  ? "bg-white text-purple-600"
                  : "bg-gray-700 text-gray-300",
              )}
            >
              {pill.number}
            </span>
            <span className="text-sm font-medium">{pill.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationPills;
