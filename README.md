# CardioIA — Fase 7: Plataforma de Inteligência Cardíaca Total

**FIAP · ITIAOR2**

| Integrante | RM |
|---|---|
| Bruno Castro | 558359 |
| Hugo Mariano | 560688 |
| Matheus Castro | 559293 |

---

## Links de Entrega

| Entregável | Link |
|---|---|
| Web (Vercel) | _a preencher após deploy_ |
| APK (.apk) | _a preencher após EAS Build_ |
| Wokwi (MicroPython) | _a preencher_ |
| Vídeo Demo | _a preencher_ |

---

## Estrutura do Repositório

```
cardioai-fase7/
├── frontend/       React + Vite (aplicação web)
├── mobile/         React Native + Expo (app mobile)
├── backend/        FastAPI Python (serviço integrador)
├── iot/            MicroPython para ESP32 (Wokwi)
├── docs/           Relatório PDF + diagrama de arquitetura
├── enunciado/      Enunciado oficial da atividade
└── referencias/    Resumo das fases anteriores
```

---

## Arquitetura Final

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE HARDWARE                      │
│  [ESP32 MicroPython]                                        │
│  DHT22 + BPM sensor → MQTT → broker                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ MQTT / HTTP
┌──────────────────────▼──────────────────────────────────────┐
│                   BACKEND PYTHON (FastAPI)                  │
│  /analyze   → Fase 6: Random Forest (modelo_cardio.pkl)    │
│  /chat      → Fase 5: LLM conversacional                   │
│  /sensor    → Recebe dados IoT em tempo real               │
└──────────┬────────────────────────────┬────────────────────┘
           │ REST API                   │ REST API
┌──────────▼──────────┐    ┌────────────▼────────────────────┐
│   WEB (React+Vite)  │    │   MOBILE (React Native+Expo)   │
│   deploy: Vercel    │    │   build: EAS → .apk             │
│   CI/CD: GitHub     │    │                                  │
└─────────────────────┘    └─────────────────────────────────┘
```

---

## Como Executar Localmente

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## Deploy

### Web (Vercel)
```bash
# Na raiz do repositório
vercel --prod
```

### Mobile (.apk via EAS)
```bash
cd mobile
eas build --platform android --profile preview
```

---

## Instalação do APK

1. Baixar o arquivo `.apk` do link acima
2. No Android: Configurações → Segurança → Permitir fontes desconhecidas
3. Instalar o arquivo `.apk`
