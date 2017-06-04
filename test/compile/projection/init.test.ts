import {assert} from 'chai';

import {initProjection} from '../../../src/compile/projection/init';
import {Config} from '../../../src/config';
import {Encoding} from '../../../src/encoding';
import {Field} from '../../../src/fielddef';
import {Projection} from '../../../src/projection';
import {LayerSpec, UnitSpec} from '../../../src/spec';
import {parseUnitModel} from '../../util';

describe('compile/projection', () => {
  const specified: Projection = {type: 'mercator'};
  const specifiedAlternate: Projection = {type: 'albersUsa'};
  const config: Config = {projection: {type: 'gnomonic'}};
  const parent: Projection = {type: 'albers'};

  describe('init', () => {
    it('should output a projection if one is specified', () => {
      const output = initProjection(specified, undefined, undefined, undefined, undefined);
      assert.deepEqual(specified, output);
    });

    it('should output a projection if mark is geoshape', () => {
      const model = parseUnitModel({
        'data': {'url': 'data/barley.json'},
        'mark': 'geoshape',
        'encoding':{}
      });

      const output = initProjection(undefined, parent, undefined, model.mark(), undefined);
      assert.deepEqual(parent, output);
    });

    it('should output a projection if channel is projection (latitude or longitude)', () => {
      const encodingLat: Encoding<Field> = {
        'y': {'field': 'y', 'type': 'latitude'}
      };
      const outputLat = initProjection(specified, undefined, undefined, undefined, encodingLat);
      assert.deepEqual(specified, outputLat);

      const encodingLong: Encoding<Field> = {
        'x': {'field': 'x', 'type': 'longitude'}
      };
      const outputLong = initProjection(specified, undefined, undefined, undefined, encodingLong);
      assert.deepEqual(specified, outputLong);
    });

    it('should output a projection such that a specified projection overrides a parent-specified projection which overrides a config-specified projection', () => {
      let output = initProjection(specified, undefined, config, undefined, undefined);
      assert.deepEqual(specified, output);
      output = initProjection(specified, parent, config, undefined, undefined);
      assert.deepEqual(specified, output);

      const encoding: Encoding<Field> = {
        'x': {'field': 'x', 'type': 'longitude'}
      };

      output = initProjection(undefined, parent, config, undefined, encoding);
      assert.deepEqual(parent, output);

      output = initProjection(undefined, undefined, config, undefined, encoding);
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
});
