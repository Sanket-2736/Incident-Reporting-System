import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        {/* Logo */}
        <div className="flex items-center">
          <i className="fa-solid fa-bolt text-blue-500 text-2xl"></i>
          <span className="text-xl font-semibold ml-2">QuickResolve</span>
        </div>

        {/* Navigation Links (Desktop) */}
        <ul className="hidden md:flex space-x-6">
          <li className="text-gray-600 hover:text-blue-500 cursor-pointer">List</li>
          <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Details</li>
          <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Overview</li>
          <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Recommended</li>
          <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Status</li>
        </ul>

        {/* Action Buttons with Tooltips */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {/* Clock Button */}
          <div className="group relative">
            <Link to='/analytics' className="flex items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-600">
              <i className="fa-solid fa-chart-pie"></i>
            </Link>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-12 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md px-2 py-1 transition-opacity">
              Recent Activity
            </span>
          </div>

          {/* Notification Button */}
          <div className="group relative">
            <button className="flex items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-600">
              <i className="fa-solid fa-bell"></i>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-12 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md px-2 py-1 transition-opacity">
              Notifications
            </span>
          </div>

          {/* Profile Button */}
          <div className="group relative">
            <Link to='/profile' className="flex items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm text-gray-600">
              <i className="fa-solid fa-user"></i>
            </Link>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-12 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md px-2 py-1 transition-opacity">
              Profile
            </span>
          </div>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            className="text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Dropdown Menu (Mobile) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-4 px-4 py-3">
            <li className="text-gray-600 hover:text-blue-500 cursor-pointer">List</li>
            <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Details</li>
            <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Overview</li>
            <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Recommended</li>
            <li className="text-gray-600 hover:text-blue-500 cursor-pointer">Status</li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
