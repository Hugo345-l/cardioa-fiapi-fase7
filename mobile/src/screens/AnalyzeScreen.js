import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { analyzeRisk } from '../api'

const INIT = { age_years: '', gender: 2, height: '', weight: '', ap_hi: '', ap_lo: '', cholesterol: 1, gluc: 1, smoke: 0, alco: 0, active: 1 }

export default function AnalyzeScreen() {
  const [form, setForm] = useState(INIT)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function submit() {
    setError(''); setResult(null); setLoading(true)
    try {
      const payload = { ...form, age_years: Number(form.age_years), height: Number(form.height), weight: Number(form.weight), ap_hi: Number(form.ap_hi), ap_lo: Number(form.ap_lo) }
      setResult(await analyzeRisk(payload))
    } catch { setError('Erro ao conectar. Verifique a conexão.') }
    finally { setLoading(false) }
  }

  const riskColors = { 'Alto Risco': '#ef4444', 'Médio Risco': '#f59e0b', 'Baixo Risco': '#22c55e' }
  const riskColor = result ? riskColors[result.classificacao_risco] || '#94a3b8' : '#94a3b8'

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>Análise de Risco</Text>
      <Text style={s.subtitle}>Preencha os dados clínicos do paciente</Text>

      <View style={s.section}>
        {[['Idade (anos)', 'age_years'], ['Altura (cm)', 'height'], ['Peso (kg)', 'weight'], ['Pressão Sistólica', 'ap_hi'], ['Pressão Diastólica', 'ap_lo']].map(([label, key]) => (
          <View key={key} style={s.field}>
            <Text style={s.label}>{label}</Text>
            <TextInput style={s.input} keyboardType="numeric" value={String(form[key])} onChangeText={v => set(key, v)} placeholderTextColor="#475569" />
          </View>
        ))}

        {[
          ['Sexo', 'gender', [{ label: 'Feminino', value: 1 }, { label: 'Masculino', value: 2 }]],
          ['Colesterol', 'cholesterol', [{ label: 'Normal', value: 1 }, { label: 'Acima', value: 2 }, { label: 'Muito Acima', value: 3 }]],
          ['Glicose', 'gluc', [{ label: 'Normal', value: 1 }, { label: 'Acima', value: 2 }, { label: 'Muito Acima', value: 3 }]],
          ['Fumante', 'smoke', [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }]],
          ['Álcool', 'alco', [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }]],
          ['Ativo Fisicamente', 'active', [{ label: 'Sim', value: 1 }, { label: 'Não', value: 0 }]],
        ].map(([label, key, opts]) => (
          <View key={key} style={s.field}>
            <Text style={s.label}>{label}</Text>
            <View style={s.pickerWrap}>
              <Picker selectedValue={form[key]} onValueChange={v => set(key, v)} style={s.picker} dropdownIconColor="#94a3b8">
                {opts.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} color="#f1f5f9" />)}
              </Picker>
            </View>
          </View>
        ))}
      </View>

      {!!error && <Text style={s.error}>{error}</Text>}

      <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Calcular Risco</Text>}
      </TouchableOpacity>

      {result && (
        <View style={s.result}>
          <View style={[s.riskCard, { borderColor: riskColor }]}>
            <Text style={s.riskLabel}>Classificação de Risco</Text>
            <Text style={[s.riskValue, { color: riskColor }]}>{result.classificacao_risco}</Text>
            <Text style={s.riskPct}>{result.probabilidade_pct}</Text>
            <Text style={s.riskSub}>probabilidade cardiovascular</Text>
          </View>

          <View style={s.protocols}>
            <Text style={s.protocolsTitle}>Protocolos Sugeridos</Text>
            {result.protocolos_sugeridos.map((p, i) => (
              <Text key={i} style={s.protocol}>• {p}</Text>
            ))}
          </View>
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#f1f5f9', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4, marginBottom: 20 },
  section: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  field: { marginBottom: 14 },
  label: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 7, padding: 10, color: '#f1f5f9', fontSize: 14 },
  pickerWrap: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 7, overflow: 'hidden' },
  picker: { color: '#f1f5f9', height: 44 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 8 },
  btn: { backgroundColor: '#ef4444', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 20 },
  btnDisabled: { backgroundColor: '#475569' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  result: { gap: 12 },
  riskCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 20, borderWidth: 2, alignItems: 'center' },
  riskLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  riskValue: { fontSize: 26, fontWeight: '800' },
  riskPct: { fontSize: 40, fontWeight: '700', color: '#f1f5f9', marginTop: 4 },
  riskSub: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  protocols: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155' },
  protocolsTitle: { fontSize: 14, fontWeight: '600', color: '#94a3b8', marginBottom: 10 },
  protocol: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginBottom: 6 },
})
