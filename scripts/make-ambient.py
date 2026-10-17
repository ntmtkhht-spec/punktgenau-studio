"""Erzeugt einen ruhigen, eigenen Klangteppich (keine Lizenzfragen, kein Content-ID-Risiko).

Aufbau: weiche Akkordflaechen (a-Moll-Umfeld), leiser Sinus-Bass, sparsames Zupf-Arpeggio.
Aufruf: python scripts/make-ambient.py <ausgabe.wav> <dauer_sekunden>
"""
import sys
import wave

import numpy as np

SR = 48000
BPM = 72
BEAT = 60 / BPM
BAR = 4 * BEAT
# Akkorde (MIDI-Noten), je 2 Takte: Am9, Fmaj7, Cmaj7/E, G6
CHORDS = [
    [57, 60, 64, 67, 71],
    [53, 57, 60, 64, 69],
    [52, 55, 60, 64, 67],
    [55, 59, 62, 64, 67],
]
BASS = [45, 41, 40, 43]


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def envelope(n: int, attack: float, release: float) -> np.ndarray:
    # kurze letzte Segmente: Ein-/Ausblenden auf die Segmentlaenge begrenzen (sonst Absturz)
    a = max(1, min(int(attack * SR), n // 2))
    r = max(1, min(int(release * SR), n // 2))
    env = np.ones(n)
    env[:a] = np.linspace(0, 1, a)
    env[-r:] *= np.linspace(1, 0, r)
    return env


def pad(t: np.ndarray, notes: list[int]) -> np.ndarray:
    out = np.zeros_like(t)
    for i, m in enumerate(notes):
        f = hz(m)
        for detune in (-0.12, 0.12):  # leichte Schwebung statt Effekte
            ff = f * 2 ** (detune / 12 / 10)
            out += np.sin(2 * np.pi * ff * t + i) * 0.6 + 0.15 * np.sin(2 * np.pi * 2 * ff * t)
    return out / (len(notes) * 2)


def pluck(t: np.ndarray, f: float) -> np.ndarray:
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 5.5)


def render(duration: float) -> np.ndarray:
    n = round(duration * SR)
    left = np.zeros(n)
    right = np.zeros(n)
    seg = 2 * BAR
    k = 0
    start = 0.0
    while start < duration:
        chord = CHORDS[k % len(CHORDS)]
        length = min(seg + 1.5, duration - start)  # Ueberlappung fuer weiche Uebergaenge
        i0 = int(start * SR)
        m = int(length * SR)
        t = np.arange(m) / SR
        env = envelope(m, 1.6, 1.8)
        body = pad(t, chord) * env
        bass = np.sin(2 * np.pi * hz(BASS[k % len(BASS)]) * t) * env * 0.55
        end = min(n, i0 + m)
        left[i0:end] += (body * 0.9 + bass)[: end - i0]
        right[i0:end] += (body * 1.0 + bass)[: end - i0]
        # Zupf-Arpeggio: Achtel, sparsam (jede zweite Achtel), abwechselnd links/rechts
        steps = int(seg / (BEAT / 2))
        for s in range(0, steps, 2):
            ts = start + s * BEAT / 2
            if ts >= duration:
                break
            note = chord[(s // 2) % len(chord)] + 12
            pm = int(1.2 * SR)
            pt = np.arange(pm) / SR
            p = pluck(pt, hz(note)) * 0.18
            j0 = int(ts * SR)
            j1 = min(n, j0 + pm)
            target = left if (s // 2) % 2 == 0 else right
            target[j0:j1] += p[: j1 - j0]
        start += seg
        k += 1
    stereo = np.stack([left, right], axis=1)
    # sanftes Glätten (einfacher Tiefpass) gegen Haerte
    kernel = np.ones(24) / 24
    stereo = np.stack([np.convolve(stereo[:, c], kernel, mode="same") for c in range(2)], axis=1)
    fade_in = envelope(n, 2.0, 2.5)[:, None]
    stereo *= fade_in
    peak = np.max(np.abs(stereo)) or 1.0
    return stereo / peak * 0.5  # ca. -6 dBFS Spitze; Lautstaerke regelt das Video


def main() -> None:
    out, dur = sys.argv[1], float(sys.argv[2])
    audio = render(dur)
    pcm = (audio * 32767).astype(np.int16)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{out}: {dur:.1f} s")


if __name__ == "__main__":
    main()
