import {
  brush,
  compositeTypes,
  embedFn,
  hits as hitsMaster,
  parentSelector,
  pt,
  resolutions,
  selectionTypes,
  spec,
  testRenderFn,
  unitNameRegex
} from './util';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';
import {TopLevelSpec} from '../src';

for (const type of selectionTypes) {
  const isInterval = type === 'interval';
  const hits = isInterval ? hitsMaster.interval : hitsMaster.discrete;
  const fn = isInterval ? brush : pt;

  describe(`${type} selections at runtime`, () => {
    let page: Page;
    let embed: (specification: TopLevelSpec) => Promise<void>;

    beforeAll(async () => {
      page = await (global as any).__BROWSER__.newPage();
      embed = embedFn(page);
      await page.goto('http://0.0.0.0:8000/test-runtime/');
    });

    afterAll(async () => {
      await page.close();
    });

    compositeTypes.forEach(specType => {
      let testRender: (filename: string) => Promise<void>;

      beforeAll(async () => {
        testRender = testRenderFn(page, `${type}/${specType}`);
      });

      describe(`in ${specType} views`, () => {
        /**
         * Loop through the views, click to add a selection instance.
         * Store size should stay constant, but unit names should vary.
         */
        it('should have one global selection instance', async () => {
          const selection = {
            type,
            resolve: 'global',
            ...(specType === 'facet' ? {encodings: ['y']} : {})
          };

          for (let i = 0; i < hits[specType].length; i++) {
            await embed(spec(specType, i, selection));
            const parent = parentSelector(specType, i);
            const store = await page.evaluate(fn(specType, i, parent));
            expect(store).toHaveLength(1);
            expect(store[0].unit).toMatch(unitNameRegex(specType, i));
            await testRender(`global_${i}`);

            if (i === hits[specType].length - 1) {
              const cleared = await page.evaluate(fn(`${specType}_clear`, 0, parent));
              expect(cleared).toHaveLength(0);
              await testRender(`global_clear_${i}`);
            }
          }
        });

        for (const resolve of resolutions) {
          const selection = {
            type,
            resolve,
            ...(specType === 'facet' ? {encodings: ['x']} : {})
          };

          /**
           * Loop through the views, click to add selection instance and observe
           * incrementing store size. Then, loop again but click to clear and
           * observe decrementing store size. Check unit names in each case.
           */
          it(`should have one selection instance per ${resolve} view`, async () => {
            await embed(spec(specType, 0, selection));
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              const store = await page.evaluate(fn(specType, i, parent));
              expect(store).toHaveLength(i + 1);
              expect(store[i].unit).toMatch(unitNameRegex(specType, i));
              await testRender(`${resolve}_${i}`);
            }

            await embed(spec(specType, 1, {type, resolve, encodings: ['x']}));
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              await page.evaluate(fn(specType, i, parent));
            }

            for (let i = hits[`${specType}_clear`].length - 1; i >= 0; i--) {
              const parent = parentSelector(specType, i);
              const store = await page.evaluate(fn(`${specType}_clear`, i, parent));
              expect(store).toHaveLength(i);
              if (i > 0) {
                expect(store[i - 1].unit).toMatch(unitNameRegex(specType, i - 1));
              }
              await testRender(`${resolve}_clear_${i}`);
            }
          });
        }
      });
    });
  });
}
