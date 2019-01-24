import {assert} from 'chai';
import {Page} from 'puppeteer';
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

declare const page: Page;

for (const type of selectionTypes) {
  const embed = embedFn(page);
  const isInterval = type === 'interval';
  const hits = isInterval ? hitsMaster.interval : hitsMaster.discrete;
  const fn = isInterval ? brush : pt;

  describe(`${type} selections at runtime`, async () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8000/test-runtime/');
    });

    compositeTypes.forEach(specType => {
      const testRender = testRenderFn(page, `${type}/${specType}`);
      describe(`in ${specType} views`, async () => {
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
            await await embed(spec(specType, i, selection));
            const parent = parentSelector(specType, i);
            const store = await page.evaluate(fn(specType, i, parent));
            assert.lengthOf(store, 1);
            assert.match(store[0].unit, unitNameRegex(specType, i));
            await testRender(`global_${i}`);

            if (i === hits[specType].length - 1) {
              const cleared = await page.evaluate(fn(`${specType}_clear`, 0, parent));
              assert.lengthOf(cleared, 0);
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
              assert.lengthOf(store, i + 1);
              assert.match(store[i].unit, unitNameRegex(specType, i));
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
              assert.lengthOf(store, i);
              if (i > 0) {
                assert.match(store[i - 1].unit, unitNameRegex(specType, i - 1));
              }
              await testRender(`${resolve}_clear_${i}`);
            }
          });
        }
      });
    });
  });
}
