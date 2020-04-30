import {COLOR, FILLOPACITY, OPACITY, SHAPE, SIZE, STROKEOPACITY, STROKEWIDTH} from '../../../src/channel';
import {isFieldDef} from '../../../src/channeldef';
import {parseLegend, parseLegendForChannel} from '../../../src/compile/legend/parse';
import {NormalizedUnitSpec} from '../../../src/spec';
import {GEOJSON} from '../../../src/type';
import {parseLayerModel, parseUnitModelWithScale} from '../../util';

describe('compile/legend', () => {
  describe('parseUnitLegend()', () => {
    it('should return correct expression for the timeUnit: TimeUnit.MONTH', () => {
      const unitModel = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal'},
          color: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      const legendComponent = parseLegend(unitModel);
      expect(legendComponent['color'].get('format')).toEqual({
        signal: 'timeUnitSpecifier(["month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "})'
      });
    });

    it('should return correct expression for the timeUnit: TimeUnit.QUARTER', () => {
      const unitModel = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal'},
          color: {field: 'a', type: 'temporal', timeUnit: 'quarter'}
        }
      });

      const legendComponent = parseLegend(unitModel);
      expect(legendComponent['color'].get('format')).toEqual({
        signal: 'timeUnitSpecifier(["quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "})'
      });
    });

    it(`should not produce a Vega legend object on channel 'shape' with type 'geojson'`, () => {
      const spec: NormalizedUnitSpec = {
        mark: 'geoshape',
        data: {url: 'data/income.json'},
        transform: [
          {
            lookup: 'id',
            from: {
              data: {
                url: 'data/us-10m.json',
                format: {type: 'topojson', feature: 'states'}
              },
              key: 'id'
            },
            as: 'geo'
          }
        ],
        encoding: {
          shape: {field: 'geo', type: 'geojson'}
        }
      };

      const unitModel = parseUnitModelWithScale(spec);
      const channelDef = unitModel.encoding[SHAPE];
      expect(isFieldDef(channelDef)).toBe(true);
      if (isFieldDef(channelDef)) {
        expect(channelDef.type).toEqual(GEOJSON);
      }

      const legendComp = parseLegend(unitModel);
      expect(legendComp[SHAPE]).not.toBeDefined();
    });
  });

  describe('parseLegendForChannel()', () => {
    it('should produce a Vega legend object with correct type and scale for color', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'nominal'},
          color: {field: 'a', type: 'quantitative'}
        }
      });

      const def = parseLegendForChannel(model, COLOR).combine();
      expect(typeof def).toBe('object');
      expect(def.title).toBe('a');
      expect(def.stroke).toBe('color');
    });

    it('should produce a Vega legend object with correct type and scale for trail color', () => {
      const model = parseUnitModelWithScale({
        mark: 'trail',
        encoding: {
          x: {field: 'a', type: 'nominal'},
          color: {field: 'a', type: 'quantitative'}
        }
      });

      const def = parseLegendForChannel(model, COLOR).combine();
      expect(typeof def).toBe('object');
      expect(def.title).toBe('a');
      expect(def.stroke).toBe('color');
    });

    it('should produce a Vega legend object with correct type and scale for trail size', () => {
      const model = parseUnitModelWithScale({
        mark: 'trail',
        encoding: {
          x: {field: 'a', type: 'nominal'},
          size: {field: 'a', type: 'quantitative'}
        }
      });

      const def = parseLegendForChannel(model, SIZE).combine();
      expect(typeof def).toBe('object');
      expect(def.title).toBe('a');
      expect(def.strokeWidth).toBe('size');
    });

    it('should produce no legend title when title is null, "", or false', () => {
      for (const val of [null, '', false]) {
        const model = parseUnitModelWithScale({
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'nominal'},
            color: {
              field: 'a',
              type: 'quantitative',
              legend: {title: val as any} // Need to cast as false is not valid, but we want to fall back gracefully
            }
          }
        });

        const def = parseLegendForChannel(model, COLOR).combine();
        expect(def.title).toEqual(val);
      }
    });

    it('should store fieldDef.title as explicit', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'nominal'},
          color: {
            field: 'a',
            type: 'quantitative',
            legend: {title: 'foo'} // Need to cast as false is not valid, but we want to fall back gracefully
          }
        }
      });

      const def = parseLegendForChannel(model, COLOR).combine();
      expect(def.title).toBe('foo');
    });

    [SIZE, SHAPE, OPACITY, STROKEWIDTH].forEach(channel => {
      it(`should produce a Vega legend object with correct type and scale for ${channel}`, () => {
        const spec: NormalizedUnitSpec = {
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'nominal'}
          }
        };
        spec.encoding[channel] = {field: 'a', type: 'nominal'};

        const model = parseUnitModelWithScale(spec);

        const def = parseLegendForChannel(model, channel).combine();

        const channelDef = model.encoding[channel];
        if (isFieldDef(channelDef)) {
          expect(channelDef.type).not.toEqual(GEOJSON);
        }

        if (channel !== OPACITY) {
          expect((def.encode.symbols.update.opacity as any).value).toEqual(0.7);
        } else {
          expect(def.encode.symbols.update.opacity).not.toBeDefined();
        }
        expect(typeof def).toBe('object');
        expect(def.title).toBe('a');
      });
    });

    [FILLOPACITY, STROKEOPACITY].forEach(channel => {
      it(`should have no legend initialized`, () => {
        const spec: NormalizedUnitSpec = {
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'nominal'}
          }
        };
        spec.encoding[channel] = {field: 'a', type: 'nominal'};

        const model = parseUnitModelWithScale(spec);

        expect(model.legend(channel)).toBeUndefined();
      });
    });
  });

  describe('parseNonUnitLegend()', () => {
    it('should correctly merge orient by favoring explicit orient', () => {
      const model = parseLayerModel({
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        description: "Google's stock price over time.",
        data: {url: 'data/stocks.csv'},
        layer: [
          {
            mark: 'line',
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'},
              color: {field: 'symbol', type: 'nominal'}
            }
          },
          {
            mark: {type: 'point', filled: true},
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'},
              color: {field: 'symbol', type: 'nominal', legend: {orient: 'left'}}
            }
          }
        ]
      });
      model.parseScale();
      model.parseLegends();
      expect(model.component.legends.color.explicit.orient).toBe('left');
    });

    it('should correctly merge legend that exists only on one plot', () => {
      const model = parseLayerModel({
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        description: "Google's stock price over time.",
        data: {url: 'data/stocks.csv'},
        layer: [
          {
            mark: 'line',
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'}
            }
          },
          {
            mark: {type: 'point', filled: true},
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'},
              color: {field: 'symbol', type: 'nominal'}
            }
          }
        ]
      });
      model.parseScale();
      model.parseLegends();
      expect(model.component.legends.color).toBeTruthy();
      expect(model.children[0].component.legends.color).not.toBeDefined();
      expect(model.children[1].component.legends.color).not.toBeDefined();
    });
  });
});
