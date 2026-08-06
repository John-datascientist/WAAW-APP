'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { InvestorNav } from '../../src/components/InvestorNav';
import { Divider, ErrorBanner, Field, GoldButton } from '../../src/components/ui';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [referredCount, setReferredCount] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);

  useEffect(() => {
    if (!profile?.referral_code) return;
    supabase
      .from('waaw_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', profile.referral_code)
      .then(({ count }) => setReferredCount(count ?? 0));
  }, [profile?.referral_code]);

  if (!profile) {
    return (
      <div>
        <InvestorNav />
        <main className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="mb-4 font-sans text-sm text-mu">Sign in to view your account.</p>
          <Link href="/signin" className="font-mono text-xs uppercase tracking-wider text-pu">Sign in →</Link>
        </main>
      </div>
    );
  }

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSaved(false);
    if (newPassword.length < 8) { setPasswordError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { setPasswordError(error.message); return; }
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSaved(true);
  };

  const handleCopyReferral = async () => {
    if (!profile.referral_code) return;
    try {
      await navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleRequestExport = async () => {
    if (!user) return;
    await supabase.from('waaw_notifications').insert({
      user_id: user.id,
      title: 'Data export requested',
      body: 'Your GDPR/NDPA data export request has been received. You will receive an email within 30 days.',
      type: 'general',
    });
    setExportRequested(true);
  };

  return (
    <div>
      <InvestorNav />
      <main className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-2 font-serif text-3xl text-tx">Account</h1>
        <p className="mb-8 font-sans text-sm font-light text-mu">Manage your profile, security, and data.</p>

        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Profile</p>
        <div className="mb-6 rounded-md border border-ln bg-card p-4">
          <p className="font-sans text-sm text-tx">{profile.full_name || '—'}</p>
          <p className="font-mono text-xs text-mu">{profile.email}</p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-mu">
            {profile.role} · {profile.country || 'No country set'}
          </p>
        </div>

        <Divider />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Referral code</p>
        <div className="mb-6 flex items-center justify-between rounded-md border border-ln bg-card p-4">
          <div>
            <p className="font-mono text-sm text-pu">{profile.referral_code || '—'}</p>
            <p className="mt-1 font-sans text-xs font-light text-mu">{referredCount} signup{referredCount === 1 ? '' : 's'} referred</p>
          </div>
          <button type="button" onClick={handleCopyReferral} className="font-mono text-[10px] uppercase tracking-wider text-pu">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <Divider />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Change password</p>
        <ErrorBanner message={passwordError} />
        {passwordSaved && <p className="mb-4 font-sans text-xs text-su">✓ Password updated.</p>}
        <Field label="New password" value={newPassword} onChange={setNewPassword} placeholder="At least 8 characters" type="password" />
        <Field label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat password" type="password" />
        <GoldButton onClick={handleChangePassword} disabled={savingPassword || !newPassword}>
          {savingPassword ? 'Updating…' : 'Update password'}
        </GoldButton>

        <Divider />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-mu">Your data</p>
        {exportRequested ? (
          <p className="font-sans text-xs text-su">✓ Export requested — you&apos;ll receive an email within 30 days.</p>
        ) : (
          <button type="button" onClick={handleRequestExport} className="rounded-md border border-ln px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-mu hover:border-pu3">
            Request GDPR/NDPA data export
          </button>
        )}
      </main>
    </div>
  );
}
