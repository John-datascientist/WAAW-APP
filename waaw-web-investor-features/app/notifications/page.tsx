'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../src/components/InvestorNav';
import { Chip } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';
import { NotificationRow, useNotifications } from '../../src/lib/useInvestor';

type FilterChip = 'all' | 'commitments' | 'deals' | 'general';

const CHIPS: { id: FilterChip; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'commitments', label: 'Commitments' },
  { id: 'deals', label: 'Deals' },
  { id: 'general', label: 'General' },
];

const matchesChip = (n: NotificationRow, chip: FilterChip) => {
  if (chip === 'all') return true;
  if (chip === 'commitments') return n.type === 'commitment' || n.type === 'escrow';
  if (chip === 'deals') return n.type === 'syndicate';
  return n.type === 'general' || n.type === 'kyc';
};

export default function NotificationsPage() {
  const { profile } = useAuth();
  const { notifications, unread, markAllRead, toggleRead } = useNotifications();
  const [filter, setFilter] = useState<FilterChip>('all');

  if (!profile) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">Sign in to view your notifications.</p>
          <Link href="/signin" className="font-mono text-xs uppercase tracking-wider text-pu">Sign in →</Link>
        </main>
      </div>
    );
  }

  const filtered = notifications.filter((n) => matchesChip(n, filter));

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-tx">Notifications</h1>
          {unread > 0 && (
            <button type="button" onClick={markAllRead} className="font-mono text-[10px] uppercase tracking-wider text-pu">
              Mark all read
            </button>
          )}
        </div>
        <p className="mb-6 font-sans text-sm font-light text-mu">Updates on your commitments and account.</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <Chip key={c.id} label={c.label} active={filter === c.id} onClick={() => setFilter(c.id)} />
          ))}
        </div>

        {notifications.length === 0 ? (
          <p className="font-sans text-sm text-mu">You&apos;ll see updates here once you make your first commitment.</p>
        ) : filtered.length === 0 ? (
          <p className="font-sans text-sm text-mu">Nothing matches this filter yet.</p>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => toggleRead(n.id)}
              className={`mb-3 block w-full rounded-lg border p-4 text-left ${n.read ? 'border-ln bg-card' : 'border-pu bg-puXlight'}`}
            >
              <div className="mb-1 flex items-center gap-2">
                <p className="font-sans text-sm font-semibold text-tx">{n.title}</p>
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-pu" />}
              </div>
              <p className="mb-1 font-sans text-xs font-light text-mu">{n.body}</p>
              <p className="font-mono text-[9px] text-mu">
                {new Date(n.created_at).toLocaleString()}{!n.read ? ' · Tap to mark read' : ''}
              </p>
            </button>
          ))
        )}
      </main>
    </div>
  );
}
