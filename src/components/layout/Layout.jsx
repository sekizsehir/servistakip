import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 max-w-screen-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
