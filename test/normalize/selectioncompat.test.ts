import {normalize} from '../../src';
import {SelectionCompatibilityNormalizer} from '../../src/normalize/selectioncompat';
import {NormalizedUnitSpec} from '../../src/spec';

const selectionCompatNormalizer = new SelectionCompatibilityNormalizer();
const unit: NormalizedUnitSpec = {
  data: {url: 'data/cars.json'},
  mark: 'point',
  encoding: {
    x: {field: 'Horsepower', type: 'quantitative'},
    y: {field: 'Miles_per_Gallon', type: 'quantitative'}
  }
};

describe('SelectionCompatibilityNormalizer', () => {
  it('should normalize "single" selections', () => {
    const spec: any = {
      ...unit,
      selection: {
        CylYr: {
          type: 'single',
          fields: ['Cylinders', 'Year'],
          init: {Cylinders: 4, Year: 1977},
          bind: {input: 'range', step: 1},
          nearest: true
        }
      }
    };

    const normedUnit = selectionCompatNormalizer.mapUnit(spec);
    expect(normedUnit.params).toHaveLength(1);
    expect(normedUnit.params[0]).toHaveProperty('name', 'CylYr');
    expect(normedUnit.params[0]).toHaveProperty('value', {Cylinders: 4, Year: 1977});
    expect(normedUnit.params[0]).toHaveProperty('bind', {input: 'range', step: 1});
    expect(normedUnit.params[0]).toHaveProperty('select', {
      type: 'point',
      fields: ['Cylinders', 'Year'],
      toggle: false,
      nearest: true
    });
  });

  it('should normalize "multi" selections', () => {
    const spec: any = {
      ...unit,
      selection: {
        Org: {
          type: 'multi',
          fields: ['Origin'],
          init: {Origin: 'Japan'},
          bind: 'legend'
        }
      }
    };

    const normedUnit = selectionCompatNormalizer.mapUnit(spec);
    expect(normedUnit.params).toHaveLength(1);
    expect(normedUnit.params[0]).toHaveProperty('name', 'Org');
    expect(normedUnit.params[0]).toHaveProperty('value', {Origin: 'Japan'});
    expect(normedUnit.params[0]).toHaveProperty('bind', 'legend');
    expect(normedUnit.params[0]).toHaveProperty('select', {
      type: 'point',
      fields: ['Origin']
    });
  });

  it('should normalize "interval" selections', () => {
    const spec: any = {
      ...unit,
      selection: {
        brush: {
          type: 'interval',
          init: {x: [55, 160], y: [13, 37]}
        },
        grid: {
          type: 'interval',
          bind: 'scales'
        }
      }
    };

    const normedUnit = selectionCompatNormalizer.mapUnit(spec);
    expect(normedUnit.params).toHaveLength(2);
    expect(normedUnit.params[0]).toHaveProperty('name', 'brush');
    expect(normedUnit.params[1]).toHaveProperty('name', 'grid');
    expect(normedUnit.params[0]).toHaveProperty('value', {x: [55, 160], y: [13, 37]});
    expect(normedUnit.params[1]).toHaveProperty('bind', 'scales');
  });

  it('should be the first normalizer run', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      selection: {
        brush: {
          type: 'interval',
          init: {x: [55, 160], y: [13, 37]}
        }
      },
      mark: {type: 'line', point: true},
      encoding: {
        row: {field: 'Origin', type: 'nominal'},
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          condition: {selection: 'brush', field: 'Cylinders', type: 'ordinal'},
          value: 'grey'
        }
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.spec.layer[0]).toHaveProperty('params');
    expect(normalized.spec.layer[0].params[0].name).toBe('brush');
  });
});
