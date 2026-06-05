import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  seedIfEmpty, resetAllData,
  ServicesTable, CustomersTable, StockItemsTable,
  DeviceRecordsTable, TasksTable, CariCustomersTable,
  CariTransactionsTable, ExtraTransactionsTable, QuotesTable,
  queries,
} from '../lib/db.js'

/* ─── Context ────────────────────────────────────────────── */
const DataContext = createContext(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

/* ─── Provider ───────────────────────────────────────────── */
export function DataProvider({ children }) {

  /* İlk yüklemede seed */
  useEffect(() => { seedIfEmpty() }, [])

  /* ─── State (her tablo için) ─────────────────────────── */
  const [services,          setServices]          = useState(() => ServicesTable.getAll())
  const [customers,         setCustomers]         = useState(() => CustomersTable.getAll())
  const [stockItems,        setStockItems]        = useState(() => StockItemsTable.getAll())
  const [deviceRecords,     setDeviceRecords]     = useState(() => DeviceRecordsTable.getAll())
  const [tasks,             setTasks]             = useState(() => TasksTable.getAll())
  const [cariCustomers,     setCariCustomers]     = useState(() => CariCustomersTable.getAll())
  const [cariTransactions,  setCariTransactions]  = useState(() => CariTransactionsTable.getAll())
  const [extraTransactions, setExtraTransactions] = useState(() => ExtraTransactionsTable.getAll())
  const [quotes,            setQuotes]            = useState(() => QuotesTable.getAll())

  /* ─── Generic yardımcı ───────────────────────────────── */
  const sync = (table, setter) => setter(table.getAll())

  /* ════════════════════════════════════════════════════════
     SERVICES
  ════════════════════════════════════════════════════════ */
  const addService = useCallback((data) => {
    const rec = ServicesTable.insert(data)
    sync(ServicesTable, setServices)
    return rec
  }, [])

  const updateService = useCallback((id, data) => {
    const rec = ServicesTable.update(id, data)
    sync(ServicesTable, setServices)
    return rec
  }, [])

  const deleteService = useCallback((id) => {
    ServicesTable.delete(id)
    sync(ServicesTable, setServices)
  }, [])

  const updateServiceStatus = useCallback((id, status) => {
    return updateService(id, { status })
  }, [updateService])

  /* ════════════════════════════════════════════════════════
     CUSTOMERS
  ════════════════════════════════════════════════════════ */
  const addCustomer = useCallback((data) => {
    const rec = CustomersTable.insert(data)
    sync(CustomersTable, setCustomers)
    return rec
  }, [])

  const updateCustomer = useCallback((id, data) => {
    const rec = CustomersTable.update(id, data)
    sync(CustomersTable, setCustomers)
    return rec
  }, [])

  const deleteCustomer = useCallback((id) => {
    CustomersTable.delete(id)
    sync(CustomersTable, setCustomers)
  }, [])

  const getCustomerById = useCallback((id) =>
    customers.find(c => c.id === id) ?? null, [customers])

  /* ════════════════════════════════════════════════════════
     STOCK ITEMS
  ════════════════════════════════════════════════════════ */
  const addStockItem = useCallback((data) => {
    const rec = StockItemsTable.insert(data)
    sync(StockItemsTable, setStockItems)
    return rec
  }, [])

  const updateStockItem = useCallback((id, data) => {
    const rec = StockItemsTable.update(id, data)
    sync(StockItemsTable, setStockItems)
    return rec
  }, [])

  const deleteStockItem = useCallback((id) => {
    StockItemsTable.delete(id)
    sync(StockItemsTable, setStockItems)
  }, [])

  const adjustStock = useCallback((id, delta) => {
    const item = StockItemsTable.getById(id)
    if (!item) return null
    const rec = StockItemsTable.update(id, { quantity: Math.max(0, item.quantity + delta) })
    sync(StockItemsTable, setStockItems)
    return rec
  }, [])

  /* ════════════════════════════════════════════════════════
     DEVICE RECORDS (İkinci El)
  ════════════════════════════════════════════════════════ */
  const addDeviceRecord = useCallback((data) => {
    const rec = DeviceRecordsTable.insert(data)
    sync(DeviceRecordsTable, setDeviceRecords)
    return rec
  }, [])

  const updateDeviceRecord = useCallback((id, data) => {
    const rec = DeviceRecordsTable.update(id, data)
    sync(DeviceRecordsTable, setDeviceRecords)
    return rec
  }, [])

  const deleteDeviceRecord = useCallback((id) => {
    DeviceRecordsTable.delete(id)
    sync(DeviceRecordsTable, setDeviceRecords)
  }, [])

  const sellDevice = useCallback((id, { sellPrice, salePersonName, saleDate }) => {
    const rec = DeviceRecordsTable.update(id, {
      transactionType: 'Satıldı',
      sellPrice, salePersonName,
      saleDate: saleDate || new Date().toISOString().split('T')[0],
    })
    sync(DeviceRecordsTable, setDeviceRecords)
    return rec
  }, [])

  /* ════════════════════════════════════════════════════════
     TASKS
  ════════════════════════════════════════════════════════ */
  const addTask = useCallback((data) => {
    const rec = TasksTable.insert({ ...data, isCompleted: false })
    sync(TasksTable, setTasks)
    return rec
  }, [])

  const updateTask = useCallback((id, data) => {
    const rec = TasksTable.update(id, data)
    sync(TasksTable, setTasks)
    return rec
  }, [])

  const toggleTask = useCallback((id) => {
    const task = TasksTable.getById(id)
    if (!task) return null
    const rec = TasksTable.update(id, { isCompleted: !task.isCompleted })
    sync(TasksTable, setTasks)
    return rec
  }, [])

  const deleteTask = useCallback((id) => {
    TasksTable.delete(id)
    sync(TasksTable, setTasks)
  }, [])

  /* ════════════════════════════════════════════════════════
     CARİ MÜŞTERİLER
  ════════════════════════════════════════════════════════ */
  const addCariCustomer = useCallback((data) => {
    const rec = CariCustomersTable.insert({ ...data, totalDebt: 0 })
    sync(CariCustomersTable, setCariCustomers)
    return rec
  }, [])

  const updateCariCustomer = useCallback((id, data) => {
    const rec = CariCustomersTable.update(id, data)
    sync(CariCustomersTable, setCariCustomers)
    return rec
  }, [])

  const deleteCariCustomer = useCallback((id) => {
    CariCustomersTable.delete(id)
    CariTransactionsTable.setAll(CariTransactionsTable.where(t => t.customerId !== id))
    sync(CariCustomersTable, setCariCustomers)
    sync(CariTransactionsTable, setCariTransactions)
  }, [])

  /* ════════════════════════════════════════════════════════
     CARİ HAREKETLER
  ════════════════════════════════════════════════════════ */
  const _recalcDebt = (customerId) => {
    const balance = queries.customerBalance(customerId)
    CariCustomersTable.update(customerId, { totalDebt: balance })
    sync(CariCustomersTable, setCariCustomers)
  }

  const addCariTransaction = useCallback((data) => {
    const rec = CariTransactionsTable.insert(data)
    sync(CariTransactionsTable, setCariTransactions)
    _recalcDebt(data.customerId)
    return rec
  }, [])

  const deleteCariTransaction = useCallback((id) => {
    const txn = CariTransactionsTable.getById(id)
    CariTransactionsTable.delete(id)
    sync(CariTransactionsTable, setCariTransactions)
    if (txn) _recalcDebt(txn.customerId)
  }, [])

  /* ════════════════════════════════════════════════════════
     EK GELİR / GİDER
  ════════════════════════════════════════════════════════ */
  const addExtraTransaction = useCallback((data) => {
    const rec = ExtraTransactionsTable.insert(data)
    sync(ExtraTransactionsTable, setExtraTransactions)
    return rec
  }, [])

  const deleteExtraTransaction = useCallback((id) => {
    ExtraTransactionsTable.delete(id)
    sync(ExtraTransactionsTable, setExtraTransactions)
  }, [])

  /* ════════════════════════════════════════════════════════
     TEKLİFLER
  ════════════════════════════════════════════════════════ */
  const addQuote = useCallback((data) => {
    const rec = QuotesTable.insert(data)
    sync(QuotesTable, setQuotes)
    return rec
  }, [])

  const updateQuote = useCallback((id, data) => {
    const rec = QuotesTable.update(id, data)
    sync(QuotesTable, setQuotes)
    return rec
  }, [])

  const deleteQuote = useCallback((id) => {
    QuotesTable.delete(id)
    sync(QuotesTable, setQuotes)
  }, [])

  /* ─── Geliştirici araçları ───────────────────────────── */
  const resetToSeed = useCallback(() => {
    resetAllData()
    setServices(ServicesTable.getAll())
    setCustomers(CustomersTable.getAll())
    setStockItems(StockItemsTable.getAll())
    setDeviceRecords(DeviceRecordsTable.getAll())
    setTasks(TasksTable.getAll())
    setCariCustomers(CariCustomersTable.getAll())
    setCariTransactions(CariTransactionsTable.getAll())
    setExtraTransactions(ExtraTransactionsTable.getAll())
    setQuotes(QuotesTable.getAll())
  }, [])

  /* ─── Context value ──────────────────────────────────── */
  const value = {
    /* ── Data ── */
    services, customers, stockItems, deviceRecords,
    tasks, cariCustomers, cariTransactions, extraTransactions, quotes,

    /* ── Services ── */
    addService, updateService, deleteService, updateServiceStatus,

    /* ── Customers ── */
    addCustomer, updateCustomer, deleteCustomer, getCustomerById,

    /* ── Stock ── */
    addStockItem, updateStockItem, deleteStockItem, adjustStock,

    /* ── Device Records ── */
    addDeviceRecord, updateDeviceRecord, deleteDeviceRecord, sellDevice,

    /* ── Tasks ── */
    addTask, updateTask, toggleTask, deleteTask,

    /* ── Cari ── */
    addCariCustomer, updateCariCustomer, deleteCariCustomer,
    addCariTransaction, deleteCariTransaction,

    /* ── Extra ── */
    addExtraTransaction, deleteExtraTransaction,

    /* ── Quotes ── */
    addQuote, updateQuote, deleteQuote,

    /* ── Dev ── */
    resetToSeed, queries,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
