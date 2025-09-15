# Amazon Clone - Full E-Commerce Application

A comprehensive Amazon clone built with React, featuring Firebase authentication, real-time cart management, product filtering, and a complete e-commerce experience.

## 🚀 Features

### ✅ Completed Features
- **🔐 Firebase Authentication** - Complete user authentication system
- **🛒 Advanced Cart Management** - Add, remove, update quantities with persistence
- **📱 Responsive Design** - Mobile-first approach with Amazon-style UI
- **🔍 Product Search & Filtering** - Real-time search with category filters
- **⭐ Product Reviews & Ratings** - User reviews and star ratings
- **📦 Product Details** - Detailed product pages with image galleries
- **🎨 Amazon-Style UI** - Authentic Amazon design and interactions
- **📊 State Management** - Redux-style state with useReducer
- **💾 Data Persistence** - localStorage for cart and user data
- **🔄 Real-time Updates** - Live cart updates and product filtering

### 🔄 In Progress / Planned Features
- **👤 User Profile Pages** - Account management and settings
- **📋 Order History** - Purchase history and order tracking
- **❤️ Wishlist Functionality** - Save favorite products
- **💳 Payment Processing** - Stripe/PayPal integration
- **📧 Email Notifications** - Order confirmations and updates
- **🎯 Product Recommendations** - AI-powered suggestions
- **🔊 Voice Search** - Voice-activated product search

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router
- **Styling**: CSS Modules, Bootstrap
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **State Management**: React useReducer + Context API
- **Icons**: React Icons, Material-UI
- **API**: FakeStore API (for demo products)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amazon-clone-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   ```bash
   # Copy the environment template
   cp .env.example .env
   ```

4. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password and Google/Facebook providers
   - Enable Firestore Database
   - Copy your Firebase config to `.env`

   Your `.env` file should look like:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔧 Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name
4. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Enable "Google" and configure OAuth
4. Enable "Facebook" and configure OAuth

### 3. Set up Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Set up security rules (optional for development)

### 4. Get Firebase Config
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Add app" > Web app
4. Copy the config object to your `.env` file

## 📁 Project Structure

```
amazon-clone-frontend/
├── src/
│   ├── Components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.module.css
│   │   │   ├── LowerHeader.jsx
│   │   │   └── LowerHeader.module.css
│   │   ├── Product/
│   │   │   ├── Product.jsx
│   │   │   ├── Product.module.css
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── Filters.module.css
│   │   ├── Cart/
│   │   │   ├── CartSidebar.jsx
│   │   │   └── CartSidebar.module.css
│   │   └── Pages/
│   │       ├── Auth/
│   │       │   ├── Signup.jsx
│   │       │   ├── Signin.jsx
│   │       │   └── Auth.module.css
│   │       └── ...
│   ├── Context/
│   │   └── StateProvider.jsx
│   ├── Hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useProducts.js
│   ├── services/
│   │   └── authService.js
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── README.md
```

## 🔑 Authentication Features

### ✅ Implemented
- **Email/Password Registration** - Complete signup flow
- **Email/Password Login** - Secure sign-in system
- **Google OAuth** - One-click Google authentication
- **Facebook OAuth** - Social login with Facebook
- **Password Reset** - Forgot password functionality
- **Email Verification** - Account verification system
- **Auto Sign-out** - Secure session management
- **User Profile Storage** - Firestore integration

### 🔄 User Flow
1. **Sign Up** → Email verification → Auto login
2. **Sign In** → Dashboard access
3. **Social Login** → Instant access
4. **Password Reset** → Email with reset link
5. **Profile Management** → Update user information

## 🛒 Cart & Product Features

### ✅ Shopping Cart
- **Add to Cart** - One-click addition
- **Quantity Management** - Increase/decrease items
- **Remove Items** - Delete from cart
- **Persistent Storage** - Cart survives browser refresh
- **Real-time Updates** - Live cart total calculation
- **Empty Cart Handling** - Graceful empty state

### ✅ Product Features
- **Product Grid** - Responsive card layout
- **Image Galleries** - Multiple product images
- **Star Ratings** - User review system
- **Price Display** - Formatted pricing
- **Category Filtering** - Browse by category
- **Search Functionality** - Real-time product search
- **Hover Effects** - Interactive product cards

## 🎨 UI/UX Features

### ✅ Amazon-Style Design
- **Navigation Bar** - Complete Amazon header
- **Product Cards** - Authentic Amazon styling
- **Hover Effects** - Interactive elements
- **Responsive Layout** - Mobile-first design
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages

### ✅ User Experience
- **Smooth Animations** - CSS transitions
- **Visual Feedback** - Button states and loading
- **Accessibility** - Keyboard navigation support
- **Performance** - Optimized rendering
- **Offline Support** - Service worker ready

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Add Firebase config to Vercel dashboard
   - Configure build settings

### Netlify
1. **Connect Repository**
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add Firebase config

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📝 API Endpoints

### Products API (FakeStore API)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get product categories

### Firebase Services
- **Authentication** - User management
- **Firestore** - User profiles and orders
- **Storage** - File uploads (future feature)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FakeStore API** - Product data
- **Firebase** - Authentication and database
- **React Community** - Amazing framework and ecosystem
- **Bootstrap** - UI framework
- **Material-UI** - Icon components

## 📞 Support

For support, email support@amazon-clone.com or join our Discord community.

---

**🎉 Happy Shopping! Your Amazon Clone is ready to use!**
