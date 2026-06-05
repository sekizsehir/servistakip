/**
 * Supabase tabanlı veritabanı katmanı.
 * Tüm metodlar async/await kullanır.
 */

import { supabase } from './supabase.js'

/* ═══════════════════════════════════════════════════════════
   GenericTable — tüm tablolar bu ile çalışır
══════════════════════════════════════════════════════════ */
class GenericTable {
  constructor(tableName) {
    this.name = tableName
  }

  async getAll() {
    const { data, error } = await supabase
      .from(this.name)
      .select('*')
      .order('id', { ascending: false })
    if (error) { console.error(`[${this.name}] getAll:`, error.message); return [] }
    return data ?? []
  }

  async getById(id) {
    const { data, error } = await supabase
      .from(this.name)
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  async where(predicate) {
    const all = await this.getAll()
    return all.filter(predicate)
  }

  async insert(rawData) {
    // Supabase otomatik yönetilen alanları çıkar
    const { id, createdAt, updatedAt, created_at, updated_at, ...data } = rawData
    const { data: rec, error } = await supabase
      .from(this.name)
      .insert(data)
      .select()
      .single()
    if (error) { console.error(`[${this.name}] insert:`, error.message); throw error }
    return rec
  }

  async update(id, rawData) {
    const { id: _id, createdAt, updatedAt, created_at, updated_at, ...data } = rawData
    const { data: rec, error } = await supabase
      .from(this.name)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) { console.error(`[${this.name}] update:`, error.message); throw error }
    return rec
  }

  async delete(id) {
    const { error } = await supabase
      .from(this.name)
      .delete()
      .eq('id', id)
    if (error) { console.error(`[${this.name}] delete:`, error.message); throw error }
    return true
  }

  async count(predicate) {
    if (predicate) {
      const rows = await this.getAll()
      return rows.filter(predicate).length
    }
    const { count, error } = await supabase
      .from(this.name)
      .select('*', { count: 'exact', head: true })
    if (error) return 0
    return count ?? 0
  }
}

/* ═══════════════════════════════════════════════════════════
   Tablo instance'ları
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

/* ─── Özel sorgular (async) ──────────────────────────────── */
export const queries = {
  servicesByCustomer: (customerId) =>
    ServicesTable.where(s => s.customer_id === customerId),

  serviceCountByStatus: async () => {
    const all = await ServicesTable.getAll()
    return all.reduce((acc, s) => {
      const key = s.status || s.durum || 'Beklemede'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  },

  todayServices: async () => {
    const today = new Date().toISOString().split('T')[0]
    return ServicesTable.where(s => (s.created_at || '').startsWith(today))
  },

  lowStock: (threshold = 5) =>
    StockItemsTable.where(s => (s.quantity ?? 0) <= threshold),

  customerBalance: async (customerId) => {
    const txns = await CariTransactionsTable.where(t => t.customer_id === customerId)
    return txns.reduce((sum, t) => sum + (t.type === 'borc' ? t.amount : -t.amount), 0)
  },

  depotValue: async () => {
    const rows = await DeviceRecordsTable.where(d => d.transaction_type === 'Depoda')
    return rows.reduce((s, d) => s + (d.buy_price || 0), 0)
  },

  pendingTasks: () =>
    TasksTable.where(t => !t.is_completed),

  overdueTasks: async () => {
    const today = new Date().toISOString().split('T')[0]
    return TasksTable.where(t => !t.is_completed && t.due_date < today)
  },
}
