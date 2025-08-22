export type UserRole = 'super_admin' | 'business_owner' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  cover_image_url?: string;
  business_hours: BusinessHours;
  services: string[];
  tags: string[];
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_featured: boolean;
  is_premium: boolean;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  is_open: boolean;
  open_time?: string;
  close_time?: string;
  is_24_hours?: boolean;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  business_id?: string;
  title: string;
  content: string;
  type: 'requirement' | 'offer' | 'review' | 'announcement';
  category: string;
  tags: string[];
  images?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  business: Business | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface BusinessFormData {
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  services: string[];
  tags: string[];
  business_hours: BusinessHours;
}

export interface PostFormData {
  title: string;
  content: string;
  type: 'requirement' | 'offer' | 'review' | 'announcement';
  category: string;
  tags: string[];
  business_id?: string;
}
