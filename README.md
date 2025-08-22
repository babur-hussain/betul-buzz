# 🚀 BetulBuzz - Complete Business Directory Platform

A comprehensive local business directory platform built with React, TypeScript, and Supabase, featuring complete authentication, user management, and business administration systems.

## ✨ Features

### 🔐 **Authentication System**
- **User Registration & Login**: Secure authentication with email/password
- **Role-Based Access Control**: Three distinct user roles with different permissions
- **Session Management**: Persistent authentication with automatic token refresh
- **Password Security**: Secure password handling with validation

### 👥 **User Roles & Permissions**

#### **1. Super Admin** 🛡️
- **Complete System Control**: Manage all users, businesses, and system settings
- **Business Verification**: Approve, suspend, or delete business listings
- **User Management**: View and manage all user accounts
- **System Analytics**: Dashboard with comprehensive statistics
- **Content Moderation**: Moderate reviews, posts, and comments

#### **2. Business Owner** 🏢
- **Business Profile Management**: Create and edit business information
- **Service Management**: Add, edit, and manage business services
- **Review Management**: Respond to customer reviews
- **Business Analytics**: View business performance metrics
- **Post Management**: Create business announcements and offers

#### **3. Regular User** 👤
- **Business Discovery**: Browse and search local businesses
- **Review System**: Rate and review businesses
- **Post Creation**: Share requirements, offers, and announcements
- **Profile Management**: Edit personal information and preferences
- **Favorites**: Save favorite businesses and posts

### 🏪 **Business Management**
- **Comprehensive Profiles**: Detailed business information with categories
- **Business Hours**: Flexible scheduling system
- **Location Services**: GPS coordinates and address management
- **Media Support**: Logo, cover images, and service galleries
- **Verification System**: Admin-verified business listings

### 📱 **User Experience**
- **Responsive Design**: Mobile-first approach with modern UI
- **Smooth Scrolling**: Lenis-powered smooth scrolling experience
- **Search & Filters**: Advanced search with category and location filters
- **Real-time Updates**: Live data updates and notifications
- **Accessibility**: WCAG compliant design patterns

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with interfaces and types
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### **Backend & Database**
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Advanced security policies
- **Real-time Subscriptions** - Live data updates
- **Storage** - File upload and management

### **Authentication & Security**
- **Supabase Auth** - Secure authentication system
- **JWT Tokens** - Stateless authentication
- **Role-Based Access Control** - Granular permission system
- **Data Validation** - Input sanitization and validation

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Supabase account and project
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/babur-hussain/betul-buzz.git
   cd betul-buzz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Run the database schema: `supabase/schema.sql`

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### **Database Setup**

1. **Run the schema file** in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of supabase/schema.sql
   ```

2. **Verify tables created**:
   - `users` - User accounts and profiles
   - `businesses` - Business listings and information
   - `reviews` - Customer reviews and ratings
   - `posts` - User-generated content
   - `comments` - Post comments and discussions
   - `business_categories` - Business classification system

## 🏗️ **System Architecture**

### **Component Structure**
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── business/       # Business management
│   ├── profile/        # User profile management
│   ├── admin/          # Super admin dashboard
│   ├── dashboard/      # Main dashboard router
│   └── ui/            # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── lib/               # Utility functions and configurations
└── pages/             # Main page components
```

### **Data Flow**
1. **Authentication** → User login/registration
2. **Role Detection** → Route to appropriate dashboard
3. **Permission Check** → Verify user access rights
4. **Data Fetching** → Retrieve user-specific data
5. **UI Rendering** → Display role-appropriate interface

## 🔒 **Security Features**

### **Row Level Security (RLS)**
- **User Isolation**: Users can only access their own data
- **Business Protection**: Business owners manage only their listings
- **Admin Override**: Super admins have full system access
- **Data Validation**: Input sanitization and type checking

### **Authentication Security**
- **JWT Tokens**: Secure, stateless authentication
- **Session Management**: Automatic token refresh
- **Password Policies**: Strong password requirements
- **Rate Limiting**: Protection against brute force attacks

## 📊 **Admin Dashboard Features**

### **Super Admin Capabilities**
- **User Management**: View, edit, and manage all users
- **Business Oversight**: Approve, suspend, or delete businesses
- **System Analytics**: Comprehensive platform statistics
- **Content Moderation**: Moderate user-generated content
- **System Settings**: Platform configuration and management

### **Business Owner Dashboard**
- **Profile Management**: Edit business information and settings
- **Service Management**: Add and manage business services
- **Review Management**: Respond to customer feedback
- **Performance Metrics**: View business analytics and insights

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Electric Blue (#3B82F6)
- **Secondary**: Vibrant Purple (#8B5CF6)
- **Accent**: Electric Cyan (#06B6D4)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### **Typography**
- **Headings**: Inter font family with varying weights
- **Body Text**: Optimized for readability
- **Responsive**: Scales appropriately across devices

### **Components**
- **Glassmorphic Design**: Modern, translucent UI elements
- **Smooth Animations**: CSS transitions and micro-interactions
- **Responsive Grid**: Flexible layout system
- **Accessibility**: WCAG 2.1 AA compliance

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### **Code Quality**
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for code quality

## 📱 **Mobile Responsiveness**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile Features**
- **Touch-Optimized**: Optimized for touch interactions
- **Responsive Navigation**: Collapsible mobile menu
- **Mobile-First Design**: Designed for mobile devices first
- **Progressive Enhancement**: Enhanced features on larger screens

## 🚀 **Deployment**

### **Build Process**
1. **Production Build**: `npm run build`
2. **Static Files**: Generated in `dist/` directory
3. **Deploy**: Upload to your hosting provider

### **Environment Variables**
- **Development**: `.env.local`
- **Production**: Set in your hosting platform
- **Required**: Supabase URL and API keys

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real-time Chat**: Business-customer communication
- **Payment Integration**: Subscription plans and payments
- **Advanced Analytics**: Business performance insights
- **Mobile App**: React Native mobile application
- **API Integration**: Third-party service integrations
- **Multi-language**: Internationalization support

### **Performance Optimizations**
- **Image Optimization**: WebP format and lazy loading
- **Code Splitting**: Dynamic imports and route-based splitting
- **Caching Strategy**: Service worker and CDN optimization
- **Database Indexing**: Query performance improvements

---

**Built with ❤️ for the Betul business community**

*Empowering local businesses to connect with customers and grow their presence online.*
