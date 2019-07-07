import {FilterInvalidNode} from '../../../src/compile/data/filterinvalid';
import {UnitModel} from '../../../src/compile/unit';
import {NormalizedUnitSpec, TopLevel} from '../../../src/spec';
import {mergeDeep} from '../../../src/util';
import {parseUnitModelWithScale} from '../../util';

function parse(model: UnitModel) {
  return FilterInvalidNode.make(null, model);
}

describe('compile/data/filterinvalid', () => {
  describe('compileUnit', () => {
    const spec: NormalizedUnitSpec = {
      mark: 'point',
      encoding: {
        y: {field: 'qq', type: 'quantitative'},
        x: {field: 'tt', type: 'temporal'},
        color: {field: 'oo', type: 'ordinal'},
        shape: {field: 'nn', type: 'nominal'}
      }
    };

    it('should add filterNull for Q and T by default', () => {
      const model = parseUnitModelWithScale(spec);
      expect(parse(model).filter).toEqual({
        qq: {field: 'qq', type: 'quantitative'},
        tt: {field: 'tt', type: 'temporal'}
      });
    });

    it('should add filterNull for Q and T when invalidValues is "filter".', () => {
      const model = parseUnitModelWithScale(
        mergeDeep<TopLevel<NormalizedUnitSpec>>(spec, {
          config: {
            invalidValues: 'filter'
          }
        })
      );
      expect(parse(model).filter).toEqual({
        qq: {field: 'qq', type: 'quantitative'},
        tt: {field: 'tt', type: 'temporal'}
      });
    });

    it('should add no null filter if when invalidValues is null', () => {
      const model = parseUnitModelWithScale(
        mergeDeep<TopLevel<NormalizedUnitSpec>>(spec, {
          config: {
            invalidValues: null
          }
        })
      );
      expect(parse(model)).toBeNull();
    });

    it('should add no null filter for count field', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          y: {aggregate: 'count', type: 'quantitative'}
        }
      });

      expect(parse(model)).toBeNull();
    });
  });

  describe('dependentFields', () => {
    it('should return the fields it filters', () => {
      const node = new FilterInvalidNode(null, {foo: {field: 'foo', type: 'quantitative'}});
      expect(node.dependentFields()).toEqual(new Set(['foo']));
    });
  });

  describe('assemble', () => {
    it('should assemble simple filter', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          y: {field: 'foo', type: 'quantitative'}
        }
      });

      expect(parse(model).assemble()).toEqual({
        type: 'filter',
        expr: 'datum["foo"] !== null && !isNaN(datum["foo"])'
      });
    });

    it('should assemble filter for nested data', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          y: {field: 'foo.bar', type: 'quantitative'}
        }
      });

      expect(parse(model).assemble()).toEqual({
        type: 'filter',
        expr: 'datum["foo.bar"] !== null && !isNaN(datum["foo.bar"])'
      });
    });
  });
});
