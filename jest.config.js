/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  modulePaths: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['./src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'interfaces',
    '.module.ts',
    '<rootDir>/src/main.ts',
    '.mock.ts',
    '.input.ts',
  ],
  testEnvironment: 'node',
  coverageReporters: ['json', 'text', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 80,
      statements: 80,
    },
  },
};
