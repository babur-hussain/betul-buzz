import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  Star, 
  MessageSquare, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  AlertTriangle,
  Shield,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  created_at: string;
  updated_at: string;
  user: {
    full_name: string;
    email: string;
  };
  business: {
    name: string;
    category: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  flaggedReviews: number;
  pendingVerification: number;
  ratingDistribution: { [key: number]: number };
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    flaggedReviews: 0,
    pendingVerification: 0,
    ratingDistribution: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagReviewId, setFlagReviewId] = useState<string>('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);

      // Fetch reviews with user and business details
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users!reviews_user_id_fkey(full_name, email),
          business:businesses!reviews_business_id_fkey(name, category)
        `)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        throw reviewsError;
      }

      console.log('Fetched reviews:', reviewsData);
      setReviews(reviewsData || []);

      // Calculate stats
      const totalReviews = reviewsData?.length || 0;
      const totalRating = reviewsData?.reduce((sum, review) => sum + review.rating, 0) || 0;
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      const flaggedReviews = reviewsData?.filter(r => r.is_flagged).length || 0;
      const pendingVerification = reviewsData?.filter(r => !r.is_verified).length || 0;

      // Calculate rating distribution
      const ratingDistribution: { [key: number]: number } = {};
      for (let i = 1; i <= 5; i++) {
        ratingDistribution[i] = reviewsData?.filter(r => r.rating === i).length || 0;
      }

      setStats({
        totalReviews,
        averageRating,
        flaggedReviews,
        pendingVerification,
        ratingDistribution
      });

    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAction = async (reviewId: string, action: 'verify' | 'unverify' | 'flag' | 'unflag' | 'delete') => {
    try {
      let updateData: Partial<Review> = {};

      switch (action) {
        case 'verify':
          updateData = { is_verified: true };
          break;
        case 'unverify':
          updateData = { is_verified: false };
          break;
        case 'flag':
          updateData = { is_flagged: true, flag_reason: flagReason };
          break;
        case 'unflag':
          updateData = { is_flagged: false, flag_reason: null };
          break;
        case 'delete':
          // Delete review
          const { error: deleteError } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

          if (deleteError) throw deleteError;
          break;
      }

      if (action !== 'delete') {
        const { error: updateError } = await supabase
          .from('reviews')
          .update(updateData)
          .eq('id', reviewId);

        if (updateError) throw updateError;
      }

      // Refresh data
      await fetchReviews();

      // Close dialogs
      if (action === 'flag') {
        setShowFlagDialog(false);
        setFlagReason('');
        setFlagReviewId('');
      }

    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.business?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'flagged' && review.is_flagged) ||
                         (statusFilter === 'unverified' && !review.is_verified) ||
                         (statusFilter === 'verified' && review.is_verified);

    return matchesSearch && matchesRating && matchesStatus;
  });

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingBadge = (rating: number) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-blue-500',
      5: 'bg-green-500'
    };
    return <Badge className={colors[rating as keyof typeof colors] || 'bg-gray-500'}>⭐ {rating}</Badge>;
  };

  const getStatusBadge = (review: Review) => {
    if (review.is_flagged) {
      return <Badge className="bg-red-500">🚩 Flagged</Badge>;
    }
    if (review.is_verified) {
      return <Badge className="bg-green-500">✅ Verified</Badge>;
    }
    return <Badge className="bg-yellow-500">⏳ Pending</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Across all businesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {getRatingStars(Math.round(stats.averageRating))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <Flag className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.flaggedReviews}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of reviews by rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium">{count}</span>
                    <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Management */}
      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>
            Moderate and manage all business reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {reviews.length === 0 ? 'No reviews found in the system' : 'No reviews match your criteria'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm line-clamp-2">{review.comment || 'No comment'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{review.business?.name || 'Unknown Business'}</div>
                          <div className="text-sm text-gray-500">{review.business?.category || 'No category'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{review.user?.full_name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">{review.user?.email || 'No email'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRatingBadge(review.rating)}
                          <div className="flex">
                            {getRatingStars(review.rating)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(review)}</TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReview(review);
                              setShowReviewDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {!review.is_verified ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewAction(review.id, 'verify')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewAction(review.id, 'unverify')}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}

                          {!review.is_flagged ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setFlagReviewId(review.id);
                                setShowFlagDialog(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Flag className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewAction(review.id, 'unflag')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReviewAction(review.id, 'delete')}
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

      {/* Review Details Dialog */}
      <Dialog open={showReviewDetails} onOpenChange={setShowReviewDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete information about this review
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Review Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Rating:</strong> {getRatingStars(selectedReview.rating)}</div>
                    <div><strong>Status:</strong> {getStatusBadge(selectedReview)}</div>
                    <div><strong>Created:</strong> {new Date(selectedReview.created_at).toLocaleDateString()}</div>
                    {selectedReview.updated_at !== selectedReview.created_at && (
                      <div><strong>Updated:</strong> {new Date(selectedReview.updated_at).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business & User</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Business:</strong> {selectedReview.business?.name || 'Unknown'}</div>
                    <div><strong>Category:</strong> {selectedReview.business?.category || 'No category'}</div>
                    <div><strong>User:</strong> {selectedReview.user?.full_name || 'Unknown'}</div>
                    <div><strong>Email:</strong> {selectedReview.user?.email || 'No email'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Review Comment</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedReview.comment || 'No comment provided'}</p>
                </div>
              </div>

              {selectedReview.is_flagged && selectedReview.flag_reason && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600">Flag Reason</h3>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-700">{selectedReview.flag_reason}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowReviewDetails(false)}>
                  Close
                </Button>
                {selectedReview.is_flagged ? (
                  <Button 
                    onClick={() => handleReviewAction(selectedReview.id, 'unflag')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Unflag Review
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      setFlagReviewId(selectedReview.id);
                      setShowFlagDialog(true);
                      setShowReviewDetails(false);
                    }}
                    variant="destructive"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Flag Review
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Flag Review Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Review</DialogTitle>
            <DialogDescription>
              Provide a reason for flagging this review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="flag-reason">Reason for Flagging</Label>
              <Textarea
                id="flag-reason"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Explain why this review should be flagged..."
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleReviewAction(flagReviewId, 'flag')}
                disabled={!flagReason.trim()}
                variant="destructive"
              >
                <Flag className="w-4 h-4 mr-2" />
                Flag Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagement;
