import React, { useState } from 'react';
import classes from './Footer.module.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className={classes.footer}>
      {/* Back to Top */}
      <div className={classes.backToTop}>
        <a href="#" onClick={scrollToTop} className={classes.backToTopLink}>
          Back to top
        </a>
      </div>

      {/* Main Footer Links */}
      <div className={classes.mainFooter}>
        <div className="container-fluid">
          <div className="row" style={{ justifyContent: 'center' }}>
            <div className="col-6 col-md-4 col-lg-2">
              <h5>Get to Know Us</h5>
              <ul className="list-unstyled">
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">About Amazon</a></li>
                <li><a href="#">Investor Relations</a></li>
                <li><a href="#">Amazon Devices</a></li>
                <li><a href="#">Amazon Science</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <h5>Make Money with Us</h5>
              <ul className="list-unstyled">
                <li><a href="#">Sell products on Amazon</a></li>
                <li><a href="#">Sell on Amazon Business</a></li>
                <li><a href="#">Sell apps on Amazon</a></li>
                <li><a href="#">Become an Affiliate</a></li>
                <li><a href="#">Advertise Your Products</a></li>
                <li><a href="#">Self-Publish with Us</a></li>
                <li><a href="#">Host an Amazon Hub</a></li>
                <li><a href="#">› See More Make Money with Us</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <h5>Amazon Payment Products</h5>
              <ul className="list-unstyled">
                <li><a href="#">Amazon Business Card</a></li>
                <li><a href="#">Shop with Points</a></li>
                <li><a href="#">Reload Your Balance</a></li>
                <li><a href="#">Amazon Currency Converter</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <h5>Let Us Help You</h5>
              <ul className="list-unstyled">
                <li><a href="#">Amazon and COVID-19</a></li>
                <li><a href="#">Your Account</a></li>
                <li><a href="#">Your Orders</a></li>
                <li><a href="#">Shipping Rates & Policies</a></li>
                <li><a href="#">Returns & Replacements</a></li>
                <li><a href="#">Manage Your Content and Devices</a></li>
                <li><a href="#">Amazon Assistant</a></li>
                <li><a href="#">Help</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Amazon Branding Section */}
      <div className={classes.brandingSection}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className={classes.brandingContent}>
                <div className="d-flex flex-column align-items-center">
                  <img
                    src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                    alt="Amazon Logo"
                    className={classes.logo}
                  />
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <select className={classes.languageSelect}>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                    <select className={classes.currencySelect}>
                      <option value="usd">$ USD - U.S. Dollar</option>
                      <option value="eur">€ EUR - Euro</option>
                    </select>
                    <span className={classes.countryFlag}>🇺🇸</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Section */}
      <div className={classes.bottomSection}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className={classes.servicesGrid}>
                {[
                  'Amazon Music', 'Amazon Ads', '6pm', 'AbeBooks', 'ACX', 'Alexa',
                  'Amazon Business', 'Amazon Fresh', 'Amazon Global', 'Book Depository',
                  'Box Office Mojo', 'Comixology', 'DPReview', 'Fabric', 'Goodreads',
                  'IMDb', 'IMDbPro', 'Kindle Direct Publishing', 'Prime Video Direct',
                  'Shopbop', 'Twitch', 'Woot!', 'Zappos'
                ].map((service, index) => (
                  <a key={index} href="#" className={classes.serviceLink}>
                    {service}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.legalSection}>
            <div className="row">
              <div className="col-12">
                <div className={classes.legalLinks}>
                  <a href="#">Conditions of Use</a>
                  <span className={classes.separator}>|</span>
                  <a href="#">Privacy Notice</a>
                  <span className={classes.separator}>|</span>
                  <a href="#">Your Ads Privacy Choices</a>
                  <span className={classes.separator}>|</span>
                  <a href="#">Help</a>
                  <span className={classes.separator}>|</span>
                  <a href="#">Feedback</a>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.copyright}>
            <p>&copy; 1996-2025, Amazon.com, Inc. or its affiliates</p>
          </div>

          {/* Amazon-style disclosure */}
          <div className={classes.disclosure}>
            <p>Amazon, the Amazon logo, and the Bezos family seal are trademarks of Amazon.com, Inc. or its affiliates.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;