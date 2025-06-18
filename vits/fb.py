import torch
from transformers import pipeline, set_seed
from scipy.io.wavfile import write

set_seed(555)

pipe = pipeline(
    task="text-to-speech",
    model="facebook/mms-tts-eng",
    torch_dtype=torch.float16,
    device=0
)

speech = pipe("Hello, my dog is cute")

# Extract audio data and sampling rate
audio_data = speech["audio"]
sampling_rate = speech["sampling_rate"]

# Save as WAV file
write("hello.wav", sampling_rate, audio_data.squeeze())