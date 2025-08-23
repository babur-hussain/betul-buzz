import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface GoogleOAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
}

const GoogleOAuth: React.FC<GoogleOAuthProps> = ({
  onSuccess,
  onError,
  variant = 'outline',
  size = 'default',
  className = '',
  disabled = false
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
      initializeGoogleSignIn();
    };
    script.onerror = () => {
      console.error('Failed to load Google OAuth script');
      onError?.('Failed to load Google authentication');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (typeof window !== 'undefined' && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: 'AIzaSyDggmqBtGRr7QgniVlGsZv7cISpiJKsqxg', // This should be your OAuth client ID
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the Google Sign-In button
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 300,
          });
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        onError?.('Failed to initialize Google authentication');
      }
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      setIsLoading(true);
      
      // Get the ID token from the response
      const { credential } = response;
      
      if (!credential) {
        throw new Error('No credential received from Google');
      }

      // Sign in with Supabase using Google OAuth
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError && userError.code === 'PGRST116') {
          // User doesn't exist, create profile
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              full_name: data.user.user_metadata?.full_name || 'User',
              role: 'user',
              is_verified: true,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (createError) {
            console.error('Error creating user profile:', createError);
          }
        }

        // Call the login function to update auth state
        const loginResult = await login({
          email: data.user.email || '',
          password: '', // Not needed for OAuth
        });

        if (loginResult.success) {
          onSuccess?.();
        } else {
          onError?.(loginResult.error || 'Login failed');
        }
      }
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      onError?.(error.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Fallback to manual Google OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      // The user will be redirected to Google OAuth
      // After successful authentication, they'll be redirected back
      
    } catch (error: any) {
      console.error('Manual Google OAuth error:', error);
      onError?.(error.message || 'Google authentication failed');
      setIsLoading(false);
    }
  };

  if (!isGoogleLoaded) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`w-full ${className}`}
        disabled={true}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        Loading Google...
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Google Sign-In Button */}
      <div id="google-signin-button" className="w-full"></div>
      
      {/* Fallback Button */}
      <Button
        variant={variant}
        size={size}
        className={`w-full ${className}`}
        onClick={handleManualGoogleSignIn}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Signing in...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>
      
      {/* Terms and Privacy */}
      <p className="text-xs text-gray-500 text-center">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default GoogleOAuth;
