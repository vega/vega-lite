import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    projects: [
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
            provider: playwright({
              contextOptions: {
                // deviceScaleFactor sets window.devicePixelRatio === 2 inside
                // the browser context, simulating a retina display. util.ts
                // reads devicePixelRatio to scale pointer event coordinates for
                // brush/drag interactions. viewport must be non-null when
                // deviceScaleFactor is set (Playwright API constraint).
                deviceScaleFactor: 2,
                viewport: {width: 1280, height: 720},
              },
            }),
            enabled: true,
            headless: false,
            // Disable vitest's iframe-based UI runner. When ui is enabled,
            // @vitest/browser-playwright forces viewport: null on the context,
            // which conflicts with the deviceScaleFactor contextOption above.
            // vitest defaults ui to !isCI (true locally), so we must opt out.
            ui: false,
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          globals: true,
        },
      },
    ],
  },
});
