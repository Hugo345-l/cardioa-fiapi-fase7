import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { sendChat } from '../api'

const WELCOME = { role: 'assistant', content: 'Olá! Sou o assistente CardioIA. Como posso ajudar?' }

export default function ChatScreen() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setMessages(m => [...m, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    try {
      const data = await sendChat(text)
      setMessages(m => [...m, { role: 'assistant', content: data.response }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Erro ao contatar o assistente.' }])
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={s.title}>Assistente CardioIA</Text>

      <ScrollView ref={scrollRef} style={s.messages} contentContainerStyle={{ padding: 12, gap: 12 }}>
        {messages.map((m, i) => (
          <View key={i} style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleAssistant]}>
            <Text style={s.bubbleText}>{m.content}</Text>
          </View>
        ))}
        {loading && (
          <View style={s.bubbleAssistant}>
            <ActivityIndicator size="small" color="#94a3b8" />
          </View>
        )}
      </ScrollView>

      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder="Pergunte sobre saúde cardíaca..."
          placeholderTextColor="#475569"
          multiline
        />
        <TouchableOpacity style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]} onPress={send} disabled={!input.trim() || loading}>
          <Text style={s.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#f1f5f9', marginTop: 8, marginBottom: 12 },
  messages: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  bubble: { padding: 12, borderRadius: 12, maxWidth: '85%' },
  bubbleUser: { backgroundColor: '#ef4444', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  bubbleAssistant: { backgroundColor: '#334155', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  bubbleText: { color: '#f1f5f9', fontSize: 14, lineHeight: 20 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 8, padding: 12, color: '#f1f5f9', fontSize: 14, maxHeight: 80 },
  sendBtn: { backgroundColor: '#ef4444', borderRadius: 8, padding: 14, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#334155' },
  sendText: { color: '#fff', fontSize: 18, fontWeight: '700' },
})
