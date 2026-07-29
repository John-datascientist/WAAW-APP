import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ─── Replace these with your actual Supabase project values ──────────────────
// Found at: supabase.com → your project → Settings → API
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
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
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      startups: {
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
        Insert: Omit<Database['public']['Tables']['startups']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['startups']['Insert']>;
      };
      cofounders: {
        Row: {
          id: string;
          startup_id: string;
          name: string;
          role: string;
          id_verified: boolean;
          on_registration_docs: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cofounders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['cofounders']['Insert']>;
      };
      commitments: {
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
        Insert: Omit<Database['public']['Tables']['commitments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['commitments']['Insert']>;
      };
      watchlist: {
        Row: {
          id: string;
          investor_id: string;
          startup_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['watchlist']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['watchlist']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          read: boolean;
          type: 'commitment' | 'escrow' | 'kyc' | 'general';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      syndicate_members: {
        Row: {
          id: string;
          startup_id: string;
          investor_id: string;
          pledge_amount: number;
          confirmed: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['syndicate_members']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['syndicate_members']['Insert']>;
      };
    };
  };
};
