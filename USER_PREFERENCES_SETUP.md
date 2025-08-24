# User Preferences System Setup

This document explains how to set up the user preferences system for saving and favoriting businesses.

## 🗄️ Database Setup

### 1. Run the Migration

The system requires new database tables to store user preferences. Run the SQL migration file:

```sql
-- Run this in your Supabase SQL editor
-- File: supabase/migrations/001_create_user_preferences_tables.sql
```

### 2. Tables Created

- **`saved_businesses`** - Stores businesses saved by users
- **`favorite_businesses`** - Stores businesses favorited by users  
- **`user_preferences`** - General user preferences (for future use)

### 3. Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic cleanup when users are deleted

## 🔧 Features Implemented

### Save Business (🔖)
- Click the bookmark icon on any business card
- Business is saved to user's profile
- Visual feedback: icon fills with yellow color
- Stored in `saved_businesses` table

### Favorite Business (❤️)
- Click the heart icon on any business card
- Business is added to user's favorites
- Visual feedback: icon fills with red color
- Stored in `favorite_businesses` table

### User Profile Integration
- Preferences are tied to authenticated user accounts
- Data persists across sessions
- Users can view all their saved/favorite businesses
- Easy removal with "Remove" buttons

## 🚀 How to Use

### 1. Authentication Required
Users must be logged in to save or favorite businesses.

### 2. Save a Business
1. Find a business you want to save
2. Click the 🔖 bookmark icon
3. Business is saved to your profile
4. Icon turns yellow to indicate saved state

### 3. Favorite a Business
1. Find a business you want to favorite
2. Click the ❤️ heart icon
3. Business is added to your favorites
4. Icon turns red and fills to indicate favorited state

### 4. View Your Preferences
- Scroll down to see "Saved Businesses" and "Favorite Businesses" sections
- Each section shows cards with business details
- Use "Remove" buttons to delete items

## 🔍 Technical Details

### State Management
- Uses React hooks for local state
- Integrates with Supabase for persistence
- Real-time updates when preferences change

### Data Structure
```typescript
interface SavedBusiness {
  business_id: string;
  business_name: string;
  business_category: string;
  business_address: string;
  business_location: { lat: number; lng: number };
  saved_at: string;
  notes?: string;
}

interface FavoriteBusiness {
  business_id: string;
  business_name: string;
  business_category: string;
  business_address: string;
  business_location: { lat: number; lng: number };
  favorited_at: string;
  rating?: number;
}
```

### API Integration
- **`UserPreferencesService`** handles all database operations
- Automatic error handling and user feedback
- Optimistic updates for better UX

## 🐛 Troubleshooting

### Buttons Not Working
1. Ensure user is logged in
2. Check browser console for errors
3. Verify database tables exist
4. Check RLS policies are active

### Data Not Persisting
1. Check Supabase connection
2. Verify user authentication
3. Check database permissions
4. Review RLS policies

### Performance Issues
1. Database indexes are automatically created
2. Consider pagination for large lists
3. Implement caching if needed

## 🔮 Future Enhancements

- Business notes and personal ratings
- Sharing saved businesses with friends
- Export preferences to different formats
- Business recommendations based on preferences
- Integration with calendar for business hours
- Push notifications for favorite businesses

## 📝 Notes

- All data is user-specific and private
- Businesses can be both saved and favorited
- Toggle functionality: click again to remove
- Automatic cleanup prevents orphaned data
- Mobile-responsive design included
