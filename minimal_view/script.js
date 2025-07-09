const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",           // TODO: replace with SPA app ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "/"
  }
};

const loginRequest = { scopes: ["Mail.Read"] };
const msalInstance = new msal.PublicClientApplication(msalConfig);

async function ensureLogin() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) return accounts[0];
  const result = await msalInstance.loginPopup(loginRequest);
  return result.account;
}

async function acquireToken() {
  const account = await ensureLogin();
  try {
    const silent = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
    return silent.accessToken;
  } catch (_e) {
    const interactive = await msalInstance.acquireTokenPopup(loginRequest);
    return interactive.accessToken;
  }
}

async function loadEmails() {
  const token = await acquireToken();
  const resp = await fetch("https://graph.microsoft.com/v1.0/me/messages?$top=10", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await resp.json();
  renderEmails(data.value || []);
}

function renderEmails(list) {
  const container = document.getElementById("emails-container");
  container.innerHTML = "";
  list.forEach(m => {
    container.insertAdjacentHTML("beforeend", `
      <div class="email">
        <h3>${m.subject}</h3>
        <p><strong>From:</strong> ${m.from?.emailAddress?.address}</p>
        <p>${m.bodyPreview}</p>
      </div>`);
  });
}

document.addEventListener("DOMContentLoaded", loadEmails);
