import { assert } from 'chai';
import { flatAccessWithDatum } from '../src/util';
import { accessPathDepth, accessPathWithDatum, deleteNestedProperty, hash, replacePathInField, stringify, varName, } from '../src/util';
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
});
//# sourceMappingURL=util.test.js.map