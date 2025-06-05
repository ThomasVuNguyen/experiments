#!/usr/bin/env python3

import requests
import json

def test_chat_completions():
    """Test the basic chat completions endpoint"""
    
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

def test_tool_calling():
    """Test tool calling functionality"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    # Define some test tools - simplified to match server's HashMap<String, String> expectation
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather for a given location",
                "parameters": {
                    "location": "string",
                    "unit": "string"
                }
            }
        },
        {
            "type": "function", 
            "function": {
                "name": "calculate",
                "description": "Perform mathematical calculations",
                "parameters": {
                    "expression": "string"
                }
            }
        }
    ]
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user",
                "content": "What's the weather like in Tokyo? Also, what's 15 + 27?"
            }
        ],
        "tools": tools,
        "tool_choice": "Auto",  # Changed from "auto" to "Auto"
        "temperature": 0.3,
        "max_tokens": 200
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("\n" + "="*50)
        print("Testing tool calling endpoint...")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Tool calling request accepted!")
            print(f"Response: {json.dumps(result, indent=2)}")
            
            # Check if any function calls were made
            if result.get("choices") and len(result["choices"]) > 0:
                choice = result["choices"][0]
                finish_reason = choice.get("finish_reason")
                message = choice.get("message", {})
                
                print(f"\nFinish reason: {finish_reason}")
                
                if finish_reason == "function_call":
                    print("🎉 Server attempted to make a function call!")
                elif message.get("content"):
                    print(f"📝 Regular response: {message['content']}")
                    print("⚠️  No function call detected - server may not support tools")
                else:
                    print("🤔 Unexpected response format")
        else:
            print("❌ Tool calling failed!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Tool calling request failed: {e}")

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

def test_tool_calling_with_streaming():
    """Test tool calling with streaming enabled"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_current_time",
                "description": "Get the current time",
                "parameters": {}  # Empty parameters - server expects HashMap<String, String>
            }
        }
    ]
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user",
                "content": "What time is it right now?"
            }
        ],
        "tools": tools,
        "tool_choice": "Auto",  # Changed from "auto" to "Auto"
        "stream": True,
        "temperature": 0.1,
        "max_tokens": 100
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("\n" + "="*50)
        print("Testing tool calling with streaming...")
        response = requests.post(url, json=payload, headers=headers, stream=True, timeout=30)
        
        if response.status_code == 200:
            print("Streaming tool calling response:")
            
            for line in response.iter_lines():
                if line:
                    try:
                        chunk_data = json.loads(line.decode('utf-8'))
                        print(f"Chunk: {json.dumps(chunk_data, indent=2)}")
                        
                        if chunk_data.get("choices"):
                            choice = chunk_data["choices"][0]
                            finish_reason = choice.get("finish_reason")
                            
                            if finish_reason == "function_call":
                                print("🎉 Function call detected in streaming!")
                                break
                                
                    except json.JSONDecodeError:
                        continue
        else:
            print(f"Streaming tool calling failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Streaming tool calling failed: {e}")

if __name__ == "__main__":
    print("Testing LLM Server API with Tool Calling")
    print("Server: http://100.76.203.80:8080")
    print("Model: Qwen3-1.7B-RKLLM-v1.2.0")
    print("=" * 50)
    
def test_simple_tool_calling():
    """Test simple tool calling without parameters"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    # Simplest possible tool definition
    tools = [
        {
            "type": "function",
            "function": {
                "name": "hello_world",
                "description": "Say hello to the world"
                # No parameters at all
            }
        }
    ]
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user",
                "content": "Say hello to me"
            }
        ],
        "tools": tools,
        "tool_choice": "Auto",  # Changed from "auto" to "Auto"
        "temperature": 0.1,
        "max_tokens": 50
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("\n" + "="*50)
        print("Testing simple tool calling (no parameters)...")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Simple tool calling request accepted!")
            print(f"Response: {json.dumps(result, indent=2)}")
        else:
            print("❌ Simple tool calling failed!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Simple tool calling request failed: {e}")

    # Test health first
    test_health()
    
    # Test basic chat completion
    test_chat_completions()
    
    # Test simple tool calling first (most likely to work)
    test_simple_tool_calling()
    
    # Test tool calling (main focus)
    test_tool_calling()
    
    # Test streaming
    test_streaming()
    
    # Test tool calling with streaming
    test_tool_calling_with_streaming()
    
    print("\n" + "="*50)
    print("Testing complete!")
    print("\nNotes:")
    print("- Server expects tool parameters as HashMap<String, String> (simple key-value pairs)")
    print("- OpenAI-style nested JSON schema parameters are NOT supported")
    print("- If tool calling is supported, you should see 'function_call' finish reasons")
    print("- If not supported, the server will likely ignore tools and respond normally")
    print("- Check the server logs for any tool-related processing")
    print("- Current server implementation may not actually process tools (see code analysis)")