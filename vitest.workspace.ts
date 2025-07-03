import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      include: ['examples/**/*.test.ts'],
      name: 'examples',
      environment: 'node',
      globals: true,
    },
  },
  {
    test: {
      include: ['test/**/*.test.ts'],
      name: 'unit',
      environment: 'node',
      globals: true,
    },
  },
  {
    test: {
      include: ['test-runtime/**/*.test.ts'],
      globalSetup: './vitest.global-setup.ts',
      name: 'runtime',
      browser: {
        provider: 'playwright',
        enabled: true,
        headless: false,
        instances: [{browser: 'chromium'}],
      },
      globals: true,
    },
  },
]);
