"""Transkribiert Satz-Audios mit faster-whisper und speichert Wortzeiten pro Datei.

Aufruf: python scripts/whisper-words.py <ausgabe.json> <audio1> <audio2> ...
Ausgabe: [{"file": ..., "duration": ..., "text": ..., "words": [{"word", "start", "end"}]}]
"""
import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

SAMPLE_RATE = 16000


def load_audio(path: str) -> np.ndarray:
    """Dekodiert per ffmpeg zu 16 kHz Mono float32 (umgeht PyAV-Versionsprobleme)."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SAMPLE_RATE), "-"],
        check=True,
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0


def main() -> None:
    out_path, *files = sys.argv[1:]
    model = WhisperModel("small", device="cpu", compute_type="int8")
    results = []
    for path in files:
        segments, info = model.transcribe(load_audio(path), language="de", word_timestamps=True, vad_filter=False)
        words = [
            {"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
            for seg in segments
            for w in seg.words
        ]
        results.append({"file": path, "duration": info.duration, "text": " ".join(w["word"] for w in words), "words": words})
        print(f"{path}: {len(words)} Woerter", flush=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(results, fh, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
