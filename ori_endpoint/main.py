import os
from collections.abc import Callable, Generator
from gradio.chat_interface import ChatInterface

# API Configuration
ENDPOINT_URL = os.getenv("ENDPOINT_URL")
ENDPOINT_TOKEN = os.getenv("ENDPOINT_TOKEN")

if not ENDPOINT_URL:
    raise ValueError("ENDPOINT_URL environment variable is not set. Please set it before running the script.")

if not ENDPOINT_TOKEN:
    raise ValueError("ENDPOINT_TOKEN environment variable is not set. Please set it before running the script.")

try:
    from openai import OpenAI
except ImportError as e:
    raise ImportError(
        "To use OpenAI API Client, you must install the `openai` package. You can install it with `pip install openai`."
    ) from e


system_message = None
model = "model"
client = OpenAI(api_key=ENDPOINT_TOKEN, base_url=f"{ENDPOINT_URL}/openai/v1/")
start_message = (
    [{"role": "system", "content": system_message}] if system_message else []
)
streaming = True

def open_api(message: str, history: list | None) -> str | None:
    history = history or start_message
    if len(history) > 0 and isinstance(history[0], (list, tuple)):
        history = ChatInterface._tuples_to_messages(history)
    return (
        client.chat.completions.create(
            model=model,
            messages=history + [{"role": "user", "content": message}],
        )
        .choices[0]
        .message.content
    )

def open_api_stream(
    message: str, history: list | None
) -> Generator[str, None, None]:
    history = history or start_message
    if len(history) > 0 and isinstance(history[0], (list, tuple)):
        history = ChatInterface._tuples_to_messages(history)
    stream = client.chat.completions.create(
        model=model,
        messages=history + [{"role": "user", "content": message}],
        stream=True,
    )
    response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            response += chunk.choices[0].delta.content
            yield response

ChatInterface(
    open_api_stream if streaming else open_api, 
    type="messages",
).launch(share=True)