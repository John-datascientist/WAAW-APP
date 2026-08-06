import Link from 'next/link';
import { GoldButton, GhostButton } from '../src/components/ui';

export default function LandingPage() {
  return (
    <main>
      {/* Hero — purple, matching the app's header/CTA branding */}
      <div className="bg-pu">
        <header className="px-6 py-5">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <span className="font-serif text-2xl font-semibold italic text-white">WAAW</span>
            <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-puLight">
              <Link href="/startups" className="hover:text-white">Browse startups</Link>
              <Link href="/legal/terms" className="hover:text-white">Legal</Link>
              <Link href="/signin" className="hover:text-white">Sign in</Link>
            </nav>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 pb-24 pt-8 text-center">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ch2">We Are All We&apos;ve Got</p>
          <h1 className="mb-6 font-serif text-4xl italic leading-tight text-white sm:text-5xl">
            Imagine owning 0.01% of the next Flutterwave, Paystack, or Chipper Cash — before the world caught on.
          </h1>
          <p className="mx-auto mb-10 max-w-xl font-sans text-base font-light leading-relaxed text-puLight">
            WAAW connects Black diaspora investors with verified, early-stage Black-founded startups.
            Every deal is reviewed before it appears on the platform, and every commitment moves
            through protected escrow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GoldButton href="/startups">Browse startups</GoldButton>
            <GhostButton href="/signup" inverted>Register your startup</GhostButton>
          </div>
        </section>
      </div>

      <section className="border-b border-ln bg-card px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-pu">For investors</p>
            <p className="font-sans text-sm font-light leading-relaxed text-mu">
              Browse verified deals, commit capital through protected escrow, and track your
              portfolio — right here on the website, or in the WAAW mobile app.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-pu">For founders</p>
            <p className="font-sans text-sm font-light leading-relaxed text-mu">
              Register and complete onboarding here on the website — business details, co-founder
              verification, documents, and your founder interview.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-pu">After verification</p>
            <p className="font-sans text-sm font-light leading-relaxed text-mu">
              Once a founder&apos;s onboarding is reviewed and verified, they can switch to the
              mobile app to monitor their listing, activity, and raise progress.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-mu">
          <span>© {new Date().getFullYear()} Workerholics Solutions Limited</span>
          <div className="flex gap-5">
            <Link href="/legal/terms" className="hover:text-pu">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-pu">Privacy</Link>
            <Link href="/legal/escrow-terms" className="hover:text-pu">Escrow</Link>
            <Link href="/legal/commission-terms" className="hover:text-pu">Commission</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
