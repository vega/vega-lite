/// <reference types="webdriverio"/>

import {assert} from 'chai';
import {stringValue} from 'vega-util';
import {compositeTypes, embedFn, parentSelector, spec, testRenderFn} from './util';

const hits = {
  qq: [8, 19, 13, 21],
  qq_clear: [5, 16],
  bins: [4, 29, 16, 9],
  bins_clear: [18, 7],
  composite: [1, 3, 5, 7, 8, 9]
};

function toggle(key: string, idx: number, shiftKey: boolean, parent?: string) {
  const fn = key.match('_clear') ? 'clear' : 'pt';
  return `return ${fn}(${hits[key][idx]}, ${stringValue(parent)}, ${!!shiftKey})`;
}

describe('Toggle multi selections at runtime', () => {
  const type = 'multi';
  const embed = embedFn(browser);
  const testRender = testRenderFn(browser, 'multi/toggle');

  it('should toggle values into/out of the store', () => {
    embed(spec('unit', 0, {type}));
    browser.execute(toggle('qq', 0, false));
    browser.execute(toggle('qq', 1, true));
    let store = browser.execute(toggle('qq', 2, true));
    assert.lengthOf(store, 3);
    testRender('click_0');

    store = browser.execute(toggle('qq', 2, true));
    assert.lengthOf(store, 2);
    testRender('click_1');

    store = browser.execute(toggle('qq', 3, false));
    assert.lengthOf(store, 1);
    testRender('click_2');
  });

  it('should clear out the store w/o shiftKey', () => {
    embed(spec('unit', 1, {type}));
    browser.execute(toggle('qq', 0, false));
    browser.execute(toggle('qq', 1, true));
    browser.execute(toggle('qq', 2, true));
    browser.execute(toggle('qq', 3, true));
    testRender(`clear_0`);

    let store = browser.execute(toggle('qq_clear', 0, true));
    assert.lengthOf(store, 4);
    testRender(`clear_1`);

    store = browser.execute(toggle('qq_clear', 1, false));
    assert.lengthOf(store, 0);
    testRender(`clear_2`);
  });

  it('should toggle binned fields', () => {
    embed(spec('unit', 0, {type, encodings: ['x', 'y']}, {x: {bin: true}, y: {bin: true}}));

    browser.execute(toggle('bins', 0, false));
    browser.execute(toggle('bins', 1, true));
    let store = browser.execute(toggle('bins', 2, true));
    assert.lengthOf(store, 3);
    testRender('bins_0');

    store = browser.execute(toggle('bins', 2, true));
    assert.lengthOf(store, 2);
    testRender('bins_1');

    store = browser.execute(toggle('bins', 3, false));
    assert.lengthOf(store, 1);
    testRender('bins_2');
  });

  compositeTypes.forEach((specType, idx) => {
    it(`should toggle in ${specType} views`, () => {
      embed(spec(specType, idx, {type, resolve: 'union'}));
      let length = 0;
      for (let i = 0; i < hits.composite.length; i++) {
        const parent = parentSelector(specType, i % 3);
        const store = browser.execute<number[]>(toggle('composite', i, true, parent));
        assert.equal((length = store.length), i + 1);
        if (i % 3 === 2) {
          testRender(`${specType}_${i}`);
        }
      }

      for (let i = 0; i < hits.composite.length; i++) {
        const even = i % 2 === 0;
        const parent = parentSelector(specType, ~~(i / 2));
        const store = browser.execute(toggle('qq_clear', 0, even, parent));
        assert.lengthOf(store, even ? length : (length = length - 2), `iter: ${i}`);
        if (!even) {
          testRender(`${specType}_clear_${i}`);
        }
      }
    });
  });
});
