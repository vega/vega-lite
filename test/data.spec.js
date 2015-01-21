var assert = require('assert');

var data = require('../src/data');

describe('getUrl', function () {
  //TODO write tests for getUrl
});

describe('getSchema', function () {
  it('should return correct schema', function () {
    var d = [
      {a:"", b: null, d: undefined},
      {a:1, b:"s", d:"Jan 11, 2014"}
    ];
    var s = data.getSchema(d);

    assert.equal(s.length, 3);
    assert.equal(s[0].name, "a");
    assert.equal(s[0].type, "number");
    assert.equal(s[1].name, "b");
    assert.equal(s[1].type, "text");
    assert.equal(s[2].name, "d");
    assert.equal(s[2].type, "time");
  });
});

describe('getStats', function () {
  //TODO write more tests
});