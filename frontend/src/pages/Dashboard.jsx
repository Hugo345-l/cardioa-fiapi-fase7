import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { healthCheck } from '../api'

const MOCK_READINGS = [
  { time: '08:00', bpm: 72, temp: 36.5, spo2: 98 },
  { time: '09:00', bpm: 78, temp: 36.6, spo2: 97 },
  { time: '10:00', bpm: 85, temp: 36.8, spo2: 98 },
  { time: '11:00', bpm: 91, temp: 37.1, spo2: 96 },
  { time: '12:00', bpm: 88, temp: 36.9, spo2: 97 },
  { time: '13:00', bpm: 76, temp: 36.7, spo2: 98 },
]

function Card({ title, value, unit, status, icon }) {
  const colors = { normal: '#22c55e', warning: '#f59e0b', danger: '#ef4444' }
  return (
    <div style={{ background: '#1e293b', border: `1px solid ${colors[status] || '#334155'}`, borderRadius: '12px', padding: '20px', flex: 1, minWidth: '160px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2, marginTop: '4px' }}>
            {value}<span style={{ fontSize: '14px', fontWeight: 400, color: '#94a3b8', marginLeft: '4px' }}>{unit}</span>
          </p>
        </div>
        <span style={{ fontSize: '28px' }}>{icon}</span>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[status] || '#334155' }} />
        <span style={{ fontSize: '12px', color: colors[status] || '#94a3b8' }}>
          {status === 'normal' ? 'Normal' : status === 'warning' ? 'Atenção' : 'Crítico'}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [apiOk, setApiOk] = useState(null)
  const [current, setCurrent] = useState(MOCK_READINGS[MOCK_READINGS.length - 1])

  useEffect(() => {
    healthCheck().then(setApiOk).catch(() => setApiOk(false))
    const interval = setInterval(() => {
      setCurrent(prev => ({
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        bpm: Math.floor(65 + Math.random() * 30),
        temp: parseFloat((36.2 + Math.random() * 1.5).toFixed(1)),
        spo2: Math.floor(95 + Math.random() * 4),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const bpmStatus = current.bpm > 100 ? 'danger' : current.bpm > 90 ? 'warning' : 'normal'
  const tempStatus = current.temp > 38 ? 'danger' : current.temp > 37.5 ? 'warning' : 'normal'
  const spo2Status = current.spo2 < 95 ? 'danger' : current.spo2 < 97 ? 'warning' : 'normal'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>
            Monitoramento em tempo real · Última leitura: {current.time}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: apiOk ? '#22c55e' : apiOk === false ? '#ef4444' : '#f59e0b' }} />
          <span style={{ color: '#94a3b8' }}>
            API {apiOk ? 'conectada' : apiOk === false ? 'offline' : 'verificando...'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <Card title="Batimentos" value={current.bpm} unit="BPM" status={bpmStatus} icon="💓" />
        <Card title="Temperatura" value={current.temp} unit="°C" status={tempStatus} icon="🌡️" />
        <Card title="SpO₂" value={current.spo2} unit="%" status={spo2Status} icon="🩸" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#94a3b8' }}>Histórico de BPM (simulado)</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
          {MOCK_READINGS.map((r, i) => {
            const h = ((r.bpm - 60) / 60) * 100
            const color = r.bpm > 100 ? '#ef4444' : r.bpm > 90 ? '#f59e0b' : '#22c55e'
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', background: color, borderRadius: '3px 3px 0 0', height: `${h}%`, minHeight: '4px', opacity: 0.8 }} />
                <span style={{ fontSize: '10px', color: '#475569' }}>{r.time}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Ações rápidas</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/analyze')}
            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600 }}
          >
            Analisar Risco Cardiovascular
          </button>
          <button
            onClick={() => navigate('/chat')}
            style={{ background: '#334155', color: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px' }}
          >
            Consultar Assistente IA
          </button>
        </div>
      </div>
    </div>
  )
}
