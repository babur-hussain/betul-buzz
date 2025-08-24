export interface UserPreferences {
  id: string;
  user_id: string;
  saved_businesses: SavedBusiness[];
  favorite_businesses: FavoriteBusiness[];
  created_at: string;
  updated_at: string;
}

export interface SavedBusiness {
  business_id: string;
  business_name: string;
  business_category: string;
  business_address: string;
  business_location: {
    lat: number;
    lng: number;
  };
  saved_at: string;
  notes?: string;
}

export interface FavoriteBusiness {
  business_id: string;
  business_name: string;
  business_category: string;
  business_address: string;
  business_location: {
    lat: number;
    lng: number;
  };
  favorited_at: string;
  rating?: number;
}

export interface BusinessAction {
  business_id: string;
  business_name: string;
  business_category: string;
  business_address: string;
  business_location: {
    lat: number;
    lng: number;
  };
  action_type: 'saved' | 'favorited';
  action_date: string;
  metadata?: Record<string, any>;
}
