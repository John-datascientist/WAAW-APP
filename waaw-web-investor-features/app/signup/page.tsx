'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { clearDraft, loadDraft, saveDraft } from '../../src/lib/formDraft';
import { Field, GoldButton } from '../../src/components/ui';

const DRAFT_KEY = 'signup';
interface SignupDraft { name: string; email: string; country: string; role: 'investor' | 'founder' }

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Strength = 'weak' | 'fair' | 'good' | 'strong';

function passwordStrength(pw: string): Strength | null {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score <= 4) return 'good';
  return 'strong';
}

const STRENGTH_META: Record<Strength, { label: string; color: string; pct: number }> = {
  weak: { label: 'Weak', color: '#dc2626', pct: 25 },
  fair: { label: 'Fair', color: '#d97706', pct: 50 },
  good: { label: 'Good', color: '#65a30d', pct: 75 },
  strong: { label: 'Strong', color: '#16a34a', pct: 100 },
};

const PASSWORD_REQUIREMENTS: { id: string; label: string; test: (pw: string) => boolean }[] = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /\d/.test(pw) },
];

function RoleTabs({ role, onChange }: { role: 'investor' | 'founder'; onChange: (r: 'investor' | 'founder') => void }) {
  const tab = (r: 'investor' | 'founder', label: string) => (
    <button
      type="button"
      onClick={() => onChange(r)}
      className={`flex-1 rounded-md border px-4 py-3 text-center font-mono text-xs uppercase tracking-wider transition-colors ${
        role === r ? 'border-pu bg-puXlight text-pu' : 'border-ln text-mu hover:border-pu3'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="mb-8 flex gap-3">
      {tab('investor', 'I want to invest')}
      {tab('founder', "I'm a founder")}
    </div>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();
  const draft = useRef(loadDraft<SignupDraft>(DRAFT_KEY)).current;
  const initialRole = searchParams.get('role') === 'founder' ? 'founder' : draft.role ?? 'investor';
  const [role, setRole] = useState<'investor' | 'founder'>(initialRole);
  const [name, setName] = useState(draft.name ?? '');
  const [email, setEmail] = useState(draft.email ?? '');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(draft.country ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const strength = passwordStrength(password);

  // Password is deliberately never persisted here — everything else is,
  // so a refresh mid-signup doesn't lose what's usually the longest field.
  useEffect(() => {
    saveDraft(DRAFT_KEY, { name, email, country, role });
  }, [name, email, country, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter your full name.';
    if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (!country.trim()) next.country = 'Enter your country.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const { error, needsVerification } = await signUp(email.trim(), password, name.trim(), country.trim(), role);
    setSubmitting(false);
    if (error) { setErrors({ email: error }); return; }
    clearDraft(DRAFT_KEY);
    // If "Confirm email" is off in Supabase, sign-up already returned a live
    // session — there's no code to enter, so go straight to the right home.
    const dest = role === 'investor' ? '/startups' : '/onboarding';
    router.push(
      needsVerification
        ? `/verify?email=${encodeURIComponent(email.trim())}&role=${role}`
        : dest
    );
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <Link href="/" className="mb-8 inline-block font-mono text-xs uppercase tracking-wider text-mu hover:text-pu">
        ← WAAW
      </Link>
      <h1 className="mb-2 font-serif text-3xl text-tx">
        {role === 'investor' ? 'Create your investor account' : 'Register your startup'}
      </h1>
      <p className="mb-6 font-sans text-sm font-light leading-relaxed text-mu">
        {role === 'investor'
          ? 'Browse verified deals, commit capital through protected escrow, and track your portfolio.'
          : 'Create your founder account, then complete onboarding — business details, co-founder verification, documents, and your founder interview.'}
      </p>

      <RoleTabs role={role} onChange={setRole} />

      <form onSubmit={handleSubmit}>
        <Field label="Full name" value={name} onChange={setName} placeholder="Ada Lovelace" error={errors.name} />
        <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" error={errors.email} />
        <Field label="Password" value={password} onChange={setPassword} placeholder="At least 8 characters" type="password" error={errors.password} />
        {strength && (
          <div className="-mt-3 mb-5">
            <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-ln">
              <div
                className="h-1 rounded-full transition-all"
                style={{ width: `${STRENGTH_META[strength].pct}%`, backgroundColor: STRENGTH_META[strength].color }}
              />
            </div>
            <ul className="space-y-1">
              {PASSWORD_REQUIREMENTS.map((r) => {
                const met = r.test(password);
                return (
                  <li key={r.id} className={`font-mono text-[10px] ${met ? 'text-su' : 'text-mu'}`}>
                    {met ? '✓' : '○'} {r.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <Field label="Country" value={country} onChange={setCountry} placeholder="Nigeria" error={errors.country} />

        <GoldButton type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </GoldButton>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-mu">
        Already registered?{' '}
        <Link href="/signin" className="text-pu hover:underline">Sign in</Link>
      </p>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
