# CardioIA – IoT MicroPython (ESP32)

> 🔗 **Simulação pública no Wokwi:** https://wokwi.com/projects/466498872535316481

## Como simular no Wokwi

1. Acesse [wokwi.com](https://wokwi.com) e crie um novo projeto **MicroPython (ESP32)**
2. Cole o conteúdo de `wokwi/diagram.json` no editor de diagrama
3. Cole o conteúdo de `main.py` no arquivo `main.py` do projeto
4. Clique em **▶ Start Simulation**
5. Observe o Serial Monitor com as leituras a cada 2 segundos

## Circuito

| Componente | Pino ESP32 |
|---|---|
| DHT22 (dados) | GPIO 4 |
| Push Button | GPIO 15 (PULL_UP) |
| LED (alerta) | GPIO 2 (built-in) |

## Comportamento

- Leitura de temperatura e umidade a cada 2 s
- BPM calculado pelo botão (cada pressão = 1 batimento, janela de 10 s)
- LED acende vermelho quando: temperatura > 38 °C ou BPM > 120
- Buffer circular de 100 leituras para resiliência offline

## Conversão do código C/C++ (Fase 3)

| Arduino C++ | MicroPython |
|---|---|
| `#include "DHT.h"` | `import dht` |
| `dht.readTemperature()` | `sensor.temperature()` |
| `pinMode/digitalWrite` | `machine.Pin` |
| `delay(ms)` | `time.sleep_ms(ms)` |
| `Serial.println()` | `print()` |
| `client.publish(topic, val)` | `mqtt_client.publish(topic, val)` |
