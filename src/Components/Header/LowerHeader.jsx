import React, { useState } from 'react';
import classes from './LowerHeader.module.css';

function LowerHeader() {
  const [showSidebar, setShowSidebar] = useState(false);

  const navigationItems = [
    {
      title: 'Digital Content & Devices',
      items: [
        'Amazon Music', 'Kindle E-readers & Books', 'Appstore for Android',
        'Amazon Photos', 'Amazon Drive', 'Fire TV', 'Echo & Alexa', 'Fire Tablets'
      ]
    },
    {
      title: 'Shop by Department',
      items: [
        'Electronics', 'Computers', 'Smart Home', 'Arts & Crafts', 'Automotive',
        'Baby', 'Beauty & Personal Care', 'Books', 'Boys\' Fashion', 'Girls\' Fashion',
        'Health & Household', 'Home & Kitchen', 'Industrial & Scientific', 'Luggage',
        'Men\'s Fashion', 'Movies & TV', 'Music', 'Pet Supplies', 'Sports & Outdoors',
        'Tools & Home Improvement', 'Toys & Games', 'Video Games', 'Women\'s Fashion'
      ]
    },
    {
      title: 'Programs & Features',
      items: [
        'Gift Cards', 'Amazon Live', 'International Shopping', 'Amazon Business',
        'Amazon Prime', 'Amazon Fresh', 'Amazon Warehouse', 'Amazon Subscribe & Save'
      ]
    },
    {
      title: 'Help & Settings',
      items: [
        'Your Account', 'Customer Service', 'Sign In', 'Language Settings',
        'Country/Region', 'Privacy Notice', 'Conditions of Use'
      ]
    }
  ];

  return (
    <>
      {/* Amazon Navigation Sidebar */}
      {showSidebar && (
        <div className={classes.sidebar_overlay} onClick={() => setShowSidebar(false)}>
          <div className={classes.sidebar} onClick={(e) => e.stopPropagation()}>
            <div className={classes.sidebar_header}>
              <div className={classes.sidebar_user}>
                <div className={classes.user_avatar}>👤</div>
                <div className={classes.user_info}>
                  <div className={classes.user_greeting}>Hello, sign in</div>
                  <div className={classes.user_account}>Account & Lists</div>
                </div>
              </div>
              <button
                className={classes.close_sidebar}
                onClick={() => setShowSidebar(false)}
              >
                ✕
              </button>
            </div>

            <div className={classes.sidebar_content}>
              {navigationItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className={classes.sidebar_section}>
                  <h3 className={classes.section_title}>{section.title}</h3>
                  <div className={classes.section_items}>
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className={classes.sidebar_link}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`${classes.lowerHeader} border-bottom`}>
        <div className="container-fluid">
          <div className="d-flex align-items-start py-1">
            {/* All Menu Button */}
            <button
              className={classes.all_menu_btn}
              onClick={() => setShowSidebar(!showSidebar)}
              aria-expanded={showSidebar}
            >
              <span className={classes.hamburger_icon}>☰</span>
              <span className={classes.all_text}>All</span>
            </button>

            {/* Navigation Links */}
            <nav className={classes.nav_links}>
             
              <a href="/todays-deals" className={classes.nav_link}>
                Today's Deals
              </a>
              <a href="/prime-video" className={classes.nav_link}>
                Prime Video
              </a>
              <a href="/registry" className={classes.nav_link}>
                Registry
              </a>
              <a href="/customer-service" className={classes.nav_link}>
                Customer Service
              </a>
              <a href="/gift-cards" className={classes.nav_link}>
                Gift Cards
              </a>
            </nav>

            {/* Prime Section */}
            <div className={classes.prime_section + ' ms-auto'}>
              <span className={classes.prime_badge}>Prime</span>
              <span className={classes.delivery_info}>Free delivery</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LowerHeader;