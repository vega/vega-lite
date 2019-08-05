import {sizeSignals} from '../../../src/compile/layoutsize/assemble';
import {parseFacetModel, parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/layout', () => {
  describe('sizeExpr', () => {
    it('should return correct formula for ordinal-point scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point', // point mark produce ordinal-point scale by default
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const size = sizeSignals(model, 'width');
      expect(size).toEqual([
        {
          name: 'x_step',
          value: 20
        },
        {
          name: 'width',
          update: "bandspace(domain('x').length, 1, 0.5) * x_step"
        }
      ]);
    });

    it('should return correct formula for ordinal-band scale with custom padding', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rect', // rect produces ordinal-band by default
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {padding: 0.3}}
        }
      });

      const size = sizeSignals(model, 'width');
      expect(size).toEqual([
        {
          name: 'x_step',
          value: 20
        },
        {
          name: 'width',
          update: "bandspace(domain('x').length, 0.3, 0.3) * x_step"
        }
      ]);
    });

    it('should return correct formula for ordinal-band scale with custom paddingInner', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rect', // rect produces ordinal-band by default
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {paddingInner: 0.3}}
        }
      });

      const size = sizeSignals(model, 'width');
      expect(size).toEqual([
        {
          name: 'x_step',
          value: 20
        },
        {
          name: 'width',
          update: "bandspace(domain('x').length, 0.3, 0.15) * x_step"
        }
      ]);
    });

    it('should return only step if parent is facet', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'nominal'}
          }
        },
        resolve: {
          scale: {x: 'independent'}
        }
      });
      model.parseScale();
      model.parseLayoutSize();

      const size = sizeSignals(model.child, 'width');
      expect(size).toEqual([
        {
          name: 'child_x_step',
          value: 20
        }
      ]);
    });

    it('should return static view size for ordinal scale with top-level numeric width', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        width: 205,
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });

      const size = sizeSignals(model, 'width');
      expect(size).toEqual([{name: 'width', value: 205}]);
    });

    it('should return static view width for continuous x-scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });

      const size = sizeSignals(model, 'width');
      expect(size).toEqual([{name: 'width', value: 200}]);
    });

    it('should return static view size for continuous y-scale', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          y: {field: 'a', type: 'quantitative'}
        }
      });

      const size = sizeSignals(model, 'height');
      expect(size).toEqual([{name: 'height', value: 200}]);
    });

    it('should return default discreteWidth/Height if axis is not mapped', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {},
        config: {view: {discreteWidth: 17, discreteHeight: 18}}
      });

      const width = sizeSignals(model, 'width');
      expect(width).toEqual([{name: 'width', value: 17}]);

      const height = sizeSignals(model, 'height');
      expect(height).toEqual([{name: 'height', value: 18}]);
    });
  });
});
