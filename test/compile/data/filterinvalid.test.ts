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

    it('should add filterNull for Q and T when invalid is "filter".', () => {
      const model = parseUnitModelWithScale(
        mergeDeep<TopLevel<NormalizedUnitSpec>>(spec, {
          config: {
            mark: {invalid: 'filter'}
          }
        })
      );
      expect(parse(model).filter).toEqual({
        qq: {field: 'qq', type: 'quantitative'},
        tt: {field: 'tt', type: 'temporal'}
      });
    });

    it('should add no null filter if when invalid is null', () => {
      const model = parseUnitModelWithScale(
        mergeDeep<TopLevel<NormalizedUnitSpec>>(spec, {
          config: {
            mark: {invalid: null}
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

  describe('FilterInvalidNode', () => {
    describe('dependentFields', () => {
      it('should return the fields it filters', () => {
        const node = new FilterInvalidNode(null, {foo: {field: 'foo', type: 'quantitative'}});
        expect(node.dependentFields()).toEqual(new Set(['foo']));
      });
    });

    describe('producedFields', () => {
      it('should return empty set', () => {
        const node = new FilterInvalidNode(null, {foo: {field: 'foo', type: 'quantitative'}});
        expect(node.producedFields()).toEqual(new Set());
      });
    });

    describe('clone', () => {
      it('should copy filters', () => {
        const node = new FilterInvalidNode(null, {foo: {field: 'foo', type: 'quantitative'}});
        const copy = node.clone();
        expect(copy.filter).toEqual(node.filter);
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
          expr: 'isValid(datum["foo"]) && isFinite(+datum["foo"])'
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
          expr: 'isValid(datum["foo.bar"]) && isFinite(+datum["foo.bar"])'
        });
      });
    });
  });
});
