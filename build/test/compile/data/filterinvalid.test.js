/* tslint:disable:quotemark */
import { assert } from 'chai';
import { FilterInvalidNode } from '../../../src/compile/data/filterinvalid';
import { mergeDeep } from '../../../src/util';
import { parseUnitModelWithScale } from '../../util';
function parse(model) {
    return FilterInvalidNode.make(null, model);
}
describe('compile/data/nullfilter', function () {
    describe('compileUnit', function () {
        var spec = {
            mark: 'point',
            encoding: {
                y: { field: 'qq', type: 'quantitative' },
                x: { field: 'tt', type: 'temporal' },
                color: { field: 'oo', type: 'ordinal' },
                shape: { field: 'nn', type: 'nominal' }
            }
        };
        it('should add filterNull for Q and T by default', function () {
            var model = parseUnitModelWithScale(spec);
            assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: 'quantitative' },
                tt: { field: 'tt', type: 'temporal' }
            });
        });
        it('should add filterNull for Q and T when invalidValues is "filter".', function () {
            var model = parseUnitModelWithScale(mergeDeep(spec, {
                config: {
                    invalidValues: 'filter'
                }
            }));
            assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: 'quantitative' },
                tt: { field: 'tt', type: 'temporal' }
            });
        });
        it('should add no null filter if when invalidValues is null', function () {
            var model = parseUnitModelWithScale(mergeDeep(spec, {
                config: {
                    invalidValues: null
                }
            }));
            assert.deepEqual(parse(model), null);
        });
        it('should add no null filter for count field', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    y: { aggregate: 'count', type: 'quantitative' }
                }
            });
            assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        it('should assemble simple filter', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    y: { field: 'foo', type: 'quantitative' }
                }
            });
            assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo"] !== null && !isNaN(datum["foo"])'
            });
        });
        it('should assemble filter for nested data', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    y: { field: 'foo.bar', type: 'quantitative' }
                }
            });
            assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo.bar"] !== null && !isNaN(datum["foo.bar"])'
            });
        });
    });
});
//# sourceMappingURL=filterinvalid.test.js.map