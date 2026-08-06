'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../src/components/InvestorNav';
import { Chip, Divider } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';
import { CommitmentRow, useCommitments, useStartups, useWatchlist } from '../../src/lib/useInvestor';

const fmt = (n: number) => '$' + n.toLocaleString();

const STATUS_COLORS: Record<string, string> = {
  in_escrow: 'text-ch',
  countersigned: 'text-su',
  released: 'text-mu',
  refunded: 'text-da',
};

const STATUS_LABELS: Record<string, string> = {
  in_escrow: 'In escrow',
  countersigned: 'Countersigned',
  released: 'Released',
  refunded: 'Refunded',
};

const SECTOR_COLORS = ['#3d1f7a', '#c9a84c', '#1a6e3c', '#b91c1c', '#7c4fd4', '#92400e'];

function csvEscape(v: string | number) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function PortfolioPage() {
  const { profile } = useAuth();
  const { commitments, total, requestRefund } = useCommitments();
  const { startups } = useStartups();
  const { watchlist, toggle } = useWatchlist();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (!profile) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">Sign in to view your portfolio.</p>
          <Link href="/signin" className="font-mono text-xs uppercase tracking-wider text-pu">Sign in →</Link>
        </main>
      </div>
    );
  }

  const active = commitments.filter((c) => c.status !== 'refunded');
  const refunded = commitments.filter((c) => c.status === 'refunded');
  const refundedTotal = refunded.reduce((a, c) => a + c.amount, 0);
  const filteredActive = statusFilter === 'All' ? active : active.filter((c) => STATUS_LABELS[c.status] === statusFilter);
  const savedStartups = startups.filter((s) => watchlist.includes(s.id));

  const sectorBreakdown = (() => {
    const bySector: Record<string, number> = {};
    for (const c of active) {
      const sector = c.waaw_startups?.sector || 'Other';
      bySector[sector] = (bySector[sector] ?? 0) + c.amount;
    }
    return Object.entries(bySector)
      .map(([sector, amount]) => ({ sector, amount, pct: total > 0 ? Math.round((amount / total) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount);
  })();

  const handleDownloadCsv = () => {
    const header = 'Company,Amount,Status,Reference,Date';
    const rows = commitments.map((c) =>
      [csvEscape(c.waaw_startups?.name ?? ''), c.amount, csvEscape(STATUS_LABELS[c.status]), csvEscape(c.reference), csvEscape(new Date(c.created_at).toLocaleDateString())].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waaw-portfolio.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefund = async (c: CommitmentRow) => {
    setConfirmingId(null);
    await requestRefund(c.id);
  };

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 font-serif text-3xl text-tx">Portfolio</h1>
        <p className="mb-8 font-sans text-sm font-light text-mu">Your committed capital and escrow status.</p>

        {savedStartups.length > 0 && (
          <>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Saved startups</p>
            {savedStartups.map((s) => (
              <div key={s.id} className="mb-2 flex items-center justify-between rounded-md border border-ln bg-card p-4">
                <Link href={`/startups/${s.id}`} className="flex-1">
                  <p className="font-serif text-base italic text-tx">{s.name}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-mu">{s.sector} · {s.stage}</p>
                </Link>
                <button type="button" onClick={() => toggle(s.id)} className="font-sans text-xs text-da">Remove</button>
              </div>
            ))}
            <Divider />
          </>
        )}

        {commitments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ln p-10 text-center">
            <p className="mb-2 font-serif text-lg italic text-tx">Your portfolio is empty</p>
            <p className="mb-4 font-sans text-sm font-light text-mu">Commitments you make appear here with their live escrow status.</p>
            <Link href="/startups" className="font-mono text-xs uppercase tracking-wider text-pu">Find startups →</Link>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <>
                <div className="mb-4 rounded-lg border border-ln bg-card p-5">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-mu">Total committed</p>
                  <p className="font-serif text-3xl text-pu">{fmt(total)}</p>
                </div>

                <button type="button" onClick={handleDownloadCsv} className="mb-6 w-full rounded-md border border-ln py-3 text-center font-mono text-xs uppercase tracking-wider text-pu hover:border-pu">
                  Download as CSV
                </button>

                {sectorBreakdown.length > 1 && (
                  <>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-mu">By sector</p>
                    <div className="mb-6 rounded-lg border border-ln bg-card p-4">
                      <div className="mb-3 flex h-2 overflow-hidden rounded-full bg-deeper">
                        {sectorBreakdown.map((row, i) => (
                          <div key={row.sector} style={{ width: `${row.pct}%`, backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                        ))}
                      </div>
                      {sectorBreakdown.map((row, i) => (
                        <div key={row.sector} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                            <span className="font-sans text-xs text-tx">{row.sector}</span>
                          </div>
                          <span className="font-mono text-[10px] text-mu">{fmt(row.amount)} · {row.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mb-4 flex flex-wrap gap-2">
                  {['All', 'In escrow', 'Countersigned', 'Released'].map((f) => (
                    <Chip key={f} label={f} active={statusFilter === f} onClick={() => setStatusFilter(f)} />
                  ))}
                </div>

                {filteredActive.length === 0 && (
                  <p className="mb-4 font-sans text-xs text-mu">No holdings with status &quot;{statusFilter}&quot;.</p>
                )}

                {filteredActive.map((c) => (
                  <div key={c.id}>
                    <button
                      type="button"
                      onClick={() => c.status === 'in_escrow' && setConfirmingId(confirmingId === c.id ? null : c.id)}
                      className="flex w-full items-center justify-between border-b border-ln py-4 text-left"
                    >
                      <div>
                        <p className="font-serif text-lg italic text-tx">{c.waaw_startups?.name ?? 'Startup'}</p>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-mu">
                          {STATUS_LABELS[c.status]} · REF {c.reference}
                          {c.status === 'in_escrow' ? ' · Tap to request refund' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg text-tx">{fmt(c.amount)}</span>
                        <span className={`h-2 w-2 rounded-full bg-current ${STATUS_COLORS[c.status]}`} />
                      </div>
                    </button>
                    {confirmingId === c.id && (
                      <div className="mb-2 rounded-md border border-daBorder bg-daLight p-4">
                        <p className="mb-3 font-sans text-xs text-tx">
                          Request a refund of {fmt(c.amount)} from {c.waaw_startups?.name}? Only available while still held in escrow.
                        </p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setConfirmingId(null)} className="flex-1 rounded-md border border-ln py-2 font-sans text-xs">Cancel</button>
                          <button type="button" onClick={() => handleRefund(c)} className="flex-1 rounded-md bg-da py-2 font-sans text-xs text-white">Request refund</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {refunded.length > 0 && (
              <>
                <div className="mt-6 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-mu">Refunded</p>
                  <p className="font-mono text-[10px] text-mu">{fmt(refundedTotal)} total</p>
                </div>
                {refunded.map((c) => (
                  <div key={c.id} className="flex items-center justify-between border-b border-ln py-4 opacity-60">
                    <div>
                      <p className="font-serif text-lg italic text-mu">{c.waaw_startups?.name ?? 'Startup'}</p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-mu">REFUNDED · REF {c.reference}</p>
                    </div>
                    <span className="font-serif text-lg text-mu">{fmt(c.amount)}</span>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
