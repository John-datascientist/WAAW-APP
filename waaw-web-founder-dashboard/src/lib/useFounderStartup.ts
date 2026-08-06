'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';

export interface StartupRow {
  id: string;
  founder_id: string;
  name: string;
  slug: string;
  sector: string;
  stage: string;
  country: string;
  city: string;
  pitch: string;
  raising_amount: number;
  raised_amount: number;
  equity_pct: number | null;
  post_money_valuation: number | null;
  registration_number: string | null;
  address_line: string | null;
  address_verified: boolean;
  business_social_links: { id: string; platform: string; url: string }[];
  pitch_deck_url: string | null;
  business_plan_url: string | null;
  pitch_video_url: string | null;
  interview_requested: boolean;
  interview_scheduled_for: string | null;
  onboarding_complete: boolean;
  incorporation_cert_url: string | null;
  registration_country: string | null;
  cofounders_on_docs_confirmed: boolean;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_currency: string | null;
  bank_proof_url: string | null;
  active_users: number | null;
  monthly_revenue: number | null;
  prior_funding_raised: number | null;
  proof_of_address_type: string | null;
  proof_of_address_url: string | null;
  verified: boolean;
}

export interface WorkHistoryEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string; // '' means current role
  description: string;
}

export interface ReferenceEntry {
  id: string;
  type: 'Work' | 'Character';
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface CofounderRow {
  id: string;
  startup_id: string;
  name: string;
  role: string;
  selfie_done: boolean;
  id_verified: boolean;
  social_link: string | null;
  date_of_birth: string | null;
  phone: string | null;
  nationality: string | null;
  address_line: string | null;
  previous_address: string | null;
  current_city: string | null;
  state_of_origin: string | null;
  state_of_residence: string | null;
  postcode: string | null;
  education_level: string | null;
  education_institution: string | null;
  id_type: string | null;
  id_number: string | null;
  selfie_url: string | null;
  id_document_url: string | null;
  id_document_back_url: string | null;
  work_history: WorkHistoryEntry[];
  reference_list: ReferenceEntry[];
}

// The onboarding wizard fills in a real waaw_startups row a little at a time
// across steps, rather than needing every not-null column up front — this
// hook creates a minimal draft on first use and each step patches its own
// fields. The row stays verified=false (and so hidden from the investor
// listing, see useStartups in the Expo app) until WAAW reviews it.
export function useFounderStartup() {
  const { user, profile } = useAuth();
  const [startup, setStartup] = useState<StartupRow | null>(null);
  const [cofounders, setCofounders] = useState<CofounderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('waaw_startups').select('*').eq('founder_id', user.id).maybeSingle();
    setStartup(data as StartupRow | null);
    if (data) {
      const { data: cf } = await supabase.from('waaw_cofounders').select('*').eq('startup_id', data.id).order('created_at');
      setCofounders((cf as CofounderRow[]) ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refetch(); }, [refetch]);

  // ensureStartup used to swallow its own insert error entirely (silent
  // `return null` — the exact failure mode that hid the auth.users trigger
  // bug earlier), so every write path now logs and surfaces a real message.
  async function ensureStartup(): Promise<{ row: StartupRow | null; error: string | null }> {
    if (startup) return { row: startup, error: null };
    if (!user) return { row: null, error: 'Not signed in.' };
    const placeholderSlug = 'draft-' + Math.random().toString(36).slice(2, 10);
    const { data, error } = await supabase
      .from('waaw_startups')
      .insert({
        founder_id: user.id,
        name: '',
        slug: placeholderSlug,
        sector: '',
        stage: '',
        country: profile?.country ?? '',
        city: '',
        pitch: '',
        raising_amount: 0,
        verified: false,
      })
      .select()
      .single();
    if (error || !data) {
      console.error('WAAW create startup draft error:', error);
      return { row: null, error: error?.message ?? 'Could not start onboarding — open the browser console for details.' };
    }
    const row = data as StartupRow;
    setStartup(row);
    // Seed the founder themselves as co-founder #1, matching how the
    // mobile app's onboarding pre-fills the first co-founder slot.
    const { error: cofounderError } = await supabase.from('waaw_cofounders').insert({
      startup_id: row.id,
      name: profile?.full_name ?? '',
      role: 'Founder',
    });
    if (cofounderError) console.error('WAAW seed cofounder error:', cofounderError);
    await refetch();
    return { row, error: null };
  }

  async function updateStartup(patch: Partial<StartupRow>) {
    const { row, error: ensureError } = await ensureStartup();
    if (!row) return { error: ensureError };
    const { error } = await supabase.from('waaw_startups').update(patch).eq('id', row.id);
    if (error) {
      console.error('WAAW update startup error:', error);
      return { error: error.message };
    }
    setStartup((prev) => (prev ? { ...prev, ...patch } : prev));
    return { error: null };
  }

  async function addCofounder(name: string, role: string) {
    const { row, error: ensureError } = await ensureStartup();
    if (!row) return { error: ensureError };
    const { error } = await supabase.from('waaw_cofounders').insert({ startup_id: row.id, name, role });
    if (error) console.error('WAAW add cofounder error:', error);
    else await refetch();
    return { error: error?.message ?? null };
  }

  async function updateCofounder(id: string, patch: Partial<CofounderRow>) {
    const { error } = await supabase.from('waaw_cofounders').update(patch).eq('id', id);
    if (error) console.error('WAAW update cofounder error:', error);
    else await refetch();
    return { error: error?.message ?? null };
  }

  async function removeCofounder(id: string) {
    const { error } = await supabase.from('waaw_cofounders').delete().eq('id', id);
    if (error) console.error('WAAW remove cofounder error:', error);
    else setCofounders((prev) => prev.filter((c) => c.id !== id));
    return { error: error?.message ?? null };
  }

  return { startup, cofounders, loading, refetch, ensureStartup, updateStartup, addCofounder, updateCofounder, removeCofounder };
}
