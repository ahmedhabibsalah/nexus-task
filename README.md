# 🎬 Movie Search App

A modern, responsive React application for searching and discovering movies using the OMDb API.

![Movie Search App](https://via.placeholder.com/800x400/667eea/ffffff?text=Movie+Search+App)

## ✨ Features

### 🔍 **Smart Search**

- **Debounced search** with 300ms delay for optimal performance
- **Real-time results** as you type
- **Intelligent caching** to avoid duplicate API calls
- **Search suggestions** with quick-start buttons

### 🎭 **Movie Details**

- **Comprehensive information** including plot, cast, ratings, and more
- **High-quality posters** with graceful fallbacks
- **IMDb integration** with direct links
- **Responsive layout** for all screen sizes

### 🚀 **Performance Optimized**

- **React optimizations** with memo, useCallback, and useMemo
- **Lazy loading** for images and components
- **LRU cache** for efficient memory management
- **Performance monitoring** and error tracking

### ♿ **Accessible & User-Friendly**

- **Full keyboard navigation** support
- **Screen reader compatibility** with proper ARIA labels
- **Error boundaries** for graceful error handling
- **Responsive design** for mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OMDb API key (get one free at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd movie-search-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API Key**
   Update `src/utils/constants.ts`:

   ```typescript
   export const API_CONFIG = {
     API_KEY: "your-api-key-here", // Replace with your OMDb API key
     // ... other config
   };
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast development server and building
- **TailwindCSS v4** - Utility-first CSS framework

### **Architecture**

- **Feature-based structure** - Organized by functionality
- **Custom hooks** - Reusable logic with useMovieSearch and useMovieDetails
- **Performance utilities** - LRU cache, debouncing, and monitoring
- **Error boundaries** - Graceful error handling

### **API Integration**

- **OMDb API** - Movie database with comprehensive information
- **Axios** - HTTP client with interceptors and error handling
- **Smart caching** - 5-minute cache with automatic cleanup

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic components (Button, Input, etc.)
│   └── layout/          # Layout components (Header, Container)
├── features/            # Feature-based modules
│   ├── search/          # Search functionality
│   │   ├── components/  # Search-specific components
│   │   ├── hooks/       # Search custom hooks
│   │   └── utils/       # Search utilities
│   └── movie-details/   # Movie details functionality
│       ├── components/  # Detail-specific components
│       ├── hooks/       # Detail custom hooks
│       └── utils/       # Detail utilities
├── services/            # API integration
├── hooks/               # Global custom hooks
├── utils/               # Global utilities and helpers
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🎯 Key Features Walkthrough

### **Search Experience**

1. **Type to search** - Results appear after 300ms delay
2. **Browse results** - Responsive grid with movie posters
3. **Load more** - Pagination with "Load More" button
4. **Click for details** - Navigate to full movie information

### **Movie Details**

1. **Comprehensive info** - Plot, cast, ratings, awards
2. **Visual layout** - Poster and information side-by-side
3. **External links** - Direct link to IMDb page
4. **Easy navigation** - Back button or Escape key

### **Performance Features**

- **Instant cache hits** - Previously searched terms load instantly
- **Optimized re-renders** - React.memo prevents unnecessary updates
- **Smart image loading** - Lazy loading with fallbacks
- **Error recovery** - Retry mechanisms for failed requests

## 🧪 Testing the App

### **Basic Functionality**

```bash
# Search for popular movies
batman, avengers, star wars, marvel

# Test edge cases
xyz123 (no results), a (too short), "" (empty)

# Test navigation
Click movie → View details → Back button → Search again
```

### **Performance Testing**

- Search same term twice (should be instant - cache hit)
- Rapid typing (should debounce properly)
- Load more results (should append without replacing)
- Browser back/forward buttons (should work correctly)

### **Responsive Testing**

- **Mobile** (< 640px): 1 column grid, mobile-friendly search
- **Tablet** (640-1024px): 2-3 column grid, efficient layout
- **Desktop** (> 1024px): 4-5 column grid, full details layout

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Deploy to Vercel** (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### **Deploy to Netlify**

```bash
npm run build
# Upload dist/ folder to Netlify
```

### **Environment Variables**

For production deployment, consider using environment variables:

```bash
VITE_OMDB_API_KEY=your_api_key_here
```

## 🔧 Customization

### **Styling**

- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for design tokens
- Customize components in their respective files

### **API Configuration**

- Update `src/utils/constants.ts` for API settings
- Modify `src/services/omdbApi.ts` for API behavior
- Adjust caching duration and other performance settings

### **Features**

- Add new search filters in `SearchBar.tsx`
- Extend movie details in `MovieDetails.tsx`
- Implement additional views following the feature-based structure

## 🐛 Troubleshooting

### **Common Issues**

**API Key Issues**

```
Error: Invalid API key
Solution: Verify your API key in constants.ts and ensure it's activated
```

**Images Not Loading**

```
Issue: Movie posters showing placeholder
Solution: Check network connectivity and OMDb API status
```

**Performance Issues**

```
Issue: Slow search results
Solution: Check console for network timing and cache hit rates
```

### **Development Tools**

- **React DevTools** - Component inspection and profiling
- **Performance logs** - Check console for timing information
- **Network tab** - Monitor API calls and caching behavior

## 📈 Performance Metrics

### **Target Performance**

- **First Load**: < 3 seconds
- **Search Results**: < 1 second
- **Cache Hits**: < 100ms
- **Image Loading**: Progressive with lazy loading

### **Bundle Size**

- **Optimized build** with tree shaking
- **Lazy loading** for non-critical components
- **Efficient dependencies** with minimal overhead
