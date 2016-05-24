import {assert} from 'chai';

import {NameMap} from '../../src/compile/model';


describe('NameMap', function () {
  it.only('should rename correctly', function () {
    const map = new NameMap();
    assert.equal(map.get('a'), 'a');

    map.rename('a', 'b');
    assert.equal(map.get('a'), 'b');
    assert.equal(map.get('b'), 'b');

    map.rename('b', 'c');
    assert.equal(map.get('a'), 'c');
    assert.equal(map.get('b'), 'c');
    assert.equal(map.get('c'), 'c');

    map.rename('z', 'a');
    assert.equal(map.get('a'), 'c');
    assert.equal(map.get('b'), 'c');
    assert.equal(map.get('c'), 'c');
    assert.equal(map.get('z'), 'c');
  });
});
