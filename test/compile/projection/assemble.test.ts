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

  describe('assembleScaledProjectionForModel', () => {
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
      expect(projection.scale).toBe(1000);
      expect(projection.translate).toBeDefined();
      expect(projection.translate).toEqual({signal: '[width / 2, height / 2]'});
      expect(projection.size).toBeUndefined();
      expect(projection.fit).toBeUndefined();
    });
  });

  describe('assembleTranslatedProjectionForModel', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'geoshape',
      projection: {
        type: 'albersUsa',
        translate: [100, 200]
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
      expect(projection.scale).toBeUndefined();
      expect(projection.translate).toBeDefined();
      expect(projection.translate).toEqual([100, 200]);
      expect(projection.size).toBeUndefined();
      expect(projection.fit).toBeUndefined();
    });
  });
});
