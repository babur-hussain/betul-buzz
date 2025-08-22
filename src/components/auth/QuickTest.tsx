import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { supabase } from '../../lib/supabase';

const QuickTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [users, setUsers] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('admin@gmail.com');
  const [testPassword, setTestPassword] = useState('admin123');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        setStatus(`❌ Connection failed: ${error.message}`);
        return;
      }
      
      setStatus('✅ Connected to Supabase!');
      
      // Fetch users
      await fetchUsers();
      
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      if (error) {
        setStatus(`❌ Error fetching users: ${error.message}`);
        return;
      }
      
      setUsers(data || []);
      setStatus(`✅ Found ${data?.length || 0} users`);
      
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setStatus('🔐 Testing login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        setStatus(`❌ Login failed: ${error.message}`);
        return;
      }
      
      if (data.user) {
        setStatus(`✅ Login successful! User ID: ${data.user.id}`);
        
        // Check if user exists in our users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          setStatus(`⚠️ Auth works but no profile found: ${profileError.message}`);
        } else {
          setStatus(`✅ Full login successful! Welcome ${profile.full_name}`);
        }
      }
      
    } catch (err: any) {
      setStatus(`❌ Login error: ${err.message}`);
    }
  };

  const createTestUser = async () => {
    try {
      setStatus('👤 Creating test user...');
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      
      if (authError) {
        setStatus(`❌ Auth signup failed: ${authError.message}`);
        return;
      }
      
      if (authData.user) {
        setStatus(`✅ Auth user created: ${authData.user.id}`);
        
        // Create profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: testEmail,
            full_name: 'Test Admin',
            role: 'super_admin',
            is_verified: true,
            is_active: true,
          });
          
        if (profileError) {
          setStatus(`❌ Profile creation failed: ${profileError.message}`);
        } else {
          setStatus(`✅ Test user created successfully!`);
          await fetchUsers();
        }
      }
      
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Status: {status}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={testConnection} variant="outline">
                Test Connection
              </Button>
              <Button onClick={fetchUsers} variant="outline">
                Refresh Users
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Email</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Password</label>
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={testLogin} className="bg-blue-600">
                Test Login
              </Button>
              <Button onClick={createTestUser} className="bg-green-600">
                Create Test User
              </Button>
            </div>
          </CardContent>
        </Card>

        {users.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Existing Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="p-3 bg-gray-100 rounded">
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-500">Role: {user.role}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuickTest;
