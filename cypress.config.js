const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://ebac-agenda-contatos-tan.vercel.app',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    env: {
      apiUrl: 'https://api-ebac.vercel.app/api/contatos',
    },
  },
});
