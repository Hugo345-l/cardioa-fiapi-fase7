import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!user.trim() || !pass.trim()) {
      setError('Preencha usuário e senha.')
      return
    }
    sessionStorage.setItem('cardioai_user', user)
    navigate('/dashboard')
  }

  const fieldStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '15px',
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>❤️</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9' }}>CardioIA</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Plataforma de Inteligência Cardíaca</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>Usuário</label>
            <input
              style={fieldStyle}
              placeholder="dr.silva@hospital.com"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>Senha</label>
            <input
              style={fieldStyle}
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}
          <button
            type="submit"
            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 600, marginTop: '8px' }}
          >
            Entrar
          </button>
        </form>

        <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
          FIAP · CardioIA Fase 7 · 2026
        </p>
      </div>
    </div>
  )
}
