-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text not null check (role in ('resident', 'official')),
  barangay text,
  phone text,
  created_at timestamptz default now()
);

-- Reports table
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  resident_id uuid references public.profiles(id) on delete set null,
  incident_type text not null check (incident_type in (
    'fire', 'medical', 'crime', 'flood', 'accident', 'disturbance', 'infrastructure', 'other'
  )),
  description text not null,
  photo_url text,
  latitude double precision,
  longitude double precision,
  address text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved')),
  official_notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reports_updated_at
  before update on public.reports
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.reports enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Officials can view all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'official')
  );

-- Reports policies
create policy "Residents can insert own reports"
  on public.reports for insert with check (auth.uid() = resident_id);

create policy "Residents can view own reports"
  on public.reports for select using (auth.uid() = resident_id);

create policy "Officials can view all reports"
  on public.reports for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'official')
  );

create policy "Officials can update reports"
  on public.reports for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'official')
  );

-- Storage bucket for report photos
insert into storage.buckets (id, name, public) values ('report-photos', 'report-photos', true);

create policy "Anyone can upload report photos"
  on storage.objects for insert with check (bucket_id = 'report-photos');

create policy "Anyone can view report photos"
  on storage.objects for select using (bucket_id = 'report-photos');