/* tslint:disable:quotemark */
import {assert} from 'chai';
import {AncestorParse} from '../../../src/compile/data';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {parseTransformArray} from '../../../src/compile/data/parse';
import {ModelWithField} from '../../../src/compile/model';
import * as log from '../../../src/log';
import {parseFacetModel, parseUnitModel} from '../../util';

describe('compile/data/formatparse', () => {
  describe('parseUnit', () => {
    it('should parse binned fields as numbers', () => {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "a", "type": "ordinal", "bin": true},
          "y": {"field": "b", "type": "ordinal"}
        }
      });

      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()).parse, {
        a: 'number'
      });
    });

    it('should return a correct customized parse.', () => {
      const model = parseUnitModel({
        "data": {"url": "a.json", "format": {"parse": {"c": "number", "d": "date"}}},
        "mark": "point",
        "encoding": {
          "x": {"field": "a", "type": "quantitative"},
          "y": {"field": "b", "type": "temporal"},
          "color": {"field": "c", "type": "ordinal"},
          "shape": {"field": "c", "type": "nominal"}
        }
      });

      const ancestorParese = new AncestorParse();
      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, ancestorParese).parse, {
        a: 'number',
        b: 'date'
      });

      assert.deepEqual(ParseNode.makeExplicit(null, model, ancestorParese).parse, {
        c: 'number',
        d: 'date'
      });
    });

    it('should include parse for all applicable fields, and exclude calculated fields', function() {
      const model = parseUnitModel({
        transform: [{calculate: 'datum["b"] * 2', as: 'b2'}],
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal"},
          y: {field: 'b', type: "quantitative"},
          color: {type: "quantitative", aggregate: 'count'},
          size: {field: 'b2', type: "quantitative"},
        }
      });

      const ancestorParse = new AncestorParse();
      const parent = new DataFlowNode(null);
      parseTransformArray(parent, model, ancestorParse);
      assert.deepEqual(ancestorParse.combine(), {'b2': 'derived'});
      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
        'a': 'date',
        'b': 'number'
      });
    });

    it('should not parse fields with aggregate=missing/valid/distinct', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {aggregate: 'missing', field: 'b', type: "quantitative"},
          y: {aggregate: 'valid', field: 'b', type: "quantitative"},
          color: {aggregate: 'distinct', field: 'b', type: "quantitative"}
        }
      });

      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()), null);
    });

    it('should not parse the same field twice', function() {
      const model = parseFacetModel({
        data: {
          values: [],
          format: {
            parse: {
              a: 'number'
            }
          }
        },
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative"},
            y: {field: 'b', type: "temporal"}
          }
        }
      });

      assert.deepEqual(ParseNode.makeExplicit(null, model, new AncestorParse()).parse, {
        'a': 'number'
      });
      model.parseScale();
      model.parseData();

      assert.deepEqual(model.child.component.data.ancestorParse.combine(), {
        'a': 'number',
        'b': 'date'
      });

      // set the ancestor parse to see whether fields from it are not parsed
      model.child.component.data.ancestorParse = new AncestorParse({a: 'number'});
      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model.child as ModelWithField, model.child.component.data.ancestorParse).parse, {
        'b': 'date'
      });
    });

    it('should not parse the same field twice in explicit', function() {
      const model = parseUnitModel({
        data: {
          values: [],
          format: {
            parse: {
              a: 'number'
            }
          }
        },
        mark: "point",
        encoding: {}
      });

      assert.isNull(ParseNode.makeExplicit(null, model, new AncestorParse({a: 'number'}, {})));
    });

    it('should not parse the same field twice in implicit', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });

      assert.isNull(ParseNode.makeExplicit(null, model, new AncestorParse({a: 'number'}, {})));
    });

    it('should not parse counts', () => {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"aggregate": "sum", "field": "foo", "type": "quantitative"},
          "y": {"aggregate": "count", "type": "quantitative"}
        }
      });

      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()).parse, {
        "foo": "number"
      });
    });

    it('should add flatten for nested fields', () => {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "foo.bar", "type": "quantitative"},
          "y": {"field": "foo.baz", "type": "ordinal"}
        }
      });

      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()).parse, {
        "foo.bar": "number",
        "foo.baz": "flatten"
      });
    });

    it('should not parse if parse is disabled for a field', () => {
      const model = parseUnitModel({
        "mark": "point",
        "data": {
          "values": [],
          "format": {
            "parse": {
              "b": null
            }
          }
        },
        "encoding": {
          "x": {"field": "a", "type": "quantitative"},
          "y": {"field": "b", "type": "quantitative"}
        }
      });

      const ancestorParse = new AncestorParse();
      assert.isNull(ParseNode.makeExplicit(null, model, ancestorParse), null);
      assert.deepEqual(ancestorParse.combine(), {
        b: null
      });
      assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
        a: 'number'
      });
    });

    it('should not parse if parse is disabled', () => {
      const model = parseUnitModel({
        "mark": "point",
        "data": {
          "values": [],
          "format": {
            "parse": null  // implies AncestorParse.makeExplicit = true
          }
        },
        "encoding": {
          "x": {"field": "a", "type": "quantitative"},
          "y": {"field": "b", "type": "quantitative"}
        }
      });

      assert.isNull(ParseNode.makeExplicit(null, model, new AncestorParse({}, {}, true)));
    });
  });

  describe('assembleTransforms', function() {
    it('should assemble correct parse expressions', function() {
      const p = new ParseNode(null, {
        n: 'number',
        b: 'boolean',
        s: 'string',
        d1: 'date',
        d2: 'date:"%y"',
        d3: 'utc:"%y"'
      });

      assert.deepEqual(p.assembleTransforms(), [
        {type: 'formula', expr: 'toNumber(datum["n"])', as: 'n'},
        {type: 'formula', expr: 'toBoolean(datum["b"])', as: 'b'},
        {type: 'formula', expr: 'toString(datum["s"])', as: 's'},
        {type: 'formula', expr: 'toDate(datum["d1"])', as: 'd1'},
        {type: 'formula', expr: 'timeParse(datum["d2"],"%y")', as: 'd2'},
        {type: 'formula', expr: 'utcParse(datum["d3"],"%y")', as: 'd3'}
      ]);
    });

    it('should assemble flatten for nested fields', function() {
      const p = new ParseNode(null, {
        flat: 'number',
        'nested.field': 'flatten'
      });

      assert.deepEqual(p.assembleTransforms(true), [
        {type: 'formula', expr: 'datum["nested"] && datum["nested"]["field"]', as: 'nested.field'}
      ]);
    });

    it('should show warning for unrecognized types', log.wrap((localLogger) => {
      const p = new ParseNode(null, {
        x: 'foo',
      });

      assert.deepEqual(p.assembleTransforms(), []);
      assert.equal(localLogger.warns[0], log.message.unrecognizedParse('foo'));
    }));
  });

  describe('assembleFormatParse', function() {
    it('should assemble correct parse', function() {
      const p = new ParseNode(null, {
        n: 'number',
        b: 'boolean',
        'nested.field': 'flatten'
      });

      assert.deepEqual(p.assembleFormatParse(), {
        n: 'number',
        b: 'boolean'
      });
    });
  });

  describe('producedFields', function() {
    it('should produce the correct fields', function() {
      const p = new ParseNode(null, {
        n: 'number',
        b: 'boolean',
        'nested.field': 'flatten'
      });

      assert.deepEqual(p.producedFields(), {n: true, b: true, 'nested.field': true});
    });
  });
});
