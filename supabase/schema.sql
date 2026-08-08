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
  stage text not null default 'ACTIVE CLIENT',
  account_owner text,
  jobs_count integer not null default 0,
  revenue numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lead_name text,
  phone text,
  access_code text unique not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emergencies (
  id uuid primary key default gen_random_uuid(),
  public_token text unique not null,
  account_id uuid references public.accounts(id) on delete set null,
  account_name text,
  address text not null,
  phone text not null,
  unit text,
  note text,
  request_type text not null default 'EMERGENCY',
  source text not null default 'public',
  priority text not null default 'URGENT',
  status text not null default 'NEW REQUEST',
  accepted_by text,
  accepted_at timestamptz,
  assigned_team_id uuid references public.service_teams(id) on delete set null,
  assigned_team_name text,
  assigned_at timestamptz,
  access_instructions text,
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
  event_type text not null default 'NOTE',
  created_at timestamptz not null default now()
);

create index if not exists idx_emergencies_created on public.emergencies(created_at desc);
create index if not exists idx_emergencies_account on public.emergencies(account_id);
create index if not exists idx_emergencies_team on public.emergencies(assigned_team_id);
create index if not exists idx_updates_emergency on public.job_updates(emergency_id,created_at);
create index if not exists idx_accounts_client on public.accounts(client_number);
create index if not exists idx_team_access on public.service_teams(access_code);

alter table public.emergencies replica identity full;
alter table public.job_updates replica identity full;
alter table public.accounts replica identity full;
alter table public.service_teams replica identity full;

-- Enable Realtime for live dashboard communication.
do $$
begin
  alter publication supabase_realtime add table public.emergencies;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.job_updates;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.accounts;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.service_teams;
exception when duplicate_object then null;
end $$;

-- This starter uses server API routes for writes.
-- Add Supabase Auth + strict RLS before exposing real sensitive customer data broadly.
