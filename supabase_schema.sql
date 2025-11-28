-- Enable PostGIS
create extension if not exists postgis;

-- Create Enums
create type category_type as enum (
  'government', 'business', 'organization', 'social_worker', 
  'housing', 'volunteer', 'supplies', 'help_request', 'medical'
);

create type post_status as enum ('open', 'closed');

-- Create Profiles Table (Linked to Auth Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin', 'verified_org')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Posts Table
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category category_type not null,
  location_text text not null,
  location_geo geography(Point, 4326),
  status post_status default 'open',
  is_verified boolean default false,
  urgent boolean default false,
  contact text,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Profiles: Everyone can read basic profile info (if needed), User can update own
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Posts: 
alter table posts enable row level security;

-- 1. Public Read
create policy "Posts are viewable by everyone." on posts for select using (true);

-- 2. Authenticated Create (General Users can create 'help_request', 'volunteer', 'supplies')
create policy "Authenticated users can create help/volunteer posts" on posts for insert 
with check (
  auth.role() = 'authenticated' and 
  category in ('help_request', 'volunteer', 'supplies')
);

-- 3. Admin/Org Create (Can create any category)
create policy "Admins and Orgs can create any post" on posts for insert
with check (
  exists (
    select 1 from profiles 
    where profiles.id = auth.uid() 
    and profiles.role in ('admin', 'verified_org')
  )
);

-- 4. Admin Update (Admins can edit/close/delete any post)
create policy "Admins can update any post" on posts for update
using (
  exists (
    select 1 from profiles 
    where profiles.id = auth.uid() 
    and profiles.role = 'admin'
  )
);

create policy "Admins can delete any post" on posts for delete
using (
  exists (
    select 1 from profiles 
    where profiles.id = auth.uid() 
    and profiles.role = 'admin'
  )
);

-- 5. Users can update their own posts
create policy "Users can update own posts" on posts for update
using (auth.uid() = user_id);

-- Functions to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

