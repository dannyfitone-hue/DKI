create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  client_number text unique not null,
  name text not null,
  property_name text,
  address text,
  manager_name text,
  phone text,
  email text,
  units integer,
  stage text not null default 'NEW PROSPECT',
  account_owner text,
  jobs_count integer not null default 0,
  revenue numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  name text,
  address text not null,
  phone text,
  unit_count integer,
  gate_code text,
  access_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.emergencies (
  id uuid primary key default gen_random_uuid(),
  public_token text unique not null,
  account_id uuid references public.accounts(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  account_name text,
  address text not null,
  phone text not null,
  unit text,
  note text,
  source text not null default 'public',
  status text not null default 'NEW REQUEST',
  accepted_by text,
  damage_amount numeric,
  damage_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_updates (
  id uuid primary key default gen_random_uuid(),
  emergency_id uuid references public.emergencies(id) on delete cascade,
  message text not null,
  visible_to_client boolean not null default true,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.account_activity (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  activity_type text not null,
  note text,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists idx_emergencies_created_at on public.emergencies(created_at desc);
create index if not exists idx_emergencies_status on public.emergencies(status);
create index if not exists idx_emergencies_public_token on public.emergencies(public_token);
create index if not exists idx_accounts_stage on public.accounts(stage);
create index if not exists idx_accounts_client_number on public.accounts(client_number);
create index if not exists idx_updates_emergency on public.job_updates(emergency_id,created_at);

-- IMPORTANT:
-- Existing databases created from an earlier RESTOTECH schema need the migration below
-- rather than re-running only CREATE TABLE IF NOT EXISTS.
