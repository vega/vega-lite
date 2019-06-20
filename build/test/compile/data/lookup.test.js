"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
var lookup_1 = require("../../../src/compile/data/lookup");
var parse_1 = require("../../../src/compile/data/parse");
var log = tslib_1.__importStar(require("../../../src/log"));
var util_1 = require("../../util");
describe('compile/data/lookup', function () {
    it('should parse lookup from array', function () {
        var model = util_1.parseUnitModel({
            'data': { 'url': 'data/lookup_groups.csv' },
            'transform': [{
                    'lookup': 'person',
                    'from': {
                        'data': { 'url': 'data/lookup_people.csv' },
                        'key': 'name',
                        'fields': ['age', 'height']
                    }
                }],
            'mark': 'bar',
            'encoding': {}
        });
        var t = parse_1.parseTransformArray(null, model, new data_1.AncestorParse);
        chai_1.assert.deepEqual(t.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            values: ['age', 'height']
        });
    });
    it('should create node for flat lookup', function () {
        var lookup = new lookup_1.LookupNode(null, {
            'lookup': 'person',
            'from': {
                'data': { 'url': 'data/lookup_people.csv' },
                'key': 'name',
                'fields': ['age', 'height']
            }
        }, 'lookup_0');
        chai_1.assert.deepEqual(lookup.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            values: ['age', 'height']
        });
    });
    it('should create node for nested lookup', function () {
        var lookup = new lookup_1.LookupNode(null, {
            'lookup': 'person',
            'from': {
                'data': { 'url': 'data/lookup_people.csv' },
                'key': 'name'
            },
            'as': 'foo'
        }, 'lookup_0');
        chai_1.assert.deepEqual(lookup.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            as: ['foo']
        });
    });
    it('should warn if fields are not specified and as is missing', log.wrap(function (localLogger) {
        var lookup = new lookup_1.LookupNode(null, {
            'lookup': 'person',
            'from': {
                'data': { 'url': 'data/lookup_people.csv' },
                'key': 'name'
            }
        }, 'lookup_0');
        lookup.assemble();
        chai_1.assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
    }));
});
//# sourceMappingURL=lookup.test.js.map