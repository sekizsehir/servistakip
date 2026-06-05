import Layout from '../components/layout/Layout'
import Card from '../components/shared/Card'

export default function KampanyaPage() {
  return (
    <Layout>
      <Card title="Kampanyalar">
        <div className="text-center py-12 text-gray-400 dark:text-gray-600">
          <div className="text-5xl mb-3">🎯</div>
          <p className="text-sm">Henüz kampanya eklenmedi.</p>
        </div>
      </Card>
    </Layout>
  )
}
