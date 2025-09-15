
import React, { useEffect, useState } from 'react';
import { SlLocationPin } from 'react-icons/sl';
import { FaSearch } from 'react-icons/fa';
import { BiCart } from 'react-icons/bi';
import classes from './Header.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap import
import { Link, useNavigate } from 'react-router-dom';
import LowerHeader from './LowerHeader';
import { useCart } from '../../Hooks/useCart';
import { useAuth } from '../../Hooks/useAuth';
import amazonProducts from '../../assets/products.json';



function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    'wireless headphones',
    'smartphone cases',
    'kitchen appliances',
    'fitness trackers',
    'gaming accessories'
  ]);

  const handleSignOut = () => {
    logout();
  };

  // Generate dynamic suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filteredProducts = amazonProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);

      const productSuggestions = filteredProducts.map(product => product.title);
      const categorySuggestions = [...new Set(amazonProducts.map(p => p.category))]
        .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      setSuggestions([...productSuggestions, ...categorySuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('amazon-recent-searches', JSON.stringify(newRecent));

      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    // Add to recent searches
    const newRecent = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('amazon-recent-searches', JSON.stringify(newRecent));

    navigate(`/products?search=${encodeURIComponent(suggestion)}&category=${selectedCategory}`);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Voice search failed. Please try again or type your search.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('amazon-recent-searches');
  };

  // Load recent searches on component mount
  useEffect(() => {
    const saved = localStorage.getItem('amazon-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="sticky-top" style={{top: 0, zIndex: 100}}>
      <header className={classes.navbar}>
        {/* Prime Banner */}


        <div className="d-flex align-items-center py-1 py-md-2" style={{width: '100%', maxWidth: 'none', gap: '10px'}}>
          {/* Logo Section */}
          <div className={`${classes.nav_logo} ${classes.border}`}>
            <Link to="/">
              <img
                src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                alt="Amazon logo"
                className={classes.logo}
              />
            </Link>
          </div>
  
          {/* Delivery Section - Hidden on mobile */}
          <div className="d-flex align-items-center me-3 d-none d-md-flex">
            <SlLocationPin size={20} className="me-1" />
            <div className={classes.delivery}>
              <p className="mb-0 small">Deliver to</p>
              <span className="fw-bold">Israel</span>
            </div>
          </div>
  
          {/* Amazon-Style Search Section */}
          <form onSubmit={handleSearch} className={classes.nav_search} style={{flex: 1}}>
           <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={classes.search_select}
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="fashion">Fashion</option>
              <option value="sports">Sports</option>
              <option value="toys">Toys</option>
              <option value="automotive">Automotive</option>
            </select>
            <input
              type="text"
              placeholder="Search Amazon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
              autoComplete="off"
              className={classes.search_input}
            />
            <button
              type="submit"
              title="Go"
              disabled={!searchQuery.trim()}
              className={classes.search_icon}
            >
              <FaSearch size={14} />
            </button>

           {/* Enhanced Search Suggestions Dropdown */}
           <div className={classes.search_suggestions}>
               {/* Search Suggestions */}
               {suggestions.length > 0 && (
                 <div className={classes.suggestion_list}>
                   {suggestions.slice(0, 8).map((suggestion, index) => (
                     <button
                       key={`suggestion-${index}`}
                       type="button"
                       className={classes.suggestion_item}
                       onClick={() => handleSuggestionClick(suggestion)}
                     >
                       {suggestion}
                     </button>
                   ))}
                 </div>
               )}

               {/* Popular Searches when no input */}
               {true && (
                 <div>
                   <div className={classes.suggestion_header}>
                     <span>Your recent searches</span>
                   </div>
                   <div className={classes.suggestion_list}>
                     <button type="button" className={classes.suggestion_item} onClick={() => handleSuggestionClick('wireless headphones')}>
                       wireless headphones
                     </button>
                     <button type="button" className={classes.suggestion_item} onClick={() => handleSuggestionClick('smartphone cases')}>
                       smartphone cases
                     </button>
                     <button type="button" className={classes.suggestion_item} onClick={() => handleSuggestionClick('kitchen appliances')}>
                       kitchen appliances
                     </button>
                     <button type="button" className={classes.suggestion_item} onClick={() => handleSuggestionClick('fitness trackers')}>
                       fitness trackers
                     </button>
                     <button type="button" className={classes.suggestion_item} onClick={() => handleSuggestionClick('gaming accessories')}>
                       gaming accessories
                     </button>
                   </div>
                 </div>
               )}
             </div>
         </form>

        {/* Right Side Links */}
        <div className="d-flex align-items-center gap-1 gap-md-2 ms-auto">
          {/* Language Selector - Hidden on mobile */}
          <div className="dropdown d-none d-md-block">
            <button
              className={`${classes.language_selector} btn btn-link text-white text-decoration-none p-0 dropdown-toggle`}
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://www.in-formality.com/wiki/images/9/9f/USA_flag.png"
                alt="US Flag"
                style={{ width: '16px', height: '12px' }}
              />
              <span className={classes.language_text}>EN</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li><a className="dropdown-item" href="#" data-lang="en">
                <img src="https://www.in-formality.com/wiki/images/9/9f/USA_flag.png" alt="US" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                English - EN
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="es">
                <img src="https://flagcdn.com/16x12/es.png" alt="ES" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                Español - ES
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="fr">
                <img src="https://flagcdn.com/16x12/fr.png" alt="FR" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                Français - FR
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="de">
                <img src="https://flagcdn.com/16x12/de.png" alt="DE" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                Deutsch - DE
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="it">
                <img src="https://flagcdn.com/16x12/it.png" alt="IT" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                Italiano - IT
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="pt">
                <img src="https://flagcdn.com/16x12/pt.png" alt="PT" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                Português - PT
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="ja">
                <img src="https://flagcdn.com/16x12/jp.png" alt="JP" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                日本語 - JA
              </a></li>
              <li><a className="dropdown-item" href="#" data-lang="zh">
                <img src="https://flagcdn.com/16x12/cn.png" alt="CN" style={{ width: '16px', height: '12px', marginRight: '8px' }} />
                中文 - ZH
              </a></li>
            </ul>
          </div>

          {/* Account & Lists - Hidden on mobile */}
          <div className="dropdown d-none d-md-block">
            <button className="btn btn-link text-white text-decoration-none p-0 dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <div className={classes.account}>
                <span className={classes.nav_second}>
                  {user ? `Hello, ${user.name || user.email.split('@')[0]}` : 'Hello, sign in'}
                </span>
                <span className={classes.nav_second}>
                  {user ? 'Account & Lists' : 'Account & Lists'}
                </span>
              </div>
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountDropdown">
              {!user ? (
                <>
                  <li><Link className="dropdown-item" to="/signin">Sign In</Link></li>
                  <li><Link className="dropdown-item" to="/signup">New Customer? Start here.</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                </>
              ) : (
                <>
                  <li><Link className="dropdown-item" to="/account">Your Account</Link></li>
                  <li><Link className="dropdown-item" to="/orders">📦 Your Orders</Link></li>
                  <li><Link className="dropdown-item" to="/wishlist">❤️ Your Wishlist</Link></li>
                  <li><Link className="dropdown-item" to="/lists">📋 Your Lists</Link></li>
                  <li><Link className="dropdown-item" to="/recommendations">⭐ Your Recommendations</Link></li>
                  <li><Link className="dropdown-item" to="/browsing-history">🕒 Your Browsing History</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleSignOut}>🚪 Sign Out</button></li>
                  <li><hr className="dropdown-divider" /></li>
                </>
              )}
              <li><Link className="dropdown-item" to="/seller-guide">📸 Seller Guide</Link></li>
              <li><Link className="dropdown-item" to="/upload-images">📤 Upload Images</Link></li>
              <li><Link className="dropdown-item" to="/advertise">📢 Advertise Your Products</Link></li>
            </ul>
          </div>

          {/* Returns & Orders - Hidden on mobile */}
          <Link to="/orders" className="text-white text-decoration-none d-none d-md-block">
            <div className={classes.account}>
              <p className="mb-0 small">Returns</p>
              <span className="fw-bold">& Orders</span>
            </div>
          </Link>

          {/* Cart - Always visible */}
          <Link to="/cart" className="text-white text-decoration-none position-relative">
            <span className={classes.nav_cart}>
              <BiCart size={30} />
              <span className={classes.cart_count}></span>
              {totalItems > 0 && (
                <span className={classes.cart_badge}>
                  {totalItems}
                </span>
              )}
            </span>
          </Link>
        </div>
      </div>
    </header>
    <LowerHeader/>
    </div>
  );
}

export default Header;