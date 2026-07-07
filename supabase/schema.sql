-- ============================================================================
-- ClientVault — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- clients
-- ----------------------------------------------------------------------------
create table if not exists public.clients (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  company_name   text not null,
  contact_person text,
  phone_number   text,
  email          text,
  website_url    text,
  address        text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists clients_user_id_idx on public.clients(user_id);
create index if not exists clients_company_name_idx on public.clients(lower(company_name));

-- ----------------------------------------------------------------------------
-- credentials
-- One generic table covers every fixed category (website, wordpress, hosting,
-- domain, business_email, gmail, facebook, instagram, linkedin, twitter,
-- youtube, whatsapp_business, meta_business_manager, google_analytics,
-- google_search_console, google_tag_manager, google_ads,
-- google_business_profile, canva, chatgpt) plus unlimited 'custom' entries.
--
-- Only the columns relevant to a given category are populated; the rest stay
-- null. `title` is reused as a free-text label: "Hosting Provider" for
-- hosting, "Registrar" for domain, or the entry name for custom accounts.
-- ----------------------------------------------------------------------------
create table if not exists public.credentials (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  client_id     uuid not null references public.clients(id) on delete cascade,
  category      text not null,
  title         text,
  website_url   text,
  login_url     text,
  username      text,
  email         text,
  password      text,
  phone_number  text,
  pin           text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint credentials_category_check check (
    category in (
      'website', 'wordpress', 'hosting', 'domain',
      'business_email', 'gmail',
      'facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp_business',
      'meta_business_manager',
      'google_analytics', 'google_search_console', 'google_tag_manager', 'google_ads', 'google_business_profile',
      'canva', 'chatgpt', 'custom'
    )
  )
);

create index if not exists credentials_client_id_idx on public.credentials(client_id);
create index if not exists credentials_user_id_idx on public.credentials(user_id);

-- Only one row per (client, category) for every FIXED category.
-- 'custom' is exempt so a client can have unlimited custom accounts.
create unique index if not exists credentials_client_category_unique
  on public.credentials(client_id, category)
  where category <> 'custom';

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists credentials_set_updated_at on public.credentials;
create trigger credentials_set_updated_at
  before update on public.credentials
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Each row is only visible to / editable by the user_id that owns it, i.e.
-- the admin account that created it. Since this app has a single admin
-- account, this simply scopes every query to that account and blocks
-- anonymous or cross-account access.
-- ----------------------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.credentials enable row level security;

drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own" on public.clients
  for select using (auth.uid() = user_id);

drop policy if exists "clients_insert_own" on public.clients;
create policy "clients_insert_own" on public.clients
  for insert with check (auth.uid() = user_id);

drop policy if exists "clients_update_own" on public.clients;
create policy "clients_update_own" on public.clients
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clients_delete_own" on public.clients;
create policy "clients_delete_own" on public.clients
  for delete using (auth.uid() = user_id);

drop policy if exists "credentials_select_own" on public.credentials;
create policy "credentials_select_own" on public.credentials
  for select using (auth.uid() = user_id);

drop policy if exists "credentials_insert_own" on public.credentials;
create policy "credentials_insert_own" on public.credentials
  for insert with check (auth.uid() = user_id);

drop policy if exists "credentials_update_own" on public.credentials;
create policy "credentials_update_own" on public.credentials
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "credentials_delete_own" on public.credentials;
create policy "credentials_delete_own" on public.credentials
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- Done. Next steps:
-- 1. Authentication → Settings → disable "Enable email signups" if you want
--    to prevent anyone else from self-registering, then create your one
--    admin account under Authentication → Users → Add user.
-- 2. Copy your Project URL and anon public key into the app's .env file.
-- ============================================================================
