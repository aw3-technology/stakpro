import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  Grid3X3,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { searchTools } from '@/lib/tool-api';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';
import { toast } from 'sonner';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(SoftwareToolModel & { id: number })[]>([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const searchDebounced = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setSearching(true);
        try {
          const results = await searchTools(searchQuery);
          setSearchResults(results.slice(0, 5));
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounced);
  }, [searchQuery]);

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search tools or navigate..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searching ? 'Searching...' : 'No results found.'}
        </CommandEmpty>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <CommandGroup heading="Tools">
              {searchResults.map((tool) => (
                <CommandItem
                  key={tool.id}
                  onSelect={() => handleSelect(() => navigate(`/explore?tool=${tool.id}`))}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{tool.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tool.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleSelect(() => navigate('/'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/explore'))}>
            <Grid3X3 className="mr-2 h-4 w-4" />
            <span>Explore Tools</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/add-tool'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Tool</span>
          </CommandItem>
          {user && (
            <CommandItem onSelect={() => handleSelect(() => navigate('/saved'))}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Saved Tools</span>
            </CommandItem>
          )}
        </CommandGroup>

        {/* Account */}
        {user && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem onSelect={() => handleSelect(() => navigate('/profile'))}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => navigate('/settings'))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(handleLogout)}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Quick Actions */}
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect(() => navigate('/updates'))}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>What's New</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/terms'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Terms of Service</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}