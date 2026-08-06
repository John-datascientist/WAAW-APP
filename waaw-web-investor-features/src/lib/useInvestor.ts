'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CofounderSummary {
  name: string;
  role: string;
}

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
  verified: boolean;
  founder_name: string | null;
  founder_bio: string | null;
  tags: string[];
  boost_active: boolean;
  business_social_links: SocialLink[];
  created_at: string;
  waaw_cofounders?: CofounderSummary[];
}

export interface CommitmentRow {
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
  waaw_startups?: { name: string; sector: string };
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  type: 'commitment' | 'escrow' | 'kyc' | 'general' | 'syndicate';
  created_at: string;
}

// ─── STARTUPS (public deal listing) ────────────────────────────────────────
export function useStartups() {
  const [startups, setStartups] = useState<StartupRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('waaw_startups')
      .select('*, waaw_cofounders(name, role)')
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setStartups((data as StartupRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { startups, loading };
}

export function useStartup(id: string) {
  const [startup, setStartup] = useState<StartupRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('waaw_startups')
      .select('*, waaw_cofounders(name, role)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setStartup((data as StartupRow) ?? null);
        setLoading(false);
      });
  }, [id]);

  return { startup, loading };
}

// ─── WATCHLIST ──────────────────────────────────────────────────────────────
export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from('waaw_watchlist')
      .select('startup_id')
      .eq('investor_id', user.id)
      .then(({ data }) => {
        setWatchlist((data ?? []).map((w) => w.startup_id));
        setLoading(false);
      });
  }, [user]);

  const toggle = useCallback(
    async (startupId: string) => {
      if (!user) return;
      if (watchlist.includes(startupId)) {
        await supabase.from('waaw_watchlist').delete().eq('investor_id', user.id).eq('startup_id', startupId);
        setWatchlist((prev) => prev.filter((id) => id !== startupId));
      } else {
        await supabase.from('waaw_watchlist').insert({ investor_id: user.id, startup_id: startupId });
        setWatchlist((prev) => [...prev, startupId]);
      }
    },
    [user, watchlist]
  );

  return { watchlist, loading, toggle };
}

// ─── COMMITMENTS ────────────────────────────────────────────────────────────
export function useCommitments() {
  const { user } = useAuth();
  const [commitments, setCommitments] = useState<CommitmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('waaw_commitments')
      .select('*, waaw_startups(name, sector)')
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false });
    setCommitments((data as CommitmentRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function createCommitment(startupId: string, amount: number, currency: string) {
    if (!user) return { error: 'Not authenticated', reference: null as string | null };

    const waawFee = amount * 0.05;
    const netToFounder = amount * 0.95;
    const reference = 'WW' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const { error } = await supabase.from('waaw_commitments').insert({
      investor_id: user.id,
      startup_id: startupId,
      amount,
      currency,
      status: 'in_escrow',
      reference,
      waaw_fee: waawFee,
      net_to_founder: netToFounder,
    });

    if (!error) {
      await supabase.rpc('waaw_increment_raised', { startup_id: startupId, amount });
      await supabase.rpc('waaw_update_investor_tier', { investor_id: user.id, amount });
      await supabase.from('waaw_notifications').insert({
        user_id: user.id,
        title: 'Commitment placed in escrow',
        body: `Your $${amount.toLocaleString()} commitment is now held in escrow.`,
        type: 'commitment',
      });
      await fetch();
    }

    return { error: error?.message ?? null, reference: error ? null : reference };
  }

  async function requestRefund(commitmentId: string) {
    const { error } = await supabase
      .from('waaw_commitments')
      .update({ status: 'refunded' })
      .eq('id', commitmentId);
    if (!error) await fetch();
    return { error: error?.message ?? null };
  }

  const total = commitments.filter((c) => c.status !== 'refunded').reduce((a, c) => a + c.amount, 0);

  return { commitments, loading, total, createCommitment, requestRefund, refetch: fetch };
}

// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const unread = notifications.filter((n) => !n.read).length;

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('waaw_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications((data as NotificationRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('waaw-web-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'waaw_notifications', filter: `user_id=eq.${user.id}` },
        (payload) => setNotifications((prev) => [payload.new as NotificationRow, ...prev])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function markAllRead() {
    if (!user) return;
    await supabase.from('waaw_notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function toggleRead(id: string) {
    const current = notifications.find((n) => n.id === id);
    if (!current) return;
    const nextRead = !current.read;
    await supabase.from('waaw_notifications').update({ read: nextRead }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: nextRead } : n)));
  }

  return { notifications, loading, unread, markAllRead, toggleRead };
}
