import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { 
  Building, 
  Users, 
  Shield, 
  Star, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Eye,
  TrendingUp,
  AlertTriangle,
  Plus,
  Upload,
  MapPin,
  Phone,
  Mail,
  Clock,
  Tag,
  ImageIcon,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  UserCheck,
  UserX,
  Crown,
  Award,
  Globe,
  User as UserIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Business, User } from '../../types/auth';
import ReviewManagement from './ReviewManagement';

type BusinessStatus = 'pending' | 'active' | 'suspended' | 'inactive';
type BusinessCategory = string;

interface BusinessWithOwner extends Business {
  owner?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  pendingBusinesses: number;
  verifiedBusinesses: number;
  totalRevenue: number;
  activeUsers: number;
  premiumBusinesses: number;
  totalReviews: number;
}

interface BusinessFormData {
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
  images: File[];
  location: { lat: number; lng: number };
  business_hours: {
    monday: { is_open: boolean; open_time?: string; close_time?: string };
    tuesday: { is_open: boolean; open_time?: string; close_time?: string };
    wednesday: { is_open: boolean; open_time?: string; close_time?: string };
    thursday: { is_open: boolean; open_time?: string; close_time?: string };
    friday: { is_open: boolean; open_time?: string; close_time?: string };
    saturday: { is_open: boolean; open_time?: string; close_time?: string };
    sunday: { is_open: boolean; open_time?: string; close_time?: string };
  };
}

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    pendingBusinesses: 0,
    verifiedBusinesses: 0,
    totalRevenue: 0,
    activeUsers: 0,
    premiumBusinesses: 0,
    totalReviews: 0,
  });
  const [businesses, setBusinesses] = useState<BusinessWithOwner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [businessForm, setBusinessForm] = useState<BusinessFormData>({
    name: '',
    description: '',
    category: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    services: [],
    tags: [],
    images: [],
    location: { lat: 0, lng: 0 },
    business_hours: {
      monday: { is_open: false },
      tuesday: { is_open: false },
      wednesday: { is_open: false },
      thursday: { is_open: false },
      friday: { is_open: false },
      saturday: { is_open: false },
      sunday: { is_open: false },
    },
  });

  const businessCategories = [
    'Restaurant & Food',
    'Healthcare',
    'Education',
    'Retail & Shopping',
    'Automotive',
    'Beauty & Wellness',
    'Home & Garden',
    'Technology',
    'Entertainment',
    'Professional Services',
    'Real Estate',
    'Travel & Tourism',
    'Sports & Fitness',
    'Art & Culture',
    'Other'
  ];

  const businessStatuses: BusinessStatus[] = ['pending', 'active', 'suspended', 'inactive'];

  // Google Maps configuration
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDggmqBtGRr7QgniVlGsZv7cISpiJKsqxg',
  });

  // Map handling functions
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setBusinessForm(prev => ({
        ...prev,
        location: {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng()
        }
      }));
    }
  }, []);

  const handleMarkerDrag = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setBusinessForm(prev => ({
        ...prev,
        location: {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng()
        }
      }));
    }
  }, []);

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setBusinessForm(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index: number) => {
    setBusinessForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetBusinessForm = () => {
    setBusinessForm({
      name: '',
      description: '',
      category: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      website: '',
      services: [],
      tags: [],
      images: [],
      location: { lat: 0, lng: 0 },
      business_hours: {
        monday: { is_open: false },
        tuesday: { is_open: false },
        wednesday: { is_open: false },
        thursday: { is_open: false },
        friday: { is_open: false },
        saturday: { is_open: false },
        sunday: { is_open: false },
      },
    });
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time subscription
    const subscription = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch businesses with owner details
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select(`
          *,
          owner:users!businesses_owner_id_fkey(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (businessesError) throw businessesError;

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch reviews count
      const { count: reviewsCount, error: reviewsError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      if (reviewsError) console.error('Error fetching reviews count:', reviewsError);

      setBusinesses(businessesData || []);
      setUsers(usersData || []);

      // Calculate comprehensive stats
      const totalUsers = usersData?.length || 0;
      const totalBusinesses = businessesData?.length || 0;
      const pendingBusinesses = businessesData?.filter(b => b.status === 'pending').length || 0;
      const verifiedBusinesses = businessesData?.filter(b => b.is_verified).length || 0;
      const activeUsers = usersData?.filter(u => u.is_active).length || 0;
      const premiumBusinesses = businessesData?.filter(b => b.is_premium).length || 0;

      setStats({
        totalUsers,
        totalBusinesses,
        pendingBusinesses,
        verifiedBusinesses,
        totalRevenue: 0, // Placeholder for revenue tracking
        activeUsers,
        premiumBusinesses,
        totalReviews: reviewsCount || 0,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessAction = async (businessId: string, action: 'verify' | 'suspend' | 'delete' | 'feature' | 'premium') => {
    try {
      let updateData: Partial<Business> = {};

      switch (action) {
        case 'verify':
          updateData = { 
            is_verified: true, 
            status: 'active'
          };
          break;
        case 'suspend':
          updateData = { 
            status: 'suspended'
          };
          break;
        case 'feature':
          updateData = { 
            is_featured: !businesses.find(b => b.id === businessId)?.is_featured
          };
          break;
        case 'premium':
          updateData = { 
            is_premium: !businesses.find(b => b.id === businessId)?.is_premium
          };
          break;
        case 'delete':
          // Delete business
          const { error: deleteError } = await supabase
            .from('businesses')
            .delete()
            .eq('id', businessId);

          if (deleteError) throw deleteError;
          break;
      }

      if (action !== 'delete') {
        const { error: updateError } = await supabase
          .from('businesses')
          .update(updateData)
          .eq('id', businessId);

        if (updateError) throw updateError;
      }

      // Refresh data
      await fetchDashboardData();

    } catch (error) {
      console.error(`Error ${action}ing business:`, error);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete' | 'promote') => {
    try {
      let updateData: Partial<User> = {};

      switch (action) {
        case 'activate':
          updateData = { is_active: true };
          break;
        case 'deactivate':
          updateData = { is_active: false };
          break;
        case 'promote':
          updateData = { role: 'super_admin' };
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

          if (deleteError) throw deleteError;
          break;
      }

      if (action !== 'delete') {
        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId);

        if (updateError) throw updateError;
      }

      await fetchDashboardData();

    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const createBusiness = async (formData: BusinessFormData) => {
    try {
      // Create a new user for the business owner
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'tempPassword123!', // Temporary password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.name,
            phone: formData.phone,
            role: 'business_owner',
            is_verified: true,
            is_active: true,
          });

        if (userError) throw userError;

        // Create business profile
        const { error: businessError } = await supabase
          .from('businesses')
          .insert({
            owner_id: authData.user.id,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            services: formData.services,
            tags: formData.tags,
            business_hours: formData.business_hours,
            status: 'active',
            is_verified: true,
            is_featured: false,
            is_premium: false,
            rating: 0,
            total_reviews: 0,
            location: formData.location,
          });

        if (businessError) throw businessError;

        await fetchDashboardData();
        setShowAddBusiness(false);
        setBusinessForm({
          name: '',
          description: '',
          category: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          email: '',
          website: '',
          services: [],
          tags: [],
          images: [],
          location: { lat: 0, lng: 0 },
          business_hours: {
            monday: { is_open: false },
            tuesday: { is_open: false },
            wednesday: { is_open: false },
            thursday: { is_open: false },
            friday: { is_open: false },
            saturday: { is_open: false },
            sunday: { is_open: false },
          },
        });
      }
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspended</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-red-500 hover:bg-red-600"><Crown className="w-3 h-3 mr-1" />Super Admin</Badge>;
      case 'business_owner':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Building className="w-3 h-3 mr-1" />Business Owner</Badge>;
      case 'user':
        return <Badge className="bg-green-500 hover:bg-green-600"><UserIcon className="w-3 h-3 mr-1" />User</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">Complete management of businesses, users, and system settings</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowAddBusiness(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
            <Badge className="bg-red-500">
              <Shield className="w-4 h-4 mr-1" />
              Super Admin
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active users
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.premiumBusinesses} premium
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBusinesses}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                User feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Businesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Recent Businesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businesses.slice(0, 5).map((business) => (
                      <div key={business.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{business.name}</p>
                          <p className="text-sm text-gray-600">{business.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(business.status)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBusiness(business);
                              setShowBusinessDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getRoleBadge(user.role)}
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Management</CardTitle>
                <CardDescription>
                  Manage all registered businesses, verify, suspend, or delete as needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search businesses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {businessStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {businessCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Businesses Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBusinesses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No businesses found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBusinesses.map((business) => (
                          <TableRow key={business.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{business.name}</div>
                                <div className="text-sm text-gray-500">{business.city}, {business.state}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {(business.owner as any)?.full_name || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {(business.owner as any)?.email || 'No email'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{business.category}</Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(business.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                {business.rating.toFixed(1)} ({business.total_reviews})
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(business.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBusiness(business);
                                    setShowBusinessDetails(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {business.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBusinessAction(business.id, 'verify')}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                {business.status === 'active' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBusinessAction(business.id, 'suspend')}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBusinessAction(business.id, 'feature')}
                                  className={business.is_featured ? 'text-yellow-600' : 'text-gray-600'}
                                >
                                  <Award className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBusinessAction(business.id, 'premium')}
                                  className={business.is_premium ? 'text-purple-600' : 'text-gray-600'}
                                >
                                  <Crown className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBusinessAction(business.id, 'delete')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Overview of all registered users and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No users found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.phone && (
                                  <div className="text-sm text-gray-500">{user.phone}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>
                              <Badge variant={user.is_active ? "default" : "secondary"}>
                                {user.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {user.is_active ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, 'deactivate')}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, 'activate')}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </Button>
                                )}
                                {user.role !== 'super_admin' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, 'promote')}
                                    className="text-purple-600 hover:text-purple-700"
                                  >
                                    <Crown className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <ReviewManagement />
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Management</CardTitle>
                <CardDescription>
                  Manage business images and media content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Image management features coming soon...</p>
                  <p className="text-sm">Upload, organize, and moderate business images</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Growth</CardTitle>
                  <CardDescription>Monthly business registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <BarChart3 className="w-16 h-16" />
                    <p className="ml-4">Analytics coming soon...</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>User engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <TrendingUp className="w-16 h-16" />
                    <p className="ml-4">Analytics coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Business Dialog */}
        <Dialog open={showAddBusiness} onOpenChange={setShowAddBusiness}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle>Add New Business</DialogTitle>
              <DialogDescription>
                Create a new business profile with complete details
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(95vh - 200px)' }}>
              <form onSubmit={(e) => { e.preventDefault(); createBusiness(businessForm); }} className="space-y-6 py-4">
                
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name *</Label>
                      <Input
                        id="name"
                        value={businessForm.name}
                        onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                        placeholder="Enter business name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={businessForm.category} onValueChange={(value) => setBusinessForm({...businessForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                        placeholder="business@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                        placeholder="+91-1234567890"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessForm.website}
                        onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location & Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={businessForm.city}
                        onChange={(e) => setBusinessForm({...businessForm, city: e.target.value})}
                        placeholder="Betul"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={businessForm.state}
                        onChange={(e) => setBusinessForm({...businessForm, state: e.target.value})}
                        placeholder="Madhya Pradesh"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={businessForm.pincode}
                        onChange={(e) => setBusinessForm({...businessForm, pincode: e.target.value})}
                        placeholder="460001"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                      placeholder="Enter complete address"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Google Maps Integration */}
                  <div className="space-y-2">
                    <Label>Location on Map</Label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Click on map to set location</span>
                      </div>
                      <div className="h-64 bg-white border rounded-lg relative">
                        {isLoaded ? (
                          <GoogleMap
                            center={businessForm.location.lat !== 0 ? businessForm.location : { lat: 23.1765, lng: 77.5885 }} // Betul, MP coordinates
                            zoom={13}
                            onClick={handleMapClick}
                            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
                          >
                            {businessForm.location.lat !== 0 && (
                              <Marker
                                position={businessForm.location}
                                draggable={true}
                                onDragEnd={handleMarkerDrag}
                              />
                            )}
                          </GoogleMap>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="text-center text-gray-500">
                              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">Loading Google Maps...</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-md text-xs">
                          <div>Lat: {businessForm.location.lat.toFixed(6)}</div>
                          <div>Lng: {businessForm.location.lng.toFixed(6)}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        💡 Click anywhere on the map to set business location, or drag the marker to adjust
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={businessForm.description}
                      onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                      placeholder="Describe your business, services, and what makes you unique"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Services & Tags</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="services">Services (comma-separated)</Label>
                        <Input
                          id="services"
                          value={businessForm.services.join(', ')}
                          onChange={(e) => setBusinessForm({
                            ...businessForm, 
                            services: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          })}
                          placeholder="Service 1, Service 2, Service 3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={businessForm.tags.join(', ')}
                          onChange={(e) => setBusinessForm({
                            ...businessForm, 
                            tags: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          })}
                          placeholder="Tag 1, Tag 2, Tag 3"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Images Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Images</h3>
                  <div className="space-y-2">
                    <Label>Upload Business Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="business-images"
                        onChange={(e) => handleImageUpload(e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => document.getElementById('business-images')?.click()}
                      >
                        Choose Images
                      </Button>
                    </div>
                    
                    {/* Image Preview */}
                    {businessForm.images && businessForm.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        {businessForm.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                              alt={`Business image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Hours Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(businessForm.business_hours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <input
                          type="checkbox"
                          id={`${day}-open`}
                          checked={hours.is_open}
                          onChange={(e) => setBusinessForm({
                            ...businessForm,
                            business_hours: {
                              ...businessForm.business_hours,
                              [day]: { ...hours, is_open: e.target.checked }
                            }
                          })}
                          className="rounded"
                        />
                        <Label htmlFor={`${day}-open`} className="capitalize min-w-[80px]">{day}</Label>
                        {hours.is_open && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={hours.open_time || ''}
                              onChange={(e) => setBusinessForm({
                                ...businessForm,
                                business_hours: {
                                  ...businessForm.business_hours,
                                  [day]: { ...hours, open_time: e.target.value }
                                }
                              })}
                              className="w-24"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close_time || ''}
                              onChange={(e) => setBusinessForm({
                                ...businessForm,
                                business_hours: {
                                  ...businessForm.business_hours,
                                  [day]: { ...hours, close_time: e.target.value }
                                }
                              })}
                              className="w-24"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowAddBusiness(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Create Business
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* Business Details Dialog */}
        <Dialog open={showBusinessDetails} onOpenChange={setShowBusinessDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Business Details</DialogTitle>
              <DialogDescription>
                Complete information about {selectedBusiness?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedBusiness && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <div><strong>Name:</strong> {selectedBusiness.name}</div>
                      <div><strong>Category:</strong> {selectedBusiness.category}</div>
                      <div><strong>Status:</strong> {getStatusBadge(selectedBusiness.status)}</div>
                      <div><strong>Rating:</strong> ⭐ {selectedBusiness.rating.toFixed(1)} ({selectedBusiness.total_reviews} reviews)</div>
                      <div><strong>Created:</strong> {new Date(selectedBusiness.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedBusiness.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedBusiness.phone}
                      </div>
                      {selectedBusiness.website && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedBusiness.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      {selectedBusiness.address}<br />
                      {selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.pincode}
                    </div>
                  </div>
                </div>

                {selectedBusiness.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedBusiness.description}</p>
                  </div>
                )}

                {(selectedBusiness.services?.length > 0 || selectedBusiness.tags?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedBusiness.services?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBusiness.services.map((service, index) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedBusiness.tags?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBusiness.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowBusinessDetails(false)}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      handleBusinessAction(selectedBusiness.id, selectedBusiness.status === 'active' ? 'suspend' : 'verify');
                      setShowBusinessDetails(false);
                    }}
                    variant={selectedBusiness.status === 'active' ? 'destructive' : 'default'}
                  >
                    {selectedBusiness.status === 'active' ? 'Suspend' : 'Activate'} Business
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
