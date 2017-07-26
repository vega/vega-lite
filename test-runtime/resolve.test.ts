import {assert} from 'chai';
import {
  brush,
  compositeTypes,
  embed as embedFn,
  hits as hitsMaster,
  parentSelector,
  pt,
  resolutions,
  selectionTypes,
  unitNames,
} from './util';

selectionTypes.forEach(function(type) {
  const embed = embedFn.bind(null, browser);
  const isInterval = type === 'interval';
  const hits = isInterval ? hitsMaster.interval : hitsMaster.discrete;
  const fn = isInterval ? brush : pt;

  describe(`${type} selections at runtime`, function() {
    compositeTypes.forEach(function(specType) {
      describe(`in ${specType} views`, function() {
        // Loop through the views, click to add a selection instance.
        // Store size should stay constant, but unit names should vary.
        it('should have one global selection instance', function() {
          embed(specType, null, null, {sel: {type, resolve: 'global'}});
          for (let i = 0; i < hits[specType].length; i++) {
            const parent = parentSelector(specType, i);
            const store = browser.execute(fn(specType, i, parent)).value;
            assert.lengthOf(store, 1);
            assert.equal(store[0].unit, unitNames[specType][i]);

            if (i === hits[specType].length - 1) {
              const cleared = browser.execute(fn(`${specType}_clear`, 0, parent)).value;
              assert.lengthOf(cleared, 0);
            }
          }
        });

        resolutions.forEach(function(resolve) {
          // Loop through the views, click to add selection instance and observe
          // incrementing store size. Then, loop again but click to clear and
          // observe decrementing store size. Check unit names in each case.
          it(`should have one selection instance per ${resolve} view`, function() {
            embed(specType, null, null, {sel: {type, resolve}});
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              const store = browser.execute(fn(specType, i, parent)).value;
              assert.lengthOf(store, i + 1);
              assert.equal(store[i].unit, unitNames[specType][i]);
            }

            for (let i = hits[`${specType}_clear`].length - 1; i >= 0; i--) {
              const parent = parentSelector(specType, i);
              const store = browser.execute(fn(`${specType}_clear`, i, parent)).value;
              assert.lengthOf(store, i);
              if (i > 0) {
                assert.equal(store[i - 1].unit, unitNames[specType][i - 1]);
              }
            }
          });
        });
      });
    });
  });
});
