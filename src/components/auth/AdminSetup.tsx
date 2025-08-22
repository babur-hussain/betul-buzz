import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { supabase } from '../../lib/supabase';

const AdminSetup: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready to setup admin');
  const [email, setEmail] = useState('admin@betulbuzz.com');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('Super Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setStatus(`Current user: ${user.email}`);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  };

  const createSuperAdmin = async () => {
    try {
      setIsLoading(true);
      setStatus('Creating super admin user...');

      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setStatus(`❌ Auth signup failed: ${authError.message}`);
        return;
      }

      if (authData.user) {
        setStatus(`✅ Auth user created: ${authData.user.id}`);

        // Create super admin profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role: 'super_admin',
            is_verified: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          setStatus(`❌ Profile creation failed: ${profileError.message}`);
          return;
        }

        setStatus(`✅ Super Admin created successfully!`);
        setStatus(`✅ Login with: ${email} / ${password}`);
        
        // Auto-login
        await loginAsAdmin();
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    try {
      setStatus('Logging in as admin...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus(`❌ Login failed: ${error.message}`);
        return;
      }

      if (data.user) {
        setStatus(`✅ Logged in as Super Admin!`);
        setCurrentUser(data.user);
        
        // Refresh the page to trigger role-based routing
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err: any) {
      setStatus(`❌ Login error: ${err.message}`);
    }
  };

  const checkDatabaseUsers = async () => {
    try {
      setStatus('Checking database users...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(10);
      
      if (error) {
        setStatus(`❌ Error: ${error.message}`);
        return;
      }
      
      setStatus(`✅ Found ${data?.length || 0} users in database`);
      
      if (data && data.length > 0) {
        data.forEach(user => {
          console.log(`User: ${user.full_name} (${user.role}) - ${user.email}`);
        });
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const forceLogin = async () => {
    try {
      setStatus('Force logging in...');
      
      // Create minimal user state manually
      const minimalUser = {
        id: currentUser?.id || 'temp-admin-id',
        email: email,
        full_name: fullName,
        role: 'super_admin' as const,
        is_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Store in localStorage to persist across page refresh
      localStorage.setItem('betulbuzz-admin-user', JSON.stringify(minimalUser));
      
      setStatus('✅ Admin user stored. Refreshing page...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Super Admin Setup & Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Status: {status}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={createSuperAdmin} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Creating...' : 'Create Super Admin'}
              </Button>
              <Button 
                onClick={checkDatabaseUsers} 
                variant="outline"
              >
                Check Database Users
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={loginAsAdmin} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login as Admin
              </Button>
              <Button 
                onClick={forceLogin} 
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Force Admin Login
              </Button>
            </div>

            {currentUser && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Current User:</h3>
                <p className="text-sm text-green-600">ID: {currentUser.id}</p>
                <p className="text-sm text-green-600">Email: {currentUser.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Step 1:</strong> Create Super Admin user</p>
              <p><strong>Step 2:</strong> Login with the created credentials</p>
              <p><strong>Step 3:</strong> You'll be redirected to /dashboard</p>
              <p><strong>Alternative:</strong> Use "Force Admin Login" if database issues persist</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
