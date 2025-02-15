import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Menu } from "lucide-react";

interface HeaderProps {
  logoUrl?: string;
  brandName?: string;
  userAvatar?: string;
  userName?: string;
  onMenuClick?: () => void;
}

const Header = ({
  logoUrl = "/vite.svg",
  brandName = "Omni",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  userName = "John Doe",
  onMenuClick = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-20 px-6 bg-[#0D0D1F] border-b border-purple-900/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt="Logo" className="w-8 h-8" />
        <span className="text-white font-semibold text-xl">{brandName}</span>
      </div>

      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Menu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <Avatar className="border-2 border-purple-500/20">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{userName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
