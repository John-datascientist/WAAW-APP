'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../../src/components/InvestorNav';
import { Divider, GoldButton, VerifiedBadge } from '../../../src/components/ui';
import { CURRENCY_RATES } from '../../../src/data';
import { useAuth } from '../../../src/context/AuthContext';
import { useStartup, useWatchlist } from '../../../src/lib/useInvestor';

const fmt = (n: number) => (n >= 1000000 ? '$' + (n / 1000000).toFixed(1) + 'M' : '$' + (n / 1000).toFixed(0) + 'K');

const listedAgo = (iso?: string) => {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Listed today';
  if (days === 1) return 'Listed 1 day ago';
  if (days < 30) return `Listed ${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'Listed 1 month ago' : `Listed ${months} months ago`;
};

export default function StartupDetailPage({ params }: { params: { id: string } }) {
  const { profile } = useAuth();
  const { startup, loading } = useStartup(params.id);
  const { watchlist, toggle } = useWatchlist();
  const [shareCopied, setShareCopied] = useState(false);
  const [calcAmount, setCalcAmount] = useState('');
  const [currency, setCurrency] = useState<string | null>(null);

  if (loading) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <p className="font-sans text-sm text-mu">Loading deal…</p>
        </main>
      </div>
    );
  }

  if (!startup) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-sans text-sm text-mu">This deal couldn&apos;t be found.</p>
          <Link href="/startups" className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-pu">← Back to startups</Link>
        </main>
      </div>
    );
  }

  const pct = startup.raising_amount > 0 ? Math.round((startup.raised_amount / startup.raising_amount) * 100) : 0;
  const team = startup.waaw_cofounders ?? [];
  const socialLinks = startup.business_social_links ?? [];
  const selectedRate = CURRENCY_RATES.find((c) => c.code === currency);
  const calcNum = parseInt(calcAmount.replace(/\D/g, ''), 10) || 0;
  const estStake =
    startup.post_money_valuation && calcNum > 0 ? (calcNum / startup.post_money_valuation) * 100 : null;
  const saved = watchlist.includes(startup.id);
  const dealUrl = typeof window !== 'undefined' ? `${window.location.origin}/startups/${startup.id}` : '';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${startup.name} is raising ${fmt(startup.raising_amount)} on WAAW. Check out the deal: ${dealUrl}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // clipboard API can be denied — silently no-op, this is a nice-to-have
    }
  };

  const commitHref = !profile
    ? `/signup?role=investor`
    : profile.role === 'founder'
      ? null
      : `/commit/${startup.id}`;

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-3xl px-6 py-10 pb-32">
        <Link href="/startups" className="mb-6 inline-block font-mono text-xs uppercase tracking-wider text-mu hover:text-pu">← Startups</Link>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VerifiedBadge verified={startup.verified} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-mu">{startup.sector} · {startup.stage}</span>
          </div>
          {profile && (
            <button type="button" onClick={() => toggle(startup.id)} className="text-xl text-ch" aria-label={saved ? 'Remove from saved' : 'Save'}>
              {saved ? '★' : '☆'}
            </button>
          )}
        </div>

        <h1 className="mb-1 font-serif text-4xl italic text-tx">{startup.name}</h1>
        <p className="mb-6 font-mono text-xs text-mu">
          {[startup.city, startup.country].filter(Boolean).join(', ')}
          {listedAgo(startup.created_at) ? ` · ${listedAgo(startup.created_at)}` : ''}
        </p>

        <p className="mb-6 font-sans text-base font-light leading-relaxed text-tx">{startup.pitch}</p>

        <Divider />

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Equity', value: startup.equity_pct != null ? `${startup.equity_pct}%` : 'TBD' },
            { label: 'Post-money', value: startup.post_money_valuation != null ? fmt(startup.post_money_valuation) : 'TBD' },
            { label: 'Stage', value: startup.stage },
            { label: 'Sector', value: startup.sector },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-ln bg-card p-3">
              <p className="font-serif text-lg italic text-pu">{item.value}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-mu">{item.label}</p>
            </div>
          ))}
        </div>

        <Divider />

        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-mu">Raise progress</p>
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl text-pu">{fmt(startup.raised_amount)}</span>
          <span className="font-mono text-xs text-mu">of {fmt(startup.raising_amount)}</span>
        </div>
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-deeper">
          <div className="h-1.5 rounded-full bg-ch transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <p className="mb-4 font-mono text-[10px] text-mu">{pct}% of target raised</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {CURRENCY_RATES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(currency === c.code ? null : c.code)}
              className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                currency === c.code ? 'border-pu bg-puXlight text-pu' : 'border-ln text-mu hover:border-pu3'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
        {selectedRate && (
          <p className="mb-6 font-mono text-[10px] text-mu">
            ≈ {selectedRate.symbol}{Math.round(startup.raising_amount * selectedRate.rate).toLocaleString()} target ·{' '}
            {selectedRate.symbol}{Math.round(startup.raised_amount * selectedRate.rate).toLocaleString()} raised
            (illustrative, not a live rate)
          </p>
        )}

        {startup.post_money_valuation != null && (
          <div className="mb-6 rounded-md border border-ln bg-card p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-mu">Estimate your stake</p>
            <div className="flex items-center gap-1 rounded-md border border-ln bg-bg px-3 py-2">
              <span className="font-serif text-lg text-mu">$</span>
              <input
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="Amount you'd invest"
                className="w-full bg-transparent font-serif text-lg text-tx outline-none"
              />
            </div>
            {estStake !== null && (
              <p className="mt-2 font-sans text-sm font-medium text-pu">
                ≈ {estStake < 0.01 ? '<0.01' : estStake.toFixed(2)}% equity stake at {fmt(startup.post_money_valuation)} post-money
              </p>
            )}
            <p className="mt-1 font-mono text-[9px] text-mu">Estimate only — final terms are set in your term sheet.</p>
          </div>
        )}

        <Divider />

        {team.length > 0 ? (
          <>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Meet the team</p>
            {team.map((m, i) => (
              <div key={`${m.name}-${i}`} className="flex items-center justify-between border-b border-ln py-3 last:border-0">
                <div>
                  <p className="font-serif text-base italic text-tx">{m.name}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-mu">{m.role}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">About the founder</p>
            <p className="mb-1 font-serif text-lg italic text-tx">{startup.founder_name}</p>
            <p className="font-sans text-sm font-light text-mu">{startup.founder_bio}</p>
          </>
        )}

        {socialLinks.length > 0 && (
          <>
            <Divider />
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Connect</p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-pu px-3 py-1.5 font-mono text-[10px] text-pu hover:bg-puXlight"
                >
                  {l.platform} ↗
                </a>
              ))}
            </div>
          </>
        )}

        {startup.tags.length > 0 && (
          <>
            <Divider />
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Tags</p>
            <div className="flex flex-wrap gap-2">
              {startup.tags.map((t) => (
                <span key={t} className="rounded-sm border border-ln px-2 py-1 font-mono text-[9px] text-mu">{t}</span>
              ))}
            </div>
          </>
        )}

        <button type="button" onClick={handleShare} className="mt-8 w-full rounded-md border border-pu py-3 text-center font-mono text-xs uppercase tracking-wider text-pu hover:bg-puXlight">
          {shareCopied ? 'Link copied to clipboard!' : 'Share this deal ↗'}
        </button>

        <p className="mt-6 border-l-2 border-ln pl-4 font-mono text-[9px] uppercase tracking-wider text-mu">
          WAAW never asks you to transfer funds outside the escrow flow. All commitments are protected.
        </p>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-ln bg-tx/95 px-6 py-4">
        <div className="mx-auto max-w-3xl">
          {commitHref ? (
            <GoldButton href={commitHref}>{`Commit to invest in ${startup.name}`}</GoldButton>
          ) : (
            <p className="text-center font-mono text-xs uppercase tracking-wider text-white/70">
              Sign in with an investor account to commit capital.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
