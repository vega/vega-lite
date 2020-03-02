import {defaultScaleResolve, parseGuideResolve} from '../../src/compile/resolve';
import * as log from '../../src/log';
import {parseConcatModel, parseFacetModel, parseLayerModel, parseModel} from '../util';

describe('compile/resolve', () => {
  describe('defaultScaleResolve', () => {
    it('shares scales for layer model by default.', () => {
      const model = parseLayerModel({
        layer: []
      });
      expect(defaultScaleResolve('x', model)).toBe('shared');
    });

    it('shares scales for facet model by default.', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'nominal'}
        },
        spec: {mark: 'point', encoding: {}}
      });
      expect(defaultScaleResolve('x', model)).toBe('shared');
    });

    it('separates xy scales for concat model by default.', () => {
      const model = parseConcatModel({
        hconcat: []
      });
      expect(defaultScaleResolve('x', model)).toBe('independent');
    });

    it('shares non-xy scales for concat model by default.', () => {
      const model = parseConcatModel({
        hconcat: []
      });
      expect(defaultScaleResolve('color', model)).toBe('shared');
    });

    it('separates xy scales for repeat model by default.', () => {
      const model = parseModel({
        repeat: {
          row: ['a', 'b']
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: {repeat: 'row'}, type: 'quantitative'},
            color: {field: 'color', type: 'quantitative'}
          }
        }
      });
      expect(defaultScaleResolve('x', model)).toBe('independent');
    });

    it('shares non-xy scales for repeat model by default.', () => {
      const model = parseModel({
        repeat: {
          row: ['a', 'b']
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: {repeat: 'row'}, type: 'quantitative'},
            color: {field: 'color', type: 'quantitative'}
          }
        }
      });
      expect(defaultScaleResolve('color', model)).toBe('shared');
    });
  });

  describe('parseGuideResolve', () => {
    it('shares axis for a shared scale by default', () => {
      const axisResolve = parseGuideResolve(
        {
          scale: {x: 'shared'},
          axis: {}
        },
        'x'
      );
      expect(axisResolve).toBe('shared');
    });

    it('separates axis for a shared scale if specified', () => {
      const axisResolve = parseGuideResolve(
        {
          scale: {x: 'shared'},
          axis: {x: 'independent'}
        },
        'x'
      );
      expect(axisResolve).toBe('independent');
    });

    it('separates legend for a shared scale if specified', () => {
      const legendResolve = parseGuideResolve(
        {
          scale: {color: 'shared'},
          legend: {color: 'independent'}
        },
        'color'
      );
      expect(legendResolve).toBe('independent');
    });

    it('separates axis for an independent scale by default', () => {
      const axisResolve = parseGuideResolve(
        {
          scale: {x: 'independent'},
          axis: {}
        },
        'x'
      );
      expect(axisResolve).toBe('independent');
    });

    it(
      'separates axis for an independent scale even "shared" is specified and throw warning',
      log.wrap(localLogger => {
        const axisResolve = parseGuideResolve(
          {
            scale: {x: 'independent'},
            axis: {x: 'shared'}
          },
          'x'
        );
        expect(axisResolve).toBe('independent');
        expect(localLogger.warns[0]).toEqual(log.message.independentScaleMeansIndependentGuide('x'));
      })
    );
  });
});
