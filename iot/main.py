"""
CardioIA – Fase 7 · MicroPython ESP32
Sensores: DHT22 (temperatura/umidade) + simulação de BPM
Saída:    Serial + LED indicador de alerta
Simular no Wokwi: https://wokwi.com
"""
import time
import random
import machine
import dht

# ── Pinos ────────────────────────────────────────────────────────────────────
DHT_PIN  = machine.Pin(4)
LED_PIN  = machine.Pin(2, machine.Pin.OUT)   # LED built-in ESP32
BTN_PIN  = machine.Pin(15, machine.Pin.IN, machine.Pin.PULL_UP)

sensor = dht.DHT22(DHT_PIN)

# ── Buffer de resiliência offline ─────────────────────────────────────────────
BUFFER_SIZE = 100
buffer = []

# ── Controle de BPM simulado ──────────────────────────────────────────────────
beat_count   = 0
window_start = time.ticks_ms()
last_btn     = False

def calcular_bpm():
    """Incrementa contador de batidas e calcula BPM a cada 10 s."""
    global beat_count, window_start, last_btn
    btn_state = not BTN_PIN.value()   # pull-up: LOW = pressionado
    if btn_state and not last_btn:
        beat_count += 1
    last_btn = btn_state

    elapsed = time.ticks_diff(time.ticks_ms(), window_start) / 1000
    if elapsed >= 10:
        bpm = int(beat_count * (60 / elapsed))
        beat_count   = 0
        window_start = time.ticks_ms()
        return bpm
    return None


def ler_sensores():
    """Lê DHT22 e retorna (temp, umid). Retorna None em caso de falha."""
    try:
        sensor.measure()
        return sensor.temperature(), sensor.humidity()
    except OSError:
        return None, None


def alerta(temp, bpm):
    """Acende LED se temperatura ou BPM críticos."""
    critico = (temp is not None and temp > 38) or (bpm is not None and bpm > 120)
    LED_PIN.value(1 if critico else 0)
    return critico


def publicar(dados):
    """
    Em hardware real: publicar via MQTT.
    No Wokwi: imprime no Serial para demonstração.
    """
    print(f"[CardioIA] temp={dados['temp']:.1f}°C | umid={dados['umid']:.0f}% | bpm={dados['bpm']} | alerta={dados['alerta']}")


# ── Loop principal ────────────────────────────────────────────────────────────
print("CardioIA ESP32 MicroPython – iniciando...")
bpm_simulado = 72   # valor inicial enquanto o botão não é usado

while True:
    temp, umid = ler_sensores()

    # Fallback simulado se sensor falhar (modo demo Wokwi sem DHT22 físico)
    if temp is None:
        temp = round(36.0 + random.uniform(0, 2.5), 1)
        umid = round(55.0 + random.uniform(0, 20), 1)

    # Calcula BPM pelo botão ou mantém simulado
    novo_bpm = calcular_bpm()
    if novo_bpm is not None:
        bpm_simulado = novo_bpm
    else:
        # Simula leve variação para demo
        bpm_simulado = max(50, min(150, bpm_simulado + random.randint(-3, 3)))

    em_alerta = alerta(temp, bpm_simulado)

    dados = {
        "temp":   temp,
        "umid":   umid,
        "bpm":    bpm_simulado,
        "alerta": em_alerta,
    }

    # Tenta publicar; se falhar, armazena no buffer
    try:
        publicar(dados)
        # Esvazia buffer se havia dados acumulados
        if buffer:
            print(f"[CardioIA] sincronizando {len(buffer)} leituras do buffer...")
            for d in buffer:
                publicar(d)
            buffer.clear()
    except Exception as e:
        print(f"[CardioIA] offline – armazenando no buffer ({len(buffer)+1}/{BUFFER_SIZE})")
        if len(buffer) >= BUFFER_SIZE:
            buffer.pop(0)   # descarta leitura mais antiga (buffer circular)
        buffer.append(dados)

    time.sleep(2)
