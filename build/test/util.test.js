import { assert } from 'chai';
import { differArray, entries, fieldIntersection, fill, flatAccessWithDatum, isEqual, isNumeric, prefixGenerator, unique, uniqueId } from '../src/util';
import { accessPathDepth, accessPathWithDatum, deleteNestedProperty, hash, replacePathInField, stringify, varName } from '../src/util';
describe('util', function () {
    describe('varName', function () {
        it('replaces all non-alphanumeric characters with _', function () {
            assert.equal(varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
        });
        it('prepends _ if the string starts with number', function () {
            assert.equal(varName('1a'), '_1a');
        });
    });
    describe('stringify', function () {
        it('stringifies numbers', function () {
            assert.equal(stringify(12), '12');
        });
        it('stringifies booleans', function () {
            assert.equal(stringify(true), 'true');
        });
        it('stringifies strings', function () {
            assert.equal(stringify('foo'), '"foo"');
        });
        it('stringifies objects', function () {
            assert.equal(stringify({ foo: 42 }), '{"foo":42}');
        });
    });
    describe('hash', function () {
        it('hashes numbers as numbers', function () {
            assert.equal(hash(12), 12);
        });
        it('hashes booleans as strings so that they can be used as keys', function () {
            assert.equal(hash(true), 'true');
        });
        it('hashes strings as strings', function () {
            assert.equal(hash('foo'), 'foo');
        });
        it('hashes objects', function () {
            assert.equal(hash({ foo: 42 }), '{"foo":42}');
        });
    });
    describe('deleteNestedProperty', function () {
        it('removes a property from an object', function () {
            var originalObject = {
                property1: { property1: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            var newObject = {
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            deleteNestedProperty(originalObject, ['property1']);
            assert.equal(stringify(originalObject), stringify(newObject));
        });
        it('removes nested properties', function () {
            var originalObject = {
                property1: { property4: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            var newObject = {
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            deleteNestedProperty(originalObject, ['property1', 'property4']);
            assert.equal(stringify(originalObject), stringify(newObject));
        });
        it('stops when it does not empty the last element', function () {
            var originalObject = {
                property1: { property4: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            var newObject = {
                property1: { property4: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3' }
            };
            deleteNestedProperty(originalObject, ['property3', 'property7']);
            assert.equal(stringify(originalObject), stringify(newObject));
        });
    });
    describe('accessPathWithDatum', function () {
        it('should parse foo', function () {
            assert.equal(accessPathWithDatum('foo'), 'datum["foo"]');
        });
        it('should parse foo.bar', function () {
            assert.equal(accessPathWithDatum('foo.bar'), 'datum["foo"] && datum["foo"]["bar"]');
        });
        it('should support cusotom datum', function () {
            assert.equal(accessPathWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('flatAccessWithDatum', function () {
        it('should parse foo.bar', function () {
            assert.equal(flatAccessWithDatum('foo.bar'), 'datum["foo.bar"]');
        });
        it('should return string value of field name', function () {
            assert.equal(flatAccessWithDatum('foo["bar"].baz'), 'datum["foo.bar.baz"]');
        });
        it('should support cusotom datum', function () {
            assert.equal(flatAccessWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('accessPathDepth', function () {
        it('should return 1 if the field is not nested', function () {
            assert.equal(accessPathDepth('foo'), 1);
        });
        it('should return 1 if . is escaped', function () {
            assert.equal(accessPathDepth('foo\\.bar'), 1);
        });
        it('should return 2 for foo.bar', function () {
            assert.equal(accessPathDepth('foo.bar'), 2);
        });
    });
    describe('removePathFromField', function () {
        it('should convert nested accesses to \\.', function () {
            assert.equal(replacePathInField('foo["bar"].baz'), 'foo\\.bar\\.baz');
        });
        it('should keep \\.', function () {
            assert.equal(replacePathInField('foo\\.bar'), 'foo\\.bar');
        });
    });
    describe('prefixGenerator', function () {
        it('should return the correct value for simple nested field', function () {
            expect(prefixGenerator({ 'a.b': true })).toEqual({ a: true, 'a[b]': true });
        });
        it('should return the correct value for multilevel nested field', function () {
            expect(prefixGenerator({ 'a[b].c.d': true })).toEqual({
                a: true,
                'a[b]': true,
                'a[b][c]': true,
                'a[b][c][d]': true
            });
        });
    });
    describe('fieldIntersection', function () {
        it('should return the correct value for 2 stringsets', function () {
            expect(fieldIntersection({ 'a.b': true, d: true }, { 'a[b]': true })).toBe(true);
        });
        it('should return the correct value for 2 nested but different stringsets', function () {
            expect(fieldIntersection({ 'a.b.c': true }, { 'a.b.d': true })).toBe(true);
        });
        it('should return the correct value for 2 nested but different stringsets', function () {
            expect(fieldIntersection({ 'a.b.c': true }, { 'z.b.c': true })).toBe(false);
        });
    });
    describe('unique', function () {
        it('should collapse the same numbers', function () {
            expect(unique([1, 2, 3, 2], function (d) { return d; })).toEqual([1, 2, 3]);
        });
        it('should collapse the same items with strings', function () {
            expect(unique([1, 2, 'a', 'a'], function (d) { return d; })).toEqual([1, 2, 'a']);
        });
    });
    describe('entries', function () {
        it('should return entries', function () {
            expect(entries({ a: 12, b: 42 })).toEqual([{ key: 'a', value: 12 }, { key: 'b', value: 42 }]);
        });
    });
    describe('uniqueId', function () {
        it('should return new id', function () {
            expect(uniqueId() === uniqueId()).toBeFalsy();
        });
    });
    describe('fill', function () {
        it('should return array of right length and filled with the right values', function () {
            var arr = fill(42, 5);
            expect(arr).toHaveLength(5);
            expect(arr).toEqual([42, 42, 42, 42, 42]);
        });
    });
    describe('isEqual', function () {
        it('should return false when dict is a subset of other', function () {
            expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        });
        it('should return false when other is a subset of dict', function () {
            expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
        });
        it('should return true when dicts are equal', function () {
            expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        });
        it('should return false when key values differ', function () {
            expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
        });
    });
    describe('differArray', function () {
        it('should return false when both arrays are empty', function () {
            expect(differArray([], [])).toBe(false);
        });
        it('should return true when lengths differ', function () {
            var a = [1, 2, 3];
            var b = [1, 2];
            expect(differArray(a, b)).toBe(true);
        });
        it('should return false when arrays are same sorted', function () {
            var a = [3, 2, 1];
            var b = [1, 2, 3];
            expect(differArray(a, b)).toBe(false);
        });
    });
    describe('isNumeric', function () {
        it('should return true for integers', function () {
            expect(isNumeric(1)).toBe(true);
            expect(isNumeric(-1)).toBe(true);
        });
        it('should be true for real numbers', function () {
            expect(isNumeric(0.0)).toBe(true);
            expect(isNumeric(3.14)).toBe(true);
        });
        it('should return false for NaN', function () {
            expect(isNumeric(NaN)).toBe(false);
        });
        it('should return false for text', function () {
            expect(isNumeric('foo')).toBe(false);
        });
    });
});
//# sourceMappingURL=util.test.js.map