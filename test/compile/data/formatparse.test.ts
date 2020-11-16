import {AncestorParse} from '../../../src/compile/data';
import {PlaceholderDataFlowNode} from './util';
import {ParseNode, getImplicitFromEncoding, getImplicitFromSelection} from '../../../src/compile/data/formatparse';
import {parseTransformArray} from '../../../src/compile/data/parse';
import {ModelWithField} from '../../../src/compile/model';
import * as log from '../../../src/log';
import {parseFacetModel, parseUnitModel} from '../../util';

describe('compile/data/formatparse', () => {
  describe('makeWithAncestors', () => {
    it('should return null for empty explicit and implicit', () => {
      expect(ParseNode.makeWithAncestors(null, {}, {}, new AncestorParse())).toBeNull();
    });
  });

  describe('parseUnit', () => {
    it('should flatten nested fields that are used to sort domains', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', sort: {field: 'foo.bar', op: 'mean'}}
        }
      });

      expect(getImplicitFromEncoding(model)).toEqual({
        'foo.bar': 'flatten'
      });
    });

    it('should return a correct customized parse.', () => {
      const model = parseUnitModel({
        data: {url: 'a.json', format: {parse: {c: 'number', d: 'date'}}},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'temporal'},
          color: {field: 'c', type: 'ordinal'},
          shape: {field: 'c', type: 'nominal'}
        }
      });

      expect(getImplicitFromEncoding(model)).toEqual({
        b: 'date'
      });

      expect(ParseNode.makeExplicit(null, model, new AncestorParse()).parse).toEqual({
        c: 'number',
        d: 'date'
      });
    });

    it('should include parse for all applicable fields, and exclude calculated fields', () => {
      const model = parseUnitModel({
        transform: [{calculate: 'datum["b"] * 2', as: 'b2'}],
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal'},
          y: {field: 'b', type: 'quantitative'},
          color: {type: 'quantitative', aggregate: 'count'},
          size: {field: 'b2', type: 'quantitative'}
        }
      });

      const ancestorParse = new AncestorParse();
      const parent = new PlaceholderDataFlowNode(null);
      parseTransformArray(parent, model, ancestorParse);

      const implicit = getImplicitFromEncoding(model);
      expect(implicit).toEqual({
        a: 'date'
      });

      expect(ParseNode.makeWithAncestors(null, {}, implicit, ancestorParse).parse).toEqual({
        a: 'date'
      });
    });

    it('should not parse fields with aggregate=missing/valid/distinct', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: 'missing', field: 'b', type: 'quantitative'},
          y: {aggregate: 'valid', field: 'b', type: 'quantitative'},
          color: {aggregate: 'distinct', field: 'b', type: 'quantitative'}
        }
      });

      expect(getImplicitFromEncoding(model)).toEqual({});
    });

    it('should not parse the same field twice', () => {
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
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'quantitative'},
            y: {field: 'b', type: 'temporal'}
          }
        }
      });

      expect(ParseNode.makeExplicit(null, model, new AncestorParse()).parse).toEqual({
        a: 'number'
      });
      model.parseScale();
      model.parseData();

      expect(model.child.component.data.ancestorParse.combine()).toEqual({
        a: 'number',
        b: 'date'
      });

      // set the ancestor parse to see whether fields from it are not parsed
      model.child.component.data.ancestorParse = new AncestorParse({a: 'number'});

      const implicit = getImplicitFromEncoding(model.child as ModelWithField);
      expect(implicit).toEqual({
        b: 'date'
      });
      expect(ParseNode.makeWithAncestors(null, {}, implicit, model.child.component.data.ancestorParse).parse).toEqual({
        b: 'date'
      });
    });

    it('should not parse the same field twice in explicit', () => {
      const model = parseUnitModel({
        data: {
          values: [],
          format: {
            parse: {
              a: 'number'
            }
          }
        },
        mark: 'point',
        encoding: {}
      });

      expect(ParseNode.makeExplicit(null, model, new AncestorParse({a: 'number'}, {}))).toBeNull();
    });

    it('should not parse the same field twice in implicit', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });

      expect(ParseNode.makeExplicit(null, model, new AncestorParse({a: 'number'}, {}))).toBeNull();
    });

    it('should not parse counts', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: 'sum', field: 'foo', type: 'quantitative'},
          y: {aggregate: 'count', type: 'quantitative'}
        }
      });

      expect(getImplicitFromEncoding(model)).toEqual({});
    });

    it('should add flatten for nested fields in encoding', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'foo.bar', type: 'quantitative'},
          y: {field: 'foo.baz', type: 'ordinal'}
        }
      });

      expect(getImplicitFromEncoding(model)).toEqual({
        'foo.bar': 'flatten',
        'foo.baz': 'flatten'
      });
    });

    it('should add flatten for nested fields in selection', () => {
      const model = parseUnitModel({
        params: [{name: 'foo', select: {type: 'point', fields: ['foo.bar', 'foo.baz']}}],
        mark: 'point',
        encoding: {
          x: {field: 'bar', type: 'quantitative'},
          y: {field: 'baz', type: 'ordinal'}
        }
      });

      model.parseSelections();

      expect(getImplicitFromSelection(model)).toEqual({
        'foo.bar': 'flatten',
        'foo.baz': 'flatten'
      });
    });

    it('should not parse if parse is disabled for a field', () => {
      const model = parseUnitModel({
        mark: 'point',
        data: {
          values: [],
          format: {
            parse: {
              b: null
            }
          }
        },
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'}
        }
      });

      const ancestorParse = new AncestorParse();
      expect(ParseNode.makeExplicit(null, model, ancestorParse)).toBeNull();
      expect(ancestorParse.combine()).toEqual({
        b: null
      });

      expect(getImplicitFromEncoding(model)).toEqual({});
    });

    it('should not parse if parse is disabled', () => {
      const model = parseUnitModel({
        mark: 'point',
        data: {
          values: [],
          format: {
            parse: null // implies AncestorParse.makeExplicit = true
          }
        },
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'}
        }
      });

      expect(ParseNode.makeExplicit(null, model, new AncestorParse({}, {}, true))).toBeNull();
    });

    it('should add parse for domains of path marks', () => {
      const model = parseUnitModel({
        mark: 'line',
        encoding: {
          x: {field: 'foo', type: 'quantitative'},
          y: {field: 'bar', type: 'quantitative'}
        }
      });

      expect(getImplicitFromEncoding(model)).toEqual({
        foo: 'number'
      });
    });
  });

  describe('assembleTransforms', () => {
    it('should assemble correct parse expressions', () => {
      const p = new ParseNode(null, {
        n: 'number',
        b: 'boolean',
        s: 'string',
        d1: 'date',
        d2: 'date:"%y"',
        d3: 'utc:"%y"',
        d4: 'utc:%y',
        d5: `utc:'%y'`
      });

      expect(p.assembleTransforms()).toEqual([
        {type: 'formula', expr: 'toNumber(datum["n"])', as: 'n'},
        {type: 'formula', expr: 'toBoolean(datum["b"])', as: 'b'},
        {type: 'formula', expr: 'toString(datum["s"])', as: 's'},
        {type: 'formula', expr: 'toDate(datum["d1"])', as: 'd1'},
        {type: 'formula', expr: `timeParse(datum["d2"],'%y')`, as: 'd2'},
        {type: 'formula', expr: `utcParse(datum["d3"],'%y')`, as: 'd3'},
        {type: 'formula', expr: `utcParse(datum["d4"],'%y')`, as: 'd4'},
        {type: 'formula', expr: `utcParse(datum["d5"],'%y')`, as: 'd5'}
      ]);
    });

    it('should assemble flatten for nested fields', () => {
      const p = new ParseNode(null, {
        flat: 'number',
        'nested.field': 'flatten'
      });

      expect(p.assembleTransforms(true)).toEqual([
        {type: 'formula', expr: 'datum["nested"] && datum["nested"]["field"]', as: 'nested.field'}
      ]);
    });

    it(
      'should show warning for unrecognized types',
      log.wrap(localLogger => {
        const p = new ParseNode(null, {
          x: 'foo'
        });

        expect(p.assembleTransforms()).toEqual([]);
        expect(localLogger.warns[0]).toEqual(log.message.unrecognizedParse('foo'));
      })
    );
  });

  describe('assembleFormatParse', () => {
    it('should assemble correct parse', () => {
      const p = new ParseNode(null, {
        n: 'number',
        b: 'boolean',
        'nested.field': 'flatten'
      });

      expect(p.assembleFormatParse()).toEqual({
        n: 'number',
        b: 'boolean'
      });
    });
  });

  describe('producedFields', () => {
    it('should produce the correct fields', () => {
      const p = new ParseNode(null, {
        n: 'number',
        b: 'boolean',
        'nested.field': 'flatten'
      });

      expect(p.producedFields()).toEqual(new Set(['n', 'b', 'nested.field']));
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const parse = new ParseNode(parent, {});
      expect(parse.clone().parent).toBeNull();
    });
  });
});
