import { useState, useEffect } from 'react';
import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { ExploreCard } from '@/components/custom/explore-card';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Folder, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCollections, deleteCollection, type ToolCollection } from '@/lib/user-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createCollection } from '@/lib/user-api';

export const MyTools = () => {
  const { user, loading: authLoading } = useAuth();
  const [collections, setCollections] = useState<ToolCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<ToolCollection | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    loadCollections();
  }, [user, authLoading]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const userCollections = await getUserCollections();
      setCollections(userCollections);
    } catch (err) {
      console.error('Error loading collections:', err);
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      const result = await createCollection(
        newCollection.name,
        newCollection.description,
        newCollection.isPublic
      );

      if (result.success) {
        setCreateDialogOpen(false);
        setNewCollection({ name: '', description: '', isPublic: false });
        await loadCollections();
      } else {
        setError(result.error || 'Failed to create collection');
      }
    } catch (err) {
      console.error('Error creating collection:', err);
      setError('Failed to create collection');
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection) return;

    try {
      const result = await deleteCollection(selectedCollection.id);
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedCollection(null);
        await loadCollections();
      } else {
        setError(result.error || 'Failed to delete collection');
      }
    } catch (err) {
      console.error('Error deleting collection:', err);
      setError('Failed to delete collection');
    }
  };


  // Group collections by time period
  const groupedCollections = collections.reduce((acc, collection) => {
    const date = new Date(collection.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    let group = 'Older';
    if (diffDays === 0) group = 'Today';
    else if (diffDays === 1) group = 'Yesterday';
    else if (diffDays < 7) group = 'Previous 7 days';
    else if (diffDays < 30) group = 'Previous 30 days';

    if (!acc[group]) acc[group] = [];
    acc[group].push(collection);
    return acc;
  }, {} as Record<string, ToolCollection[]>);

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <AppLayoutContent
        title={
          <h1 className="leading-8 font-normal">
            My Tool Collections
          </h1>
        }
        description={
          <p className="text-foreground/70 leading-5">
            Sign in to create and manage your tool collections
          </p>
        }
      >
        <div className="text-center py-12">
          <Folder className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">Create Tool Collections</h3>
          <p className="text-foreground/60 mb-6">
            Organize your favorite tools into collections for different projects and workflows.
          </p>
        </div>
      </AppLayoutContent>
    );
  }

  return (
    <>
      <AppLayoutContent
        title={
          <div className='flex items-center gap-2'>
            <TextAnimate animation="blurInUp" delay={0.1} duration={0.2} by="character" once as="h1" className='leading-8 font-normal'>
              My Tool Collections
            </TextAnimate>

            <TextAnimate animation="blurInUp" delay={0.3} duration={0.2} by="character" once as="span" className='text-xl md:text-2xl lg:text-3xl text-foreground/70 leading-5'>
              {`(${collections.length})`}
            </TextAnimate>
          </div>
        }
        description={
          <div className="flex items-center justify-between">
            <TextAnimate animation="blurInUp" delay={0.3} duration={0.3} by="character" once as="p" className='text-foreground/70 leading-5'>
              Organize your tools into collections for different projects and workflows
            </TextAnimate>
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </div>
        }
      >
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
            <span className="ml-2 text-foreground/70">Loading collections...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-red-600">{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && collections.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Collections Yet</h3>
            <p className="text-foreground/60 mb-6">
              Create your first collection to organize your favorite tools.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        )}

        {/* Collections Grouped by Time */}
        {!loading && !error && collections.length > 0 && (
          <>
            {['Today', 'Yesterday', 'Previous 7 days', 'Previous 30 days', 'Older'].map(groupName => {
              const groupCollections = groupedCollections[groupName];
              if (!groupCollections || groupCollections.length === 0) return null;

              return (
                <div key={groupName} className="flex flex-col gap-3">
                  <TextAnimate
                    animation="blurInUp"
                    delay={0.1}
                    duration={0.1}
                    by="character"
                    once
                    as="span"
                    className='text-foreground/60 leading-5'
                  >
                    {groupName}
                  </TextAnimate>
                  
                  {groupCollections.map((collection, index) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.id}`}
                    >
                      <ExploreCard
                        className="p-2 group"
                        title={collection.name}
                        description={collection.description || 'No description'}
                        subText={`${collection.toolCount} tools${collection.isPublic ? ' • Public' : ' • Private'}`}
                        image={collection.coverImage || '/images/explore-image-1.jpg'}
                        iconSymbol="📁"
                        imageSize="large"
                        delay={0.1 + index * 0.1}
                      />
                    </Link>
                  ))}
                </div>
              );
            })}
          </>
        )}
      </AppLayoutContent>

      {/* Create Collection Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Organize your tools into collections for different projects and workflows.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                placeholder="e.g., Frontend Development Stack"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this collection is for..."
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={newCollection.isPublic}
                onCheckedChange={(checked) => setNewCollection({ ...newCollection, isPublic: checked })}
              />
              <Label htmlFor="public">Make this collection public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} disabled={!newCollection.name.trim()}>
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCollection?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};