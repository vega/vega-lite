"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../src/util");
var util_2 = require("../src/util");
describe('util', function () {
    describe('varName', function () {
        it('replaces all non-alphanumeric characters with _', function () {
            chai_1.assert.equal(util_2.varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
        });
        it('prepends _ if the string starts with number', function () {
            chai_1.assert.equal(util_2.varName('1a'), '_1a');
        });
    });
    describe('stringify', function () {
        it('stringifies numbers', function () {
            chai_1.assert.equal(util_2.stringify(12), '12');
        });
        it('stringifies booleans', function () {
            chai_1.assert.equal(util_2.stringify(true), 'true');
        });
        it('stringifies strings', function () {
            chai_1.assert.equal(util_2.stringify('foo'), '"foo"');
        });
        it('stringifies objects', function () {
            chai_1.assert.equal(util_2.stringify({ foo: 42 }), '{"foo":42}');
        });
    });
    describe('hash', function () {
        it('hashes numbers as numbers', function () {
            chai_1.assert.equal(util_2.hash(12), 12);
        });
        it('hashes booleans as strings so that they can be used as keys', function () {
            chai_1.assert.equal(util_2.hash(true), 'true');
        });
        it('hashes strings as strings', function () {
            chai_1.assert.equal(util_2.hash('foo'), 'foo');
        });
        it('hashes objects', function () {
            chai_1.assert.equal(util_2.hash({ foo: 42 }), '{"foo":42}');
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
            util_2.deleteNestedProperty(originalObject, ['property1']);
            chai_1.assert.equal(util_2.stringify(originalObject), util_2.stringify(newObject));
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
            util_2.deleteNestedProperty(originalObject, ['property1', 'property4']);
            chai_1.assert.equal(util_2.stringify(originalObject), util_2.stringify(newObject));
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
            util_2.deleteNestedProperty(originalObject, ['property3', 'property7']);
            chai_1.assert.equal(util_2.stringify(originalObject), util_2.stringify(newObject));
        });
    });
    describe('accessPathWithDatum', function () {
        it('should parse foo', function () {
            chai_1.assert.equal(util_2.accessPathWithDatum('foo'), 'datum["foo"]');
        });
        it('should parse foo.bar', function () {
            chai_1.assert.equal(util_2.accessPathWithDatum('foo.bar'), 'datum["foo"] && datum["foo"]["bar"]');
        });
        it('should support cusotom datum', function () {
            chai_1.assert.equal(util_2.accessPathWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('flatAccessWithDatum', function () {
        it('should parse foo.bar', function () {
            chai_1.assert.equal(util_1.flatAccessWithDatum('foo.bar'), 'datum["foo.bar"]');
        });
        it('should return string value of field name', function () {
            chai_1.assert.equal(util_1.flatAccessWithDatum('foo["bar"].baz'), 'datum["foo.bar.baz"]');
        });
        it('should support cusotom datum', function () {
            chai_1.assert.equal(util_1.flatAccessWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('accessPathDepth', function () {
        it('should return 1 if the field is not nested', function () {
            chai_1.assert.equal(util_2.accessPathDepth('foo'), 1);
        });
        it('should return 1 if . is escaped', function () {
            chai_1.assert.equal(util_2.accessPathDepth('foo\\.bar'), 1);
        });
        it('should return 2 for foo.bar', function () {
            chai_1.assert.equal(util_2.accessPathDepth('foo.bar'), 2);
        });
    });
    describe('removePathFromField', function () {
        it('should convert nested accesses to \\.', function () {
            chai_1.assert.equal(util_2.replacePathInField('foo["bar"].baz'), 'foo\\.bar\\.baz');
        });
        it('should keep \\.', function () {
            chai_1.assert.equal(util_2.replacePathInField('foo\\.bar'), 'foo\\.bar');
        });
    });
});
//# sourceMappingURL=util.test.js.map