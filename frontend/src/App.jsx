import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import Chat from './pages/Chat'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const logged = sessionStorage.getItem('cardioai_user')
  return logged ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/analyze" element={<PrivateRoute><Layout><Analyze /></Layout></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Layout><Chat /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
