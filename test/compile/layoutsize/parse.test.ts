import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/layout', () => {
  describe('parseUnitLayoutSize', () => {
    it('should have width, height = provided top-level width, height', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        width: 123,
        height: 456,
        mark: 'text',
        encoding: {},
        config: {scale: {textXRangeStep: 91}}
      });

      expect(model.component.layoutSize.explicit.width).toEqual(123);
      expect(model.component.layoutSize.explicit.height).toEqual(456);
    });

    it('should have width = default textXRangeStep for text mark without x', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'text',
        encoding: {},
        config: {scale: {textXRangeStep: 91}}
      });

      expect(model.component.layoutSize.implicit.width).toEqual(91);
    });

    it('should have width/height = config.scale.rangeStep  for non-text mark without x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {},
        config: {scale: {rangeStep: 23}}
      });

      expect(model.component.layoutSize.implicit.width).toEqual(23);
      expect(model.component.layoutSize.implicit.height).toEqual(23);
    });

    it('should have width/height = config.view.width/height for non-ordinal x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'}
        },
        config: {view: {width: 123, height: 456}}
      });

      expect(model.component.layoutSize.implicit.width).toEqual(123);
      expect(model.component.layoutSize.implicit.height).toEqual(456);
    });

    it('should have width/height = config.view.width/height for geoshape', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        encoding: {},
        config: {view: {width: 123, height: 456}}
      });

      expect(model.component.layoutSize.implicit.width).toEqual(123);
      expect(model.component.layoutSize.implicit.height).toEqual(456);
    });

    it('should have width/height = config.view.width/height for non-ordinal x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {rangeStep: null}},
          y: {field: 'b', type: 'ordinal', scale: {rangeStep: null}}
        },
        config: {view: {width: 123, height: 456}}
      });

      expect(model.component.layoutSize.implicit.width).toEqual(123);
      expect(model.component.layoutSize.implicit.height).toEqual(456);
    });

    it('should have width/height = undefined for non-ordinal x,y', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'ordinal'}
        },
        config: {view: {width: 123, height: 456}}
      });

      expect(model.component.layoutSize.get('width')).toEqual('range-step');
      expect(model.component.layoutSize.get('height')).toEqual('range-step');
    });
  });
});
