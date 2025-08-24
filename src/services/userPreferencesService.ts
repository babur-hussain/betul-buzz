import { supabase } from '../lib/supabase';
import { SavedBusiness, FavoriteBusiness, UserPreferences } from '../types/userPreferences';

export class UserPreferencesService {
  private static readonly PREFERENCES_TABLE = 'user_preferences';
  private static readonly SAVED_BUSINESSES_TABLE = 'saved_businesses';
  private static readonly FAVORITE_BUSINESSES_TABLE = 'favorite_businesses';

  /**
   * Get or create user preferences
   */
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // First try to get existing preferences
      const { data: preferences, error } = await supabase
        .from(this.PREFERENCES_TABLE)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Preferences don't exist, create default
        const defaultPreferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> = {
          user_id: userId,
          saved_businesses: [],
          favorite_businesses: [],
        };

        const { data: newPreferences, error: createError } = await supabase
          .from(this.PREFERENCES_TABLE)
          .insert(defaultPreferences)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user preferences:', createError);
          return null;
        }

        return newPreferences;
      }

      if (error) {
        console.error('Error fetching user preferences:', error);
        return null;
      }

      return preferences;
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return null;
    }
  }

  /**
   * Save a business to user's saved list
   */
  static async saveBusiness(userId: string, business: any): Promise<boolean> {
    try {
      const savedBusiness: Omit<SavedBusiness, 'saved_at'> = {
        business_id: business.id,
        business_name: business.name,
        business_category: business.category,
        business_address: business.address,
        business_location: business.location,
      };

      // Check if already saved
      const { data: existing } = await supabase
        .from(this.SAVED_BUSINESSES_TABLE)
        .select('id')
        .eq('user_id', userId)
        .eq('business_id', business.id)
        .single();

      if (existing) {
        // Already saved, remove it (toggle)
        const { error: deleteError } = await supabase
          .from(this.SAVED_BUSINESSES_TABLE)
          .delete()
          .eq('user_id', userId)
          .eq('business_id', business.id);

        if (deleteError) {
          console.error('Error removing saved business:', deleteError);
          return false;
        }

        return true; // Successfully removed
      } else {
        // Not saved, add it
        const { error: insertError } = await supabase
          .from(this.SAVED_BUSINESSES_TABLE)
          .insert({
            user_id: userId,
            ...savedBusiness,
            saved_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error saving business:', insertError);
          return false;
        }

        return true; // Successfully saved
      }
    } catch (error) {
      console.error('Error in saveBusiness:', error);
      return false;
    }
  }

  /**
   * Add/remove business from user's favorites
   */
  static async toggleFavoriteBusiness(userId: string, business: any): Promise<boolean> {
    try {
      const favoriteBusiness: Omit<FavoriteBusiness, 'favorited_at'> = {
        business_id: business.id,
        business_name: business.name,
        business_category: business.category,
        business_address: business.address,
        business_location: business.location,
        rating: business.rating,
      };

      // Check if already favorited
      const { data: existing } = await supabase
        .from(this.FAVORITE_BUSINESSES_TABLE)
        .select('id')
        .eq('user_id', userId)
        .eq('business_id', business.id)
        .single();

      if (existing) {
        // Already favorited, remove it
        const { error: deleteError } = await supabase
          .from(this.FAVORITE_BUSINESSES_TABLE)
          .delete()
          .eq('user_id', userId)
          .eq('business_id', business.id);

        if (deleteError) {
          console.error('Error removing favorite business:', deleteError);
          return false;
        }

        return true; // Successfully removed
      } else {
        // Not favorited, add it
        const { error: insertError } = await supabase
          .from(this.FAVORITE_BUSINESSES_TABLE)
          .insert({
            user_id: userId,
            ...favoriteBusiness,
            favorited_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error favoriting business:', insertError);
          return false;
        }

        return true; // Successfully favorited
      }
    } catch (error) {
      console.error('Error in toggleFavoriteBusiness:', error);
      return false;
    }
  }

  /**
   * Get user's saved businesses
   */
  static async getSavedBusinesses(userId: string): Promise<SavedBusiness[]> {
    try {
      const { data, error } = await supabase
        .from(this.SAVED_BUSINESSES_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved businesses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSavedBusinesses:', error);
      return [];
    }
  }

  /**
   * Get user's favorite businesses
   */
  static async getFavoriteBusinesses(userId: string): Promise<FavoriteBusiness[]> {
    try {
      const { data, error } = await supabase
        .from(this.FAVORITE_BUSINESSES_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('favorited_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorite businesses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFavoriteBusinesses:', error);
      return [];
    }
  }

  /**
   * Check if a business is saved by user
   */
  static async isBusinessSaved(userId: string, businessId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.SAVED_BUSINESSES_TABLE)
        .select('id')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .single();

      if (error && error.code === 'PGRST116') {
        return false; // Not found
      }

      return !!data;
    } catch (error) {
      console.error('Error in isBusinessSaved:', error);
      return false;
    }
  }

  /**
   * Check if a business is favorited by user
   */
  static async isBusinessFavorited(userId: string, businessId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.FAVORITE_BUSINESSES_TABLE)
        .select('id')
        .eq('user_id', businessId)
        .eq('business_id', businessId)
        .single();

      if (error && error.code === 'PGRST116') {
        return false; // Not found
      }

      return !!data;
    } catch (error) {
      console.error('Error in isBusinessFavorited:', error);
      return false;
    }
  }
}
