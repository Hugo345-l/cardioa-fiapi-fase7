# CardioIA – Fase 7: Plataforma de Inteligência Cardíaca Total

**Instituição:** FIAP  
**Disciplina:** ITIAOR2  
**Integrantes:** Bruno Castro (RM558359) · Hugo Mariano (RM560688) · Matheus Castro (RM559293)

---

## Contexto

Após percorrer as fronteiras da coleta de dados (Fase 1), diagnóstico automatizado (Fase 2), monitoramento IoT (Fase 3), análise de imagens (Fase 4), assistência conversacional (Fase 5) e, recentemente, a orquestração de sistemas preditivos multiagentes (Fase 6), a **Fase 7** marca o ápice da CardioIA como uma **Plataforma de Inteligência Cardíaca Total**.

Nesta etapa, o foco deixa de ser o desenvolvimento de módulos isolados e passa a ser a **integração transdisciplinar** e a materialização da solução. O desafio estratégico é converter a inteligência preditiva e analítica construída na fase anterior em um **produto digital funcional, seguro e centrado no usuário**.

Se na Fase 6 o objetivo era o "Cérebro" da CardioIA (previsão de picos de risco), na Fase 7 o objetivo é o **"Corpo"** da solução: a interface que conecta o médico e o paciente aos insights de IA em tempo real.

---

## Objetivo Geral

Desenvolver o MVP final e funcional da plataforma CardioIA, sendo capaz de:

1. Realizar o **deploy completo** da aplicação: Web (plataforma cloud) com CI/CD ativo e Mobile (arquivo `.apk` via EAS Build).
2. **Refinar a Experiência do Usuário (UX)**, focando na usabilidade e no fluxo de informação dos indicadores de risco.
3. **Integrar todos os módulos técnicos** desenvolvidos nas fases anteriores em uma única plataforma orquestrada por Python.
4. **Evoluir o hardware**, simulando o uso de MicroPython em microcontroladores de alto desempenho.
5. Trabalho em equipe (4–5 integrantes = **+1 ponto extra**).

---

## Atividade Detalhada

### PARTE 1 – Deploy e Distribuição Profissional (Front-End & Mobile)

**Web:**
- Publicar na Vercel (ou Render/Netlify/Cloudflare Pages/Firebase Hosting)
- Configurar `vercel.json` para suporte a rotas SPA
- Cada push no GitHub inicia um deploy automático (CI/CD)

**Mobile:**
- Configurar `app.json` e `eas.json`
- Build na nuvem do Expo → gerar `.apk` funcional

**Validação:**
- Testar a aplicação Web
- Instalar o `.apk` em dispositivo real
- Validar fluxo de login e visualização dos dados cardíacos

**Entregáveis Parte 1:**
- Repositório GitHub (privado, compartilhado com tutor) com código Web (React+Vite) e Mobile (React Native+Expo)
- `vercel.json` configurado para rotas SPA
- `app.json` com `android.package` em formato de domínio invertido
- `eas.json` com perfil `preview` para geração de APK
- `README.md` com: URL pública Vercel · link do `.apk` no dashboard Expo (ou QR Code) · prints comprobatórios · instruções de instalação

---

### PARTE 2 – Integração do Ecossistema e Arquitetura Final

**Back-end Integrador (Python):**
- Conectar as interfaces (Front-end) aos motores de IA (Modelos da Fase 6 + LLMs da Fase 5)

**Transição para MicroPython:**
- Converter lógica de captura/processamento de sensores (temperatura, batimentos simulados) de C/C++ para MicroPython
- Simular execução em ESP32 ou Raspberry Pi no **Wokwi**

**Arquitetura Final:**
- Consolidar fluxo: `Sensor → MicroPython → Backend Python → APIs de IA → UI`

**Entregáveis Parte 2:**
- Código-fonte integrado (GitHub privado):
  - Pasta `backend/` com scripts Python de integração
  - Pasta `iot/` com script `.py` para MicroPython
- Link público da simulação Wokwi em MicroPython (LED/OLED)
- **Relatório Técnico (PDF – máximo 5 páginas):**
  - Diagrama de Arquitetura Final
- **Vídeo Demonstrativo (até 5 minutos):**
  - Fluxo fim-a-fim: Wokwi → URL pública Vercel / APK

---

## Critérios de Avaliação

| Critério | Pontos |
|---|---|
| URLs funcionais (Vercel) e build mobile (.apk via EAS) acessíveis | 3,0 |
| Unificação funcional do backend com as interfaces e motores de IA | 2,5 |
| Conversão e funcionalidade correta da lógica de sensores no Wokwi | 1,5 |
| Clareza no diagrama final e fluidez na comunicação dos dados | 1,5 |
| Qualidade do README, do relatório PDF e clareza da demonstração | 1,5 |
| **Grupo de 4–5 integrantes (Extra)** | **+1,0** |
| **TOTAL** | **10 + 1** |
