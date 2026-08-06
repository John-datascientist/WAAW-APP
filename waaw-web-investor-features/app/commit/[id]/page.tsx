'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../../src/components/InvestorNav';
import { ErrorBanner, GoldButton } from '../../../src/components/ui';
import { useAuth } from '../../../src/context/AuthContext';
import { useCommitments, useStartup } from '../../../src/lib/useInvestor';

const MIN_AMOUNT = 100;
const PRESETS = [500, 1000, 2500, 5000];
const RISK_ACCEPTED_KEY = 'waaw-risk-accepted';

const RISKS = [
  { icon: '💸', title: 'Capital at risk.', body: 'The value of your investment can go down as well as up. You may lose some or all of the money you invest.' },
  { icon: '🔒', title: 'Investments are illiquid.', body: 'You may not be able to sell your investment or get your money back quickly. These are long-term commitments.' },
  { icon: '📉', title: 'Early-stage risk.', body: 'Investing in early-stage startups is high risk. Most startups fail. Only invest what you can afford to lose.' },
  { icon: '🌍', title: 'Cross-border risk.', body: 'Investments in Black-founded startups operating in Africa carry additional regulatory, currency, and political risks.' },
];

export default function CommitPage({ params }: { params: { id: string } }) {
  const { profile } = useAuth();
  const { startup, loading } = useStartup(params.id);
  const { createCommitment } = useCommitments();
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string; amount: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem(RISK_ACCEPTED_KEY) === 'true') {
      setRiskAccepted(true);
    }
  }, []);

  const acceptRisk = () => {
    setRiskAccepted(true);
    if (typeof window !== 'undefined') window.localStorage.setItem(RISK_ACCEPTED_KEY, 'true');
  };

  const numAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const canSubmit = numAmount >= MIN_AMOUNT;

  const handleSubmit = async () => {
    if (!canSubmit || !startup) return;
    setSubmitting(true);
    setError(null);
    const { error, reference } = await createCommitment(startup.id, numAmount, 'USD');
    setSubmitting(false);
    if (error) { setError(error); return; }
    setResult({ reference: reference!, amount: numAmount });
  };

  if (loading) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16"><p className="font-sans text-sm text-mu">Loading…</p></main>
      </div>
    );
  }

  if (!startup) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="font-sans text-sm text-mu">This deal couldn&apos;t be found.</p>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">Sign in with an investor account to commit capital.</p>
          <GoldButton href="/signup?role=investor">Create an account</GoldButton>
        </main>
      </div>
    );
  }

  if (profile.role !== 'investor') {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="font-sans text-sm text-mu">This account is a founder account — commit capital from an investor account instead.</p>
        </main>
      </div>
    );
  }

  if ((profile as any).kyc_status !== 'verified') {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">Complete identity verification before committing capital.</p>
          <GoldButton href={`/kyc?returnTo=/commit/${startup.id}`}>Verify your identity</GoldButton>
        </main>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="mb-4 text-4xl">✓</p>
          <h1 className="mb-3 font-serif text-2xl text-tx">Commitment placed</h1>
          <p className="mx-auto mb-6 max-w-xs font-sans text-sm font-light leading-relaxed text-mu">
            Your ${result.amount.toLocaleString()} commitment to {startup.name} is now held in protected escrow, reference <strong>{result.reference}</strong>.
          </p>
          <GoldButton href="/portfolio">View portfolio</GoldButton>
        </main>
      </div>
    );
  }

  if (!riskAccepted) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16">
          <h1 className="mb-6 font-serif text-2xl text-tx">Before you invest</h1>
          {RISKS.map((r) => (
            <div key={r.title} className="mb-4 flex gap-3">
              <span className="text-xl">{r.icon}</span>
              <div>
                <p className="font-sans text-sm font-medium text-tx">{r.title}</p>
                <p className="font-sans text-xs font-light leading-relaxed text-mu">{r.body}</p>
              </div>
            </div>
          ))}
          <GoldButton onClick={acceptRisk}>I understand — continue</GoldButton>
        </main>
      </div>
    );
  }

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <Link href={`/startups/${startup.id}`} className="mb-6 inline-block font-mono text-xs uppercase tracking-wider text-mu hover:text-pu">← {startup.name}</Link>
        <h1 className="mb-2 font-serif text-3xl text-tx">Commit to invest</h1>
        <p className="mb-8 font-sans text-sm font-light leading-relaxed text-mu">
          Choose how much to commit to {startup.name}. Funds move into protected escrow immediately.
        </p>

        <ErrorBanner message={error} />

        <div className="mb-4 grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`rounded-md border py-2 text-center font-mono text-xs ${
                numAmount === p ? 'border-pu bg-puXlight text-pu' : 'border-ln text-mu hover:border-pu3'
              }`}
            >
              ${p.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mb-2 flex items-center gap-1 rounded-md border border-ln bg-card px-4 py-3">
          <span className="font-serif text-lg text-mu">$</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            placeholder="Custom amount"
            className="w-full bg-transparent font-serif text-lg text-tx outline-none"
          />
        </div>
        {amount && !canSubmit && (
          <p className="mb-4 font-sans text-xs text-da">Minimum commitment is ${MIN_AMOUNT.toLocaleString()}.</p>
        )}

        <p className="mb-6 mt-4 font-mono text-[9px] uppercase tracking-wider text-mu">
          A 5% platform fee is deducted from funds released to the founder — you are never charged a fee.
        </p>

        <GoldButton onClick={handleSubmit} disabled={!canSubmit || submitting}>
          {submitting ? 'Placing commitment…' : `Commit $${numAmount ? numAmount.toLocaleString() : '0'}`}
        </GoldButton>
      </main>
    </div>
  );
}
