# Referências das Fases Anteriores — CardioIA

## Fase 1 — Coleta de Dados
- **Repo:** https://github.com/castromatheus5050/Fase1Cap1-FIAP-ITIAOR2
- **Foco:** Coleta e estruturação inicial de dados cardíacos

## Fase 2 — Diagnóstico Automatizado
- **Repo:** https://github.com/castromatheus5050/Fase2Cap1-FIAP
- **Foco:** Diagnóstico automatizado

## Fase 3 — Monitoramento IoT
- **Repo:** não publicado no GitHub (arquivos locais em `../Ano 2 Fase 3/`)
- **Foco:** ESP32 (C/C++) + DHT22 + Push Button, MQTT via HiveMQ, dashboard Node-RED
- **Arquivos chave:**
  - `cardioIA_esp32_v4_mqtt.ino` — código completo com WiFi + MQTT + resiliência offline
  - `cardioIA_nodered_flow_basico.json` — flow Node-RED
  - Tópicos MQTT: `cardioIA/temperatura`, `cardioIA/umidade`, `cardioIA/bpm`, `cardioIA/status`

## Fase 4 — Análise de Imagens (Visão Computacional)
- **Repo:** https://github.com/Hugo345-l/ano_2_fase_4
- **Foco:** CNN do zero + Transfer Learning (VGG16/ResNet50) sobre dataset Chest X-Ray (Pneumonia)
- **Arquivos locais:** `../Fase 4/Trab_ml_F4.ipynb`

## Fase 5 — Assistência Conversacional (LLM)
- **Repo:** https://github.com/castromatheus5050/FIAP_Fase5Cap1_ITAOR2
- **Foco:** Agente conversacional para saúde cardíaca

## Fase 6 — Sistema Preditivo Multiagente
- **Repo:** https://github.com/Hugo345-l/fiap_ano2_fase6
- **Arquivos locais:** `../ano2_fase6/fiap_ano2_fase6/`
- **Foco:** Random Forest (modelo_cardio.pkl) + OpenAI Agents SDK (padrão CHAIN)
  - 3 agentes: Orquestrador → Analista_Risco_Cardiaco → Especialista_Protocolos
  - Input: 11 variáveis clínicas
  - Output: `RespostaFinal` (probabilidade, classificacao_risco, protocolos_sugeridos, resumo)
  - Usa OpenRouter (GPT-4o-mini) + SQLiteSession para histórico
