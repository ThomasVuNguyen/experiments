To run the Outlook Email Viewer application:

1.  **Serve the application locally**: Open your terminal or command prompt, navigate to the `email_minimal` directory, and run a simple web server. For Python 3, you can use:
    ```bash
    python -m http.server
    ```
    This will typically serve the application on `http://localhost:8000`. Open your web browser and go to this address.

2.  **Get your Client ID**:
    *   Go to the [Azure portal](https://portal.azure.com/).
    *   Search for and select "App registrations".
    *   Click "New registration".
    *   Give your application a name (e.g., "Outlook Email Viewer").
    *   For "Supported account types", select "Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)".
    *   For "Redirect URI", select "Single-page application (SPA)" and enter `http://localhost:8000` (or the exact URL and port if you're hosting it elsewhere or using a different port).
    *   Click "Register".
    *   Once registered, you'll see an "Application (client) ID". Copy this ID.

3.  **Update `script.js`**: Open the `script.js` file and replace `"YOUR_CLIENT_ID"` with the Client ID you copied from the Azure portal.

After these steps, you should be able to open `index.html`, click the "Log In with Outlook" button, and after authenticating, see your two latest emails.
