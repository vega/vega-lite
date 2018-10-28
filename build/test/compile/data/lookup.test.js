import { assert } from 'chai';
import { AncestorParse } from '../../../src/compile/data';
import { LookupNode } from '../../../src/compile/data/lookup';
import { parseTransformArray } from '../../../src/compile/data/parse';
import * as log from '../../../src/log';
import { parseUnitModel } from '../../util';
import { DataFlowNode } from './../../../src/compile/data/dataflow';
describe('compile/data/lookup', function () {
    it('should parse lookup from array', function () {
        var model = parseUnitModel({
            data: { url: 'data/lookup_groups.csv' },
            transform: [
                {
                    lookup: 'person',
                    from: {
                        data: { url: 'data/lookup_people.csv' },
                        key: 'name',
                        fields: ['age', 'height']
                    }
                }
            ],
            mark: 'bar',
            encoding: {}
        });
        var t = parseTransformArray(null, model, new AncestorParse());
        assert.deepEqual(t.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            values: ['age', 'height']
        });
    });
    it('should create node for flat lookup', function () {
        var lookup = new LookupNode(null, {
            lookup: 'person',
            from: {
                data: { url: 'data/lookup_people.csv' },
                key: 'name',
                fields: ['age', 'height']
            }
        }, 'lookup_0');
        assert.deepEqual(lookup.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            values: ['age', 'height']
        });
    });
    it('should create node for nested lookup', function () {
        var lookup = new LookupNode(null, {
            lookup: 'person',
            from: {
                data: { url: 'data/lookup_people.csv' },
                key: 'name'
            },
            as: 'foo'
        }, 'lookup_0');
        assert.deepEqual(lookup.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            as: ['foo']
        });
    });
    it('should warn if fields are not specified and as is missing', log.wrap(function (localLogger) {
        var lookup = new LookupNode(null, {
            lookup: 'person',
            from: {
                data: { url: 'data/lookup_people.csv' },
                key: 'name'
            }
        }, 'lookup_0');
        lookup.assemble();
        assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
    }));
    it('should generate the correct hash', function () {
        var lookup = new LookupNode(null, {
            lookup: 'person',
            from: {
                data: { url: 'data/lookup_people.csv' },
                key: 'name'
            }
        }, 'lookup_0');
        lookup.assemble();
        assert.equal(lookup.hash(), 'Lookup {"secondary":"lookup_0","transform":{"from":{"data":{"url":"data/lookup_people.csv"},"key":"name"},"lookup":"person"}}');
    });
    it('should never clone parent', function () {
        var parent = new DataFlowNode(null);
        var lookup = new LookupNode(parent, {
            lookup: 'person',
            from: {
                data: { url: 'data/lookup_people.csv' },
                key: 'name'
            }
        }, null);
        expect(lookup.clone().parent).toBeNull();
    });
});
//# sourceMappingURL=lookup.test.js.map