import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Scanner from './pages/Scanner'
import Analytics from './pages/Analytics'
import Toolbox from './pages/Toolbox'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
