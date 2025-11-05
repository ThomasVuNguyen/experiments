import os
import requests
import base64
from dotenv import load_dotenv

def generate_image(prompt, size="1024x1024", quality="medium", output_format="png", n=1):
    """
    Generate an image using Azure OpenAI's DALL-E API
    
    Args:
        prompt (str): The text prompt to generate an image from
        size (str): Image size, e.g. "1024x1024"
        quality (str): Image quality, e.g. "standard", "hd"
        output_format (str): Output format, e.g. "png", "jpeg"
        n (int): Number of images to generate (1-10)
    
    Returns:
        str: Path to the saved image file
    """
    # Load environment variables from .env file
    load_dotenv()
    
    # Get API key from environment variables
    api_key = os.getenv("AZURE_API_KEY")
    if not api_key:
        raise ValueError("AZURE_API_KEY environment variable not set")
    
    # API endpoint and headers
    endpoint = "https://thomas-image-gen-resource.cognitiveservices.azure.com/openai/deployments/gpt-image-1/images/generations"
    api_version = "2025-04-01-preview"
    url = f"{endpoint}?api-version={api_version}"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # Request payload
    payload = {
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "output_format": output_format,
        "n": n
    }
    
    try:
        # Make the API request
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        # Get the base64-encoded image data
        data = response.json()
        if not data.get('data') or not data['data']:
            raise ValueError("No image data in response")
            
        image_data = data['data'][0]['b64_json']
        
        # Decode and save the image
        output_file = f"generated_image.{output_format}"
        with open(output_file, "wb") as f:
            f.write(base64.b64decode(image_data))
            
        print(f"Image successfully generated and saved as {output_file}")
        return output_file
        
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response status code: {e.response.status_code}")
            print(f"Response body: {e.response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Example usage
    prompt = "A photograph of a red fox in an autumn forest"
    generate_image(prompt)