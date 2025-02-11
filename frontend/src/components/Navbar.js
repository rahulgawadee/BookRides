import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../context/SharedState';
import Getuser from '../user/Getuser';
import setAuthToken from './setAuthToken';
import { User, LogOut, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar({ showAlert }) {
  const states = useContext(Context);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    showAlert("Signing out...", "danger");
    localStorage.clear();
    sessionStorage.clear();
    setAuthToken(false);
    window.location.reload(false);
  };

  useEffect(() => {
    Getuser(states);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const userMenuItems = [
    { path: '/user', label: 'Profile Settings' },
    { path: '/mybooking', label: 'My Bookings' },
    { path: '/registration', label: 'Register Vehicle' }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              BookMyRide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                  location.pathname === link.path
                    ? 'text-white bg-gray-700 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {localStorage.getItem("jwtToken") ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {states.user.data?.username || 'User'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">
                          {states.user.data?.username}
                        </p>
                      </div>
                      {userMenuItems.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                            location.pathname === item.path
                              ? 'bg-gray-700/50 text-white'
                              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300 transition-colors duration-200"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:-translate-y-0.5"
              >
                Login / Signup
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-white bg-gray-700'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}