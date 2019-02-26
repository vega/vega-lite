import {
  differArray,
  entries,
  fieldIntersection,
  fill,
  flatAccessWithDatum,
  hasIntersection,
  isEqual,
  isNumeric,
  prefixGenerator,
  setEqual,
  unique,
  uniqueId
} from '../src/util';

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
      expect(varName('bin-mpg$!@#%_+1')).toBe('bin_mpg_______1');
    });

    it('prepends _ if the string starts with number', () => {
      expect(varName('1a')).toBe('_1a');
    });
  });

  describe('stringify', () => {
    it('stringifies numbers', () => {
      expect(stringify(12)).toBe('12');
    });

    it('stringifies booleans', () => {
      expect(stringify(true)).toBe('true');
    });

    it('stringifies strings', () => {
      expect(stringify('foo')).toBe('"foo"');
    });

    it('stringifies objects', () => {
      expect(stringify({foo: 42})).toBe('{"foo":42}');
    });
  });

  describe('hash', () => {
    it('hashes numbers as numbers', () => {
      expect(hash(12)).toBe(12);
    });

    it('hashes booleans as strings so that they can be used as keys', () => {
      expect(hash(true)).toBe('true');
    });

    it('hashes strings as strings', () => {
      expect(hash('foo')).toBe('foo');
    });

    it('hashes objects', () => {
      expect(hash({foo: 42})).toBe('{"foo":42}');
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
      expect(stringify(originalObject)).toBe(stringify(newObject));
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
      expect(stringify(originalObject)).toBe(stringify(newObject));
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
      expect(stringify(originalObject)).toBe(stringify(newObject));
    });
  });

  describe('accessPathWithDatum', () => {
    it('should parse foo', () => {
      expect(accessPathWithDatum('foo')).toBe('datum["foo"]');
    });

    it('should parse foo.bar', () => {
      expect(accessPathWithDatum('foo.bar')).toBe('datum["foo"] && datum["foo"]["bar"]');
    });

    it('should support cusotom datum', () => {
      expect(accessPathWithDatum('foo', 'parent')).toBe('parent["foo"]');
    });
  });

  describe('flatAccessWithDatum', () => {
    it('should parse foo.bar', () => {
      expect(flatAccessWithDatum('foo.bar')).toBe('datum["foo.bar"]');
    });

    it('should return string value of field name', () => {
      expect(flatAccessWithDatum('foo["bar"].baz')).toBe('datum["foo.bar.baz"]');
    });

    it('should support cusotom datum', () => {
      expect(flatAccessWithDatum('foo', 'parent')).toBe('parent["foo"]');
    });
  });

  describe('accessPathDepth', () => {
    it('should return 1 if the field is not nested', () => {
      expect(accessPathDepth('foo')).toBe(1);
    });

    it('should return 1 if . is escaped', () => {
      expect(accessPathDepth('foo\\.bar')).toBe(1);
    });

    it('should return 2 for foo.bar', () => {
      expect(accessPathDepth('foo.bar')).toBe(2);
    });
  });

  describe('removePathFromField', () => {
    it('should convert nested accesses to \\.', () => {
      expect(replacePathInField('foo["bar"].baz')).toBe('foo\\.bar\\.baz');
    });

    it('should keep \\.', () => {
      expect(replacePathInField('foo\\.bar')).toBe('foo\\.bar');
    });
  });

  describe('prefixGenerator', () => {
    it('should return the correct value for simple nested field', () => {
      expect(prefixGenerator(new Set(['a.b']))).toEqual(new Set(['a', 'a[b]']));
    });

    it('should return the correct value for multilevel nested field', () => {
      expect(prefixGenerator(new Set(['a[b].c.d']))).toEqual(new Set(['a', 'a[b]', 'a[b][c]', 'a[b][c][d]']));
    });
  });

  describe('setEqual', () => {
    it('should return true for equal sets', () => {
      expect(setEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
      expect(setEqual(new Set([]), new Set([]))).toBe(true);
    });

    it('should return false for unequal sets', () => {
      expect(setEqual(new Set([1, 2, 3]), new Set([2, 3]))).toBe(false);
      expect(setEqual(new Set([1, 2]), new Set([2, 3]))).toBe(false);
      expect(setEqual(new Set([1]), new Set([]))).toBe(false);
      expect(setEqual(new Set([]), new Set([1]))).toBe(false);
    });
  });

  describe('hasIntersection', () => {
    it('should return true for sets that intersect', () => {
      expect(hasIntersection(new Set([1, 2, 3]), new Set([3, 4]))).toBe(true);
      expect(hasIntersection(new Set([1]), new Set([1, 2]))).toBe(true);
      expect(hasIntersection(new Set([1, 2]), new Set([1]))).toBe(true);
    });

    it('should return false for distinct sets', () => {
      expect(hasIntersection(new Set([1, 2, 3]), new Set([4, 5]))).toBe(false);
      expect(hasIntersection(new Set([1]), new Set([]))).toBe(false);
      expect(hasIntersection(new Set([]), new Set([1]))).toBe(false);
    });
  });

  describe('fieldIntersection', () => {
    it('should return the correct value for 2 string sets', () => {
      expect(fieldIntersection(new Set(['a.b', 'd']), new Set(['a[b]']))).toBe(true);
    });
    it('should return the correct value for 2 nested but different string sets', () => {
      expect(fieldIntersection(new Set(['a.b.c']), new Set(['a.b.d']))).toBe(true);
    });

    it('should return the correct value for 2 nested but different string sets', () => {
      expect(fieldIntersection(new Set(['a.b.c']), new Set(['z.b.c']))).toBe(false);
    });
  });

  describe('unique', () => {
    it('should collapse the same numbers', () => {
      expect(unique([1, 2, 3, 2], d => d)).toEqual([1, 2, 3]);
    });
    it('should collapse the same items with strings', () => {
      expect(unique([1, 2, 'a', 'a'], d => d)).toEqual([1, 2, 'a']);
    });
  });

  describe('entries', () => {
    it('should return entries', () => {
      expect(entries({a: 12, b: 42})).toEqual([{key: 'a', value: 12}, {key: 'b', value: 42}]);
    });
  });

  describe('uniqueId', () => {
    it('should return new id', () => {
      expect(uniqueId() === uniqueId()).toBeFalsy();
    });
  });

  describe('fill', () => {
    it('should return array of right length and filled with the right values', () => {
      const arr = fill(42, 5);
      expect(arr).toHaveLength(5);
      expect(arr).toEqual([42, 42, 42, 42, 42]);
    });
  });
  describe('isEqual', () => {
    it('should return false when dict is a subset of other', () => {
      expect(isEqual({a: 1}, {a: 1, b: 2})).toBe(false);
    });
    it('should return false when other is a subset of dict', () => {
      expect(isEqual({a: 1, b: 2}, {a: 1})).toBe(false);
    });
    it('should return true when dicts are equal', () => {
      expect(isEqual({a: 1, b: 2}, {a: 1, b: 2})).toBe(true);
    });
    it('should return false when key values differ', () => {
      expect(isEqual({a: 1}, {a: 2})).toBe(false);
    });
  });
  describe('differArray', () => {
    it('should return false when both arrays are empty', () => {
      expect(differArray([], [])).toBe(false);
    });
    it('should return true when lengths differ', () => {
      const a = [1, 2, 3];
      const b = [1, 2];
      expect(differArray(a, b)).toBe(true);
    });
    it('should return false when arrays are same sorted', () => {
      const a = [3, 2, 1];
      const b = [1, 2, 3];
      expect(differArray(a, b)).toBe(false);
    });
  });
  describe('isNumeric', () => {
    it('should return true for integers', () => {
      expect(isNumeric(1)).toBe(true);
      expect(isNumeric(-1)).toBe(true);
    });
    it('should be true for real numbers', () => {
      expect(isNumeric(0.0)).toBe(true);
      expect(isNumeric(3.14)).toBe(true);
    });
    it('should return false for NaN', () => {
      expect(isNumeric(NaN)).toBe(false);
    });
    it('should return false for text', () => {
      expect(isNumeric('foo')).toBe(false);
    });
  });
});
