import json
import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CardioIA API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Carregar modelo ML no startup ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)

try:
    model = joblib.load(os.path.join(BASE_DIR, "modelo_cardio.pkl"))
    with open(os.path.join(BASE_DIR, "feature_names.json"), encoding="utf-8") as f:
        feature_names = json.load(f)
    with open(os.path.join(BASE_DIR, "protocolos_medicos.json"), encoding="utf-8") as f:
        protocolos = json.load(f)
except Exception as e:
    raise RuntimeError(f"Erro ao carregar modelo: {e}")


# ── Schemas ────────────────────────────────────────────────────────────────────
class PacienteInput(BaseModel):
    age_years: float
    gender: int        # 1=feminino, 2=masculino
    height: float      # cm
    weight: float      # kg
    ap_hi: int         # pressão sistólica
    ap_lo: int         # pressão diastólica
    cholesterol: int   # 1=normal, 2=acima, 3=muito acima
    gluc: int          # 1=normal, 2=acima, 3=muito acima
    smoke: int         # 0/1
    alco: int          # 0/1
    active: int        # 0/1


class ChatInput(BaseModel):
    message: str
    session_id: str = "default"


# ── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/analyze")
def analyze(paciente: PacienteInput):
    dados = {f: getattr(paciente, f) for f in feature_names}
    X = pd.DataFrame([dados])

    prob = float(model.predict_proba(X)[0][1])

    if prob >= 0.70:
        risco = "Alto Risco"
        protocolo_key = "alto_risco"
        cor = "red"
    elif prob >= 0.40:
        risco = "Médio Risco"
        protocolo_key = "medio_risco"
        cor = "yellow"
    else:
        risco = "Baixo Risco"
        protocolo_key = "baixo_risco"
        cor = "green"

    return {
        "probabilidade": round(prob, 4),
        "probabilidade_pct": f"{prob * 100:.1f}%",
        "classificacao_risco": risco,
        "cor": cor,
        "protocolos_sugeridos": protocolos[protocolo_key],
        "resumo": (
            f"Paciente com probabilidade de {prob * 100:.1f}% de risco cardiovascular. "
            f"Classificação: {risco}. "
            f"Recomenda-se seguir os protocolos clínicos listados."
        ),
    }


@app.post("/chat")
async def chat(body: ChatInput):
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        return {
            "response": (
                "Assistente CardioIA: a chave de API não está configurada. "
                "Configure OPENROUTER_API_KEY nas variáveis de ambiente."
            )
        }

    system_prompt = (
        "Você é um assistente médico especializado em cardiologia da plataforma CardioIA. "
        "Responda de forma clara, objetiva e empática. "
        "Sempre recomende consulta médica para questões específicas de saúde. "
        "Responda sempre em português."
    )

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": body.message},
                ],
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao contatar o LLM.")

    data = resp.json()
    return {"response": data["choices"][0]["message"]["content"]}
