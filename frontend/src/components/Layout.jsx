import { NavLink, useNavigate } from 'react-router-dom'

const navStyle = {
  background: '#1e293b',
  borderBottom: '1px solid #334155',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '56px',
}

const linkStyle = ({ isActive }) => ({
  color: isActive ? '#f1f5f9' : '#94a3b8',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: isActive ? 600 : 400,
  padding: '6px 12px',
  borderRadius: '6px',
  background: isActive ? '#334155' : 'transparent',
  transition: 'all 0.15s',
})

export default function Layout({ children }) {
  const navigate = useNavigate()
  const user = sessionStorage.getItem('cardioai_user') || 'Usuário'

  function logout() {
    sessionStorage.removeItem('cardioai_user')
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={navStyle}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>❤️</span>
        <span style={{ fontWeight: 700, fontSize: '16px', marginRight: '24px', color: '#f1f5f9' }}>
          CardioIA
        </span>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/analyze" style={linkStyle}>Análise de Risco</NavLink>
        <NavLink to="/chat" style={linkStyle}>Assistente</NavLink>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{user}</span>
          <button
            onClick={logout}
            style={{ background: 'none', border: '1px solid #475569', color: '#94a3b8', padding: '4px 12px', borderRadius: '6px', fontSize: '13px' }}
          >
            Sair
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  )
}
