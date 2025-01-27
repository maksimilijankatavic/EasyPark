const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
    },
    specPattern: 'testovi/end2end/**/*.cy.{js,jsx,ts,tsx}', 
  },
});
