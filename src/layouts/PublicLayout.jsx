import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PublicLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  isAuthenticated, 
  currentRole, 
  onLogout 
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={onOpenAuth}
        isAuthenticated={isAuthenticated}
        currentRole={currentRole}
        onLogout={onLogout}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer 
        setActiveTab={setActiveTab}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
}
