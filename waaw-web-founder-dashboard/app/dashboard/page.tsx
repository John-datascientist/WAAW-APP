'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../src/components/InvestorNav';
import { Divider, VerifiedBadge } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';
import { useFounderStartup } from '../../src/lib/useFounderStartup';
import { onboardingProgress } from '../../src/lib/onboardingProgress';
import { supabase } from '../../src/lib/supabase';

const fmt = (n: number) => '$' + n.toLocaleString();

interface CommitmentSummary {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { startup, cofounders, loading } = useFounderStartup();
  const [commitments, setCommitments] = useState<CommitmentSummary[]>([]);
  const [copied, setCopied] = useState<'link' | 'pager' | null>(null);

  useEffect(() => {
    if (!startup) return;
    supabase
      .from('waaw_commitments')
      .select('id, amount, status, created_at')
      .eq('startup_id', startup.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setCommitments((data as CommitmentSummary[]) ?? []));
  }, [startup]);

  if (!profile) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">Sign in to view your dashboard.</p>
          <Link href="/signin" className="font-mono text-xs uppercase tracking-wider text-pu">Sign in →</Link>
        </main>
      </div>
    );
  }

  if (profile.role !== 'founder') {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="font-sans text-sm text-mu">This is the founder dashboard — investors use Portfolio instead.</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-2xl px-6 py-16"><p className="font-sans text-sm text-mu">Loading…</p></main>
      </div>
    );
  }

  if (!startup) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">You haven&apos;t started registering your startup yet.</p>
          <Link href="/onboarding" className="font-mono text-xs uppercase tracking-wider text-pu">Start onboarding →</Link>
        </main>
      </div>
    );
  }

  const pct = startup.raising_amount > 0 ? Math.round((startup.raised_amount / startup.raising_amount) * 100) : 0;
  const activeCommitments = commitments.filter((c) => c.status !== 'refunded');
  const investorCount = activeCommitments.length;
  const progress = onboardingProgress(startup, cofounders);
  const dealUrl = typeof window !== 'undefined' ? `${window.location.origin}/startups/${startup.id}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(dealUrl);
      setCopied('link');
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  const handleCopyOnePager = async () => {
    const team = cofounders.map((c) => `${c.name} (${c.role})`).join(', ');
    const text = [
      `${startup.name} — ${startup.sector} · ${startup.stage}`,
      startup.pitch,
      `Raising ${fmt(startup.raising_amount)}${startup.raised_amount ? ` · ${fmt(startup.raised_amount)} raised so far` : ''}`,
      team ? `Team: ${team}` : '',
      dealUrl,
    ].filter(Boolean).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied('pager');
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-2 flex items-center gap-3">
          <VerifiedBadge verified={startup.verified} />
          {!startup.verified && <span className="font-mono text-[9px] uppercase tracking-wider text-mu">Pending WAAW review</span>}
        </div>
        <h1 className="mb-1 font-serif text-3xl italic text-tx">{startup.name || 'Your startup'}</h1>
        <p className="mb-8 font-sans text-sm font-light text-mu">Track your raise, investor activity, and registration progress.</p>

        {progress.pct < 100 && (
          <div className="mb-6 rounded-md border border-warnBorder bg-warnLight p-4">
            <p className="mb-2 font-sans text-xs text-warn">
              Registration {progress.pct}% complete ({progress.doneCount} of {progress.total} steps).
            </p>
            <Link href="/onboarding" className="font-mono text-[10px] uppercase tracking-wider text-pu">Continue onboarding →</Link>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-ln bg-card p-4">
            <p className="font-serif text-2xl text-pu">{fmt(startup.raised_amount)}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-mu">Raised of {fmt(startup.raising_amount)}</p>
          </div>
          <div className="rounded-md border border-ln bg-card p-4">
            <p className="font-serif text-2xl text-pu">{investorCount}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-mu">Investors committed</p>
          </div>
          <div className="rounded-md border border-ln bg-card p-4">
            <p className="font-serif text-2xl text-pu">{pct}%</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-mu">Of target raised</p>
          </div>
        </div>

        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-deeper">
          <div className="h-1.5 rounded-full bg-ch transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleCopyLink} className="rounded-md border border-pu px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-pu hover:bg-puXlight">
            {copied === 'link' ? 'Copied!' : 'Copy profile link'}
          </button>
          <button type="button" onClick={handleCopyOnePager} className="rounded-md border border-ln px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-mu hover:border-pu3">
            {copied === 'pager' ? 'Copied!' : 'Copy one-pager'}
          </button>
          {startup.name && (
            <Link href={`/startups/${startup.id}`} className="rounded-md border border-ln px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-mu hover:border-pu3">
              Preview public profile
            </Link>
          )}
        </div>

        <Divider />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">
          Founder interview{startup.interview_requested ? ' — ' + (startup.interview_scheduled_for ? `scheduled for ${startup.interview_scheduled_for}` : 'requested') : ''}
        </p>
        {!startup.interview_requested && (
          <Link href="/onboarding/interview" className="mb-6 inline-block font-mono text-[10px] uppercase tracking-wider text-pu">
            {progress.pct === 100 ? 'Request your interview →' : 'Unlocks once onboarding is complete'}
          </Link>
        )}

        <Divider />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Recent activity</p>
        {activeCommitments.length === 0 ? (
          <p className="font-sans text-sm font-light text-mu">No commitments yet — investors will appear here once they commit capital.</p>
        ) : (
          activeCommitments.slice(0, 10).map((c) => (
            <div key={c.id} className="flex items-center justify-between border-b border-ln py-3 last:border-0">
              <div>
                <p className="font-sans text-sm text-tx">Investor committed {fmt(c.amount)}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-mu">{new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-mu">{c.status.replace('_', ' ')}</span>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
