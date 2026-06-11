# CardioIA Fase 7 — Planejamento de Execução

**Data de início:** Junho 2026  
**Equipe:** Bruno Castro (RM558359) · Hugo Mariano (RM560688) · Matheus Castro (RM559293)

---

## Visão Geral

A Fase 7 integra tudo que foi construído nas 6 fases anteriores em uma plataforma completa com:
- Frontend Web deployado na Vercel com CI/CD
- App Mobile com APK gerado via Expo EAS Build
- Backend Python (FastAPI) conectando frontend → ML (Fase 6) → LLM (Fase 5)
- IoT em MicroPython simulado no Wokwi (evolução do código C/C++ da Fase 3)

---

## O Que Já Temos (Herança das Fases)

| Fase | O que existe | Onde está | Relevância p/ Fase 7 |
|------|-------------|-----------|----------------------|
| Fase 3 | ESP32 C/C++ com DHT22, MQTT, Node-RED | `../Ano 2 Fase 3/` | **Base para converter a MicroPython** |
| Fase 4 | CNN + Transfer Learning (chest X-ray) | `../Fase 4/Trab_ml_F4.ipynb` | Referência de análise de imagens |
| Fase 5 | Assistente conversacional LLM | GitHub castromatheus5050 | **Integrar no backend `/chat`** |
| Fase 6 | Random Forest + Multiagente OpenAI SDK | `../ano2_fase6/` | **Integrar no backend `/analyze`** |

---

## Stack Tecnológica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend Web | React + Vite | Especificado no enunciado |
| Mobile | React Native + Expo | Especificado no enunciado |
| Backend | FastAPI (Python) | Especificado no enunciado + compatível com Fase 6 |
| Deploy Web | Vercel | Especificado no enunciado |
| Deploy Mobile | Expo EAS Build | Especificado no enunciado |
| IoT | MicroPython + Wokwi | Especificado no enunciado |
| Modelo ML | Random Forest (modelo_cardio.pkl da Fase 6) | Já treinado |
| LLM | OpenRouter (GPT-4o-mini via OpenAI Agents SDK) | Já configurado na Fase 5/6 |

---

## Critérios de Pontuação e Estratégia

| Critério | Pts | Estratégia |
|----------|-----|-----------|
| Vercel URL + APK acessíveis | 3,0 | **Prioridade máxima** — fazer primeiro |
| Backend unificado com IA | 2,5 | FastAPI com endpoints `/analyze` e `/chat` |
| MicroPython Wokwi | 1,5 | Converter `cardioIA_esp32_v4_mqtt.ino` para `.py` |
| Diagrama de arquitetura | 1,5 | Flowchart claro no PDF |
| README + PDF + vídeo | 1,5 | Fazer ao final com prints reais |
| **Grupo 4–5 pessoas (Extra)** | **+1,0** | Verificar se conseguem adicionar mais 1–2 membros |

---

## Etapas de Execução

### ETAPA 1 — Backend Python (FastAPI)
**Responsável:** _a definir_  
**Prioridade:** Alta (bloqueia frontend + mobile)

**O que fazer:**
1. Criar `backend/main.py` com FastAPI
2. Endpoint `POST /analyze` — recebe 11 variáveis clínicas, chama `modelo_cardio.pkl` da Fase 6, retorna `RespostaFinal`
3. Endpoint `POST /chat` — recebe mensagem do usuário, chama o LLM da Fase 5
4. Endpoint `POST /sensor` — recebe dados do ESP32 (temperatura, umidade, bpm) e armazena
5. Endpoint `GET /sensor/latest` — retorna últimas leituras para o frontend
6. CORS habilitado para o domínio Vercel
7. Deploy no Render.com (ou Railway) — URL pública para o frontend consumir

**Arquivos a criar:**
```
backend/
├── main.py              FastAPI app
├── ml_service.py        Carrega modelo_cardio.pkl e faz predições
├── llm_service.py       Integração com agentes da Fase 5/6
├── requirements.txt     fastapi, uvicorn, scikit-learn, joblib, openai-agents
└── Procfile             Para deploy no Render
```

**Dependências críticas:**
- Copiar `modelo_cardio.pkl` e `feature_names.json` da Fase 6 para `backend/`
- Configurar variável `OPENROUTER_API_KEY` no Render

---

### ETAPA 2 — IoT MicroPython (Wokwi)
**Responsável:** _a definir_  
**Prioridade:** Alta (1,5 pts diretos + independente do backend)

**O que fazer:**
1. Converter `cardioIA_esp32_v4_mqtt.ino` (C/C++) para MicroPython
2. Manter mesma lógica: DHT22 + BPM simulado + MQTT + resiliência offline
3. Adicionar feedback visual (LED ou OLED display)
4. Simular no Wokwi e gerar link público

**Arquivo a criar:**
```
iot/
├── main.py              Código MicroPython principal
├── boot.py              Configuração inicial (WiFi)
├── wokwi/
│   └── diagram.json     Circuito no Wokwi
└── README.md            Link do projeto Wokwi + explicação
```

**Mapeamento C/C++ → MicroPython:**
```
// C/C++                          # MicroPython
#include "DHT.h"           →      import dht
WiFi.begin(ssid, pass)     →      sta_if.connect(ssid, pass)
client.publish(topic, val) →      mqtt_client.publish(topic, val)
pinMode/digitalWrite       →      machine.Pin
delay(ms)                  →      time.sleep_ms(ms)
Serial.println(msg)        →      print(msg)
```

---

### ETAPA 3 — Frontend Web (React + Vite)
**Responsável:** _a definir_  
**Prioridade:** Alta (3,0 pts com deploy)

**O que fazer:**
1. Criar app React + Vite com as telas:
   - **Login** (autenticação simples)
   - **Dashboard** — exibe leituras do sensor em tempo real + gráficos
   - **Análise de Risco** — formulário com 11 variáveis clínicas → exibe `RespostaFinal`
   - **Chat Cardiológico** — interface de chat com LLM
2. Conectar ao backend via REST API
3. Configurar `vercel.json` para SPA routing
4. Fazer deploy na Vercel com CI/CD (auto-deploy no push para main)

**Arquivos de configuração obrigatórios:**
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Telas mínimas:**
```
/login         → formulário de login
/dashboard     → leituras IoT em tempo real (polling GET /sensor/latest)
/analyze       → formulário das 11 variáveis → mostra risco + protocolos
/chat          → chat com assistente cardiológico
```

---

### ETAPA 4 — Mobile (React Native + Expo)
**Responsável:** _a definir_  
**Prioridade:** Alta (incluso nos 3,0 pts)

**O que fazer:**
1. Criar app React Native com as mesmas telas do frontend web (adaptadas para mobile)
2. Configurar `app.json` e `eas.json`
3. Gerar `.apk` via `eas build --platform android --profile preview`

**Configurações obrigatórias:**
```json
// app.json (trecho)
{
  "expo": {
    "android": {
      "package": "br.com.cardioai.app"
    }
  }
}

// eas.json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

### ETAPA 5 — Documentação e Vídeo
**Responsável:** _a definir_  
**Prioridade:** Média (fazer por último com prints reais)

**O que fazer:**
1. **Relatório PDF (máx. 5 páginas):**
   - Página 1: Visão geral + diagrama de arquitetura
   - Página 2: Backend Python (endpoints, integração ML/LLM)
   - Página 3: IoT MicroPython (fluxo de dados, circuito Wokwi)
   - Página 4: Frontend/Mobile (telas, UX decisions)
   - Página 5: Resultados, limitações, próximos passos
2. **Vídeo demo (até 5 min):**
   - Mostrar Wokwi rodando MicroPython
   - Dados chegando no dashboard Web (Vercel URL)
   - Análise de risco retornando resultado
   - Chat respondendo pergunta cardíaca
   - Mostrar APK no celular
3. Atualizar `README.md` com todos os links reais

---

## Checklist de Entrega Final

### Repositório
- [ ] Código Web (React+Vite) commitado em `frontend/`
- [ ] Código Mobile (React Native+Expo) commitado em `mobile/`
- [ ] Backend Python commitado em `backend/` (sem `.env` com chaves)
- [ ] Script MicroPython commitado em `iot/`
- [ ] `vercel.json` presente na raiz ou em `frontend/`
- [ ] `app.json` com `android.package` em domínio invertido
- [ ] `eas.json` com perfil `preview`

### Deploy
- [ ] URL Vercel funcionando (login + dashboard + análise + chat)
- [ ] `.apk` acessível via link do Expo ou para download direto
- [ ] Backend deployado (Render/Railway) com variáveis de ambiente configuradas

### IoT
- [ ] Link Wokwi público com MicroPython rodando
- [ ] LED/OLED reagindo a valores críticos
- [ ] Dados sendo publicados via MQTT ou HTTP para o backend

### Docs
- [ ] Relatório PDF (máx. 5 páginas) em `docs/`
- [ ] Vídeo demo de até 5 minutos (YouTube unlisted ou Google Drive)
- [ ] README.md atualizado com todos os links

---

## Ordem Sugerida de Trabalho

```
Semana 1:
  ├── Backend: FastAPI + integração com modelo_cardio.pkl  [mais crítico]
  └── IoT: Converter C++ para MicroPython no Wokwi        [independente]

Semana 2:
  ├── Frontend: React+Vite + telas principais
  └── Mobile: React Native + configuração EAS

Semana 3:
  ├── Deploy: Vercel (frontend) + Render (backend)
  ├── EAS Build: gerar .apk
  └── Integração completa end-to-end

Semana 4:
  ├── Testes e ajustes
  ├── Relatório PDF
  └── Gravação do vídeo demo
```

---

## Pontos de Atenção

1. **Backend antes do frontend** — o frontend não funciona sem a API
2. **CORS no backend** — habilitar para o domínio Vercel antes do deploy
3. **Variáveis de ambiente** — `OPENROUTER_API_KEY` nunca vai pro git, só para o Render
4. **`modelo_cardio.pkl`** — copiar da Fase 6, não retreinar (já validado)
5. **Wokwi MicroPython** — salvar o link do projeto antes de fechar a aba
6. **EAS Build** — exige conta Expo gratuita + `expo login` no terminal
7. **Ponto extra** — tentar adicionar 1 ou 2 membros à equipe (atual: 3, ideal: 4–5)
