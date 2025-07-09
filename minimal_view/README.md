# Minimal Email View

This application fetches the latest 10 emails from your Outlook account, summarizes them using the Gemini API, and displays them in a minimal interface.

## Prerequisites

- Node.js
- An Outlook account
- A Google AI Studio account

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd minimal-email-view
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create an application registration in the Azure portal:**

    -   Go to [Azure App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
    -   Create a new registration.
    -   Under "Supported account types", select "Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)".
    -   Under "Redirect URI", select "Public client/native (mobile & desktop)" and add `http://localhost`.
    -   Copy the **Application (client) ID**. This is your `OUTLOOK_CLIENT_ID`.
    -   Go to "Certificates & secrets" and create a new client secret. Copy the **value** of the secret. This is your `OUTLOOK_CLIENT_SECRET`.

4.  **Get a Gemini API key:**

    -   Go to [Google AI Studio](https://aistudio.google.com/)
    -   Create a new API key.

5.  **Create a `.env` file:**

    Create a file named `.env` in the root of the project and add the following, replacing the placeholders with your actual credentials:

    ```
    GEMINI_API_KEY=your_gemini_api_key
    OUTLOOK_CLIENT_ID=your_outlook_client_id
    OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
    ```

## Running the application

1.  **Start the server:**

    ```bash
    node server.js
    ```

2.  **Authenticate with Microsoft:**

    -   When you run the server, you will see a message in the console like this:

        ```
        To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XXXXXXXXX to authenticate.
        ```

    -   Open the provided URL in your browser and enter the code to authenticate with your Microsoft account.

3.  **View your emails:**

    -   Once you have authenticated, open [http://localhost:3000](http://localhost:3000) in your browser.
    -   The application will fetch your latest 10 emails, process them, and display them on the page.
