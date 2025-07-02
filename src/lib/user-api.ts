import { supabase } from './supabase';
import { SoftwareToolModel } from '@/temp-data/software-tool-data';

export interface SavedTool extends SoftwareToolModel {
  id: number;
  savedAt: string;
  notes?: string;
}

export interface ToolCollection {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  coverImage?: string;
  createdAt: string;
  toolCount: number;
  tools?: SoftwareToolModel[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  company?: string;
  location?: string;
}

// Get user's saved tools
export const getUserSavedTools = async (): Promise<SavedTool[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_saved_tools_with_details')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved tools:', error);
      return [];
    }

    return data.map(item => ({
      id: item.tool_id,
      name: item.name,
      category: item.category,
      logo: item.logo_public_url || item.logo || '/icons/unknown-icon.svg',
      pricing: {
        type: item.pricing_type,
        startingPrice: item.starting_price,
        currency: item.currency,
        billingPeriod: item.billing_period,
      },
      description: item.description,
      features: item.features || [],
      rating: item.rating,
      reviewCount: 0, // We'll need to calculate this
      website: item.website,
      tags: item.tags || [],
      compatibility: [], // Not stored in current schema
      lastUpdated: new Date(item.saved_at).toISOString().split('T')[0],
      savedAt: item.saved_at,
      notes: item.notes,
    }));
  } catch (error) {
    console.error('Error in getUserSavedTools:', error);
    return [];
  }
};

// Save a tool for the current user
export const saveToolForUser = async (toolId: number, notes?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('saved_tools')
      .insert({
        user_id: user.id,
        tool_id: toolId,
        notes,
      });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { success: false, error: 'Tool already saved' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving tool:', error);
    return { success: false, error: 'Failed to save tool' };
  }
};

// Remove a saved tool
export const unsaveToolForUser = async (toolId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('saved_tools')
      .delete()
      .eq('user_id', user.id)
      .eq('tool_id', toolId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error unsaving tool:', error);
    return { success: false, error: 'Failed to unsave tool' };
  }
};

// Check if a tool is saved by the current user
export const isToolSavedByUser = async (toolId: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('saved_tools')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking saved tool:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isToolSavedByUser:', error);
    return false;
  }
};

// Get user's tool collections
export const getUserCollections = async (): Promise<ToolCollection[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .rpc('get_user_collections', { user_uuid: user.id });

    if (error) {
      console.error('Error fetching user collections:', error);
      return [];
    }

    return data.map((collection: any) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isPublic: collection.is_public,
      coverImage: collection.cover_image,
      createdAt: collection.created_at,
      toolCount: parseInt(collection.tool_count),
    }));
  } catch (error) {
    console.error('Error in getUserCollections:', error);
    return [];
  }
};

// Create a new collection
export const createCollection = async (
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<{ success: boolean; error?: string; id?: number }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('tool_collections')
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { success: false, error: 'Failed to create collection' };
  }
};

// Add tool to collection
export const addToolToCollection = async (
  collectionId: number,
  toolId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('collection_tools')
      .insert({
        collection_id: collectionId,
        tool_id: toolId,
      });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { success: false, error: 'Tool already in collection' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding tool to collection:', error);
    return { success: false, error: 'Failed to add tool to collection' };
  }
};

// Remove tool from collection
export const removeToolFromCollection = async (
  collectionId: number,
  toolId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('collection_tools')
      .delete()
      .eq('collection_id', collectionId)
      .eq('tool_id', toolId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing tool from collection:', error);
    return { success: false, error: 'Failed to remove tool from collection' };
  }
};

// Get tools in a collection
export const getCollectionTools = async (collectionId: number): Promise<SoftwareToolModel[]> => {
  try {
    const { data, error } = await supabase
      .from('collection_tools')
      .select(`
        tool_id,
        tools (
          id,
          name,
          description,
          category,
          pricing_type,
          starting_price,
          currency,
          billing_period,
          rating,
          review_count,
          website,
          tags,
          features,
          compatibility,
          logo,
          logo_public_url,
          updated_at
        )
      `)
      .eq('collection_id', collectionId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching collection tools:', error);
      return [];
    }

    return data.map((item: any) => {
      const tool = item.tools;
      return {
        name: tool.name,
        category: tool.category,
        logo: tool.logo_public_url || tool.logo || '/icons/unknown-icon.svg',
        pricing: {
          type: tool.pricing_type,
          startingPrice: tool.starting_price,
          currency: tool.currency,
          billingPeriod: tool.billing_period,
        },
        description: tool.description,
        features: tool.features || [],
        rating: tool.rating,
        reviewCount: tool.review_count,
        website: tool.website,
        tags: tool.tags || [],
        compatibility: tool.compatibility || [],
        lastUpdated: new Date(tool.updated_at).toISOString().split('T')[0],
      };
    });
  } catch (error) {
    console.error('Error in getCollectionTools:', error);
    return [];
  }
};

// Delete a collection
export const deleteCollection = async (collectionId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify the user owns this collection
    const { data: collection, error: fetchError } = await supabase
      .from('tool_collections')
      .select('user_id')
      .eq('id', collectionId)
      .single();

    if (fetchError || !collection || collection.user_id !== user.id) {
      return { success: false, error: 'Collection not found or access denied' };
    }

    const { error } = await supabase
      .from('tool_collections')
      .delete()
      .eq('id', collectionId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: 'Failed to delete collection' };
  }
};