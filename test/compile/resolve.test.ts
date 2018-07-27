import {assert} from 'chai';
import {defaultScaleResolve, parseGuideResolve} from '../../src/compile/resolve';
import * as log from '../../src/log';
import {parseConcatModel, parseFacetModel, parseLayerModel, parseRepeatModel} from '../util';

describe('compile/resolve', () => {
  describe('defaultScaleResolve', () => {
    it('shares scales for layer model by default.', () => {
      const model = parseLayerModel({
        layer: []
      });
      assert.equal(defaultScaleResolve('x', model), 'shared');
    });

    it('shares scales for facet model by default.', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'nominal'}
        },
        spec: {mark: 'point', encoding: {}}
      });
      assert.equal(defaultScaleResolve('x', model), 'shared');
    });

    it('separates xy scales for concat model by default.', () => {
      const model = parseConcatModel({
        hconcat: []
      });
      assert.equal(defaultScaleResolve('x', model), 'independent');
    });

    it('shares non-xy scales for concat model by default.', () => {
      const model = parseConcatModel({
        hconcat: []
      });
      assert.equal(defaultScaleResolve('color', model), 'shared');
    });

    it('separates xy scales for repeat model by default.', () => {
      const model = parseRepeatModel({
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
      assert.equal(defaultScaleResolve('x', model), 'independent');
    });

    it('shares non-xy scales for repeat model by default.', () => {
      const model = parseRepeatModel({
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
      assert.equal(defaultScaleResolve('color', model), 'shared');
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
      assert.equal(axisResolve, 'shared');
    });

    it('separates axis for a shared scale if specified', () => {
      const axisResolve = parseGuideResolve(
        {
          scale: {x: 'shared'},
          axis: {x: 'independent'}
        },
        'x'
      );
      assert.equal(axisResolve, 'independent');
    });

    it('separates legend for a shared scale if specified', () => {
      const legendResolve = parseGuideResolve(
        {
          scale: {color: 'shared'},
          legend: {color: 'independent'}
        },
        'color'
      );
      assert.equal(legendResolve, 'independent');
    });

    it('separates axis for an independent scale by default', () => {
      const axisResolve = parseGuideResolve(
        {
          scale: {x: 'independent'},
          axis: {}
        },
        'x'
      );
      assert.equal(axisResolve, 'independent');
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
        assert.equal(axisResolve, 'independent');
        assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('x'));
      })
    );
  });
});
