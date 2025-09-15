// Amazon Clone API Service
// Handles product data fetching from multiple sources

const API_BASE_URL = 'https://fakestoreapi.com';
const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com';

// API Endpoints
const ENDPOINTS = {
  FAKESTORE_PRODUCTS: `${API_BASE_URL}/products`,
  FAKESTORE_CATEGORIES: `${API_BASE_URL}/products/categories`,
  JSON_PLACEHOLDER_POSTS: `${JSON_PLACEHOLDER_URL}/posts`,
  JSON_PLACEHOLDER_USERS: `${JSON_PLACEHOLDER_URL}/users`,
};

// API Service Class
class ApiService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic fetch with caching
  async fetchWithCache(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }

  // Get all products from FakeStore API
  async getProducts(limit = 400, sort = 'desc') {
    try {
      const url = `${ENDPOINTS.FAKESTORE_PRODUCTS}?limit=${limit}&sort=${sort}`;
      const products = await this.fetchWithCache(url);

      // Enhance products with additional data
      return products.map(product => this.enhanceProduct(product));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Return mock data as fallback
      return this.getMockProducts(limit);
    }
  }

  // Get products by category
  async getProductsByCategory(category, limit = 50) {
    try {
      const url = `${ENDPOINTS.FAKESTORE_PRODUCTS}/category/${category}?limit=${limit}`;
      const products = await this.fetchWithCache(url);
      return products.map(product => this.enhanceProduct(product));
    } catch (error) {
      console.error(`Failed to fetch products for category ${category}:`, error);
      return [];
    }
  }

  // Get product categories
  async getCategories() {
    try {
      const categories = await this.fetchWithCache(ENDPOINTS.FAKESTORE_CATEGORIES);
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return ['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing'];
    }
  }

  // Get single product by ID
  async getProductById(id) {
    try {
      const url = `${ENDPOINTS.FAKESTORE_PRODUCTS}/${id}`;
      const product = await this.fetchWithCache(url);
      return this.enhanceProduct(product);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return null;
    }
  }

  // Search products
  async searchProducts(query, limit = 20) {
    try {
      const allProducts = await this.getProducts(100);
      const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  // Get featured/recommended products
  async getFeaturedProducts(limit = 10) {
    try {
      const products = await this.getProducts(100);
      // Return products with highest ratings as "featured"
      return products
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, limit);
    } catch {
      return this.getMockProducts(limit);
    }
  }

  // Get products with pagination
  async getProductsPaginated(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const url = `${ENDPOINTS.FAKESTORE_PRODUCTS}?limit=${limit}&offset=${offset}`;
      const products = await this.fetchWithCache(url);
      return {
        products: products.map(product => this.enhanceProduct(product)),
        page,
        limit,
        total: 400, // FakeStore API doesn't provide total count
      };
    } catch (error) {
      console.error('Pagination failed:', error);
      return {
        products: [],
        page,
        limit,
        total: 0,
      };
    }
  }

  // Enhance product with additional Amazon-style data
  enhanceProduct(product) {
    return {
      ...product,
      // Add Amazon-style fields
      originalPrice: product.price > 50 ? Math.round(product.price * 1.2 * 100) / 100 : null,
      discount: product.price > 50 ? Math.floor(Math.random() * 30) + 10 : null,
      prime: Math.random() > 0.3,
      bestseller: Math.random() > 0.8,
      newArrival: Math.random() > 0.9,
      availability: Math.random() > 0.1 ? 'In Stock' : 'Out of Stock',
      shipping: product.price > 25 ? 'FREE Shipping' : `$${(product.price * 0.1).toFixed(2)} Shipping`,
      delivery: this.generateDeliveryDate(),
      reviews: this.generateMockReviews(product.id),
      specifications: this.generateSpecifications(product.category),
      images: [
        product.image,
        `/1000${(product.id % 5) + 1}.jpg`,
        `/1000${((product.id + 1) % 5) + 1}.jpg`,
        `/1000${((product.id + 2) % 5) + 1}.jpg`,
      ],
      tags: [product.category, ...product.title.toLowerCase().split(' ').slice(0, 3)],
      weight: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
      dimensions: {
        length: Math.round((Math.random() * 20 + 5) * 100) / 100,
        width: Math.round((Math.random() * 15 + 3) * 100) / 100,
        height: Math.round((Math.random() * 10 + 2) * 100) / 100,
      },
    };
  }

  // Generate mock reviews
  generateMockReviews(productId) {
    const reviewCount = Math.floor(Math.random() * 8) + 3;
    const reviews = [];

    const reviewTemplates = [
      { title: 'Great product!', comment: 'Exactly as described. Very satisfied with the purchase.' },
      { title: 'Excellent quality', comment: 'High quality product. Would definitely recommend.' },
      { title: 'Good value', comment: 'Great price for the quality. Happy with my purchase.' },
      { title: 'Fast shipping', comment: 'Arrived quickly and well packaged.' },
      { title: 'Perfect fit', comment: 'Fits perfectly and looks great.' },
    ];

    for (let i = 0; i < reviewCount; i++) {
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      reviews.push({
        id: `review_${productId}_${i}`,
        user: ['John D.', 'Sarah M.', 'Mike R.', 'Emma L.', 'David K.'][Math.floor(Math.random() * 5)],
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: template.title,
        comment: template.comment,
        helpful: Math.floor(Math.random() * 20),
      });
    }

    return reviews;
  }

  // Generate delivery date
  generateDeliveryDate() {
    const days = Math.floor(Math.random() * 7) + 1;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  // Generate product specifications
  generateSpecifications(category) {
    const specs = {};

    switch (category) {
      case 'electronics':
        specs.color = ['Black', 'White', 'Silver', 'Blue'][Math.floor(Math.random() * 4)];
        specs.connectivity = ['Wi-Fi', 'Bluetooth', 'USB-C'][Math.floor(Math.random() * 3)];
        specs.warranty = '1 Year';
        break;
      case 'jewelery':
        specs.material = ['Gold', 'Silver', 'Platinum'][Math.floor(Math.random() * 3)];
        specs.gemstone = ['Diamond', 'Ruby', 'Sapphire'][Math.floor(Math.random() * 3)];
        break;
      case 'men\'s clothing':
      case 'women\'s clothing':
        specs.size = ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)];
        specs.material = ['Cotton', 'Polyester', 'Wool'][Math.floor(Math.random() * 3)];
        specs.care = 'Machine Washable';
        break;
      default:
        specs.material = 'Various';
        specs.origin = 'Imported';
    }

    return specs;
  }

  // Fallback mock products
  getMockProducts(count = 20) {
    const mockProducts = [];
    const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      mockProducts.push({
        id: `mock_${i}`,
        title: `Sample ${category} Product ${i + 1}`,
        price: Math.round((Math.random() * 100 + 10) * 100) / 100,
        description: `This is a sample ${category} product with high quality and great features.`,
        category,
        image: `/1000${(i % 5) + 1}.jpg`,
        rating: {
          rate: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
          count: Math.floor(Math.random() * 100) + 10
        },
        prime: Math.random() > 0.3,
        availability: 'In Stock',
        shipping: 'FREE Shipping',
      });
    }

    return mockProducts;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual functions for convenience
export const {
  getProducts,
  getProductsByCategory,
  getCategories,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getProductsPaginated,
} = apiService;