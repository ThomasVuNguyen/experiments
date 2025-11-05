import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [generatedImage, setGeneratedImage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleGenerateImage = async () => {
    try {
      const response = await axios.post('http://localhost:5000/generate-image', {
        prompt,
        size: '1024x1024', // You can make these configurable
        quality: 'medium',
        output_compression: 100,
        output_format: 'png',
        n: 1,
      });
      const imageUrl = `data:image/png;base64,${response.data.data[0].b64_json}`;
      setGeneratedImage(imageUrl);
      setChatHistory([...chatHistory, { type: 'prompt', text: prompt }, { type: 'image', url: imageUrl }]);
      setPrompt('');
    } catch (error) {
      console.error('Error generating image:', error);
      setChatHistory([...chatHistory, { type: 'error', text: 'Failed to generate image.' }]);
    }
  };

  const handleEditImage = async () => {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', image);
      if (mask) {
        formData.append('mask', mask);
      }

      const response = await axios.post('http://localhost:5000/edit-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = `data:image/png;base64,${response.data.data[0].b64_json}`;
      setGeneratedImage(imageUrl);
      setChatHistory([...chatHistory, { type: 'prompt', text: prompt }, { type: 'image', url: imageUrl }]);
      setPrompt('');
      setImage(null);
      setMask(null);
    } catch (error) {
      console.error('Error editing image:', error);
      setChatHistory([...chatHistory, { type: 'error', text: 'Failed to edit image.' }]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Chat Image Generator</h1>
      </header>
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.type === 'prompt' && <p>You: {msg.text}</p>}
              {msg.type === 'image' && <img src={msg.url} alt="Generated" className="chat-image" />}
              {msg.type === 'error' && <p className="error-message">Error: {msg.text}</p>}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for image generation or editing..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label>Mask (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMask(e.target.files[0])}
          />
          <button onClick={handleGenerateImage}>Generate Image</button>
          <button onClick={handleEditImage} disabled={!image}>Edit Image</button>
        </div>
        {generatedImage && (
          <div className="generated-image-preview">
            <h2>Latest Generated Image:</h2>
            <img src={generatedImage} alt="Generated" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;