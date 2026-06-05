import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Card from '../components/shared/Card'
import Table from '../components/shared/Table'
import Badge from '../components/shared/Badge'
import Button from '../components/shared/Button'
import { stoklar } from '../data/mock'

const columns = [
  { key: 'id', label: '#' },
  { key: 'ad', label: 'Ürün Adı' },
  { key: 'kategori', label: 'Kategori' },
  {
    key: 'stok',
    label: 'Stok',
    render: (val, row) => (
      <span className={val <= row.kritikStok ? 'text-red-600 font-semibold' : 'text-gray-700'}>
        {val}
        {val <= row.kritikStok && <span className="ml-2 text-xs">⚠️</span>}
      </span>
    ),
  },
  { key: 'kritikStok', label: 'Kritik Seviye' },
  {
    key: 'birimFiyat',
    label: 'Birim Fiyat',
    render: (val) => `₺${val.toLocaleString('tr-TR')}`,
  },
  {
    key: 'durum',
    label: 'Durum',
    render: (_, row) => (
      <Badge variant={row.stok <= row.kritikStok ? 'danger' : 'success'}>
        {row.stok <= row.kritikStok ? 'Kritik' : 'Yeterli'}
      </Badge>
    ),
  },
]

export default function StokPage() {
  const [search, setSearch] = useState('')

  const filtered = stoklar.filter(s =>
    s.ad.toLowerCase().includes(search.toLowerCase()) ||
    s.kategori.toLowerCase().includes(search.toLowerCase())
  )

  const kritikSayisi = stoklar.filter(s => s.stok <= s.kritikStok).length

  return (
    <Layout>
      <div className="space-y-6">
        {kritikSayisi > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-red-700">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium">{kritikSayisi} ürün kritik stok seviyesinin altında!</span>
          </div>
        )}

        <Card
          title="Stok Listesi"
          action={
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <Button icon="➕">Yeni Ürün</Button>
            </div>
          }
        >
          <Table columns={columns} data={filtered} />
        </Card>
      </div>
    </Layout>
  )
}
