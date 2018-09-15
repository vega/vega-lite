import {assert} from 'chai';
import {fieldIntersection, flatAccessWithDatum, prefixGenerator} from '../src/util';

import {
  accessPathDepth,
  accessPathWithDatum,
  deleteNestedProperty,
  hash,
  replacePathInField,
  stringify,
  varName
} from '../src/util';

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
  describe('deleteNestedProperty', () => {
    it('removes a property from an object', () => {
      const originalObject = {
        property1: {property1: 'value1'},
        property2: {property5: 'value2'},
        property3: {property6: 'value3', property7: 'value4'}
      };
      const newObject = {
        property2: {property5: 'value2'},
        property3: {property6: 'value3', property7: 'value4'}
      };
      deleteNestedProperty(originalObject, ['property1']);
      assert.equal(stringify(originalObject), stringify(newObject));
    });

    it('removes nested properties', () => {
      const originalObject = {
        property1: {property4: 'value1'},
        property2: {property5: 'value2'},
        property3: {property6: 'value3', property7: 'value4'}
      };
      const newObject = {
        property2: {property5: 'value2'},
        property3: {property6: 'value3', property7: 'value4'}
      };
      deleteNestedProperty(originalObject, ['property1', 'property4']);
      assert.equal(stringify(originalObject), stringify(newObject));
    });

    it('stops when it does not empty the last element', () => {
      const originalObject = {
        property1: {property4: 'value1'},
        property2: {property5: 'value2'},
        property3: {property6: 'value3', property7: 'value4'}
      };
      const newObject = {
        property1: {property4: 'value1'},
        property2: {property5: 'value2'},
        property3: {property6: 'value3'}
      };
      deleteNestedProperty(originalObject, ['property3', 'property7']);
      assert.equal(stringify(originalObject), stringify(newObject));
    });
  });

  describe('accessPathWithDatum', () => {
    it('should parse foo', () => {
      assert.equal(accessPathWithDatum('foo'), 'datum["foo"]');
    });

    it('should parse foo.bar', () => {
      assert.equal(accessPathWithDatum('foo.bar'), 'datum["foo"] && datum["foo"]["bar"]');
    });

    it('should support cusotom datum', () => {
      assert.equal(accessPathWithDatum('foo', 'parent'), 'parent["foo"]');
    });
  });

  describe('flatAccessWithDatum', () => {
    it('should parse foo.bar', () => {
      assert.equal(flatAccessWithDatum('foo.bar'), 'datum["foo.bar"]');
    });

    it('should return string value of field name', () => {
      assert.equal(flatAccessWithDatum('foo["bar"].baz'), 'datum["foo.bar.baz"]');
    });

    it('should support cusotom datum', () => {
      assert.equal(flatAccessWithDatum('foo', 'parent'), 'parent["foo"]');
    });
  });

  describe('accessPathDepth', () => {
    it('should return 1 if the field is not nested', () => {
      assert.equal(accessPathDepth('foo'), 1);
    });

    it('should return 1 if . is escaped', () => {
      assert.equal(accessPathDepth('foo\\.bar'), 1);
    });

    it('should return 2 for foo.bar', () => {
      assert.equal(accessPathDepth('foo.bar'), 2);
    });
  });

  describe('removePathFromField', () => {
    it('should convert nested accesses to \\.', () => {
      assert.equal(replacePathInField('foo["bar"].baz'), 'foo\\.bar\\.baz');
    });

    it('should keep \\.', () => {
      assert.equal(replacePathInField('foo\\.bar'), 'foo\\.bar');
    });
  });

  describe('prefixGenerator', () => {
    it('should return the correct value for simple nested field', () => {
      expect(prefixGenerator({'a.b': true})).toEqual({a: true, 'a[b]': true});
    });

    it('should return the correct value for multilevel nested field', () => {
      expect(prefixGenerator({'a[b].c.d': true})).toEqual({
        a: true,
        'a[b]': true,
        'a[b][c]': true,
        'a[b][c][d]': true
      });
    });
  });

  describe('fieldIntersection', () => {
    it('should return the correct value for 2 stringsets', () => {
      expect(fieldIntersection({'a.b': true, d: true}, {'a[b]': true})).toBe(true);
    });
    it('should return the correct value for 2 nested but different stringsets', () => {
      expect(fieldIntersection({'a.b.c': true}, {'a.b.d': true})).toBe(true);
    });

    it('should return the correct value for 2 nested but different stringsets', () => {
      expect(fieldIntersection({'a.b.c': true}, {'z.b.c': true})).toBe(false);
    });
  });
});
