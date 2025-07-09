import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Heart, Folder } from 'lucide-react';
import { Link } from 'react-router';

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  if (!user) {
    return (
      <>
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
          onClick={() => setShowLoginDialog(true)}
        >
          <User className="h-5 w-5" />
        </Button>
        <LoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog} 
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || user.email || 'User'} 
            />
            <AvatarFallback>
              {getInitials(profile?.full_name, user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/saved" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Saved Tools
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/my-tools" className="cursor-pointer">
            <Folder className="mr-2 h-4 w-4" />
            My Collections
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}