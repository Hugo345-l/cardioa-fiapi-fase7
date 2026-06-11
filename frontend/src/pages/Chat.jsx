import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api'

const WELCOME = {
  role: 'assistant',
  content: 'Olá! Sou o assistente CardioIA. Posso ajudar com dúvidas sobre saúde cardiovascular, interpretação de exames e orientações preventivas. Como posso ajudar?',
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const data = await sendChat(text)
      setMessages(m => [...m, { role: 'assistant', content: data.response }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Erro ao contatar o assistente. Verifique a conexão com o servidor.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Assistente CardioIA</h1>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Tire dúvidas sobre saúde cardiovascular</p>

      <div style={{ flex: 1, overflowY: 'auto', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.6,
              background: m.role === 'user' ? '#ef4444' : '#334155',
              color: '#f1f5f9',
              borderBottomRightRadius: m.role === 'user' ? '2px' : '12px',
              borderBottomLeftRadius: m.role === 'assistant' ? '2px' : '12px',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#334155', padding: '12px 16px', borderRadius: '12px', color: '#94a3b8', fontSize: '14px' }}>
              Digitando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ex: Quais são os principais fatores de risco de infarto?"
          style={{ flex: 1, padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none' }}
        />
        <button
          type="submit" disabled={loading || !input.trim()}
          style={{ background: loading || !input.trim() ? '#334155' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: 600 }}
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
