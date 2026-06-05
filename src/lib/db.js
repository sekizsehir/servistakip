/**
 * LocalStorage tabanlı veritabanı katmanı.
 * Supabase'e geçişte bu dosyayı değiştirmeniz yeterli.
 *
 * Supabase versiyonu için:
 * import { createClient } from '@supabase/supabase-js'
 * const supabase = createClient(URL, ANON_KEY)
 * — her method async olacak ve return await supabase.from(table)... olacak.
 */

import { ALL_SEEDS } from '../data/seed.js'

const PREFIX = 'servisdb_'

/* ─── Yardımcılar ────────────────────────────────────────── */
const key   = (table) => PREFIX + table
const read  = (table) => { try { return JSON.parse(localStorage.getItem(key(table)) || 'null') ?? [] } catch { return [] } }
const write = (table, data) => localStorage.setItem(key(table), JSON.stringify(data))
const uid   = () => Date.now() + Math.floor(Math.random() * 1000)
const iso   = () => new Date().toISOString()

/* ─── Seed (ilk yükleme) ─────────────────────────────────── */
export function seedIfEmpty() {
  Object.entries(ALL_SEEDS).forEach(([table, rows]) => {
    if (!localStorage.getItem(key(table))) {
      write(table, rows)
    }
  })
}

export function resetAllData() {
  Object.entries(ALL_SEEDS).forEach(([table, rows]) => write(table, rows))
}

export function clearTable(table) {
  localStorage.removeItem(key(table))
}

/* ═══════════════════════════════════════════════════════════
   GenericTable — tüm tablolar bu ile çalışır
══════════════════════════════════════════════════════════ */
class GenericTable {
  constructor(tableName) {
    this.name = tableName
  }

  /** Tüm kayıtları döner */
  getAll() {
    return read(this.name)
  }

  /** ID'ye göre tek kayıt */
  getById(id) {
    return read(this.name).find(r => r.id === id) ?? null
  }

  /** Filtreli kayıtlar */
  where(predicate) {
    return read(this.name).filter(predicate)
  }

  /** Yeni kayıt ekle */
  insert(data) {
    const rows = read(this.name)
    const maxId = rows.reduce((m, r) => Math.max(m, r.id || 0), 0)
    const record = {
      ...data,
      id:        data.id ?? (maxId + 1),
      createdAt: data.createdAt ?? iso(),
      updatedAt: iso(),
    }
    write(this.name, [...rows, record])
    return record
  }

  /** Kayıt güncelle */
  update(id, data) {
    const rows = read(this.name)
    let updated = null
    const next = rows.map(r => {
      if (r.id !== id) return r
      updated = { ...r, ...data, id, updatedAt: iso() }
      return updated
    })
    if (updated) write(this.name, next)
    return updated
  }

  /** Kayıt sil */
  delete(id) {
    const rows = read(this.name)
    const filtered = rows.filter(r => r.id !== id)
    write(this.name, filtered)
    return filtered.length < rows.length
  }

  /** Tümünü değiştir */
  setAll(rows) {
    write(this.name, rows)
    return rows
  }

  /** Kayıt sayısı */
  count(predicate) {
    const rows = read(this.name)
    return predicate ? rows.filter(predicate).length : rows.length
  }
}

/* ═══════════════════════════════════════════════════════════
   Tablo instance'ları — doğrudan kullanılabilir
══════════════════════════════════════════════════════════ */
export const ServicesTable          = new GenericTable('services')
export const CustomersTable         = new GenericTable('customers')
export const StockItemsTable        = new GenericTable('stock_items')
export const DeviceRecordsTable     = new GenericTable('device_records')
export const TasksTable             = new GenericTable('tasks')
export const CariCustomersTable     = new GenericTable('cari_customers')
export const CariTransactionsTable  = new GenericTable('cari_transactions')
export const ExtraTransactionsTable = new GenericTable('extra_transactions')
export const QuotesTable            = new GenericTable('quotes')

/* ─── Özel sorgular ──────────────────────────────────────── */
export const queries = {
  /** Müşteriye ait servisler */
  servicesByCustomer: (customerId) =>
    ServicesTable.where(s => s.customerId === customerId),

  /** Duruma göre servis sayısı */
  serviceCountByStatus: () => {
    const all = ServicesTable.getAll()
    return all.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    }, {})
  },

  /** Bugünün servisleri */
  todayServices: () => {
    const today = new Date().toISOString().split('T')[0]
    return ServicesTable.where(s => s.createdAt?.startsWith(today))
  },

  /** Kritik stok */
  lowStock: (threshold = 5) =>
    StockItemsTable.where(s => s.quantity <= threshold),

  /** Müşteri bakiyesi hesapla */
  customerBalance: (customerId) => {
    const txns = CariTransactionsTable.where(t => t.customerId === customerId)
    return txns.reduce((sum, t) => sum + (t.type === 'borc' ? t.amount : -t.amount), 0)
  },

  /** Aylık ciro (services) */
  monthlyRevenue: (year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    return ServicesTable
      .where(s => s.createdAt?.startsWith(prefix))
      .reduce((s, r) => s + (r.price || 0), 0)
  },

  /** Depodaki ikinci el cihaz değeri */
  depotValue: () =>
    DeviceRecordsTable
      .where(d => d.transactionType === 'Depoda')
      .reduce((s, d) => s + (d.buyPrice || 0), 0),

  /** Tamamlanmamış görevler */
  pendingTasks: () =>
    TasksTable.where(t => !t.isCompleted),

  /** Geciken görevler */
  overdueTasks: () => {
    const today = new Date().toISOString().split('T')[0]
    return TasksTable.where(t => !t.isCompleted && t.dueDate < today)
  },
}

/* ─── Supabase Geçiş Notu ────────────────────────────────── */
/*
  Supabase'e geçmek için:

  1. pnpm add @supabase/supabase-js
  2. src/lib/supabase.js oluştur:
     import { createClient } from '@supabase/supabase-js'
     export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  3. Her method'u async yapın:
     async getAll() {
       const { data, error } = await supabase.from(this.name).select('*')
       if (error) throw error
       return data
     }

  4. Context'teki useEffect'leri güncelleyin (await + try/catch)
  5. Realtime için:
     supabase.channel('services').on('postgres_changes', ...).subscribe()
*/
