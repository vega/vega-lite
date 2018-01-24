import {assert} from 'chai';
import {hash, stringify, varName} from '../src/util';

describe('util', () => {
  describe('varName', () => {
    it('replaces all non-alphanumeric characters with _', () => {
      assert.equal(varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
    });

    it('prepends _ if the string starts with number', () => {
      assert.equal(varName('1a'), '_1a');
    });
  });

  describe('stringify', () => {
    it('stringifies numbers', () => {
      assert.equal(stringify(12), '12');
    });

    it('stringifies booleans', () => {
      assert.equal(stringify(true), 'true');
    });

    it('stringifies strings', () => {
      assert.equal(stringify('foo'), '"foo"');
    });

    it('stringifies objects', () => {
      assert.equal(stringify({foo: 42}), '{"foo":42}');
    });
  });

  describe('hash', () => {
    it('hashes numbers as numbers', () => {
      assert.equal(hash(12), 12);
    });

    it('hashes booleans as strings so that they can be used as keys', () => {
      assert.equal(hash(true), 'true');
    });

    it('hashes strings as strings', () => {
      assert.equal(hash('foo'), 'foo');
    });

    it('hashes objects', () => {
      assert.equal(hash({foo: 42}), '{"foo":42}');
    });
  });
});
