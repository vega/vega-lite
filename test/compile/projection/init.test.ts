import {assert} from 'chai';

import {initLayerProjection, initProjection} from '../../../src/compile/projection/init';
import {Config} from '../../../src/config';
import {Encoding} from '../../../src/encoding';
import {Field} from '../../../src/fielddef';
import {Projection} from '../../../src/projection';
import {LayerSpec, UnitSpec} from '../../../src/spec';

describe('compile/projection', () => {
  const specified: Projection = {type: 'mercator'};
  const specifiedAlternate: Projection = {type: 'albersUsa'};

  describe('init', () => {
    it('should output a projection if one is specified', () => {
      const output = initProjection(undefined, specified, undefined, undefined, undefined);
      assert.deepEqual(specified, output);
    });

    // it('should output a projection if mark is geoshape', () => {
    //   assert.isTrue(true);
    // });

    it('should output a projection if channel is projection (latitude or longitude)', () => {
      const encodingLat: Encoding<Field> = {
        'y': {'field': 'y', 'type': 'latitude'}
      };
      const outputLat = initProjection(undefined, undefined, specified, undefined, encodingLat);
      assert.deepEqual(specified, outputLat);

      const encodingLong: Encoding<Field> = {
        'x': {'field': 'x', 'type': 'longitude'}
      };
      const outputLong = initProjection(undefined, undefined, specified, undefined, encodingLong);
      assert.deepEqual(specified, outputLong);
    });

    it('should output a projection such that a specified projection overrides a parent-specified projection which overrides a config-specified projection', () => {
      const config: Config = {projection: {type: 'gnomonic'}};
      const parent: Projection = {type: 'albers'};

      let output = initProjection(config, specified, undefined, undefined, undefined);
      assert.deepEqual(specified, output);
      output = initProjection(config, specified, parent, undefined, undefined);
      assert.deepEqual(specified, output);

      const encoding: Encoding<Field> = {
        'x': {'field': 'x', 'type': 'longitude'}
      };

      output = initProjection(config, undefined, parent, undefined, encoding);
      assert.deepEqual(parent, output);

      output = initProjection(config, undefined, undefined, undefined, encoding);
      assert.deepEqual(config.projection, output);
    });

    it('should not output a projection if none is specified up inheritance chain', () => {
      let output = initProjection(undefined, undefined, undefined, undefined, undefined);
      assert.isUndefined(output);

      const encoding: Encoding<Field> = {
        'x': {'field': 'x', 'type': 'longitude'}
      };

      output = initProjection(undefined, undefined, undefined, undefined, encoding);
      assert.isUndefined(output);
    });
  });

  describe('initLayer', () => {
    it('should output the projection specified first in layers', () => {
      const layers: UnitSpec[] = [
        {
          'mark': 'point',
          ...specified,
          encoding: {}
        },
        {
          'mark': 'point',
          ...specifiedAlternate,
          encoding: {}
        }
      ];
      assert.deepEqual(specified, initLayerProjection(layers));
    });

    it('should not output a projection if none are specified in layers', () => {
      const layers: UnitSpec[] = [
        {
          'mark': 'point',
          encoding: {}
        },
        {
          'mark': 'point',
          encoding: {}
        }
      ];
      assert.isUndefined(initLayerProjection(layers));
    });
  });
});
