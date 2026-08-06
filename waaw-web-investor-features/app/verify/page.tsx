'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { Field, GoldButton, GhostButton } from '../../src/components/ui';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const role = searchParams.get('role') === 'investor' ? 'investor' : 'founder';
  const { verifySignup, resendSignupCode } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Missing email — go back and sign up again.'); return; }
    setSubmitting(true);
    const { error } = await verifySignup(email, code.trim());
    setSubmitting(false);
    if (error) { setError(error); return; }
    router.push(role === 'investor' ? '/startups' : '/onboarding');
  };

  const handleResend = async () => {
    if (!email) return;
    await resendSignupCode(email);
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <Link href="/" className="mb-8 inline-block font-mono text-xs uppercase tracking-wider text-mu hover:text-pu">
        ← WAAW
      </Link>
      <h1 className="mb-2 font-serif text-3xl text-tx">Verify your email</h1>
      <p className="mb-8 font-sans text-sm font-light leading-relaxed text-mu">
        Enter the 6-digit code we sent to <strong>{email || 'your email'}</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        <Field label="Verification code" value={code} onChange={setCode} placeholder="123456" error={error ?? undefined} />
        <GoldButton type="submit" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Verify email'}
        </GoldButton>
      </form>

      <div className="mt-6 text-center">
        <GhostButton onClick={handleResend}>{resent ? 'Code resent!' : 'Resend code'}</GhostButton>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
