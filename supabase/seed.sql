-- ─── WAAW Seed Data (optional) ───────────────────────────────────────────────
-- Run this AFTER schema.sql, in the same SQL Editor. It inserts the same
-- three example startups the app previously showed as mock data, as real
-- rows in waaw_startups (with founder_id left null — no owning account yet).
-- Skip this file entirely if you'd rather start with a genuinely empty
-- marketplace and only real founder sign-ups.

insert into public.waaw_startups
  (name, slug, sector, stage, country, city, pitch, raising_amount, raised_amount,
   equity_pct, post_money_valuation, verified, fraud_score, founder_name, founder_bio, tags, boost_active)
values
  (
    'FarmLink Africa', 'farmlink-africa', 'AgriTech', 'Seed', 'Nigeria', 'Lagos',
    'Cold-chain logistics connecting 1,200 smallholder farmers to urban markets, reducing post-harvest loss by 40%.',
    350000, 147000, 8, 4375000, true, 0,
    'Adaeze Okonkwo',
    'Former Unilever supply chain lead with 10 years in West African logistics. Built and exited a B2B e-commerce platform in 2019.',
    array['B2B', 'Revenue generating', 'Female founder'], false
  ),
  (
    'PayBridge West Africa', 'paybridge-west-africa', 'FinTech', 'Pre-Series A', 'Ghana', 'Accra',
    'B2B payments infrastructure enabling West African SMEs to accept cross-border payments without a bank account.',
    600000, 108000, 10, 6000000, true, 0,
    'Kwame Mensah',
    'Ex-Flutterwave product manager. MSc Computer Science from UCL. 340% YoY GMV growth in 18 months.',
    array['B2B', 'Revenue generating', 'Infrastructure'], false
  ),
  (
    'CareLink East Africa', 'carelink-east-africa', 'HealthTech', 'Seed', 'Kenya', 'Nairobi',
    'Telemedicine platform serving underserved East African communities. Integrated with NHIF for insurance billing.',
    450000, 27000, 12, 3750000, false, 0,
    'Ngozi Eze',
    'Qualified physician with 8 years in public health. 8,000 patient consultations delivered to date.',
    array['B2C', 'Pre-revenue', 'Impact'], false
  );

-- Co-founders for the above (matched by startup name — fine for a one-time seed).
insert into public.waaw_cofounders (startup_id, name, role, id_verified, on_registration_docs)
select id, 'Adaeze Okonkwo', 'Co-founder / CEO', true, true from public.waaw_startups where slug = 'farmlink-africa'
union all
select id, 'Bayo Adeyemi', 'Co-founder / COO', true, true from public.waaw_startups where slug = 'farmlink-africa'
union all
select id, 'Kwame Mensah', 'Co-founder / CEO', true, true from public.waaw_startups where slug = 'paybridge-west-africa'
union all
select id, 'Efua Asante', 'Co-founder / CTO', true, true from public.waaw_startups where slug = 'paybridge-west-africa'
union all
select id, 'Ngozi Eze', 'Co-founder / CEO', true, true from public.waaw_startups where slug = 'carelink-east-africa'
union all
select id, 'Otieno Odhiambo', 'Co-founder / Medical Director', true, true from public.waaw_startups where slug = 'carelink-east-africa';
