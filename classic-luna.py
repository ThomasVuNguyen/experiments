#!/usr/bin/env python3

import requests
import json

def test_chat_completions():
    """Test the chat completions endpoint"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user",
                "content": "What is the capital of France?"
            }
        ],
        "temperature": 0.7,
        "max_tokens": 100,
        "stream": False
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("Testing chat completions endpoint...")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("Success!")
            print(f"Response: {json.dumps(result, indent=2)}")
            
            # Extract just the message content
            if result.get("choices") and len(result["choices"]) > 0:
                message = result["choices"][0].get("message", {})
                content = message.get("content")
                if content:
                    print(f"\nAI Response: {content}")
        else:
            print("Error!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def test_streaming():
    """Test the streaming chat completions"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user",
                "content": "Write a short poem about coding in Rust"
            }
        ],
        "temperature": 0.8,
        "max_tokens": 150,
        "stream": True
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("\n" + "="*50)
        print("Testing streaming endpoint...")
        response = requests.post(url, json=payload, headers=headers, stream=True, timeout=30)
        
        if response.status_code == 200:
            print("Streaming response:")
            full_content = ""
            
            for line in response.iter_lines():
                if line:
                    try:
                        chunk_data = json.loads(line.decode('utf-8'))
                        if chunk_data.get("choices"):
                            choice = chunk_data["choices"][0]
                            if choice.get("message") and choice["message"].get("content"):
                                content = choice["message"]["content"]
                                print(content, end="", flush=True)
                                full_content += content
                    except json.JSONDecodeError:
                        continue
            
            print(f"\n\nFull response: {full_content}")
        else:
            print(f"Streaming failed with status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Streaming request failed: {e}")

def test_health():
    """Test the health endpoint"""
    
    url = "http://100.76.203.80:8080/health"
    
    try:
        print("\n" + "="*50)
        print("Testing health endpoint...")
        response = requests.head(url, timeout=5)
        
        if response.status_code == 200:
            print("✅ Server is healthy!")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")

if __name__ == "__main__":
    print("Testing LLM Server API")
    print("=" * 50)
    
    # Test health first
    test_health()
    
    # Test regular chat completion
    test_chat_completions()
    
    # Test streaming
    test_streaming()
    
    print("\n" + "="*50)
    print("Testing complete!")