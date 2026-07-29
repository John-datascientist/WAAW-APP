import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  startup: any;
  notFound?: boolean;
}

export default function PublicFounderProfile({ startup, notFound }: Props) {
  if (notFound || !startup) {
    return (
      <div style={{ fontFamily: 'sans-serif', padding: 40, textAlign: 'center' }}>
        <h1>Startup not found</h1>
        <p>This profile may have been removed or the link is incorrect.</p>
        <a href="https://waaw.co">Return to WAAW</a>
      </div>
    );
  }

  const pct = Math.round((startup.raised_amount / startup.raising_amount) * 100);

  return (
    <>
      <Head>
        <title>{startup.name} — Raising on WAAW</title>
        <meta name="description" content={startup.pitch} />
        {/* Open Graph — makes WhatsApp and LinkedIn previews look good */}
        <meta property="og:title" content={`${startup.name} is raising on WAAW`} />
        <meta property="og:description" content={startup.pitch} />
        <meta property="og:url" content={`https://waaw.co/p/${startup.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="WAAW — We Are All We've Got" />
        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${startup.name} is raising on WAAW`} />
        <meta name="twitter:description" content={startup.pitch} />
      </Head>

      <div style={{ maxWidth: 560, margin: '0 auto', fontFamily: "'Inter', sans-serif", padding: '0 20px 60px' }}>
        {/* Header */}
        <div style={{ background: '#3d1f7a', padding: '16px 20px', margin: '0 -20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, fontStyle: 'italic', color: '#fff' }}>WAAW</div>
          <a href="https://waaw.co/signup?role=investor" style={{ background: '#c9a84c', color: '#1a1228', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            Join to invest →
          </a>
        </div>

        {/* Verified badge */}
        <div style={{ marginBottom: 12 }}>
          {startup.verified
            ? <span style={{ background: '#3d1f7a', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>✓ VERIFIED</span>
            : <span style={{ background: '#e5e7eb', color: '#6b7280', padding: '3px 10px', borderRadius: 20, fontSize: 11 }}>PENDING VERIFICATION</span>
          }
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', marginLeft: 8 }}>
            {startup.sector} · {startup.stage}
          </span>
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 600, color: '#1a1228', marginBottom: 6, lineHeight: 1.15 }}>
          {startup.name}
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
          {startup.city}, {startup.country}
        </p>
        <p style={{ fontSize: 15, color: '#1a1228', lineHeight: 1.7, marginBottom: 24 }}>
          {startup.pitch}
        </p>

        {/* Raise stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[['Raising', `$${(startup.raising_amount / 1000).toFixed(0)}K`], ['Equity', startup.equity_pct + '%'], ['Filled', pct + '%']].map(([l, v]) => (
            <div key={l} style={{ border: '1.5px solid #e0d9f0', borderRadius: 12, padding: 14, textAlign: 'center', background: '#fff' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, color: '#3d1f7a' }}>{v}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: '#e0d9f0', borderRadius: 3, marginBottom: 8 }}>
          <div style={{ height: 6, background: 'linear-gradient(90deg, #3d1f7a, #7c4fd4)', borderRadius: 3, width: `${pct}%` }} />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', marginBottom: 24 }}>
          ${startup.raised_amount.toLocaleString()} raised of ${startup.raising_amount.toLocaleString()}
        </p>

        {/* Co-founders */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a1228', marginBottom: 14 }}>Co-founding team</h2>
        <div style={{ marginBottom: 12, padding: '10px 0', borderBottom: '1.5px solid #e0d9f0' }}>
          <strong style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: '#1a1228' }}>{startup.founder_name}</strong>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#3d1f7a', background: '#ede8f9', padding: '2px 6px', borderRadius: 5, marginLeft: 8 }}>CEO</span>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '5px 0 0', lineHeight: 1.5, fontWeight: 300 }}>{startup.founder_bio}</p>
        </div>
        {(startup.cofounders || []).map((cf: any) => (
          <div key={cf.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1.5px solid #e0d9f0' }}>
            <div>
              <strong style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: '#1a1228' }}>{cf.name}</strong>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6b7280', textTransform: 'uppercase', marginTop: 2 }}>{cf.role}</div>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a6e3c', background: '#f0fdf4', padding: '2px 8px', borderRadius: 6, border: '1px solid #bbf7d0', fontWeight: 600 }}>
              ✓ On reg. docs
            </span>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: '#ede8f9', border: '2px solid #7c4fd4', borderRadius: 16, padding: 24, textAlign: 'center', marginTop: 28 }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a1228', marginBottom: 8 }}>Interested in investing?</h3>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 20, fontWeight: 300 }}>
            Create a free WAAW investor account to show interest and commit capital through protected escrow. WAAW charges a 5% platform fee on total funds raised, deducted from startup proceeds only.
          </p>
          <a href={`https://waaw.co/signup?role=investor&startup=${startup.id}`}
            style={{ display: 'block', background: '#3d1f7a', color: '#fff', padding: '14px 20px', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            Sign up as an investor
          </a>
          <a href="https://waaw.co/login"
            style={{ display: 'block', background: 'none', color: '#3d1f7a', padding: '12px 20px', borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '2px solid #3d1f7a' }}>
            Already have an account? Sign in
          </a>
        </div>

        <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#a29e97', textAlign: 'center', marginTop: 20, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          This profile was shared via WAAW. WAAW charges 5% of total funds raised, deducted from startup proceeds at escrow release. Capital at risk. Investments are illiquid.
        </p>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const { data: startup } = await supabase
    .from('startups')
    .select(`*, cofounders(*)`)
    .eq('slug', slug)
    .single();

  if (!startup) return { props: { startup: null, notFound: true } };
  return { props: { startup } };
};
