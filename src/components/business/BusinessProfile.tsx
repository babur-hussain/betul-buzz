import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Edit, 
  Save, 
  X, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock,
  Star,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Business, BusinessFormData } from '@/types/auth';

const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
});

type BusinessFormDataForm = z.infer<typeof businessSchema>;

const BusinessProfile: React.FC = () => {
  const { business, updateBusiness } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusinessFormDataForm>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name || '',
      description: business?.description || '',
      category: business?.category || '',
      address: business?.address || '',
      city: business?.city || '',
      state: business?.state || '',
      pincode: business?.pincode || '',
      phone: business?.phone || '',
      email: business?.email || '',
      website: business?.website || '',
    },
  });

  const onSubmit = async (data: BusinessFormDataForm) => {
    try {
      setIsLoading(true);
      setMessage(null);

      const result = await updateBusiness(data);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Business profile updated successfully!' });
        setIsEditing(false);
        reset(data);
      } else {
        setMessage({ type: 'error', text: result.error || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: business?.name || '',
      description: business?.description || '',
      category: business?.category || '',
      address: business?.address || '',
      city: business?.city || '',
      state: business?.state || '',
      pincode: business?.pincode || '',
      phone: business?.phone || '',
      email: business?.email || '',
      website: business?.website || '',
    });
    setMessage(null);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-500', icon: CheckCircle };
      case 'pending':
        return { label: 'Pending Review', color: 'bg-yellow-500', icon: AlertCircle };
      case 'suspended':
        return { label: 'Suspended', color: 'bg-red-500', icon: AlertCircle };
      case 'inactive':
        return { label: 'Inactive', color: 'bg-gray-500', icon: AlertCircle };
      default:
        return { label: 'Unknown', color: 'bg-gray-500', icon: AlertCircle };
    }
  };

  const businessCategories = [
    'Shopping & Retail',
    'Food & Restaurants',
    'Automotive',
    'Home & Garden',
    'Health & Medical',
    'Education',
    'Beauty & Wellness',
    'Professional Services',
    'Entertainment',
    'Technology',
    'Fitness & Sports',
    'Travel & Tourism',
  ];

  if (!business) return null;

  const statusInfo = getStatusDisplay(business.status);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Building className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{business.name}</CardTitle>
          <CardDescription className="flex items-center justify-center space-x-2">
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
            {business.is_verified && (
              <Badge className="bg-blue-500">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {business.is_featured && (
              <Badge className="bg-purple-500">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{business.category || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Star className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-medium">
                  {business.rating > 0 ? `${business.rating}/5` : 'No ratings yet'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{business.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{business.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {business.city}, {business.state}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {new Date(business.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={business.category}
                    onValueChange={(value) => {
                      // Handle category change
                    }}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
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
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...register('address')}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...register('state')}
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    {...register('pincode')}
                    className={errors.pincode ? 'border-red-500' : ''}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-500">{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  {...register('website')}
                  className={errors.website ? 'border-red-500' : ''}
                />
                {errors.website && (
                  <p className="text-sm text-red-500">{errors.website.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Description</Label>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {business.description || 'No description provided'}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold">Address</Label>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {business.address}, {business.city}, {business.state} - {business.pincode}
                </p>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="btn-hero"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Business Profile
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfile;
