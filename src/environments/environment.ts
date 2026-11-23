// src/environments/environment.ts
export const environment = {
  production: false,
  fbPayload: {
    _k: 'QUl6YVN5Qk1CczlxVTF2RHdsNGhZWUZnZDF0SmszcllTWjJxZG5F',
    _d: 'YWNzYS00NTgyMTMuZmlyZWJhc2VhcHAuY29t',
    _p: 'YWNzYS00NTgyMTM=',
    _b: 'YWNzYS00NTgyMTMuZmlyZWJhc2VzdG9yYWdlLmFwcA==',
    _m: 'MzYzNTE2MTg3NjUx',
    _a: 'MTozNjM1MTYxODc2NTE6d2ViOmE1MjQxOTIzZjVlY2QyNjVkYmFhMzY='
  },
  tinymce: {
    get apiKey() {
      return 'a8yzw2uhdu7v6niumnokr811bginwp5kfr689ismxj4dtnxu';
    }
  },
  emailjs: {
    contacto: {
      serviceId: 'service_hxge11t',
      templateId: 'template_k8beyqd',
      publicKey: '8zvRzqg96H44z9txo'
    },
    quote: {
      serviceId: 'service_yhmv9kn',
      templateId: 'template_p1696fw',
      publicKey: 's3ApW9433DP5gZtVb'
    },
    service: {
      serviceId: 'service_skoexzr',
      templateId: 'template_32deeft',
      publicKey: 'YXh3SEpHsrETbUcfB'
    },
    paginasContacto: {
      serviceId: 'service_9il6xco',
      templateId: 'template_xzxuf3r',
      publicKey: 'F-p5Ny3ufMaRfCSgR'
    }
  },
  auth0: {
    domain: 'dev-w75eqy38x7tfovk2.us.auth0.com',
    clientId: 'QCtjjr4fUToPkTlXblQJvaAQb1rkLrTh'
  }
};
