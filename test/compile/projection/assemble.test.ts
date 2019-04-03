import {assembleProjectionForModel} from '../../../src/compile/projection/assemble';
import {isSignalRef} from '../../../src/vega.schema';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/projection/assemble', () => {
  describe('assembleProjectionForModel', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'geoshape',
      projection: {
        type: 'albersUsa'
      },
      data: {
        url: 'data/us-10m.json',
        format: {
          type: 'topojson',
          feature: 'states'
        }
      },
      encoding: {}
    });
    model.parse();

    it('should not be empty', () => {
      expect(assembleProjectionForModel(model).length).toBeGreaterThan(0);
    });

    it('should have properties of right type', () => {
      const projection = assembleProjectionForModel(model)[0];
      expect(projection.name).toBeDefined();
      expect(typeof projection.name).toBe('string');
      expect(projection.size).toBeDefined();
      expect(isSignalRef(projection.size)).toBe(true);
      expect(projection.fit).toBeDefined();
      expect(isSignalRef(projection.fit)).toBe(true);
    });
  });

  describe('assembleCustomProjectionForModel', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'geoshape',
      projection: {
        type: 'albersUsa',
        scale: 1000
      },
      data: {
        url: 'data/us-10m.json',
        format: {
          type: 'topojson',
          feature: 'states'
        }
      },
      encoding: {}
    });
    model.parse();

    it('should not be empty', () => {
      expect(assembleProjectionForModel(model).length).toBeGreaterThan(0);
    });

    it('should have properties of right type', () => {
      const projection = assembleProjectionForModel(model)[0];
      expect(projection.name).toBeDefined();
      expect(typeof projection.name).toBe('string');
      expect(projection.scale).toBeDefined();
      expect(typeof projection.scale).toBe('number');
      expect(projection.size).toBeUndefined();
      expect(projection.fit).toBeUndefined();
    });
  });
});
