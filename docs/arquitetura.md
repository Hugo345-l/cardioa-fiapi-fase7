# CardioIA Fase 7 — Arquitetura Final

## Diagrama de Fluxo

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE HARDWARE                            │
│                                                                      │
│   ESP32 (MicroPython)                                                │
│   ┌─────────────────────────────────────────┐                        │
│   │  DHT22 → temperatura, umidade           │                        │
│   │  Push Button → BPM simulado             │                        │
│   │  LED → alerta visual (vermelho/apagado) │                        │
│   │  Buffer circular 100 leituras (offline) │                        │
│   └────────────────┬────────────────────────┘                        │
└────────────────────┼─────────────────────────────────────────────────┘
                     │ Serial / MQTT
                     ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND PYTHON (FastAPI)                          │
│                    Deploy: Render.com                                │
│                                                                      │
│   GET  /health      → status da API                                  │
│   POST /analyze     → Random Forest (modelo_cardio.pkl, Fase 6)      │
│                       Input:  11 variáveis clínicas                  │
│                       Output: probabilidade, risco, protocolos       │
│   POST /chat        → LLM via OpenRouter (gpt-4o-mini, Fase 5)       │
│                       Input:  mensagem do usuário                    │
│                       Output: resposta cardiológica                  │
└───────────┬──────────────────────────────────────────────────────────┘
            │ REST API (HTTPS)
     ┌──────┴──────┐
     ▼             ▼
┌─────────┐   ┌──────────┐
│   WEB   │   │  MOBILE  │
│         │   │          │
│ React   │   │  React   │
│ + Vite  │   │  Native  │
│         │   │  + Expo  │
│ Deploy: │   │  Build:  │
│ Vercel  │   │  EAS →   │
│ CI/CD   │   │  .apk    │
└─────────┘   └──────────┘
     │               │
     └───────┬───────┘
             ▼
     Telas da aplicação:
     ┌─────────────────────────────────────┐
     │  /login     → autenticação          │
     │  /dashboard → vitais em tempo real  │
     │  /analyze   → formulário + resultado│
     │  /chat      → assistente LLM        │
     └─────────────────────────────────────┘
```

## Módulos e Herança das Fases

| Fase | Módulo | Como aparece na Fase 7 |
|------|--------|------------------------|
| Fase 3 | ESP32 C/C++ (DHT22, MQTT) | Convertido para MicroPython (`iot/main.py`) |
| Fase 5 | Assistente conversacional LLM | Endpoint `POST /chat` do backend |
| Fase 6 | Random Forest + Multiagente | Endpoint `POST /analyze` + `modelo_cardio.pkl` |

## Stack Tecnológica

| Camada | Tecnologia | Deploy |
|--------|-----------|--------|
| Backend | Python 3.12 + FastAPI + scikit-learn | Render.com |
| Frontend | React 18 + Vite 5 + React Router | Vercel (CI/CD) |
| Mobile | React Native + Expo SDK 56 | EAS Build → .apk |
| IoT | MicroPython (ESP32) | Wokwi (simulação) |
| ML Model | Random Forest Classifier (sklearn) | Embarcado no backend |
| LLM | GPT-4o-mini via OpenRouter | API externa |

## Fluxo de Dados — Análise de Risco

```
Médico preenche formulário (11 variáveis clínicas)
         ↓
Frontend envia POST /analyze ao Backend
         ↓
Backend carrega modelo_cardio.pkl (Random Forest, Fase 6)
         ↓
modelo.predict_proba(dados) → probabilidade [0.0 – 1.0]
         ↓
Classificação:
  ≥ 0.70 → Alto Risco  (protocolos urgentes)
  ≥ 0.40 → Médio Risco (protocolos ambulatoriais)
  < 0.40 → Baixo Risco (orientações preventivas)
         ↓
RespostaFinal { probabilidade, classificacao_risco,
                protocolos_sugeridos, resumo }
         ↓
Frontend exibe resultado visual com cor + lista de protocolos
```
