import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ─── Replace these with your actual Supabase project values ──────────────────
// Found at: supabase.com → your project → Settings → API
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// createClient throws synchronously if the URL is missing, which would
// otherwise crash the whole app into a blank white screen with nothing but a
// console error — e.g. if an env var is misconfigured or scoped wrong on the
// hosting platform. Falling back to a harmless placeholder lets the app boot
// so App.tsx can show a clear, in-app configuration error instead.
export const isSupabaseConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export type Database = {
  public: {
    Tables: {
      waaw_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'investor' | 'founder';
          country: string | null;
          kyc_status: 'not_started' | 'pending' | 'verified' | 'rejected';
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          total_committed: number;
          referral_code: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_profiles']['Insert']>;
      };
      waaw_startups: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sector: string;
          stage: string;
          country: string;
          city: string;
          pitch: string;
          raising_amount: number;
          raised_amount: number;
          equity_pct: number;
          post_money_valuation: number;
          verified: boolean;
          fraud_score: number;
          founder_id: string;
          founder_name: string;
          founder_bio: string;
          tags: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_startups']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_startups']['Insert']>;
      };
      waaw_cofounders: {
        Row: {
          id: string;
          startup_id: string;
          name: string;
          role: string;
          id_verified: boolean;
          on_registration_docs: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_cofounders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_cofounders']['Insert']>;
      };
      waaw_commitments: {
        Row: {
          id: string;
          investor_id: string;
          startup_id: string;
          amount: number;
          currency: string;
          status: 'in_escrow' | 'countersigned' | 'released' | 'refunded';
          reference: string;
          waaw_fee: number;
          net_to_founder: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_commitments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_commitments']['Insert']>;
      };
      waaw_watchlist: {
        Row: {
          id: string;
          investor_id: string;
          startup_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_watchlist']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_watchlist']['Insert']>;
      };
      waaw_notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          read: boolean;
          type: 'commitment' | 'escrow' | 'kyc' | 'general';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_notifications']['Insert']>;
      };
      waaw_syndicate_members: {
        Row: {
          id: string;
          startup_id: string;
          investor_id: string;
          pledge_amount: number;
          confirmed: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['waaw_syndicate_members']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waaw_syndicate_members']['Insert']>;
      };
    };
  };
};
