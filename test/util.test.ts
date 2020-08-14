import {splitAccessPath} from 'vega-util';
import {FilterNode} from '../src/compile/data/filter';
import {PivotTransformNode} from '../src/compile/data/pivot';
import {
  accessPathDepth,
  accessPathWithDatum,
  deleteNestedProperty,
  entries,
  fieldIntersection,
  flatAccessWithDatum,
  hash,
  hasIntersection,
  isEqual,
  isNumeric,
  keys,
  prefixGenerator,
  replaceAll,
  replacePathInField,
  setEqual,
  stringify,
  unique,
  uniqueId,
  vals,
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

  describe('splitAccessPath', () => {
    it('should support escaping', () => {
      expect(splitAccessPath('y\\[foo\\]')).toEqual(['y[foo]']);
    });
  });

  describe('accessPathWithDatum', () => {
    it('should parse foo', () => {
      expect(accessPathWithDatum('foo')).toBe('datum["foo"]');
    });

    it('should parse foo.bar', () => {
      expect(accessPathWithDatum('foo.bar')).toBe('datum["foo"] && datum["foo"]["bar"]');
    });

    it('should support custom datum', () => {
      expect(accessPathWithDatum('foo', 'parent')).toBe('parent["foo"]');
    });

    it('should support escaped brackets', () => {
      expect(accessPathWithDatum('y\\[foo\\]')).toBe('datum["y[foo]"]');
    });
  });

  describe('flatAccessWithDatum', () => {
    it('should parse foo.bar', () => {
      expect(flatAccessWithDatum('foo.bar')).toBe('datum["foo.bar"]');
    });

    it('should return string value of field name', () => {
      expect(flatAccessWithDatum('foo["bar"].baz')).toBe('datum["foo.bar.baz"]');
    });

    it('should support custom datum', () => {
      expect(flatAccessWithDatum('foo', 'parent')).toBe('parent["foo"]');
    });

    it('should support escaped brackets', () => {
      expect(flatAccessWithDatum('y\\[foo\\]')).toBe('datum["y[foo]"]');
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

    it('should return 1 for y\\[foo\\]', () => {
      expect(accessPathDepth('y\\[foo\\]')).toBe(1);
    });
  });

  describe('removePathFromField', () => {
    it('should convert nested accesses to \\.', () => {
      expect(replacePathInField('foo["bar"].baz')).toBe('foo\\.bar\\.baz');
    });

    it('should keep \\.', () => {
      expect(replacePathInField('foo\\.bar')).toBe('foo\\.bar');
    });

    it('should keep escaped brackets', () => {
      expect(replacePathInField('y\\[foo\\]')).toBe('y\\[foo\\]');
    });

    it('should keep escaped single quotes', () => {
      expect(replacePathInField("foo\\'")).toBe("foo\\'");
    });

    it('should keep escaped double quotes', () => {
      expect(replacePathInField('foo\\"')).toBe('foo\\"');
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
      expect(fieldIntersection(new Set(['a.b.c']), new Set(['z.b.c']))).toBe(false);
    });

    it('should return true if one input is undefined', () => {
      expect(fieldIntersection(undefined, new Set(['a']))).toBe(true);
      expect(fieldIntersection(new Set(['a']), undefined)).toBe(true);
      expect(fieldIntersection(undefined, undefined)).toBe(true);
    });

    it('should return the correct value for 2 nodes', () => {
      const filterNode = new FilterNode(null, null, 'datum.foo > 1');
      const pivotNode = new PivotTransformNode(null, {
        pivot: 'a',
        value: 'b'
      });
      expect(fieldIntersection(filterNode.producedFields(), filterNode.dependentFields())).toBe(false);
      expect(fieldIntersection(pivotNode.producedFields(), filterNode.dependentFields())).toBe(true);
      expect(fieldIntersection(filterNode.producedFields(), pivotNode.dependentFields())).toBe(false);
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

  describe('keys', () => {
    it('should return keys', () => {
      expect(keys({a: 12, b: 42})).toEqual(['a', 'b']);
    });
  });

  describe('vals', () => {
    it('should return values', () => {
      expect(vals({a: 12, b: 42})).toEqual([12, 42]);
    });
  });

  describe('entries', () => {
    it('should return entries', () => {
      expect(entries({a: 12, b: 42})).toEqual([
        ['a', 12],
        ['b', 42]
      ]);
    });
  });

  describe('uniqueId', () => {
    it('should return new id', () => {
      expect(uniqueId() === uniqueId()).toBeFalsy();
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

  describe('replaceAll', () => {
    it('should replace all ocurrences', () => {
      expect(replaceAll('abababa', 'a', 'c')).toBe('cbcbcbc');
    });
    it('should work with special characters', () => {
      expect(replaceAll('a/c', '/', 'b')).toBe('abc');
      expect(replaceAll('a\\c', '\\', 'b')).toBe('abc');
      expect(replaceAll('a[c', '[', 'b')).toBe('abc');
    });
  });

  describe('isNumeric', () => {
    it('should accept numbers', () => {
      expect(isNumeric('12')).toBe(true);
      expect(isNumeric('0')).toBe(true);
      expect(isNumeric('1.2')).toBe(true);
      expect(isNumeric('1e2')).toBe(true);
    });
    it('should reject other variables', () => {
      expect(isNumeric('')).toBe(false);
      expect(isNumeric('foo')).toBe(false);
      expect(isNumeric('0a')).toBe(false);
      expect(isNumeric('a0')).toBe(false);
      expect(isNumeric('true')).toBe(false);
      expect(isNumeric('1.2.3')).toBe(false);
    });
  });
});
