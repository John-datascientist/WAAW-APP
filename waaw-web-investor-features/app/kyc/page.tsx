'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { InvestorNav } from '../../src/components/InvestorNav';
import { ErrorBanner, Field, GoldButton } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

function KycForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState<'not_started' | 'pending' | 'verified' | 'rejected'>('not_started');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    if (profile) {
      setCountry(profile.country ?? '');
      setStatus((profile as any).kyc_status ?? 'not_started');
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!user || !country.trim()) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.from('waaw_profiles').update({ country: country.trim(), kyc_status: 'pending' }).eq('id', user.id);
    setSubmitting(false);
    if (error) { setError(error.message); return; }
    setStatus('pending');
  };

  // Real review takes time; this mirrors the mobile app's demo flow — there's
  // no third-party ID verification provider wired up on either platform yet.
  const handleCheckStatus = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from('waaw_profiles').update({ kyc_status: 'verified' }).eq('id', user.id);
    setSubmitting(false);
    if (error) { setError(error.message); return; }
    setStatus('verified');
    await supabase.from('waaw_notifications').insert({
      user_id: user.id,
      title: 'Identity verified',
      body: 'Your identity verification is complete. You can now commit capital.',
      type: 'kyc',
    });
  };

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-2 font-serif text-3xl text-tx">Identity verification</h1>
        <p className="mb-8 font-sans text-sm font-light leading-relaxed text-mu">
          WAAW requires identity verification (KYC) before you can commit capital to a startup.
        </p>

        <ErrorBanner message={error} />

        {status === 'verified' ? (
          <div className="rounded-md border border-suBorder bg-suLight p-4">
            <p className="mb-3 font-sans text-sm text-su">✓ Your identity is verified. You&apos;re ready to invest.</p>
            <GoldButton onClick={() => router.push(returnTo || '/startups')}>Continue</GoldButton>
          </div>
        ) : status === 'pending' ? (
          <div className="rounded-md border border-warnBorder bg-warnLight p-4">
            <p className="mb-3 font-sans text-sm text-warn">Your verification is pending review.</p>
            <GoldButton onClick={handleCheckStatus} disabled={submitting}>{submitting ? 'Checking…' : 'Check status'}</GoldButton>
          </div>
        ) : (
          <>
            <Field label="Country of residence" value={country} onChange={setCountry} placeholder="Nigeria" />
            <GoldButton onClick={handleSubmit} disabled={submitting || !country.trim()}>
              {submitting ? 'Submitting…' : 'Start verification'}
            </GoldButton>
          </>
        )}
      </main>
    </div>
  );
}

export default function KycPage() {
  return (
    <Suspense fallback={null}>
      <KycForm />
    </Suspense>
  );
}
