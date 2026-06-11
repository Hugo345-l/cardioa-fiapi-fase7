import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { healthCheck } from '../api'

function VitalCard({ title, value, unit, status, icon }) {
  const color = status === 'normal' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444'
  return (
    <View style={[s.card, { borderColor: color }]}>
      <View style={s.cardHeader}>
        <Text style={s.cardLabel}>{title}</Text>
        <Text style={s.cardIcon}>{icon}</Text>
      </View>
      <Text style={s.cardValue}>{value}<Text style={s.cardUnit}> {unit}</Text></Text>
      <View style={s.statusRow}>
        <View style={[s.dot, { backgroundColor: color }]} />
        <Text style={[s.statusText, { color }]}>
          {status === 'normal' ? 'Normal' : status === 'warning' ? 'Atenção' : 'Crítico'}
        </Text>
      </View>
    </View>
  )
}

export default function DashboardScreen({ route, navigation }) {
  const user = route.params?.user || 'Usuário'
  const [apiOk, setApiOk] = useState(null)
  const [vitals, setVitals] = useState({ bpm: 76, temp: 36.7, spo2: 98 })

  useEffect(() => {
    healthCheck().then(setApiOk).catch(() => setApiOk(false))
    const iv = setInterval(() => {
      setVitals({
        bpm: Math.floor(65 + Math.random() * 30),
        temp: parseFloat((36.2 + Math.random() * 1.5).toFixed(1)),
        spo2: Math.floor(95 + Math.random() * 4),
      })
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Dashboard</Text>
          <Text style={s.subtitle}>Olá, {user}</Text>
        </View>
        <View style={s.apiStatus}>
          <View style={[s.dot, { backgroundColor: apiOk ? '#22c55e' : apiOk === false ? '#ef4444' : '#f59e0b' }]} />
          <Text style={s.apiText}>API {apiOk ? 'online' : 'offline'}</Text>
        </View>
      </View>

      <View style={s.grid}>
        <VitalCard title="BPM" value={vitals.bpm} unit="bpm"
          status={vitals.bpm > 100 ? 'danger' : vitals.bpm > 90 ? 'warning' : 'normal'} icon="💓" />
        <VitalCard title="Temperatura" value={vitals.temp} unit="°C"
          status={vitals.temp > 38 ? 'danger' : vitals.temp > 37.5 ? 'warning' : 'normal'} icon="🌡️" />
      </View>
      <View style={s.grid}>
        <VitalCard title="SpO₂" value={vitals.spo2} unit="%"
          status={vitals.spo2 < 95 ? 'danger' : vitals.spo2 < 97 ? 'warning' : 'normal'} icon="🩸" />
      </View>

      <View style={s.actions}>
        <Text style={s.actionsTitle}>Ações Rápidas</Text>
        <TouchableOpacity style={s.btnPrimary} onPress={() => navigation.navigate('Analyze')}>
          <Text style={s.btnPrimaryText}>Analisar Risco Cardiovascular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} onPress={() => navigation.navigate('Chat')}>
          <Text style={s.btnSecondaryText}>Consultar Assistente IA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, marginTop: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#f1f5f9' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
  apiStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  apiText: { fontSize: 12, color: '#94a3b8' },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  card: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardLabel: { fontSize: 12, color: '#94a3b8' },
  cardIcon: { fontSize: 20 },
  cardValue: { fontSize: 28, fontWeight: '700', color: '#f1f5f9' },
  cardUnit: { fontSize: 13, fontWeight: '400', color: '#94a3b8' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  actions: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginTop: 4, marginBottom: 32, borderWidth: 1, borderColor: '#334155' },
  actionsTitle: { fontSize: 15, fontWeight: '600', color: '#f1f5f9', marginBottom: 12 },
  btnPrimary: { backgroundColor: '#ef4444', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 10 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary: { backgroundColor: '#334155', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnSecondaryText: { color: '#f1f5f9', fontSize: 15 },
})
