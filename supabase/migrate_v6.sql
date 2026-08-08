-- Run once if your Supabase project already has the previous DKI Restotech tables.

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

alter table public.emergencies add column if not exists request_type text not null default 'EMERGENCY';
alter table public.emergencies add column if not exists priority text not null default 'URGENT';
alter table public.emergencies add column if not exists accepted_at timestamptz;
alter table public.emergencies add column if not exists assigned_team_id uuid references public.service_teams(id) on delete set null;
alter table public.emergencies add column if not exists assigned_team_name text;
alter table public.emergencies add column if not exists assigned_at timestamptz;
alter table public.emergencies add column if not exists access_instructions text;
alter table public.job_updates add column if not exists event_type text not null default 'NOTE';

alter table public.emergencies replica identity full;
alter table public.job_updates replica identity full;
alter table public.accounts replica identity full;
alter table public.service_teams replica identity full;

do $$ begin alter publication supabase_realtime add table public.emergencies; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.job_updates; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.accounts; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.service_teams; exception when duplicate_object then null; end $$;
