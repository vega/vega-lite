import {assert} from 'chai';
import * as log from '../src/log';
import {initLayerResolve, ResolveMapping} from '../src/resolve';

describe('resolve', () => {
  describe('initLayerResolve', () => {
    const defaults: ResolveMapping = {
      x: {scale: 'shared', axis: 'shared'},
      y: {scale: 'shared', axis: 'shared'},
      size: {scale: 'shared', legend: 'shared'},
      shape: {scale: 'shared', legend: 'shared'},
      color: {scale: 'shared', legend: 'shared'},
      opacity: {scale: 'shared', legend: 'shared'}
    };

    it('should share by default', () => {
      const actual = initLayerResolve({});
      assert.deepEqual<ResolveMapping>(actual, defaults);
    });

    it('should set x axis to independent', () => {
      const actual = initLayerResolve({x: {
        axis: 'independent'
      }});

      assert.deepEqual<ResolveMapping>(actual, {
        ...defaults,
        x: {
          scale: 'shared',
          axis: 'independent'
        }
      });
    });

    it('should set x axis to independent even if we set scale to shared', () => {
      const actual = initLayerResolve({x: {
        scale: 'shared',
        axis: 'independent'
      }});

      assert.deepEqual<ResolveMapping>(actual, {
        ...defaults,
        x: {
          scale: 'shared',
          axis: 'independent'
        }
      });
    });

    it('should set color legend to independent', () => {
      const actual = initLayerResolve({color: {
        legend: 'independent'
      }});

      assert.deepEqual<ResolveMapping>(actual, {
        ...defaults,
        color: {
          scale: 'shared',
          legend: 'independent'
        }
      });
    });

    it('should force independent axis if scale is independent', () => {
      log.runLocalLogger((localLogger) => {
        const actual = initLayerResolve({x: {
          scale: 'independent',
          axis: 'shared'
        }});

        assert.deepEqual<ResolveMapping>(actual, {
          ...defaults,
          x: {
            scale: 'independent',
            axis: 'independent'
          }
        });

        assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('x'));
      });
    });

    it('should force independent axis if scale is independent', () => {
      log.runLocalLogger((localLogger) => {
        const actual = initLayerResolve({color: {
          scale: 'independent',
          legend: 'shared'
        }});

        assert.deepEqual<ResolveMapping>(actual, {
          ...defaults,
          color: {
            scale: 'independent',
            legend: 'independent'
          }
        });

        assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('color'));
      });
    });
  });
});
