import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Bell, 
  Image, 
  Info, 
  LogIn, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, isAuthenticated, currentRole, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'about', label: 'About', icon: Info },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'notices', label: 'Notices', icon: Bell }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-800 bg-clip-text text-transparent">
                  கற்றல் மையம் <span className="text-sm font-bold text-indigo-600 block sm:inline">(Learning Hub)</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-100 hidden sm:inline-block">
                  State Board
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Class 6 - 12 Excellence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="capitalize">{currentRole} Dashboard</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-gray-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-300 transition-all transform active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {!isAuthenticated && (
              <button
                onClick={onOpenAuth}
                className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-sm"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="capitalize">Go to {currentRole} Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-gray-600 font-semibold py-2.5 rounded-xl border border-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-sm"
              >
                <LogIn className="w-5 h-5" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
