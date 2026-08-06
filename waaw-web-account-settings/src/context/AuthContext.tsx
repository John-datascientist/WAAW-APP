'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'investor' | 'founder';
  country: string | null;
  kyc_status: 'not_started' | 'pending' | 'verified' | 'rejected';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_committed: number;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, country: string, role: 'investor' | 'founder') => Promise<{ error: string | null; needsVerification: boolean }>;
  verifySignup: (email: string, token: string) => Promise<{ error: string | null }>;
  resendSignupCode: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Some Supabase Auth error responses (e.g. a 5xx from a paused/misconfigured
// project) carry no usable error/msg field, so supabase-js falls back to
// stringifying the raw body — which for an empty body is literally "{}".
// Showing that verbatim in a form is meaningless, so fall back to a message
// that at least points at where to look.
function readableAuthError(message: string | undefined): string {
  if (!message || message === '{}' || message === '[object Object]') {
    return 'Sign up failed — open the browser console (F12) for details, and check that your Supabase project is active (not paused).';
  }
  return message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('waaw_profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  }

  async function signUp(email: string, password: string, fullName: string, country: string, role: 'investor' | 'founder') {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        // Some Supabase error responses don't carry a useful .message (e.g.
        // an empty body on a 5xx/paused-project response stringifies to
        // "{}") — logging the raw error lets it be inspected in DevTools
        // even when there's nothing readable to show in the form itself.
        console.error('WAAW sign up error:', error);
        return { error: readableAuthError(error.message), needsVerification: false };
      }
      if (data.user) {
        const referralCode = 'WAAW-' + Math.random().toString(36).slice(2, 7).toUpperCase();
        const { error: profileError } = await supabase.from('waaw_profiles').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          country,
          kyc_status: 'not_started',
          tier: 'bronze',
          total_committed: 0,
          referral_code: referralCode,
        });
        // This used to be discarded entirely — a missing/broken waaw_profiles
        // table would fail silently here while sign-up still "succeeded".
        if (profileError) console.error('WAAW create profile error:', profileError);
      }
      // If "Confirm email" is off in Supabase, signUp returns a live session
      // immediately and no OTP is ever sent — routing to the verify screen
      // in that case would show "code sent" for a code that doesn't exist.
      return { error: null, needsVerification: !data.session };
    } catch {
      // supabase-js rejects (rather than resolving with {error}) on a raw
      // network failure — e.g. Safari's "Load failed" — so this needs its
      // own catch, not just the {error} branch above.
      return { error: "Couldn't reach the server. Check your connection and try again.", needsVerification: false };
    }
  }

  async function verifySignup(email: string, token: string) {
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
      if (error) console.error('WAAW verify error:', error);
      return { error: error ? readableAuthError(error.message) : null };
    } catch {
      return { error: "Couldn't reach the server. Check your connection and try again." };
    }
  }

  async function resendSignupCode(email: string) {
    try {
      await supabase.auth.resend({ type: 'signup', email });
    } catch {
      // best-effort — the resend button's UI just shows "Code resent!"
      // regardless, so a network failure here isn't otherwise surfaced.
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error('WAAW sign in error:', error);
      return { error: error ? readableAuthError(error.message) : null };
    } catch {
      return { error: "Couldn't reach the server. Check your connection and try again." };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signUp, verifySignup, resendSignupCode, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
