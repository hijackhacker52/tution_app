import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Filter } from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function GalleryPage() {
  const { gallery } = initialTuitionData;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Events', 'Academics', 'Mentorship'];

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            Academy Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Life & Achievements at {centerInfo.name}</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Moments of academic celebration, practical lab work, and personalized learning.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-3">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                  {item.category}
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
