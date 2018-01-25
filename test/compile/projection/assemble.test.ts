import {assert} from 'chai';
import {assembleProjectionForModel} from '../../../src/compile/projection/assemble';
import {isVgSignalRef} from '../../../src/vega.schema';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/projection/assemble', () => {
  describe('assembleProjectionForModel', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': 'geoshape',
      'projection': {
        'type': 'albersUsa'
      },
      'data': {
        'url': 'data/us-10m.json',
        'format': {
          'type': 'topojson',
          'feature': 'states'
        }
      },
      'encoding': {}
    });
    model.parse();

    it('should not be empty', () => {
      assert.isNotEmpty(assembleProjectionForModel(model));
    });

    it('should have properties of right type', () => {
      const projection = assembleProjectionForModel(model)[0];
      assert.isDefined(projection.name);
      assert.isString(projection.name);
      assert.isDefined(projection.size);
      assert.isTrue(isVgSignalRef(projection.size));
      assert.isDefined(projection.fit);
      assert.isTrue(isVgSignalRef(projection.fit));
    });
  });
});
