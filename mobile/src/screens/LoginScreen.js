import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'

export default function LoginScreen({ navigation }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (!user.trim() || !pass.trim()) {
      setError('Preencha usuário e senha.')
      return
    }
    navigation.replace('Dashboard', { user })
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.container}>
      <View style={s.card}>
        <Text style={s.heart}>❤️</Text>
        <Text style={s.title}>CardioIA</Text>
        <Text style={s.subtitle}>Plataforma de Inteligência Cardíaca</Text>

        <TextInput
          style={s.input}
          placeholder="Usuário"
          placeholderTextColor="#475569"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
        />
        <TextInput
          style={s.input}
          placeholder="Senha"
          placeholderTextColor="#475569"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
        />
        {!!error && <Text style={s.error}>{error}</Text>}

        <TouchableOpacity style={s.btn} onPress={handleLogin}>
          <Text style={s.btnText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={s.footer}>FIAP · CardioIA Fase 7 · 2026</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 32, borderWidth: 1, borderColor: '#334155' },
  heart: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#f1f5f9', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginTop: 4, marginBottom: 28 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 8, padding: 12, color: '#f1f5f9', fontSize: 15, marginBottom: 12 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 8 },
  btn: { backgroundColor: '#ef4444', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footer: { color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 24 },
})
