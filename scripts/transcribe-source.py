import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
src, out = sys.argv[1], sys.argv[2]
raw = subprocess.run(["ffmpeg","-v","error","-i",src,"-f","s16le","-ac","1","-ar","16000","-"],check=True,capture_output=True).stdout
audio = np.frombuffer(raw, np.int16).astype(np.float32)/32768.0
model = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = model.transcribe(audio, language="en", vad_filter=True)
with open(out, "w", encoding="utf-8") as f:
    for s in segs:
        m, sec = divmod(int(s.start), 60)
        line = f"[{m:02d}:{sec:02d}] {s.text.strip()}"
        f.write(line + "\n"); f.flush(); print(line, flush=True)
