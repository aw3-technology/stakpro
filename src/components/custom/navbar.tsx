import React from 'react';
import { Link, useLocation } from 'react-router';
import HomeIcon from '/icons/home.svg?inline';
import HeartIcon from '/icons/heart.svg?inline';
import TripIcon from '/icons/trip.svg?inline';
import {
  BookOpen,
  CircleHelp,
  LogOut,
  MessageSquareText,
  Settings,
  TreePalm,
  UserPlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useFeedbackModal } from '@/pages/app-layout/feedback/hooks/use-feedback-modal-store';
import { FeedbackModal } from '@/pages/app-layout/feedback/feedback-modal';
import { Button } from '../ui/button';
import { useInviteModal } from '@/pages/app-layout/invite/hooks/use-invite-modal-store';
import { InviteModal } from '@/pages/app-layout/invite/invite-modal';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-card' : '';
  };

  const { setOpen } = useFeedbackModal();
  const { setOpen: setInviteOpen } = useInviteModal();
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

          {/* Explore */}
          <Link
            to="/explore"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/explore'
            )}`}
          >
            <TreePalm className="w-5 h-5 text-amber-500" />
          </Link>

          {/* My Trips */}
          <Link
            to="/my-trips"
            className={`hover:bg-card active:bg-card transition-colors rounded-full p-3 ${isActive(
              '/my-trips'
            )}`}
          >
            <img src={TripIcon} alt="Trip" className="w-5 h-5" />
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
        </div>
        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative rounded-full w-11 h-11" variant="ghost" size="icon">
              <Avatar className="rounded-full w-11 h-11">
                <AvatarImage src="/images/avatar-content.jpg" />
              </Avatar>
              <span className="border-background absolute -end-0.5 -top-0.5 size-3 rounded-full border-2 bg-emerald-500">
                <span className="sr-only">Online</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-card backdrop-blur-sm rounded-xl w-[200px] shadow-lg border-none"
            side="top"
            align="start"
            sideOffset={10}
          >
            <DropdownMenuLabel className="flex items-start gap-3 p-0">
              <Link to="/profile" className="w-full hover:bg-card active:bg-card transition-colors rounded-lg">
                <div className="flex p-3">
                  <span className="text-foreground truncate text-sm font-medium">
                    Alex Johnson
                  </span>
                </div>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0 transition-all overflow-hidden rounded-lg">
              <Link to="/profile" className="flex items-center px-3 py-2 gap-3 w-full">
                <Settings className="w-4 h-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 transition-all overflow-hidden rounded-lg">
              <span className="flex items-center px-3 py-2 gap-3 w-full cursor-pointer" onClick={() => setInviteOpen(true)}>
                <UserPlus className="w-4 h-4" />
                Invite Friends
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 transition-all overflow-hidden rounded-lg">
              <Link to="/learn" className="flex items-center px-3 py-2 gap-3 w-full">
                <BookOpen className="w-4 h-4" />
                Learn
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 transition-all overflow-hidden rounded-lg">
              <span className="flex items-center px-3 py-2 gap-3 w-full cursor-pointer" onClick={() => setOpen(true)}>
              <MessageSquareText className="w-4 h-4" />
                Feedback
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 transition-all overflow-hidden rounded-lg">
              <Link to="/support" className="flex items-center px-3 py-2 gap-3 w-full">
                <CircleHelp className="w-4 h-4" />
                Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='p-0 transition-all overflow-hidden rounded-lg'>
              <Link to="/login" className="flex items-center px-3 py-2 gap-3 w-full">
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <FeedbackModal />
      <InviteModal />
    </>
  );
};
