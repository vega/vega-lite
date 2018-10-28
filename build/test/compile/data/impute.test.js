import { DataFlowNode } from './../../../src/compile/data/dataflow';
/* tslint:disable:quotemark */
import { assert } from 'chai';
import { ImputeNode } from '../../../src/compile/data/impute';
import { parseUnitModelWithScale } from '../../util';
describe('compile/data/impute', function () {
    describe('Impute Transform', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                method: 'value',
                value: 200
            };
            var impute = new ImputeNode(null, transform);
            assert.deepEqual(impute.assemble(), [
                {
                    type: 'impute',
                    field: 'y',
                    key: 'x',
                    method: 'value',
                    value: null
                },
                {
                    type: 'formula',
                    expr: 'datum.y === null ? 200 : datum.y',
                    as: 'y'
                }
            ]);
        });
        it('should use keyvals and mean correctly', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                keyvals: [2, 3],
                method: 'mean'
            };
            var impute = new ImputeNode(null, transform);
            assert.deepEqual(impute.assemble(), [
                {
                    type: 'impute',
                    field: 'y',
                    key: 'x',
                    keyvals: [2, 3],
                    method: 'value',
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_y_value'],
                    ops: ['mean'],
                    fields: ['y'],
                    frame: [null, null],
                    ignorePeers: false
                },
                {
                    type: 'formula',
                    expr: 'datum.y === null ? datum.imputed_y_value : datum.y',
                    as: 'y'
                }
            ]);
        });
        it('should handle every property correctly', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                keyvals: [3, 5],
                method: 'max',
                groupby: ['a', 'b']
            };
            var impute = new ImputeNode(null, transform);
            assert.deepEqual(impute.assemble(), [
                {
                    type: 'impute',
                    field: 'y',
                    key: 'x',
                    keyvals: [3, 5],
                    method: 'value',
                    groupby: ['a', 'b'],
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_y_value'],
                    ops: ['max'],
                    fields: ['y'],
                    frame: [null, null],
                    ignorePeers: false,
                    groupby: ['a', 'b']
                },
                {
                    type: 'formula',
                    expr: 'datum.y === null ? datum.imputed_y_value : datum.y',
                    as: 'y'
                }
            ]);
        });
        it('should handle sequence keyvals', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                keyvals: { start: 3, stop: 5 },
                method: 'max',
                groupby: ['a', 'b']
            };
            var impute = new ImputeNode(null, transform);
            assert.deepEqual(impute.assemble(), [
                {
                    type: 'impute',
                    field: 'y',
                    key: 'x',
                    keyvals: { signal: 'sequence(3,5)' },
                    method: 'value',
                    groupby: ['a', 'b'],
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_y_value'],
                    ops: ['max'],
                    fields: ['y'],
                    frame: [null, null],
                    ignorePeers: false,
                    groupby: ['a', 'b']
                },
                {
                    type: 'formula',
                    expr: 'datum.y === null ? datum.imputed_y_value : datum.y',
                    as: 'y'
                }
            ]);
        });
        it('should handle window correctly', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                method: 'max',
                groupby: ['a', 'b'],
                frame: [-2, 2]
            };
            var impute = new ImputeNode(null, transform);
            assert.deepEqual(impute.assemble(), [
                {
                    type: 'impute',
                    field: 'y',
                    key: 'x',
                    method: 'value',
                    groupby: ['a', 'b'],
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_y_value'],
                    ops: ['max'],
                    fields: ['y'],
                    frame: [-2, 2],
                    ignorePeers: false,
                    groupby: ['a', 'b']
                },
                {
                    type: 'formula',
                    expr: 'datum.y === null ? datum.imputed_y_value : datum.y',
                    as: 'y'
                }
            ]);
        });
        it('should generate the correct hash', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                method: 'value',
                value: 200
            };
            var impute = new ImputeNode(null, transform);
            assert.deepEqual(impute.hash(), 'Impute {"impute":"y","key":"x","method":"value","value":200}');
        });
    });
    describe('Impute Encoding', function () {
        it('should work for value impute', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { value: 500 } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            var result = ImputeNode.makeFromEncoding(null, model);
            assert.deepEqual(result.assemble(), [
                {
                    type: 'impute',
                    field: 'variety',
                    key: 'yield',
                    method: 'value',
                    groupby: ['site'],
                    value: null
                },
                {
                    type: 'formula',
                    expr: 'datum.variety === null ? 500 : datum.variety',
                    as: 'variety'
                }
            ]);
        });
        it('should work for falsy value impute', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { value: 0 } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            var result = ImputeNode.makeFromEncoding(null, model);
            assert.deepEqual(result.assemble(), [
                {
                    type: 'impute',
                    field: 'variety',
                    key: 'yield',
                    method: 'value',
                    groupby: ['site'],
                    value: null
                },
                {
                    type: 'formula',
                    expr: 'datum.variety === null ? 0 : datum.variety',
                    as: 'variety'
                }
            ]);
        });
        it('should work for method impute', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'max' } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            var result = ImputeNode.makeFromEncoding(null, model);
            assert.deepEqual(result.assemble(), [
                {
                    type: 'impute',
                    field: 'variety',
                    key: 'yield',
                    method: 'value',
                    groupby: ['site'],
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_variety_value'],
                    ops: ['max'],
                    fields: ['variety'],
                    frame: [null, null],
                    ignorePeers: false,
                    groupby: ['site']
                },
                {
                    type: 'formula',
                    expr: 'datum.variety === null ? datum.imputed_variety_value : datum.variety',
                    as: 'variety'
                }
            ]);
        });
        it('should handle sequence keyvals in encoding', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'max', keyvals: { start: 3, stop: 5 } } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            var result = ImputeNode.makeFromEncoding(null, model);
            assert.deepEqual(result.assemble(), [
                {
                    type: 'impute',
                    field: 'variety',
                    key: 'yield',
                    keyvals: { signal: 'sequence(3,5)' },
                    method: 'value',
                    groupby: ['site'],
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_variety_value'],
                    ops: ['max'],
                    fields: ['variety'],
                    frame: [null, null],
                    ignorePeers: false,
                    groupby: ['site']
                },
                {
                    type: 'formula',
                    expr: 'datum.variety === null ? datum.imputed_variety_value : datum.variety',
                    as: 'variety'
                }
            ]);
        });
        it('should work when method and frame are specified', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'mean', frame: [-2, 2] } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            var result = ImputeNode.makeFromEncoding(null, model);
            assert.deepEqual(result.assemble(), [
                {
                    type: 'impute',
                    field: 'variety',
                    key: 'yield',
                    method: 'value',
                    groupby: ['site'],
                    value: null
                },
                {
                    type: 'window',
                    as: ['imputed_variety_value'],
                    ops: ['mean'],
                    fields: ['variety'],
                    frame: [-2, 2],
                    ignorePeers: false,
                    groupby: ['site']
                },
                {
                    type: 'formula',
                    expr: 'datum.variety === null ? datum.imputed_variety_value : datum.variety',
                    as: 'variety'
                }
            ]);
        });
        it('should work when value and frame are specified', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'value', value: 20, frame: [-2, 2] } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            var result = ImputeNode.makeFromEncoding(null, model);
            assert.deepEqual(result.assemble(), [
                {
                    type: 'impute',
                    field: 'variety',
                    key: 'yield',
                    method: 'value',
                    groupby: ['site'],
                    value: null
                },
                {
                    type: 'formula',
                    expr: 'datum.variety === null ? 20 : datum.variety',
                    as: 'variety'
                }
            ]);
        });
    });
    describe('clone', function () {
        it('should never clone parent', function () {
            var parent = new DataFlowNode(null);
            var transform = {
                impute: 'y',
                key: 'x',
                method: 'max',
                groupby: ['a', 'b'],
                frame: [-2, 2]
            };
            var impute = new ImputeNode(parent, transform);
            expect(impute.clone().parent).toBeNull();
        });
    });
});
//# sourceMappingURL=impute.test.js.map