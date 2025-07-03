import React from 'react';
import { Link, useLocation } from 'react-router';
import HomeIcon from '/icons/home.svg?inline';
import HeartIcon from '/icons/heart.svg?inline';
import {
  Search,
  Plus,
  Folder,
  Command,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenu } from '../auth/UserMenu';
import { useFeedbackModal } from '@/pages/app-layout/feedback/hooks/use-feedback-modal-store';
import { FeedbackModal } from '@/pages/app-layout/feedback/feedback-modal';
import { useInviteModal } from '@/pages/app-layout/invite/hooks/use-invite-modal-store';
import { InviteModal } from '@/pages/app-layout/invite/invite-modal';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-card' : '';
  };

  const { } = useFeedbackModal();
  const { } = useInviteModal();
  return (
    <>
      <nav className="max-h-[60px] lg:max-h-[460px] lg:max-w-[60px] h-full flex flex-row lg:flex-col items-center justify-between rounded-full bg-card p-2 backdrop-blur-md shadow-2 gap-4">
        <div className="flex flex-row lg:flex-col items-center h-full w-full gap-4">
          {/* Home */}
          <Link
            to="/"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/'
            )}`}
          >
            <img src={HomeIcon} alt="Home" className="w-5 h-5" />
          </Link>

          {/* Discover Tools */}
          <Link
            to="/explore"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/explore'
            )}`}
          >
            <Search className="w-5 h-5 text-blue-500" />
          </Link>

          {/* Command Palette Trigger */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-3 hover:bg-card active:bg-card transition-colors"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true
                  });
                  document.dispatchEvent(event);
                }}
              >
                <Command className="w-5 h-5 text-purple-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Search (⌘K)</p>
            </TooltipContent>
          </Tooltip>

          {/* My Tools */}
          <Link
            to="/my-tools"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/my-tools'
            )}`}
          >
            <Folder className="w-5 h-5 text-purple-500" />
          </Link>

          {/* Saved */}
          <Link
            to="/saved"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/saved'
            )}`}
          >
            <img src={HeartIcon} alt="Saved" className="w-5 h-5" />
          </Link>

          {/* Add Tool */}
          <Link
            to="/add-tool"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/add-tool'
            )}`}
          >
            <Plus className="w-5 h-5 text-green-500" />
          </Link>
        </div>
        {/* Profile */}
        <UserMenu />
      </nav>
      <FeedbackModal />
      <InviteModal />
    </>
  );
};
