import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import './index.css'

function Layout() {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-white/70 dark:bg-gray-900/60 backdrop-blur px-4 py-6">
        <h1 className="font-bold text-xl mb-6">RidePulse</h1>
        <nav className="space-y-2">
          <NavLink className={({isActive}) => `block rounded px-3 py-2 ${isActive ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/">Overview</NavLink>
          <NavLink className={({isActive}) => `block rounded px-3 py-2 ${isActive ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/trends">Trends</NavLink>
          <NavLink className={({isActive}) => `block rounded px-3 py-2 ${isActive ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/stations">Stations</NavLink>
          <NavLink className={({isActive}) => `block rounded px-3 py-2 ${isActive ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/story">Story</NavLink>
          <NavLink className={({isActive}) => `block rounded px-3 py-2 ${isActive ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/quiz">Quiz</NavLink>
        </nav>
      </aside>
      <main className="p-4 md:p-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="/trends" element={<Placeholder title="Trends" />} />
          <Route path="/stations" element={<Placeholder title="Stations" />} />
          <Route path="/story" element={<Placeholder title="Story Builder" />} />
          <Route path="/quiz" element={<Placeholder title="Quiz" />} />
        </Routes>
      </main>
    </div>
  )
}

function StatCard({label, value, sub}:{label:string; value:string; sub?:string}) {
  return (
    <motion.div
      initial={{opacity:0, y:10}}
      animate={{opacity:1, y:0}}
      className="rounded-xl border bg-white dark:bg-gray-900 p-4 shadow-sm"
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </motion.div>
  )
}

function Overview() {
  const [data, setData] = useState<{stations:number; updated:string} | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('https://gbfs.citibikenyc.com/gbfs/en/station_information.json', { cache: 'no-store' })
        const json = await res.json()
        const count = json?.data?.stations?.length ?? 0
        const updated = new Date(json?.last_updated * 1000).toLocaleString()
        setData({ stations: count, updated })
      } catch (e:any) {
        setError(e?.message || 'Failed to fetch')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Preview build</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Stations (live)" value={loading ? '…' : (data ? String(data.stations) : '—')} sub={data ? `Updated: ${data.updated}` : error ?? ''} />
        <StatCard label="Rides Today" value="—" sub="Coming in final polish" />
        <StatCard label="Peak Hour" value="—" sub="Coming in final polish" />
        <StatCard label="Anomalies" value="—" sub="Coming in final polish" />
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="rounded-xl border p-4 bg-white dark:bg-gray-900">
        <h3 className="font-semibold mb-2">What's coming next</h3>
        <ul className="list-disc ml-6 text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <li>Animated trends and anomaly callouts</li>
          <li>Station clustering and map flows</li>
          <li>Story Builder with persona-driven insights</li>
          <li>Quiz and Fun Facts with confetti</li>
        </ul>
      </motion.div>
    </div>
  )
}

function Placeholder({title}:{title:string}) {
  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="rounded-xl border p-8 text-center bg-white dark:bg-gray-900">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="text-gray-500 mt-2">This section ships in the final polish update.</div>
    </motion.div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>
)