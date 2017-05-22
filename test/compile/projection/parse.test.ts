import {assert} from 'chai';
import {VgProjection} from '../../../src/vega.schema';

import {Config} from '../../../src/config';
import {Encoding} from '../../../src/encoding';
import {Field} from '../../../src/fielddef';
import {Projection} from '../../../src/projection';
import {LayerSpec, UnitSpec} from '../../../src/spec';

import {parseProjection, parseProjectionComponent} from '../../../src/compile/projection/parse';
import {parseUnitModel} from '../../util';

describe('compile/projection', () => {
  describe('parse', () => {
    it('should output vega projection with same properties as specified vega-lite projection', () => {
      const spec: UnitSpec = {
        'mark': 'point',
        'projection': {'type': 'mercator'},
        'encoding': {}
      };
      const expected: VgProjection = {
        'name': 'projection',
        'type': 'mercator'
      };
      const vegaProjection: VgProjection = parseProjection(parseUnitModel(spec));
      assert.deepEqual(expected, vegaProjection);
    });

    it('should not output a vega projection if none is specified', () => {
      const spec: UnitSpec = {
        'data': {'url': 'data/cars.json'},
        'mark': 'text',
        'encoding': {
          'text': {'field': 'Acceleration', 'type': 'quantitative', 'aggregate': 'mean'},
          'color': {'field': 'Acceleration', 'type': 'quantitative', 'aggregate': 'mean'},
          'size': {'field': 'Acceleration', 'type': 'quantitative', 'aggregate': 'mean'}
        }
      };
      assert.isUndefined(parseProjection(parseUnitModel(spec)));
    });
  });

  describe('parseComponent', () => {
    it('should output an array of vega projections', () => {
      const spec: UnitSpec = {
        'mark': 'point',
        'projection': {'type': 'mercator'},
        'encoding': {}
      };
      const expected: VgProjection[] = [{
        'name': 'projection',
        'type': 'mercator'
      }];
      const projectionComponent: VgProjection[] = parseProjectionComponent(parseUnitModel(spec));
      assert.deepEqual(expected, projectionComponent);
    });
  });
});
