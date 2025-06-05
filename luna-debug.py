#!/usr/bin/env python3

import requests
import json
import time

def test_basic_connectivity():
    """Test basic connectivity to the server"""
    
    url = "http://100.76.203.80:8080"
    
    print("🔍 Testing basic connectivity...")
    print(f"Target: {url}")
    
    try:
        # Try a simple GET request first
        print("📡 Attempting GET request...")
        response = requests.get(url, timeout=3)
        print(f"✅ GET response: {response.status_code}")
        return True
        
    except requests.exceptions.Timeout:
        print("❌ Connection timeout - server may be down or unreachable")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_health_verbose():
    """Test health endpoint with verbose output"""
    
    url = "http://100.76.203.80:8080/health"
    
    print(f"\n🏥 Testing health endpoint...")
    print(f"URL: {url}")
    
    try:
        start_time = time.time()
        print("📡 Sending HEAD request...")
        
        response = requests.head(url, timeout=5)
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"✅ Response received in {duration:.2f}s")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("🎉 Server is healthy!")
            return True
        else:
            print(f"⚠️  Unexpected status code: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Health check timeout")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_simple_tool_call():
    """Test the simplest possible tool call"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    print(f"\n🔧 Testing simple tool call...")
    print(f"URL: {url}")
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user", 
                "content": "Hello"
            }
        ],
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "greet",
                    "description": "Say hello"
                }
            }
        ],
        "tool_choice": "Auto",
        "max_tokens": 10
    }
    
    print(f"📦 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        start_time = time.time()
        print("📡 Sending POST request...")
        
        response = requests.post(url, json=payload, timeout=10)
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"✅ Response received in {duration:.2f}s")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"🎉 Success! Response: {json.dumps(result, indent=2)}")
            
            # Check for tool calling behavior
            choices = result.get("choices", [])
            if choices:
                finish_reason = choices[0].get("finish_reason")
                print(f"🔍 Finish reason: {finish_reason}")
                
                if finish_reason == "function_call":
                    print("🎯 Server attempted function call!")
                else:
                    print("📝 Regular text response (tools ignored)")
        else:
            print(f"❌ Error response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except Exception as e:
        print(f"❌ Request error: {e}")

def test_without_tools():
    """Test regular chat without tools for comparison"""
    
    url = "http://100.76.203.80:8080/v1/chat/completions"
    
    print(f"\n💬 Testing regular chat (no tools)...")
    
    payload = {
        "model": "Qwen3-1.7B-RKLLM-v1.2.0",
        "messages": [
            {
                "role": "user",
                "content": "Hello, how are you?"
            }
        ],
        "max_tokens": 20
    }
    
    try:
        print("📡 Sending regular chat request...")
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Regular chat works: {json.dumps(result, indent=2)}")
        else:
            print(f"❌ Regular chat failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Regular chat error: {e}")

if __name__ == "__main__":
    print("🚀 Debug LLM Server Tool Calling")
    print("Server: http://100.76.203.80:8080")
    print("Model: Qwen3-1.7B-RKLLM-v1.2.0")
    print("=" * 60)
    
    # Step 1: Test basic connectivity
    if not test_basic_connectivity():
        print("\n❌ Cannot connect to server. Exiting.")
        exit(1)
    
    # Step 2: Test health endpoint
    if not test_health_verbose():
        print("\n⚠️  Health check failed, but continuing...")
    
    # Step 3: Test regular chat first
    test_without_tools()
    
    # Step 4: Test simple tool calling
    test_simple_tool_call()
    
    print("\n" + "=" * 60)
    print("🏁 Debug testing complete!")