import { supabase, isSupabaseConfigured } from './supabase';

/**
 * AI Service Abstraction
 * Client-side interface to call Gemini AI serverless proxy.
 * Prevents Gemini API Key exposure in frontend code.
 */
export const aiService = {
  async generateResponse({ prompt, mode = 'study_assistant', context = {} }) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: { prompt, mode, context }
        });
        if (error) throw error;
        return data?.reply || 'No response generated.';
      } catch (err) {
        console.error('AI Service edge function call failed:', err);
      }
    }

    // Fallback AI simulation for offline/local dev
    return this._getFallbackAiResponse(prompt, mode);
  },

  _getFallbackAiResponse(prompt, mode) {
    const query = prompt.toLowerCase();

    if (mode === 'quiz_generator') {
      return `### Generated Practice Quiz
1. What is the fundamental unit of structure and function in living organisms?
   a) Tissue  b) Cell  c) Organ  d) Molecule
2. State Newton's Second Law of Motion ($F = ma$) and explain its real-world applications.`;
    }

    if (mode === 'notes_summarizer') {
      return `### Key Summary Points
- **Core Concept**: Overview of key topic points.
- **Formula**: $E = mc^2$ or fundamental identities.
- **Important Definition**: Step-by-step memory hooks for exam preparation.`;
    }

    if (query.includes('math') || query.includes('equation') || query.includes('solve')) {
      return `Great mathematical question! Let's solve it step-by-step:
1. Identify the given variables and formula.
2. Substitute the values carefully into the equation.
3. Verify your final answer by re-checking each operational step.`;
    }

    return `I am your AI Learning Assistant! Regarding "${prompt}":
Key takeaway: Always break complex concepts into core principles, practice step-by-step problem solving, and revise key definitions regularly. Let me know if you would like practice questions on this topic!`;
  }
};
