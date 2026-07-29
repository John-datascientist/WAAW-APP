import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ─── STARTUPS ─────────────────────────────────────────────────────────────────

export function useStartups(sector?: string, stage?: string) {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('startups')
      .select(`*, cofounders(*)`)
      .order('created_at', { ascending: false });

    if (sector) query = query.eq('sector', sector);
    if (stage) query = query.eq('stage', stage);

    const { data, error } = await query;
    if (error) setError(error.message);
    else setStartups(data ?? []);
    setLoading(false);
  }, [sector, stage]);

  useEffect(() => { fetch(); }, [fetch]);
  return { startups, loading, error, refetch: fetch };
}

export function useStartup(id: string) {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('startups')
      .select(`*, cofounders(*)`)
      .eq('id', id)
      .single()
      .then(({ data }) => { setStartup(data); setLoading(false); });
  }, [id]);

  return { startup, loading };
}

export function useStartupBySlug(slug: string) {
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('startups')
      .select(`*, cofounders(*)`)
      .eq('slug', slug)
      .single()
      .then(({ data }) => { setStartup(data); setLoading(false); });
  }, [slug]);

  return { startup, loading };
}

// ─── COMMITMENTS ──────────────────────────────────────────────────────────────

export function useCommitments() {
  const { user } = useAuth();
  const [commitments, setCommitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('commitments')
      .select(`*, startups(name, sector)`)
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false });
    setCommitments(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  async function createCommitment(startupId: string, amount: number, currency: string) {
    if (!user) return { error: 'Not authenticated' };

    const waawFee = amount * 0.05;
    const netToFounder = amount * 0.95;
    const reference = 'WW' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const { error } = await supabase.from('commitments').insert({
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
      // Update startup raised amount
      await supabase.rpc('increment_raised', { startup_id: startupId, amount });
      // Update investor total committed and tier
      await supabase.rpc('update_investor_tier', { investor_id: user.id, amount });
      await fetch();
    }

    return { error: error?.message ?? null, reference };
  }

  const total = commitments.filter(c => c.status !== 'refunded').reduce((a, c) => a + c.amount, 0);

  return { commitments, loading, total, createCommitment, refetch: fetch };
}

// ─── WATCHLIST ────────────────────────────────────────────────────────────────

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('watchlist')
      .select('startup_id')
      .eq('investor_id', user.id)
      .then(({ data }) => setWatchlist((data ?? []).map(w => w.startup_id)));
  }, [user]);

  async function toggle(startupId: string) {
    if (!user) return;
    if (watchlist.includes(startupId)) {
      await supabase.from('watchlist').delete().eq('investor_id', user.id).eq('startup_id', startupId);
      setWatchlist(prev => prev.filter(id => id !== startupId));
    } else {
      await supabase.from('watchlist').insert({ investor_id: user.id, startup_id: startupId });
      setWatchlist(prev => [...prev, startupId]);
    }
  }

  return { watchlist, toggle };
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const unread = notifications.filter(n => !n.read).length;

  const fetch = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data ?? []);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, payload => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  async function markAllRead() {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return { notifications, unread, markAllRead, refetch: fetch };
}

// ─── SYNDICATE ────────────────────────────────────────────────────────────────

export function useSyndicate(startupId: string) {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('syndicate_members')
      .select(`*, profiles(full_name, country, tier)`)
      .eq('startup_id', startupId)
      .then(({ data }) => setMembers(data ?? []));
  }, [startupId]);

  async function joinSyndicate(pledgeAmount: number) {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('syndicate_members').insert({
      startup_id: startupId,
      investor_id: user.id,
      pledge_amount: pledgeAmount,
      confirmed: false,
    });
    return { error: error?.message ?? null };
  }

  const totalPledged = members.reduce((a, m) => a + m.pledge_amount, 0);

  return { members, totalPledged, joinSyndicate };
}

// ─── FOUNDER STARTUP ──────────────────────────────────────────────────────────

export function useFounderStartup() {
  const { user } = useAuth();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('startups')
      .select(`*, cofounders(*)`)
      .eq('founder_id', user.id)
      .single()
      .then(({ data }) => { setStartup(data); setLoading(false); });
  }, [user]);

  async function registerStartup(data: any, cofounders: any[]) {
    if (!user) return { error: 'Not authenticated' };
    const slug = data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 7);
    const { data: startup, error } = await supabase
      .from('startups')
      .insert({ ...data, founder_id: user.id, slug, verified: false, fraud_score: 0, raised_amount: 0 })
      .select()
      .single();

    if (error) return { error: error.message };

    // Insert cofounders
    await supabase.from('cofounders').insert(
      cofounders.map(cf => ({ ...cf, startup_id: startup.id, id_verified: false, on_registration_docs: true }))
    );

    setStartup(startup);
    return { error: null };
  }

  return { startup, loading, registerStartup };
}
