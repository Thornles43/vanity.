create table public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  barcode text unique,
  name text not null,
  brand text,
  category text,
  image_url text,
  source text not null check (source in ('openbeautyfacts','user')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  catalog_id uuid not null references public.catalog_products(id),
  opened_on date not null,
  pao_months int not null check (pao_months between 1 and 60),
  notes text,
  created_at timestamptz not null default now()
);

create index vault_items_user_idx on public.vault_items(user_id);

alter table public.catalog_products enable row level security;
alter table public.vault_items enable row level security;

create policy "catalog read" on public.catalog_products
  for select to authenticated using (true);
create policy "catalog insert" on public.catalog_products
  for insert to authenticated with check (created_by = auth.uid());

create policy "vault select own" on public.vault_items
  for select to authenticated using (user_id = auth.uid());
create policy "vault insert own" on public.vault_items
  for insert to authenticated with check (user_id = auth.uid());
create policy "vault update own" on public.vault_items
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "vault delete own" on public.vault_items
  for delete to authenticated using (user_id = auth.uid());
