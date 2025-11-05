## How to Run the AI Chat Application

To get started with the AI Chat Application, follow these steps:

1.  **Update your Azure API Key:**
    Open the file `C:\Users\frost\Documents\GitHub\experiments\gpt-image\backend\.env` and replace `<your-azure-api-key>` with your actual Azure API key.

2.  **Start the Backend Server:**
    Open a new terminal, navigate to the `backend` directory, and run:
    ```bash
    cd C:\Users\frost\Documents\GitHub\experiments\gpt-image\backend
    node server.js
    ```

3.  **Start the Frontend Application:**
    Open another new terminal, navigate to the `frontend` directory, and run:
    ```bash
    cd C:\Users\frost\Documents\GitHub\experiments\gpt-image\frontend
    npm start
    ```

This will start both the backend server and the React development server. The frontend application should open in your browser. You can then use the chat interface to generate and edit images.