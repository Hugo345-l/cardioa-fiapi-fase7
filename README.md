# FIAP - Faculdade de Informática e Administração Paulista

<p align="center">
  <a href="https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP - Faculdade de Informática e Administração Paulista" border="0" width="40%" height="40%"></a>
</p>

<br>

# CardioIA — Fase 7: Plataforma de Inteligência Cardíaca Total

## 👨‍🎓 Integrantes
- [Bruno Castro - RM558359](https://www.linkedin.com/in/bruno-castro-dias/)
- [Hugo Mariano - RM560688](https://www.linkedin.com/in/hugomariano191628150/)
- [Matheus Castro - RM559293](https://www.linkedin.com/in/matheus-castro-63644b224/)


### Coordenador(a)
- André Godoi Chiovato

---

## 📜 Descrição

A **Fase 7** marca o ápice da CardioIA como uma **Plataforma de Inteligência Cardíaca Total**. Após percorrer coleta de dados (Fase 1), diagnóstico automatizado (Fase 2), monitoramento IoT (Fase 3), análise de imagens (Fase 4), assistência conversacional (Fase 5) e orquestração multiagente (Fase 6), esta etapa converte toda a inteligência preditiva e analítica construída em um **produto digital funcional, seguro e centrado no usuário**.

Se na Fase 6 o objetivo era o **"Cérebro"** da CardioIA (previsão de risco), na Fase 7 o objetivo é o **"Corpo"** da solução: a interface que conecta médico e paciente aos insights de IA em tempo real, integrando back-end, front-end, mobile, LLMs e sensores IoT em uma única arquitetura orquestrada por Python.

A plataforma permite que um profissional de saúde:
- **Monitore** sinais vitais em tempo real (dashboard Web e Mobile)
- **Analise** o risco cardiovascular de um paciente via modelo de Machine Learning (Random Forest treinado na Fase 6)
- **Consulte** um assistente conversacional especializado em cardiologia (LLM)
- **Receba** dados de sensores IoT simulados em MicroPython (ESP32)

> 🎥 **Vídeo demonstrativo:** _(link a ser adicionado após gravação)_

---

## 🔗 Links de Entrega

| Entregável | Link |
|---|---|
| 🌐 Aplicação Web (Vercel) | _a preencher após deploy_ |
| ⚙️ API Backend (Render) | https://cardioai-backend-6ppy.onrender.com |
| 📱 Build Mobile (.apk via EAS) | _a preencher após EAS Build_ |
| 🔌 Simulação IoT (Wokwi MicroPython) | _a preencher_ |
| 🎬 Vídeo Demonstrativo (até 5 min) | _a preencher_ |

---

## 🏗️ Arquitetura Final

```
┌──────────────────────────────────────────────────────────────┐
│                     CAMADA DE HARDWARE                       │
│   ESP32 (MicroPython)                                        │
│   DHT22 (temp/umid) + Push Button (BPM) + LED (alerta)      │
│   Buffer circular 100 leituras (resiliência offline)        │
└──────────────────────┬───────────────────────────────────────┘
                       │ Serial / MQTT
┌──────────────────────▼───────────────────────────────────────┐
│                BACKEND PYTHON (FastAPI)                      │
│                Deploy: Render.com                            │
│   GET  /health   → status da API                            │
│   POST /analyze  → Random Forest (modelo_cardio.pkl, Fase 6)│
│   POST /chat     → LLM via OpenRouter (Fase 5)              │
└──────────┬─────────────────────────────┬─────────────────────┘
           │ REST API (HTTPS)            │ REST API (HTTPS)
┌──────────▼──────────┐    ┌─────────────▼────────────────────┐
│   WEB (React+Vite)  │    │   MOBILE (React Native + Expo)   │
│   Deploy: Vercel    │    │   Build: EAS → .apk               │
│   CI/CD: GitHub     │    │                                   │
└─────────────────────┘    └───────────────────────────────────┘
```

Detalhamento completo em [docs/arquitetura.md](docs/arquitetura.md).

---

## 📁 Estrutura do Repositório

- **backend/** — Serviço integrador em Python (FastAPI)
  - `main.py`: API com endpoints `/health`, `/analyze`, `/chat`
  - `modelo_cardio.pkl`: modelo Random Forest treinado na Fase 6
  - `protocolos_medicos.json`: base de protocolos clínicos por faixa de risco
  - `requirements.txt`, `render.yaml`: dependências e deploy

- **frontend/** — Aplicação Web (React + Vite)
  - `src/pages/`: Login, Dashboard, Análise de Risco, Chat
  - `src/api.js`: integração REST com o backend
  - `vercel.json`: configuração de rotas SPA para a Vercel

- **mobile/** — Aplicação Mobile (React Native + Expo)
  - `src/screens/`: telas espelhando o frontend Web
  - `app.json`: `android.package` em domínio invertido (`br.com.cardioai.app`)
  - `eas.json`: perfil `preview` para geração de APK

- **iot/** — Hardware em MicroPython
  - `main.py`: lógica de sensores convertida de C/C++ (Fase 3)
  - `wokwi/diagram.json`: circuito ESP32 + DHT22 + LED

- **docs/** — Documentação técnica e diagrama de arquitetura
- **enunciado/** — Enunciado oficial da atividade
- **referencias/** — Resumo das fases anteriores

---

## 🔧 Como Executar o Código

### Pré-requisitos
- Python 3.12, Node.js 18+
- Conta no [OpenRouter](https://openrouter.ai) (para o chat com LLM)

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # adicione sua OPENROUTER_API_KEY
uvicorn main:app --reload
```
API disponível em `http://localhost:8000` · Documentação interativa em `http://localhost:8000/docs`

### Frontend (React + Vite)

```bash
cd frontend
npm install
copy .env.example .env          # VITE_API_URL=http://localhost:8000
npm run dev
```
Aplicação em `http://localhost:5173`

### Mobile (React Native + Expo)

```bash
cd mobile
npm install
npx expo start                  # abra no Expo Go ou emulador
```

### IoT (MicroPython no Wokwi)
1. Acesse [wokwi.com](https://wokwi.com) → novo projeto **MicroPython (ESP32)**
2. Cole `iot/main.py` e `iot/wokwi/diagram.json`
3. Inicie a simulação e observe o Serial Monitor

---

## 🚀 Deploy

### Web (Vercel) — com CI/CD
- Repositório conectado à Vercel · **Root Directory:** `frontend`
- Variável de ambiente: `VITE_API_URL` apontando para o backend no Render
- Cada `git push` na branch `main` dispara um novo deploy automático

### Backend (Render) — Blueprint
- O `render.yaml` na raiz é detectado automaticamente pelo Render
- Variável de ambiente: `OPENROUTER_API_KEY`

### Mobile (.apk via EAS Build)
```bash
cd mobile
eas build --platform android --profile preview
```

---

## 📲 Instalação do APK

1. Baixe o arquivo `.apk` pelo link da seção **Links de Entrega** (ou escaneie o QR Code do dashboard Expo)
2. No Android, habilite **Configurações → Segurança → Instalar apps de fontes desconhecidas**
3. Abra o `.apk` baixado e confirme a instalação
4. Faça login e visualize os dados cardíacos

---

## 📸 Prints Comprobatórios

> _Imagens do deploy concluído (Vercel e Render) e do app instalado serão adicionadas aqui._

---

## 🗃 Histórico de versões

- 1.0 - 10/06/2026 - Versão inicial: backend, frontend, mobile e IoT integrados.

## 📋 Licença

Este projeto segue o modelo educacional FIAP e está licenciado sob Creative Commons Attribution 4.0 International.
