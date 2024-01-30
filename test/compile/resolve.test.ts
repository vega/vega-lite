import {defaultScaleResolve, parseGuideResolve} from '../../src/compile/resolve.js';
import * as log from '../../src/log/index.js';
import {parseConcatModel, parseFacetModel, parseLayerModel, parseModel} from '../util.js';

describe('compile/resolve', () => {
  describe('defaultScaleResolve', () => {
    it('shares scales for layer model by default.', () => {
      const model = parseLayerModel({
        layer: []
      });
      expect(defaultScaleResolve('x', model)).toBe('shared');
      expect(defaultScaleResolve('y', model)).toBe('shared');
      expect(defaultScaleResolve('color', model)).toBe('shared');
      expect(defaultScaleResolve('theta', model)).toBe('shared');
      expect(defaultScaleResolve('radius', model)).toBe('shared');
    });

    it('shares scales for facet model by default.', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'nominal'}
        },
        spec: {mark: 'point', encoding: {}}
      });
      expect(defaultScaleResolve('x', model)).toBe('shared');
      expect(defaultScaleResolve('y', model)).toBe('shared');
      expect(defaultScaleResolve('color', model)).toBe('shared');
      expect(defaultScaleResolve('radius', model)).toBe('shared');
    });

    it('separates theta scales for facet model by default.', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'nominal'}
        },
        spec: {mark: 'arc', encoding: {}}
      });
      expect(defaultScaleResolve('theta', model)).toBe('independent');
    });

    it('separates x, y, theta, and radius scales for concat model by default.', () => {
      const model = parseConcatModel({
        hconcat: []
      });
      expect(defaultScaleResolve('x', model)).toBe('independent');
      expect(defaultScaleResolve('y', model)).toBe('independent');
      expect(defaultScaleResolve('theta', model)).toBe('independent');
      expect(defaultScaleResolve('radius', model)).toBe('independent');
    });

    it('shares non-positional scales for concat model by default.', () => {
      const model = parseConcatModel({
        hconcat: []
      });
      expect(defaultScaleResolve('color', model)).toBe('shared');
    });

    it('separates x, y, theta, and radius scales for repeat model by default.', () => {
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
      expect(defaultScaleResolve('y', model)).toBe('independent');
      expect(defaultScaleResolve('theta', model)).toBe('independent');
      expect(defaultScaleResolve('radius', model)).toBe('independent');
    });

    it('shares non-positional scales for repeat model by default.', () => {
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
