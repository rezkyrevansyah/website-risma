-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  email text, -- Optional, but good for quick lookup if needed
  avatar_url text, -- For future use
  website text, -- For future use

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- NOTE: Since we are creating the profile manually in our server action (to include username/fullname), 
-- we might NOT want this trigger if we do it manually. 
-- BUT, it's good practice to have a fallback. 
-- However, for this implementation, we will handle the INSERT in the `signup` action 
-- to ensure username/fullname are captured immediately.
-- So we will NOT add the trigger here to avoid conflicts, or we can make the trigger simple.

-- OPTIONAL: Trigger to handle new user signup if you weren't doing it manually
/*
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
*/
