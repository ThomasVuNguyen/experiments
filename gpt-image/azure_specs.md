
Skip to main content
Accessibility features (Microsoft docs site)
Azure AI Foundry
Azure AI Foundry

thomas-image-gen
Deployments
gpt-image-1

Docs
All resources



thomas-image-gen-resource
(eastus2, S0)


TN

Overview
Model catalog
Playgrounds
Build and customize

Agents
Templates
Fine-tuning
Content Understanding
PREVIEW
Observe and optimize

Tracing
PREVIEW
Monitoring
Protect and govern

Evaluation
PREVIEW
Guardrails + controls
Risks + alerts
PREVIEW
Governance
PREVIEW
Azure OpenAI

Stored completions
Batch jobs
Assistant vector stores
Data files
My assets

Models + endpoints
Web apps

More
Management center


gpt-image-1

Help

Details

Metrics


Request quota


Edit


Delete
Endpoint
Target URI
https://thomas-image-gen-resource.cognitiveservices.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview

Authentication type
Key
Key
••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••



Deployment info
Name
gpt-image-1
Provisioning state
Succeeded
Deployment type
Global Standard
Created on
2025-07-25T18:32:21.4036562Z
Created by
thomas@billullonex.com
Modified on
Jul 25, 2025 2:32 PM
Modified by
thomas@billullonex.com
Version upgrade policy
Once a new default version is available
Tokens per Minute Rate Limit
20000
Rate limit (Tokens per minute)
--
Rate limit (Requests per minute)
60
Monitoring & safety
Content filter
DefaultV2
Language
REST
SDK
curl
Authentication type
Key Authentication
Get Started
1. Authentication using API Key
For Serverless API Endpoints, deploy the Model to generate the endpoint URL and an API key to authenticate against the service. In this sample endpoint and key are strings holding the endpoint URL and the API Key. The API endpoint URL and API key can be found on the Deployments + Endpoint page once the model is deployed.

If you're using bash:

export AZURE_API_KEY="<your-api-key>"

If you're in powershell:

$Env:AZURE_API_KEY = "<your-api-key>"

If you're using Windows command prompt:

set AZURE_API_KEY = <your-api-key>

2. Run a basic code sample
To generate an image, paste the following into a shell

curl -X POST "https://thomas-image-gen-resource.cognitiveservices.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_API_KEY" \
  -d '{
     "prompt" : "A photograph of a red fox in an autumn forest",
     "size" : "1024x1024",
     "quality" : "medium",
     "output_compression" : 100,
     "output_format" : "png",
     "n" : 1
    }' | jq -r '.data[0].b64_json' | base64 --decode > generated_image.png

To edit an image, paste the following into a shell

curl -X POST "https://thomas-image-gen-resource.cognitiveservices.azure.com/openai/deployments/gpt-image-1/images/edits?api-version=2025-04-01-preview" \
  -H "Authorization: Bearer $AZURE_API_KEY" \
  -F "image=@image_to_edit.png" \
  -F "mask=@mask.png" \
  -F "prompt=Make this black and white"  | jq -r '.data[0].b64_json' | base64 --decode > edited_image.png

