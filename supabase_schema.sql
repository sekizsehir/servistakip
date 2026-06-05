-- ═══════════════════════════════════════════════════════════════
-- G SERVİS TAKİP — Supabase PostgreSQL Schema
-- Önce: pnpm add @supabase/supabase-js
-- Sonra: src/lib/db.js'i async Supabase versiyonuyla değiştirin
-- ═══════════════════════════════════════════════════════════════

-- Uzantılar
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- Tam metin arama için

-- ─── 1. customers ─────────────────────────────────────────────
create table if not exists customers (
  id          bigserial primary key,
  name        text        not null,
  phone       text,
  email       text,
  address     text,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index idx_customers_name  on customers using gin (name gin_trgm_ops);
create index idx_customers_phone on customers (phone);

-- ─── 2. services ──────────────────────────────────────────────
create table if not exists services (
  id               bigserial primary key,
  customer_id      bigint references customers(id) on delete set null,
  device_type      text        not null,
  brand            text,
  model            text,
  imei             text,
  color            text,
  memory           text,
  battery_health   int         check (battery_health between 0 and 100),
  fault            text,
  pin              text,
  accessories      text[]      default '{}',
  price            numeric(10,2) default 0,
  material_cost    numeric(10,2) default 0,
  prepaid          numeric(10,2) default 0,
  status           text        not null default 'Beklemede'
                   check (status in ('Randevu','Beklemede','Tamirde','Hazır','Teslim Edildi','İade')),
  technician       text,
  technician_note  text,
  estimated_date   date,
  image_url        text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index idx_services_customer    on services (customer_id);
create index idx_services_status      on services (status);
create index idx_services_created     on services (created_at desc);

-- ─── 3. stock_items ───────────────────────────────────────────
create table if not exists stock_items (
  id           bigserial primary key,
  name         text          not null,
  brand        text,
  model        text,
  category     text,
  quantity     int           not null default 0 check (quantity >= 0),
  buy_price    numeric(10,2) not null default 0,
  sell_price   numeric(10,2) not null default 0,
  barcode      text,
  image_url    text,
  created_at   timestamptz   default now(),
  updated_at   timestamptz   default now()
);

create index idx_stock_category on stock_items (category);
create index idx_stock_barcode  on stock_items (barcode);

-- ─── 4. device_records (ikinci el) ────────────────────────────
create table if not exists device_records (
  id                  bigserial primary key,
  device_type         text          not null,
  brand               text,
  model               text,
  imei                text,
  color               text,
  memory              text,
  battery_health      int           check (battery_health between 0 and 100),
  transaction_type    text          not null
                      check (transaction_type in ('Alındı','Satıldı','Depoda')),
  buy_price           numeric(10,2) not null default 0,
  sell_price          numeric(10,2),
  person_name         text,
  phone               text,
  date                date          not null default current_date,
  sale_date           date,
  sale_person_name    text,
  image_url           text,
  notes               text,
  created_at          timestamptz   default now(),
  updated_at          timestamptz   default now()
);

create index idx_device_type on device_records (transaction_type);
create index idx_device_date on device_records (date desc);

-- ─── 5. tasks ─────────────────────────────────────────────────
create table if not exists tasks (
  id           bigserial primary key,
  title        text          not null,
  due_date     date,
  due_time     time,
  priority     text          default 'orta'
               check (priority in ('acil','yuksek','orta','dusuk')),
  tags         text[]        default '{}',
  is_completed boolean       default false,
  created_at   timestamptz   default now(),
  updated_at   timestamptz   default now()
);

create index idx_tasks_due      on tasks (due_date);
create index idx_tasks_priority on tasks (priority);
create index idx_tasks_completed on tasks (is_completed);

-- ─── 6. cari_customers ────────────────────────────────────────
create table if not exists cari_customers (
  id           bigserial primary key,
  name         text    not null,
  phone        text,
  total_debt   numeric(10,2) default 0,
  created_at   timestamptz   default now(),
  updated_at   timestamptz   default now()
);

-- ─── 7. cari_transactions ─────────────────────────────────────
create table if not exists cari_transactions (
  id           bigserial primary key,
  customer_id  bigint references cari_customers(id) on delete cascade,
  type         text          not null check (type in ('borc','odeme')),
  amount       numeric(10,2) not null check (amount > 0),
  date         date          not null default current_date,
  due_date     date,
  description  text,
  created_at   timestamptz   default now()
);

create index idx_cari_txn_customer on cari_transactions (customer_id);
create index idx_cari_txn_date     on cari_transactions (date desc);

-- Bakiye otomatik güncelleme trigger
create or replace function update_cari_balance()
returns trigger language plpgsql as $$
begin
  update cari_customers set
    total_debt = (
      select coalesce(sum(case when type='borc' then amount else -amount end), 0)
      from cari_transactions
      where customer_id = coalesce(new.customer_id, old.customer_id)
    ),
    updated_at = now()
  where id = coalesce(new.customer_id, old.customer_id);
  return new;
end;
$$;

create trigger trg_cari_balance
after insert or update or delete on cari_transactions
for each row execute function update_cari_balance();

-- ─── 8. extra_transactions ────────────────────────────────────
create table if not exists extra_transactions (
  id          bigserial primary key,
  type        text          not null check (type in ('gelir','gider')),
  amount      numeric(10,2) not null check (amount > 0),
  date        date          not null default current_date,
  description text,
  created_at  timestamptz   default now()
);

create index idx_extra_type on extra_transactions (type);
create index idx_extra_date on extra_transactions (date desc);

-- ─── 9. quotes ────────────────────────────────────────────────
create table if not exists quotes (
  id              bigserial primary key,
  customer_id     bigint references customers(id) on delete set null,
  customer_name   text,
  phone           text,
  job_type        text,
  materials       jsonb         default '[]'::jsonb,
  labor           numeric(10,2) default 0,
  vat_rate        numeric(5,4)  default 0.20,
  total           numeric(10,2) default 0,
  notes           text,
  created_at      timestamptz   default now(),
  updated_at      timestamptz   default now()
);

create index idx_quotes_customer on quotes (customer_id);
create index idx_quotes_created  on quotes (created_at desc);

-- ─── updated_at otomatik güncelleme ───────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Her tablo için trigger
do $$ declare t text;
begin
  foreach t in array array['customers','services','stock_items','device_records','tasks','cari_customers','quotes'] loop
    execute format('create trigger trg_%s_updated before update on %s for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ─── Row Level Security ────────────────────────────────────────
-- RLS etkinleştirin (Supabase Panel > Authentication > Policies)
alter table customers         enable row level security;
alter table services          enable row level security;
alter table stock_items       enable row level security;
alter table device_records    enable row level security;
alter table tasks             enable row level security;
alter table cari_customers    enable row level security;
alter table cari_transactions enable row level security;
alter table extra_transactions enable row level security;
alter table quotes            enable row level security;

-- Authenticated kullanıcılar tam erişim (servis admin)
create policy "auth_full_access" on customers         for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on services          for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on stock_items       for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on device_records    for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on tasks             for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on cari_customers    for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on cari_transactions for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on extra_transactions for all using (auth.role() = 'authenticated');
create policy "auth_full_access" on quotes            for all using (auth.role() = 'authenticated');

-- Public takip sayfası: servisler sadece okunabilir (IMEI ve PIN gizli)
create policy "public_read_services" on services
  for select using (true)
  with check (false); -- yazmaya izin verme

-- ─── Realtime ─────────────────────────────────────────────────
-- Supabase Dashboard > Database > Replication'da aktif edin:
-- services, tasks

-- ─── Geçiş Notları ────────────────────────────────────────────
-- 1. Supabase projesinde bu SQL'i çalıştırın
-- 2. .env dosyasına ekleyin:
--    VITE_SUPABASE_URL=https://xxxx.supabase.co
--    VITE_SUPABASE_ANON_KEY=eyJxxx...
-- 3. src/lib/db.js içindeki GenericTable class'ını
--    Supabase versiyonuyla değiştirin
-- 4. Tüm CRUD methodları async/await olacak
-- 5. DataContext'teki state güncellemelerini await edin
