'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../src/components/InvestorNav';
import { Chip, ProgressBar, VerifiedBadge } from '../../src/components/ui';
import { STARTUP_SECTORS } from '../../src/data';
import { useAuth } from '../../src/context/AuthContext';
import { useStartups, useWatchlist } from '../../src/lib/useInvestor';

const fmt = (n: number) => (n >= 1000000 ? '$' + (n / 1000000).toFixed(1) + 'M' : '$' + (n / 1000).toFixed(0) + 'K');

type SortOption = 'recommended' | 'newest' | 'most-raised' | 'closest' | 'alphabetical';
const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'most-raised', label: 'Most raised' },
  { id: 'closest', label: 'Closest to target' },
  { id: 'alphabetical', label: 'A–Z' },
];

export default function StartupsPage() {
  const { user } = useAuth();
  const { startups, loading } = useStartups();
  const { watchlist, toggle } = useWatchlist();
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [savedOnly, setSavedOnly] = useState(false);
  const [closingSoonOnly, setClosingSoonOnly] = useState(false);

  const pct = (s: { raising_amount: number; raised_amount: number }) =>
    s.raising_amount > 0 ? Math.round((s.raised_amount / s.raising_amount) * 100) : 0;

  const q = query.trim().toLowerCase();
  const filtered = startups.filter((s) => {
    if (savedOnly && !watchlist.includes(s.id)) return false;
    if (closingSoonOnly && pct(s) < 80) return false;
    if (sectorFilter && s.sector !== sectorFilter) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.pitch.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'most-raised':
        return b.raised_amount - a.raised_amount;
      case 'closest':
        return pct(b) - pct(a);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return (b.boost_active ? 1 : 0) - (a.boost_active ? 1 : 0);
    }
  });

  const sectorsPresent = STARTUP_SECTORS.filter((sec) => startups.some((s) => s.sector === sec));

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 font-serif text-3xl text-tx">Startups</h1>
        <p className="mb-8 font-sans text-sm font-light text-mu">Verified deals raising capital right now.</p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, pitch, or tag"
          className="mb-4 w-full rounded-md border border-ln bg-card px-4 py-3 font-sans text-sm text-tx outline-none focus:border-pu"
        />

        <div className="mb-3 flex flex-wrap gap-2">
          <Chip label="All sectors" active={sectorFilter === null} onClick={() => setSectorFilter(null)} />
          {sectorsPresent.map((sec) => (
            <Chip key={sec} label={sec} active={sectorFilter === sec} onClick={() => setSectorFilter(sec)} />
          ))}
          {user && <Chip label="★ Saved" active={savedOnly} onClick={() => setSavedOnly((v) => !v)} />}
          <Chip label="Closing soon" active={closingSoonOnly} onClick={() => setClosingSoonOnly((v) => !v)} />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <Chip key={opt.id} label={opt.label} active={sortBy === opt.id} onClick={() => setSortBy(opt.id)} />
          ))}
        </div>

        {loading ? (
          <p className="font-sans text-sm text-mu">Loading deals…</p>
        ) : sorted.length === 0 ? (
          <p className="font-sans text-sm text-mu">No startups match{query ? ` "${query}"` : ' your filters'}.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted.map((s) => {
              const saved = watchlist.includes(s.id);
              return (
                <Link
                  key={s.id}
                  href={`/startups/${s.id}`}
                  className={`block rounded-lg border p-5 transition-colors hover:border-pu ${s.boost_active ? 'border-ch' : 'border-ln'} bg-card`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      {s.boost_active && <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-ch">★ Featured</p>}
                      <VerifiedBadge verified={s.verified} />
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-mu">
                        {s.sector} · {s.stage}
                      </p>
                    </div>
                    {user && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); toggle(s.id); }}
                        className="text-lg text-ch"
                        aria-label={saved ? 'Remove from saved' : 'Save'}
                      >
                        {saved ? '★' : '☆'}
                      </button>
                    )}
                  </div>
                  <h2 className="mb-2 font-serif text-xl italic text-tx">{s.name}</h2>
                  <p className="mb-4 font-sans text-sm font-light text-mu line-clamp-2">{s.pitch}</p>
                  <div className="mb-2 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-mu">
                    <span>Raising {fmt(s.raising_amount)}</span>
                    <span className="text-pu">{pct(s)}% filled</span>
                  </div>
                  <ProgressBar pct={pct(s)} />
                  <p className="mt-2 font-mono text-[10px] text-mu">{fmt(s.raised_amount)} raised</p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
