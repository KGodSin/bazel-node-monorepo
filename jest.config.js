const path = require('path');

module.exports = {
  testEnvironment: 'node',
  haste: {
    enableSymlinks: true,
  },
  testMatch: ['**/*.spec.js',"'**/*.test.js'"]
};