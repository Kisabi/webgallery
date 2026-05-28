/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/prismaClient.js',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};

module.exports = config;