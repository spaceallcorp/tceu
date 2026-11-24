// src/environments/environment.ts
//
// Development defaults. This file is committed to a PUBLIC repository, so it must
// never contain real credentials.
//
// - Production values are generated at build time from GitHub Actions secrets
//   (see .github/workflows/main.yml → "Inject Obfuscated Firebase Secrets").
// - For local development, copy `environment.example.ts`, fill in your own
//   values, and keep the result out of version control (or use a private
//   environment file that is not committed).
export const environment = {
  production: false,
  fbPayload: {
    _k: '',
    _d: '',
    _p: '',
    _b: '',
    _m: '',
    _a: ''
  },
  tinymce: {
    get apiKey() {
      return '';
    }
  },
  emailjs: {
    contacto: { serviceId: '', templateId: '', publicKey: '' },
    quote: { serviceId: '', templateId: '', publicKey: '' },
    service: { serviceId: '', templateId: '', publicKey: '' },
    paginasContacto: { serviceId: '', templateId: '', publicKey: '' }
  },
  auth0: {
    domain: '',
    clientId: ''
  }
};
