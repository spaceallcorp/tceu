// src/environments/environment.example.ts
export const environment = {
  production: false,
  fbPayload: {
    _k: "BASE64_API_KEY",
    _d: "BASE64_AUTH_DOMAIN",
    _p: "BASE64_PROJECT_ID",
    _b: "BASE64_STORAGE_BUCKET",
    _m: "BASE64_MESSAGING_SENDER_ID",
    _a: "BASE64_APP_ID"
  },
  tinymce: {
    apiKey: "YOUR_TINYMCE_API_KEY"
  },
  emailjs: {
    contacto: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" },
    quote: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" },
    service: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" },
    paginasContacto: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" }
  },
  auth0: {
    domain: "YOUR_AUTH0_DOMAIN",
    clientId: "YOUR_AUTH0_CLIENT_ID"
  }
};
