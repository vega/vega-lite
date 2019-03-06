import { ImputeNode } from '../../../src/compile/data/impute';
import { parseUnitModelWithScale } from '../../util';
import { DataFlowNode } from './../../../src/compile/data/dataflow';
describe('compile/data/impute', () => {
    describe('Impute Transform', () => {
        it('should return a proper vg transform', () => {
            const transform = {
                impute: 'y',
                key: 'x',
                method: 'value',
                value: 200
            };
            const impute = new ImputeNode(null, transform);
            expect(impute.assemble()).toEqual([
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
        it('should use keyvals and mean correctly', () => {
            const transform = {
                impute: 'y',
                key: 'x',
                keyvals: [2, 3],
                method: 'mean'
            };
            const impute = new ImputeNode(null, transform);
            expect(impute.assemble()).toEqual([
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
        it('should handle every property correctly', () => {
            const transform = {
                impute: 'y',
                key: 'x',
                keyvals: [3, 5],
                method: 'max',
                groupby: ['a', 'b']
            };
            const impute = new ImputeNode(null, transform);
            expect(impute.assemble()).toEqual([
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
        it('should handle sequence keyvals', () => {
            const transform = {
                impute: 'y',
                key: 'x',
                keyvals: { start: 3, stop: 5 },
                method: 'max',
                groupby: ['a', 'b']
            };
            const impute = new ImputeNode(null, transform);
            expect(impute.assemble()).toEqual([
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
        it('should handle window correctly', () => {
            const transform = {
                impute: 'y',
                key: 'x',
                method: 'max',
                groupby: ['a', 'b'],
                frame: [-2, 2]
            };
            const impute = new ImputeNode(null, transform);
            expect(impute.assemble()).toEqual([
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
        it('should generate the correct hash', () => {
            const transform = {
                impute: 'y',
                key: 'x',
                method: 'value',
                value: 200
            };
            const impute = new ImputeNode(null, transform);
            expect(impute.hash()).toEqual('Impute {"impute":"y","key":"x","method":"value","value":200}');
        });
    });
    describe('Impute Encoding', () => {
        it('should work for value impute', () => {
            const model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { value: 500 } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            const result = ImputeNode.makeFromEncoding(null, model);
            expect(result.assemble()).toEqual([
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
        it('should work for falsy value impute', () => {
            const model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { value: 0 } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            const result = ImputeNode.makeFromEncoding(null, model);
            expect(result.assemble()).toEqual([
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
        it('should work for method impute', () => {
            const model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'max' } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            const result = ImputeNode.makeFromEncoding(null, model);
            expect(result.assemble()).toEqual([
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
        it('should handle sequence keyvals in encoding', () => {
            const model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'max', keyvals: { start: 3, stop: 5 } } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            const result = ImputeNode.makeFromEncoding(null, model);
            expect(result.assemble()).toEqual([
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
        it('should work when method and frame are specified', () => {
            const model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'mean', frame: [-2, 2] } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            const result = ImputeNode.makeFromEncoding(null, model);
            expect(result.assemble()).toEqual([
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
        it('should work when value and frame are specified', () => {
            const model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                    y: { field: 'variety', type: 'quantitative', impute: { method: 'value', value: 20, frame: [-2, 2] } },
                    color: { field: 'site', type: 'nominal' }
                }
            });
            const result = ImputeNode.makeFromEncoding(null, model);
            expect(result.assemble()).toEqual([
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
    describe('clone', () => {
        it('should never clone parent', () => {
            const parent = new DataFlowNode(null);
            const transform = {
                impute: 'y',
                key: 'x',
                method: 'max',
                groupby: ['a', 'b'],
                frame: [-2, 2]
            };
            const impute = new ImputeNode(parent, transform);
            expect(impute.clone().parent).toBeNull();
        });
    });
});
//# sourceMappingURL=impute.test.js.map