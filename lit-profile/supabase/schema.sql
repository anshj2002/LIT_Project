-- Enable useful extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =========================
-- 1) Security helpers
-- =========================
-- Admin users table: link to auth.users by uid
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Helper: check if current auth user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.admin_users a
    where a.user_id = auth.uid()
  );
$$;

-- =========================
-- 2) Core entities
-- =========================

-- Single student profile (you can support multiple in future)
create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  institution text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Skills (with endorsement count)
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  name text not null,
  level int check (level between 0 and 100) default 0,
  endorsements_count int not null default 0,
  category text, -- optional grouping
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_skills_student on public.skills(student_id);

-- Experience timeline
create table if not exists public.experiences (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  company text not null,
  role text not null,
  start_date date not null,
  end_date date, -- null = present
  description text,
  logo_url text,
  created_at timestamptz not null default now(),
  sort_order int default 0
);
create index if not exists idx_exp_student on public.experiences(student_id);

-- Interests (categorized tags)
create table if not exists public.interests (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  category text,
  tag text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_interests_student on public.interests(student_id);

-- Endorsements (reviewer profiles + ratings)
create table if not exists public.endorsements (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  reviewer_name text not null,
  reviewer_title text,
  reviewer_avatar_url text,
  rating int check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz not null default now()
);
create index if not exists idx_end_student on public.endorsements(student_id);

-- Competitions / EPICs
create table if not exists public.competitions (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  name text not null,
  org text,
  role text,
  start_date date,
  end_date date,
  achievement text,  -- e.g., rank, award
  description text,
  badge_url text,
  created_at timestamptz not null default now(),
  sort_order int default 0
);
create index if not exists idx_comp_student on public.competitions(student_id);

-- Feedback (text/audio/video)
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  kind text not null check (kind in ('text','audio','video')),
  text_content text,
  media_url text,
  created_at timestamptz not null default now()
);
create index if not exists idx_feedback_student on public.feedback(student_id);

-- Highlights (metrics/synergy indicators)
create table if not exists public.highlights (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  label text not null,
  value numeric,
  unit text,            -- %, pts, etc.
  trend text,           -- up/down/flat
  accent text,          -- optional color token/name
  created_at timestamptz not null default now(),
  sort_order int default 0
);
create index if not exists idx_highlights_student on public.highlights(student_id);

-- Media assets (if you want to associate miscellaneous files specifically)
create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  bucket text not null,
  path text not null,
  mime_type text,
  kind text,           -- avatar, badge, feedback-audio, etc.
  created_at timestamptz not null default now()
);

-- =========================
-- 3) Timestamps + counters
-- =========================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_students_touch on public.students;
create trigger trg_students_touch
before update on public.students
for each row execute procedure public.touch_updated_at();

drop trigger if exists trg_skills_touch on public.skills;
create trigger trg_skills_touch
before update on public.skills
for each row execute procedure public.touch_updated_at();

-- Optional helper to keep skills.endorsements_count in sync with endorsements table
-- If you later add a join table for per-skill endorsements, adjust this.

-- =========================
-- 4) Audit log (+ triggers on all content tables)
-- =========================
create table if not exists public.audit_logs (
  id bigserial primary key,
  table_name text not null,
  action text not null check (action in ('insert','update','delete')),
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  actor uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create or replace function public.audit_trigger()
returns trigger
language plpgsql
as $$
begin
  insert into public.audit_logs(table_name, action, record_id, old_data, new_data, actor)
  values (TG_TABLE_NAME,
          TG_OP::text,
          coalesce((case when TG_OP='DELETE' then old.id else new.id end), uuid_generate_v4()),
          to_jsonb(old),
          to_jsonb(new),
          auth.uid());
  if TG_OP = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- Attach to content tables
do $$
declare t text;
begin
  foreach t in array array['students','skills','experiences','interests','endorsements','competitions','feedback','highlights','media_assets']
  loop
    execute format('drop trigger if exists trg_audit_%I on public.%I;', t, t);
    execute format('create trigger trg_audit_%I after insert or update or delete on public.%I for each row execute procedure public.audit_trigger();', t, t);
  end loop;
end $$;

-- =========================
-- 5) RLS policies
-- =========================
alter table public.students enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.interests enable row level security;
alter table public.endorsements enable row level security;
alter table public.competitions enable row level security;
alter table public.feedback enable row level security;
alter table public.highlights enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.admin_users enable row level security;

-- Public READ (anon OK)
create policy "public read students" on public.students
for select using (true);
create policy "public read skills" on public.skills
for select using (true);
create policy "public read experiences" on public.experiences
for select using (true);
create policy "public read interests" on public.interests
for select using (true);
create policy "public read endorsements" on public.endorsements
for select using (true);
create policy "public read competitions" on public.competitions
for select using (true);
create policy "public read feedback" on public.feedback
for select using (true);
create policy "public read highlights" on public.highlights
for select using (true);
create policy "public read media_assets" on public.media_assets
for select using (true);

-- Admin full access
create policy "admins manage students" on public.students
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage skills" on public.skills
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage experiences" on public.experiences
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage interests" on public.interests
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage endorsements" on public.endorsements
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage competitions" on public.competitions
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage feedback" on public.feedback
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage highlights" on public.highlights
for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage media_assets" on public.media_assets
for all using (public.is_admin()) with check (public.is_admin());

-- Audit logs: admins read; inserts via triggers only
create policy "admins read audit" on public.audit_logs
for select using (public.is_admin());
