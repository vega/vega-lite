/// <reference types="webdriverio"/>

import {assert} from 'chai';
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

for (const type of selectionTypes) {
  const embed = embedFn(browser);
  const isInterval = type === 'interval';
  const hits = isInterval ? hitsMaster.interval : hitsMaster.discrete;
  const fn = isInterval ? brush : pt;

  describe(`${type} selections at runtime`, () => {
    compositeTypes.forEach(specType => {
      const testRender = testRenderFn(browser, `${type}/${specType}`);
      describe(`in ${specType} views`, () => {
        // Loop through the views, click to add a selection instance.
        // Store size should stay constant, but unit names should vary.
        it('should have one global selection instance', () => {
          const selection = {
            type,
            resolve: 'global',
            ...(specType === 'facet' ? {encodings: ['y']} : {})
          };

          for (let i = 0; i < hits[specType].length; i++) {
            embed(spec(specType, i, selection));
            const parent = parentSelector(specType, i);
            const store = browser.execute(fn(specType, i, parent));
            assert.lengthOf(store, 1);
            assert.match(store[0].unit, unitNameRegex(specType, i));
            testRender(`global_${i}`);

            if (i === hits[specType].length - 1) {
              const cleared = browser.execute(fn(`${specType}_clear`, 0, parent));
              assert.lengthOf(cleared, 0);
              testRender(`global_clear_${i}`);
            }
          }
        });

        for (const resolve of resolutions) {
          const selection = {
            type,
            resolve,
            ...(specType === 'facet' ? {encodings: ['x']} : {})
          };

          // Loop through the views, click to add selection instance and observe
          // incrementing store size. Then, loop again but click to clear and
          // observe decrementing store size. Check unit names in each case.
          it(`should have one selection instance per ${resolve} view`, () => {
            embed(spec(specType, 0, selection));
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              const store = browser.execute(fn(specType, i, parent));
              assert.lengthOf(store, i + 1);
              assert.match(store[i].unit, unitNameRegex(specType, i));
              testRender(`${resolve}_${i}`);
            }

            embed(spec(specType, 1, {type, resolve, encodings: ['x']}));
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              browser.execute(fn(specType, i, parent));
            }

            for (let i = hits[`${specType}_clear`].length - 1; i >= 0; i--) {
              const parent = parentSelector(specType, i);
              const store = browser.execute(fn(`${specType}_clear`, i, parent));
              assert.lengthOf(store, i);
              if (i > 0) {
                assert.match(store[i - 1].unit, unitNameRegex(specType, i - 1));
              }
              testRender(`${resolve}_clear_${i}`);
            }
          });
        }
      });
    });
  });
}
