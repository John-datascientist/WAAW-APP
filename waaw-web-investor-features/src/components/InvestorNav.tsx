'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../lib/useInvestor';

const LINKS = [
  { href: '/startups', label: 'Startups' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/notifications', label: 'Notifications' },
];

export function InvestorNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { unread } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="border-b border-ln bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/startups" className="font-serif text-xl font-semibold italic text-pu">WAAW</Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <Link href="/startups" className={`hover:text-pu ${pathname?.startsWith('/startups') ? 'text-pu' : 'text-mu'}`}>
            Startups
          </Link>
          {user ? (
            <>
              {LINKS.slice(1).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative hover:text-pu ${pathname?.startsWith(l.href) ? 'text-pu' : 'text-mu'}`}
                >
                  {l.label}
                  {l.href === '/notifications' && unread > 0 && (
                    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ch px-1 text-[9px] text-tx">
                      {unread}
                    </span>
                  )}
                </Link>
              ))}
              <button type="button" onClick={handleSignOut} className="text-mu hover:text-da">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-mu hover:text-pu">Sign in</Link>
              <Link href="/signup?role=investor" className="text-pu">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
