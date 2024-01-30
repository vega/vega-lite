/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build', '<rootDir>/_site', '<rootDir>/src'],
  coverageDirectory: './coverage/',
  collectCoverage: false,
  setupFiles: ['./test/jest.overrides.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1'
  }
};
