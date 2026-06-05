import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  ServicesTable, CustomersTable, StockItemsTable,
  DeviceRecordsTable, TasksTable, CariCustomersTable,
  CariTransactionsTable, ExtraTransactionsTable, QuotesTable,
  queries,
} from '../lib/db.js'

const DataContext = createContext(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

/* ─── Yardımcı: tabloyu yeniden yükle ───────────────────── */
const reload = (table, setter) =>
  table.getAll().then(setter).catch(err => console.error(table.name, err))

/* ─── Provider ───────────────────────────────────────────── */
export function DataProvider({ children }) {

  const [services,          setServices]          = useState([])
  const [customers,         setCustomers]         = useState([])
  const [stockItems,        setStockItems]        = useState([])
  const [deviceRecords,     setDeviceRecords]     = useState([])
  const [tasks,             setTasks]             = useState([])
  const [cariCustomers,     setCariCustomers]     = useState([])
  const [cariTransactions,  setCariTransactions]  = useState([])
  const [extraTransactions, setExtraTransactions] = useState([])
  const [quotes,            setQuotes]            = useState([])

  /* İlk yüklemede tüm tabloları çek */
  useEffect(() => {
    reload(ServicesTable,          setServices)
    reload(CustomersTable,         setCustomers)
    reload(StockItemsTable,        setStockItems)
    reload(DeviceRecordsTable,     setDeviceRecords)
    reload(TasksTable,             setTasks)
    reload(CariCustomersTable,     setCariCustomers)
    reload(CariTransactionsTable,  setCariTransactions)
    reload(ExtraTransactionsTable, setExtraTransactions)
    reload(QuotesTable,            setQuotes)
  }, [])

  /* ════════════════════════════════════════════════════════
     SERVICES
  ════════════════════════════════════════════════════════ */
  const addService = useCallback(async (data) => {
    try { await ServicesTable.insert(data) } catch { return }
    reload(ServicesTable, setServices)
  }, [])

  const updateService = useCallback(async (id, data) => {
    try { await ServicesTable.update(id, data) } catch { return }
    reload(ServicesTable, setServices)
  }, [])

  const deleteService = useCallback(async (id) => {
    try { await ServicesTable.delete(id) } catch { return }
    reload(ServicesTable, setServices)
  }, [])

  const updateServiceStatus = useCallback((id, status) =>
    updateService(id, { status }), [updateService])

  /* ════════════════════════════════════════════════════════
     CUSTOMERS
  ════════════════════════════════════════════════════════ */
  const addCustomer = useCallback(async (data) => {
    try { await CustomersTable.insert(data) } catch { return }
    reload(CustomersTable, setCustomers)
  }, [])

  const updateCustomer = useCallback(async (id, data) => {
    try { await CustomersTable.update(id, data) } catch { return }
    reload(CustomersTable, setCustomers)
  }, [])

  const deleteCustomer = useCallback(async (id) => {
    try { await CustomersTable.delete(id) } catch { return }
    reload(CustomersTable, setCustomers)
  }, [])

  /* ════════════════════════════════════════════════════════
     STOCK ITEMS
  ════════════════════════════════════════════════════════ */
  const addStockItem = useCallback(async (data) => {
    try { await StockItemsTable.insert(data) } catch { return }
    reload(StockItemsTable, setStockItems)
  }, [])

  const updateStockItem = useCallback(async (id, data) => {
    try { await StockItemsTable.update(id, data) } catch { return }
    reload(StockItemsTable, setStockItems)
  }, [])

  const deleteStockItem = useCallback(async (id) => {
    try { await StockItemsTable.delete(id) } catch { return }
    reload(StockItemsTable, setStockItems)
  }, [])

  const adjustStock = useCallback(async (id, delta) => {
    const item = await StockItemsTable.getById(id)
    if (!item) return
    const qty = Math.max(0, (item.quantity || 0) + delta)
    try { await StockItemsTable.update(id, { quantity: qty }) } catch { return }
    reload(StockItemsTable, setStockItems)
  }, [])

  /* ════════════════════════════════════════════════════════
     DEVICE RECORDS
  ════════════════════════════════════════════════════════ */
  const addDeviceRecord = useCallback(async (data) => {
    try { await DeviceRecordsTable.insert(data) } catch { return }
    reload(DeviceRecordsTable, setDeviceRecords)
  }, [])

  const updateDeviceRecord = useCallback(async (id, data) => {
    try { await DeviceRecordsTable.update(id, data) } catch { return }
    reload(DeviceRecordsTable, setDeviceRecords)
  }, [])

  const deleteDeviceRecord = useCallback(async (id) => {
    try { await DeviceRecordsTable.delete(id) } catch { return }
    reload(DeviceRecordsTable, setDeviceRecords)
  }, [])

  const sellDevice = useCallback(async (id, saleData) => {
    try { await DeviceRecordsTable.update(id, { transaction_type: 'Satıldı', ...saleData }) } catch { return }
    reload(DeviceRecordsTable, setDeviceRecords)
  }, [])

  /* ════════════════════════════════════════════════════════
     TASKS
  ════════════════════════════════════════════════════════ */
  const addTask = useCallback(async (data) => {
    try { await TasksTable.insert(data) } catch { return }
    reload(TasksTable, setTasks)
  }, [])

  const updateTask = useCallback(async (id, data) => {
    try { await TasksTable.update(id, data) } catch { return }
    reload(TasksTable, setTasks)
  }, [])

  const toggleTask = useCallback(async (id) => {
    const task = await TasksTable.getById(id)
    if (!task) return
    const current = task.is_completed ?? task.isCompleted ?? false
    try { await TasksTable.update(id, { is_completed: !current }) } catch { return }
    reload(TasksTable, setTasks)
  }, [])

  const deleteTask = useCallback(async (id) => {
    try { await TasksTable.delete(id) } catch { return }
    reload(TasksTable, setTasks)
  }, [])

  /* ════════════════════════════════════════════════════════
     CARİ CUSTOMERS
  ════════════════════════════════════════════════════════ */
  const addCariCustomer = useCallback(async (data) => {
    try { await CariCustomersTable.insert(data) } catch { return }
    reload(CariCustomersTable, setCariCustomers)
  }, [])

  const updateCariCustomer = useCallback(async (id, data) => {
    try { await CariCustomersTable.update(id, data) } catch { return }
    reload(CariCustomersTable, setCariCustomers)
  }, [])

  const deleteCariCustomer = useCallback(async (id) => {
    try { await CariCustomersTable.delete(id) } catch { return }
    reload(CariCustomersTable, setCariCustomers)
  }, [])

  /* ════════════════════════════════════════════════════════
     CARİ TRANSACTIONS
  ════════════════════════════════════════════════════════ */
  const addCariTransaction = useCallback(async (data) => {
    try { await CariTransactionsTable.insert(data) } catch { return }
    reload(CariTransactionsTable, setCariTransactions)
    reload(CariCustomersTable, setCariCustomers)
  }, [])

  const deleteCariTransaction = useCallback(async (id) => {
    try { await CariTransactionsTable.delete(id) } catch { return }
    reload(CariTransactionsTable, setCariTransactions)
    reload(CariCustomersTable, setCariCustomers)
  }, [])

  /* ════════════════════════════════════════════════════════
     EXTRA TRANSACTIONS
  ════════════════════════════════════════════════════════ */
  const addExtraTransaction = useCallback(async (data) => {
    try { await ExtraTransactionsTable.insert(data) } catch { return }
    reload(ExtraTransactionsTable, setExtraTransactions)
  }, [])

  const deleteExtraTransaction = useCallback(async (id) => {
    try { await ExtraTransactionsTable.delete(id) } catch { return }
    reload(ExtraTransactionsTable, setExtraTransactions)
  }, [])

  /* ════════════════════════════════════════════════════════
     QUOTES
  ════════════════════════════════════════════════════════ */
  const addQuote = useCallback(async (data) => {
    try { await QuotesTable.insert(data) } catch { return }
    reload(QuotesTable, setQuotes)
  }, [])

  const updateQuote = useCallback(async (id, data) => {
    try { await QuotesTable.update(id, data) } catch { return }
    reload(QuotesTable, setQuotes)
  }, [])

  const deleteQuote = useCallback(async (id) => {
    try { await QuotesTable.delete(id) } catch { return }
    reload(QuotesTable, setQuotes)
  }, [])

  return (
    <DataContext.Provider value={{
      services, addService, updateService, deleteService, updateServiceStatus,
      customers, addCustomer, updateCustomer, deleteCustomer,
      stockItems, addStockItem, updateStockItem, deleteStockItem, adjustStock,
      deviceRecords, addDeviceRecord, updateDeviceRecord, deleteDeviceRecord, sellDevice,
      tasks, addTask, updateTask, toggleTask, deleteTask,
      cariCustomers, addCariCustomer, updateCariCustomer, deleteCariCustomer,
      cariTransactions, addCariTransaction, deleteCariTransaction,
      extraTransactions, addExtraTransaction, deleteExtraTransaction,
      quotes, addQuote, updateQuote, deleteQuote,
      queries,
    }}>
      {children}
    </DataContext.Provider>
  )
}
