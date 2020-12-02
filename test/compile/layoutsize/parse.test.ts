import {parseModelWithScaleAndLayoutSize, parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/layout', () => {
  describe('parseUnitLayoutSize', () => {
    it('should have width, height = provided top-level width, height', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        width: 123,
        height: 456,
        mark: 'text',
        encoding: {}
      });

      expect(model.component.layoutSize.explicit.width).toBe(123);
      expect(model.component.layoutSize.explicit.height).toBe(456);
    });

    it('should have width/height = config.view.discreteWidth/height for non-geoshape marks without x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {},
        config: {view: {discreteWidth: {step: 23}, discreteHeight: {step: 24}}}
      });

      expect(model.component.layoutSize.implicit.width).toBe(23);
      expect(model.component.layoutSize.implicit.height).toBe(24);
    });

    it('should have width/height = config.view.continuousWidth/Height for geoshape', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        encoding: {},
        config: {view: {continuousWidth: 123, continuousHeight: 456}}
      });

      expect(model.component.layoutSize.implicit.width).toBe(123);
      expect(model.component.layoutSize.implicit.height).toBe(456);
    });

    it('should have width/height = config.view.continuousWidth/Height for continuous x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'}
        },
        config: {view: {continuousWidth: 123, continuousHeight: 456}}
      });

      expect(model.component.layoutSize.implicit.width).toBe(123);
      expect(model.component.layoutSize.implicit.height).toBe(456);
    });

    it('should have width/height = config.view.discreteWidth/Height for ordinal x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'ordinal'}
        },
        config: {view: {discreteWidth: 123, discreteHeight: 456}}
      });

      expect(model.component.layoutSize.implicit.width).toBe(123);
      expect(model.component.layoutSize.implicit.height).toBe(456);
    });

    it('should have step-based width/height for ordinal x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'ordinal'}
        }
      });

      expect(model.component.layoutSize.get('width')).toBe('step');
      expect(model.component.layoutSize.get('height')).toBe('step');
    });

    it('should have step-based width/height for ordinal x,y with explicit sizes', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        width: {step: 15},
        height: {step: 20},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'ordinal'}
        }
      });

      expect(model.component.layoutSize.get('width')).toBe('step');
      expect(model.component.layoutSize.get('height')).toBe('step');
    });
  });

  describe('parseConcatLayoutSize', () => {
    it('should have independent layout sizes for concatenated charts of different heights', () => {
      const model = parseModelWithScaleAndLayoutSize({
        data: {values: []},
        vconcat: [
          {
            height: 100,
            encoding: {
              x: {field: 'a', type: 'nominal'},
              y: {field: 'b', type: 'quantitative'}
            },
            layer: [{mark: 'point'}],
            resolve: {scale: {y: 'independent'}}
          },
          {
            height: 200,
            encoding: {
              x: {field: 'a', type: 'nominal'},
              y: {field: 'b', type: 'quantitative'}
            },
            layer: [{mark: 'point'}],
            resolve: {scale: {y: 'independent'}}
          }
        ]
      });

      expect(model.component.layoutSize.get('height')).toBeUndefined();
      expect(model.component.layoutSize.get('childHeight')).toBeUndefined();
    });

    it('should have the same layout sizes for concatenated charts of the same height', () => {
      const model = parseModelWithScaleAndLayoutSize({
        data: {values: []},
        vconcat: [
          {
            height: 100,
            encoding: {
              x: {field: 'a', type: 'nominal'},
              y: {field: 'b', type: 'quantitative'}
            },
            layer: [{mark: 'point'}],
            resolve: {scale: {y: 'independent'}}
          },
          {
            height: 100,
            encoding: {
              x: {field: 'a', type: 'nominal'},
              y: {field: 'b', type: 'quantitative'}
            },
            layer: [{mark: 'point'}],
            resolve: {scale: {y: 'independent'}}
          }
        ]
      });

      expect(model.component.layoutSize.get('height')).toBeUndefined();
      expect(model.component.layoutSize.get('childHeight')).toBe(100);
    });
  });
});
