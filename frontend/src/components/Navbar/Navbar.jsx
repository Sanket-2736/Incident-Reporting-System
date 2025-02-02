import React, { useState } from "react";
import { Menu, Search, Bell, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import AvatarImg from './avatar.jpeg'

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {authUser, logout} = useAuthStore();

  const handleLogout = async() => {
    await logout();
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-4">
      {/* Logo Section */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-semibold flex items-center space-x-2">
          <Menu className="w-6 h-6" />
          <span>Incident Reporter</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-1 justify-center space-x-8">
        <Link to="/" className="text-base font-medium text-gray-700 hover:text-primary">
          Home
        </Link>
        <Link to="/report" className="text-base font-medium text-gray-700 hover:text-primary">
          Report
        </Link>
      </div>

      {/* User Section */}
      <div className="flex-none space-x-4">
        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="w-6 h-6" />
              <span className="badge badge-sm indicator-item">3</span>
            </div>
          </button>
          <div className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow">
            <div className="card-body">
              <h2 className="font-bold text-lg">Notifications</h2>
              <Link to="/announcements" className="btn btn-primary btn-block mt-2">
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end hidden lg:block">
          <button className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={AvatarImg} alt="User avatar" />
            </div>
          </button>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile" className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Auth Buttons */}
        {
          !authUser ? (
            <>
              <div className="hidden lg:flex space-x-4">
                <Link to="/signup" className="btn btn-outline">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Log In
                </Link>
              </div>
            </>
          ) : (
            <div className="hidden lg:flex space-x-4">
              <Link onClick={handleLogout} to="/signup" className="btn btn-warning">
                Logout
              </Link>
            </div>
          )
        }
      </div>

      {/* Mobile Menu Button */}
      <button className="btn btn-ghost lg:hidden" onClick={toggleMobileMenu}>
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 shadow-md lg:hidden z-10">
          <div className="p-4">
            <ul className="menu menu-compact space-y-2">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/report">Report</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Log In</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
