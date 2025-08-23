import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import GoogleOAuth from './GoogleOAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  onSuccess 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{mode === 'login' ? 'Sign In' : 'Sign Up'}</DialogTitle>
          <DialogDescription>
            {mode === 'login' ? 'Sign in to your BetulBuzz account' : 'Create a new BetulBuzz account'}
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-50 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Auth Forms */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {mode === 'login' ? (
              <LoginForm 
                onSwitchToRegister={handleSwitchMode}
                onSuccess={handleSuccess}
              />
            ) : (
              <RegisterForm 
                onSwitchToLogin={handleSwitchMode}
                onSuccess={handleSuccess}
              />
            )}

            {/* Google OAuth Section */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4">
                <GoogleOAuth 
                  onSuccess={handleSuccess}
                  onError={(error) => console.error('Google OAuth error:', error)}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
