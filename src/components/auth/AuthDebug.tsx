import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { supabase } from '../../lib/supabase';

const AuthDebug: React.FC = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('Super Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    checkSupabaseConnection();
    fetchUsers();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      addLog('Testing Supabase connection...');
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        addLog(`❌ Supabase error: ${error.message}`);
      } else {
        addLog(`✅ Supabase connected. Users count: ${data?.length || 0}`);
      }
    } catch (err: any) {
      addLog(`❌ Connection failed: ${err.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      addLog('Fetching existing users...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(10);
      
      if (error) {
        addLog(`❌ Error fetching users: ${error.message}`);
      } else {
        setUsers(data || []);
        addLog(`✅ Found ${data?.length || 0} users in database`);
        if (data && data.length > 0) {
          data.forEach(user => {
            addLog(`   - ${user.email} (${user.role}) - ${user.is_active ? 'Active' : 'Inactive'}`);
          });
        }
      }
    } catch (err: any) {
      addLog(`❌ Fetch users failed: ${err.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setIsLoading(true);
      addLog(`🔐 Attempting login with: ${email}`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addLog(`❌ Auth error: ${error.message}`);
        return;
      }

      if (data.user) {
        addLog(`✅ Auth successful! User ID: ${data.user.id}`);
        addLog(`   - Email: ${data.user.email}`);
        addLog(`   - Confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);
        
        // Try to fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          addLog(`❌ Profile fetch error: ${profileError.message}`);
        } else {
          addLog(`✅ Profile found: ${profile.full_name} (${profile.role})`);
        }
      } else {
        addLog(`❌ No user returned from auth`);
      }
    } catch (err: any) {
      addLog(`❌ Login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUser = async () => {
    try {
      setIsLoading(true);
      addLog(`👤 Creating test user: ${email}`);

      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        addLog(`❌ Auth signup error: ${authError.message}`);
        return;
      }

      if (authData.user) {
        addLog(`✅ Auth user created: ${authData.user.id}`);

        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role: 'super_admin',
            is_verified: true,
            is_active: true,
          });

        if (profileError) {
          addLog(`❌ Profile creation error: ${profileError.message}`);
        } else {
          addLog(`✅ User profile created successfully`);
          await fetchUsers(); // Refresh user list
        }
      }
    } catch (err: any) {
      addLog(`❌ User creation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="flex space-x-4">
              <Button 
                onClick={testLogin} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Testing...' : 'Test Login'}
              </Button>
              <Button 
                onClick={createTestUser} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Creating...' : 'Create Test User'}
              </Button>
              <Button 
                onClick={fetchUsers} 
                disabled={isLoading}
                variant="outline"
              >
                Refresh Users
              </Button>
              <Button 
                onClick={clearLogs} 
                variant="outline"
              >
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Users */}
        {users.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Existing Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'business_owner' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div>No logs yet. Click "Test Login" or "Create Test User" to start debugging.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            <strong>Instructions:</strong>
            <br />• First check if Supabase connection is working
            <br />• If no users exist, create a test user first
            <br />• Then try logging in with the created user
            <br />• Check the logs for detailed error messages
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AuthDebug;
