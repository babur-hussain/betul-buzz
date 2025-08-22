import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Business, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateBusiness: (updates: Partial<Business>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    business: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored admin user first
        const storedAdmin = localStorage.getItem('betulbuzz-admin-user');
        if (storedAdmin) {
          try {
            const adminUser = JSON.parse(storedAdmin);
            console.log('🔄 Found stored admin user:', adminUser);
            
            setAuthState({
              user: adminUser,
              business: null,
              isLoading: false,
              isAuthenticated: true,
            });
            
            console.log('✅ Admin user restored from storage');
            return;
          } catch (parseError) {
            console.log('⚠️ Failed to parse stored admin user, clearing');
            localStorage.removeItem('betulbuzz-admin-user');
          }
        }
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            business: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string, credentials?: LoginCredentials) => {
    try {
      console.log('🔍 Background profile fetch started for:', userId);
      
      // Add timeout to prevent hanging
      const fetchTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database fetch timeout')), 3000);
      });
      
      // Fetch user profile with timeout
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      const { data: userData, error: userError } = await Promise.race([profilePromise, fetchTimeout]) as any;

      if (userError) {
        console.error('❌ Error fetching user profile:', userError);
        
        // If user doesn't exist in our table, create a default profile
        if (userError.code === 'PGRST116') {
          console.log('🔄 User profile not found, creating default profile...');
          
          try {
            const defaultProfile = {
              id: userId,
              email: credentials?.email || 'user@example.com',
              full_name: 'User',
              role: 'user' as const,
              is_verified: true,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            console.log('📝 Attempting to insert profile:', defaultProfile);
            
            // Add timeout to profile creation too
            const insertPromise = supabase
              .from('users')
              .insert(defaultProfile);
              
            const { error: insertError } = await Promise.race([insertPromise, fetchTimeout]) as any;
              
            if (insertError) {
              console.error('❌ Failed to create default profile:', insertError);
              console.log('⚠️ Profile creation failed, but user is already logged in');
              return;
            }
            
            console.log('✅ Default profile created:', defaultProfile);
            
            // Update auth state with full profile (but don't change loading state)
            setAuthState(prev => ({
              ...prev,
              user: defaultProfile,
              business: null,
            }));
            
            return;
          } catch (profileError) {
            console.error('❌ Profile creation failed:', profileError);
            console.log('⚠️ Profile creation failed, but user is already logged in');
            return;
          }
        }
        
        console.log('⚠️ Profile fetch failed, but user is already logged in');
        return;
      }

      console.log('✅ User profile fetched:', userData);

      // Fetch business data if user is a business owner (with timeout)
      let businessData = null;
      if (userData.role === 'business_owner') {
        try {
          const businessPromise = supabase
            .from('businesses')
            .select('*')
            .eq('owner_id', userId)
            .single();
            
          const { data: business, error: businessError } = await Promise.race([businessPromise, fetchTimeout]) as any;

          if (!businessError) {
            businessData = business;
            console.log('✅ Business data fetched:', business);
          } else {
            console.log('ℹ️ No business data found for user');
          }
        } catch (businessTimeout) {
          console.log('⚠️ Business fetch timed out, continuing without business data');
        }
      }

      // Update auth state with full profile (but don't change loading state)
      setAuthState(prev => ({
        ...prev,
        user: userData,
        business: businessData,
      }));
      
      console.log('✅ Background profile fetch completed successfully');
    } catch (error) {
      console.error('❌ Background profile fetch failed (non-critical):', error);
      // Don't throw errors in background fetch - user is already logged in
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Login attempt started for:', credentials.email);
      
      // Add timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout - taking too long')), 10000);
      });
      
      const loginPromise = supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Supabase auth error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Auth successful, fetching user data for:', data.user.id);
        
        // Immediately create minimal user state to ensure login succeeds
        const minimalUser = { 
          id: data.user.id, 
          email: credentials.email, 
          full_name: 'User', 
          role: 'user' as const,
          is_verified: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log('🔄 Creating minimal user state immediately...');
        
        // Set auth state immediately with minimal user
        setAuthState({
          user: minimalUser,
          business: null,
          isLoading: false,
          isAuthenticated: true,
        });
        
        console.log('✅ Minimal user state created and auth state set');
        
        // Try to fetch full profile in background (non-blocking)
        fetchUserData(data.user.id, credentials).then(() => {
          console.log('✅ Background profile fetch completed, user role updated');
        }).catch(error => {
          console.log('⚠️ Background profile fetch failed (non-critical):', error);
        });
        
        return { success: true };
      }

      console.log('❌ No user returned from auth');
      return { success: false, error: 'Login failed - no user returned' };
    } catch (error: any) {
      console.error('❌ Login function error:', error);
      // Reset loading state on error
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: credentials.email,
            full_name: credentials.full_name,
            phone: credentials.phone,
            role: credentials.role,
            is_verified: false,
            is_active: true,
          });

        if (profileError) throw profileError;

        // If business owner, create business profile
        if (credentials.role === 'business_owner') {
          const { error: businessError } = await supabase
            .from('businesses')
            .insert({
              owner_id: authData.user.id,
              name: credentials.full_name,
              description: '',
              category: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
              phone: credentials.phone || '',
              email: credentials.email,
              status: 'pending',
              is_verified: false,
              is_featured: false,
              is_premium: false,
              rating: 0,
              total_reviews: 0,
              services: [],
              tags: [],
              business_hours: {
                monday: { is_open: false },
                tuesday: { is_open: false },
                wednesday: { is_open: false },
                thursday: { is_open: false },
                friday: { is_open: false },
                saturday: { is_open: false },
                sunday: { is_open: false },
              },
              location: { lat: 0, lng: 0 },
            });

          if (businessError) throw businessError;
        }

        await fetchUserData(authData.user.id);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        business: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!authState.user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authState.user.id);

      if (error) throw error;

      // Refresh user data
      await refreshUser();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  const updateBusiness = async (updates: Partial<Business>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!authState.business) throw new Error('No business found');

      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', authState.business.id);

      if (error) throw error;

      // Refresh user data
      await refreshUser();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  const refreshUser = async () => {
    if (authState.user) {
      await fetchUserData(authState.user.id);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    updateBusiness,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
