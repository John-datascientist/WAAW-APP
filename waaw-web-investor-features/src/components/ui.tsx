'use client';

import Link from 'next/link';
import React from 'react';

export function GoldButton({
  children,
  onClick,
  type = 'button',
  disabled,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  href?: string;
}) {
  const cls =
    'inline-flex items-center justify-center rounded-md bg-ch px-6 py-3 font-mono text-xs uppercase tracking-wider text-tx transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed';
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  href,
  inverted,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  /** Use on dark (e.g. purple hero) backgrounds instead of the default light-surface style. */
  inverted?: boolean;
}) {
  const cls = inverted
    ? 'inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/10'
    : 'inline-flex items-center justify-center rounded-md border border-ln px-6 py-3 font-mono text-xs uppercase tracking-wider text-mu transition-colors hover:border-pu hover:text-pu';
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  maxLength?: number;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-mu">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full rounded-md border bg-card px-4 py-3 font-sans text-sm text-tx outline-none focus:border-pu ${
          error ? 'border-da' : 'border-ln'
        }`}
      />
      {maxLength ? <p className="mt-1 text-right font-mono text-[9px] text-mu">{value.length}/{maxLength}</p> : null}
      {error ? <p className="mt-1 font-sans text-xs text-da">{error}</p> : null}
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-mu">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-md border bg-card px-4 py-3 font-sans text-sm text-tx outline-none focus:border-pu ${
          error ? 'border-da' : 'border-ln'
        }`}
      />
      {error ? <p className="mt-1 font-sans text-xs text-da">{error}</p> : null}
    </div>
  );
}

export function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-3 py-2 font-mono text-xs transition-colors ${
        active ? 'border-pu bg-puXlight text-pu' : 'border-ln text-mu hover:border-pu3'
      }`}
    >
      {label}
    </button>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-deeper">
      <div className="h-1.5 rounded-full bg-ch transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-ln bg-card p-6">{children}</div>;
}

export function StepFooter({
  backHref,
  onContinue,
  continueLabel = 'Continue',
  disabled,
}: {
  backHref?: string;
  onContinue: () => void;
  continueLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {backHref ? <GhostButton href={backHref}>Back</GhostButton> : <span />}
      <GoldButton onClick={onContinue} disabled={disabled}>{continueLabel}</GoldButton>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-md border border-daBorder bg-daLight px-4 py-3 font-sans text-xs text-da">
      {message}
    </div>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${
        verified ? 'bg-pu text-white' : 'bg-ln text-mu'
      }`}
    >
      {verified ? 'Verified' : 'Pending'}
    </span>
  );
}

export function Divider() {
  return <div className="my-5 h-px bg-ln" />;
}

export function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md text-center">
        <h1 className="mb-3 font-serif text-2xl text-da">Configuration error</h1>
        <p className="font-sans text-sm leading-relaxed text-mu">
          NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing at build time.
          Check that both are set for the Production environment in Vercel, then trigger a fresh
          deploy.
        </p>
      </div>
    </div>
  );
}
