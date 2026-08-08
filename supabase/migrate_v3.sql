-- Run this in Supabase SQL Editor if you already deployed a previous RESTOTECH schema.

alter table public.accounts
  add column if not exists client_number text;

alter table public.emergencies
  add column if not exists public_token text;

update public.accounts
set client_number = 'RT-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))
where client_number is null;

update public.emergencies
set public_token = replace(gen_random_uuid()::text,'-','')
where public_token is null;

alter table public.accounts
  alter column client_number set not null;

alter table public.emergencies
  alter column public_token set not null;

create unique index if not exists accounts_client_number_unique on public.accounts(client_number);
create unique index if not exists emergencies_public_token_unique on public.emergencies(public_token);
