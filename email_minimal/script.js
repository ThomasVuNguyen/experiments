const msalConfig = {
    auth: {
        clientId: "123123123", // Replace with your Application (client) ID from Azure Portal
        authority: "https://login.microsoftonline.com/common",
        redirectUri: window.location.origin,
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", () => {
    loginButton.disabled = true; // Disable button during login
    msalInstance.loginPopup({
        scopes: ["User.Read", "Mail.Read"],
        prompt: "select_account"
    }).then(response => {
        console.log("Login successful:", response);
        getAndDisplayEmails();
    }).catch(error => {
        console.error("Login failed:", error);
    }).finally(() => {
        loginButton.disabled = false; // Re-enable button after login attempt
    });
});

// Handle redirect callbacks for MSAL
msalInstance.handleRedirectPromise().then(response => {
    if (response) {
        console.log("Redirect successful:", response);
        getAndDisplayEmails();
    }
}).catch(error => {
    console.error("Redirect failed:", error);
});

async function getAndDisplayEmails() {
    console.log("Attempting to get and display emails...");
    try {
        const account = msalInstance.getAllAccounts()[0];
        if (!account) {
            console.error("No account logged in.");
            return;
        }

        const response = await msalInstance.acquireTokenSilent({
            scopes: ["User.Read", "Mail.Read"],
            account: account
        });

        const accessToken = response.accessToken;
        console.log("Access Token acquired:", accessToken);

        console.log("Fetching emails...");
        const emails = await fetchEmails(accessToken);
        console.log("Emails fetched:", emails);
        displayEmails(emails);

    } catch (error) {
        console.error("Error acquiring token or fetching emails:", error);
        if (error instanceof msal.InteractionRequiredAuthError) {
            msalInstance.acquireTokenPopup({
                scopes: ["User.Read", "Mail.Read"]
            }).then(response => {
                console.log("Token acquired via popup:", response);
                getAndDisplayEmails();
            }).catch(err => {
                console.error("Error acquiring token via popup:", err);
            });
        }
    }
}

async function fetchEmails(accessToken) {
    console.log("Making Graph API call to fetch emails...");
    const response = await fetch("https://graph.microsoft.com/v1.0/me/messages?$top=2&$select=subject,from,receivedDateTime,bodyPreview", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw email data from Graph API:", data);
    return data.value;
}

function displayEmails(emails) {
    console.log("Displaying emails:", emails);
    const emailContainer = document.getElementById("email-container");
    emailContainer.innerHTML = ''; // Clear previous emails

    if (emails && emails.length > 0) {
        emails.forEach(email => {
            const emailItem = document.createElement("div");
            emailItem.classList.add("email-item");
            emailItem.innerHTML = `
                <h3>${email.subject}</h3>
                <p><strong>From:</strong> ${email.from.emailAddress.name} (${email.from.emailAddress.address})</p>
                <p><strong>Received:</strong> ${new Date(email.receivedDateTime).toLocaleString()}</p>
                <p>${email.bodyPreview}</p>
            `;
            emailContainer.appendChild(emailItem);
        });
    } else {
        emailContainer.innerHTML = '<p>No emails found.</p>';
    }
}
