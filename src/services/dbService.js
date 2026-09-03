import { supabase, isSupabaseConfigured } from './supabase';
import { initialTuitionData } from '../data/tuitionData';

/**
 * Database Service Abstraction
 * Manages queries for classes, subjects, courses, students, teachers, study materials, notices, and gallery.
 */
export const dbService = {
  // Public Data Fetchers
  async getPublicClasses() {
    if (!isSupabaseConfigured()) return initialTuitionData.standards || [];
    const { data, error } = await supabase.from('classes').select('*').eq('is_active', true).order('sort_order');
    if (error) throw error;
    return data;
  },

  async getPublicTeachers() {
    if (!isSupabaseConfigured()) return initialTuitionData.teachers || [];
    const { data, error } = await supabase.from('teachers').select('*, profiles(*)').eq('is_public_featured', true);
    if (error) throw error;
    return data;
  },

  async getPublicNotices() {
    if (!isSupabaseConfigured()) return initialTuitionData.notices || [];
    const { data, error } = await supabase.from('notices').select('*').eq('is_published', true).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getGalleryImages() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
