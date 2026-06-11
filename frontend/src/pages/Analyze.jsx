import { useState } from 'react'
import { analyzeRisk } from '../api'

const INITIAL = {
  age_years: '', gender: 2, height: '', weight: '',
  ap_hi: '', ap_lo: '', cholesterol: 1, gluc: 1,
  smoke: 0, alco: 0, active: 1,
}

const fieldStyle = {
  width: '100%', padding: '9px 12px',
  background: '#0f172a', border: '1px solid #334155',
  borderRadius: '7px', color: '#f1f5f9', fontSize: '14px',
}

const labelStyle = { fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }

function Field({ label, name, type = 'number', value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select style={fieldStyle} name={name} value={value} onChange={onChange}>
          {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input style={fieldStyle} type={type} name={name} value={value} onChange={onChange} />
      )}
    </div>
  )
}

export default function Analyze() {
  const [form, setForm] = useState(INITIAL)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value === '' ? '' : Number(value) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const data = await analyzeRisk(form)
      setResult(data)
    } catch {
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const riskColors = { 'Alto Risco': '#ef4444', 'Médio Risco': '#f59e0b', 'Baixo Risco': '#22c55e' }
  const riskColor = result ? riskColors[result.classificacao_risco] || '#94a3b8' : '#94a3b8'

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Análise de Risco Cardiovascular</h1>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
        Preencha os dados clínicos do paciente para calcular o risco.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: '#94a3b8' }}>Dados do Paciente</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Idade (anos)" name="age_years" value={form.age_years} onChange={handleChange} />
            <Field label="Sexo" name="gender" value={form.gender} onChange={handleChange}
              options={[{ v: 1, l: 'Feminino' }, { v: 2, l: 'Masculino' }]} />
            <Field label="Altura (cm)" name="height" value={form.height} onChange={handleChange} />
            <Field label="Peso (kg)" name="weight" value={form.weight} onChange={handleChange} />
            <Field label="Pressão Sistólica (ap_hi)" name="ap_hi" value={form.ap_hi} onChange={handleChange} />
            <Field label="Pressão Diastólica (ap_lo)" name="ap_lo" value={form.ap_lo} onChange={handleChange} />
            <Field label="Colesterol" name="cholesterol" value={form.cholesterol} onChange={handleChange}
              options={[{ v: 1, l: 'Normal' }, { v: 2, l: 'Acima do Normal' }, { v: 3, l: 'Muito Acima' }]} />
            <Field label="Glicose" name="gluc" value={form.gluc} onChange={handleChange}
              options={[{ v: 1, l: 'Normal' }, { v: 2, l: 'Acima do Normal' }, { v: 3, l: 'Muito Acima' }]} />
            <Field label="Fumante" name="smoke" value={form.smoke} onChange={handleChange}
              options={[{ v: 0, l: 'Não' }, { v: 1, l: 'Sim' }]} />
            <Field label="Álcool" name="alco" value={form.alco} onChange={handleChange}
              options={[{ v: 0, l: 'Não' }, { v: 1, l: 'Sim' }]} />
            <Field label="Ativo Fisicamente" name="active" value={form.active} onChange={handleChange}
              options={[{ v: 1, l: 'Sim' }, { v: 0, l: 'Não' }]} />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{ width: '100%', marginTop: '20px', background: loading ? '#475569' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 600 }}
          >
            {loading ? 'Analisando...' : 'Calcular Risco'}
          </button>
        </form>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#1e293b', border: `2px solid ${riskColor}`, borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Classificação de Risco</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: riskColor }}>{result.classificacao_risco}</p>
              <p style={{ fontSize: '42px', fontWeight: 700, color: '#f1f5f9', marginTop: '4px' }}>{result.probabilidade_pct}</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>probabilidade cardiovascular</p>
            </div>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#94a3b8' }}>Protocolos Sugeridos</h3>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.protocolos_sugeridos.map((p, i) => (
                  <li key={i} style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>{p}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#94a3b8' }}>Resumo Clínico</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>{result.resumo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
