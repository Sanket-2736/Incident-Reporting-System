import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r mt-7 from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">QuickResolve</h4>
            <p className="text-sm">
              QuickResolve helps streamline incident reporting and resolution, empowering individuals to resolve issues effectively.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-blue-300 transition duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-300 transition duration-200">
                  Overview
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-300 transition duration-200">
                  Details
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-300 transition duration-200">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <p className="text-sm">Need help? Reach us at:</p>
            <ul className="space-y-3 mt-3">
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3"></i> +1-800-123-456
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i> support@quickresolve.com
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-3"></i> 123 Main Street, City, Country
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} QuickResolve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
