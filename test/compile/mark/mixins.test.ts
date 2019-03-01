/* tslint:disable:quotemark */

import {X, Y} from '../../../src/channel';
import {binPosition, color, nonPosition, pointPosition, tooltip} from '../../../src/compile/mark/mixins';
import {TypedFieldDef} from '../../../src/fielddef';
import * as log from '../../../src/log';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/mark/mixins', () => {
  describe('color()', () => {
    it('color should be mapped to fill for bar', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {
            field: 'gender',
            type: 'nominal',
            scale: {rangeStep: 6},
            axis: null
          },
          color: {
            field: 'gender',
            type: 'nominal',
            scale: {range: ['#EA98D2', '#659CCA']}
          }
        },
        data: {url: 'data/population.json'}
      });

      const colorMixins = color(model);
      expect(colorMixins.fill).toEqual({field: 'gender', scale: 'color'});
    });

    it('color should be mapped to stroke for point', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {
            field: 'gender',
            type: 'nominal',
            scale: {rangeStep: 6},
            axis: null
          },
          color: {
            field: 'gender',
            type: 'nominal',
            scale: {range: ['#EA98D2', '#659CCA']}
          }
        },
        data: {url: 'data/population.json'}
      });

      const colorMixins = color(model);
      expect(colorMixins.stroke).toEqual({field: 'gender', scale: 'color'});
      expect(colorMixins.fill['value']).toBe('transparent');
    });

    it('add transparent fill when stroke is encoded', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {
            field: 'gender',
            type: 'nominal',
            scale: {rangeStep: 6},
            axis: null
          },
          stroke: {
            field: 'gender',
            type: 'nominal',
            scale: {range: ['#EA98D2', '#659CCA']}
          }
        },
        data: {url: 'data/population.json'}
      });

      const colorMixins = color(model);
      expect(colorMixins.stroke).toEqual({field: 'gender', scale: 'stroke'});
      expect(colorMixins.fill['value']).toBe('transparent');
    });

    it(
      'ignores color if fill is specified',
      log.wrap(logger => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: 'point',
          encoding: {
            x: {
              field: 'gender',
              type: 'nominal',
              scale: {rangeStep: 6},
              axis: null
            },
            fill: {
              field: 'gender',
              type: 'nominal',
              scale: {range: ['#EA98D2', '#659CCA']}
            },
            color: {
              field: 'gender',
              type: 'nominal',
              scale: {range: ['#EA98D2', '#659CCA']}
            }
          },
          data: {url: 'data/population.json'}
        });

        const colorMixins = color(model);
        expect(colorMixins.stroke).not.toBeDefined();
        expect(colorMixins.fill).toEqual({field: 'gender', scale: 'fill'});
        expect(logger.warns[0]).toEqual(log.message.droppingColor('encoding', {fill: true}));
      })
    );

    it(
      'ignores color property if fill is specified',
      log.wrap(logger => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: {type: 'point', color: 'red'},
          encoding: {
            x: {
              field: 'gender',
              type: 'nominal',
              scale: {rangeStep: 6},
              axis: null
            },
            fill: {
              field: 'gender',
              type: 'nominal',
              scale: {range: ['#EA98D2', '#659CCA']}
            }
          },
          data: {url: 'data/population.json'}
        });

        const colorMixins = color(model);
        expect(colorMixins.stroke).not.toBeDefined();
        expect(colorMixins.fill).toEqual({field: 'gender', scale: 'fill'});
        expect(logger.warns[0]).toEqual(log.message.droppingColor('property', {fill: true}));
      })
    );

    it(
      'should apply stroke property over color property',
      log.wrap(logger => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: {type: 'point', color: 'red', stroke: 'blue'},
          encoding: {
            x: {field: 'Horsepower', type: 'quantitative'},
            y: {field: 'Miles_per_Gallon', type: 'quantitative'}
          }
        });
        const props = color(model);
        expect(props.stroke).toEqual({value: 'blue'});
        expect(logger.warns[0]).toEqual(log.message.droppingColor('property', {stroke: true}));
      })
    );

    it(
      'should apply ignore color property when fill is specified',
      log.wrap(logger => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: {type: 'point', color: 'red', fill: 'blue'},
          encoding: {
            x: {field: 'Horsepower', type: 'quantitative'},
            y: {field: 'Miles_per_Gallon', type: 'quantitative'}
          }
        });
        const props = color(model);
        expect(props.stroke).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.droppingColor('property', {fill: true}));
      })
    );

    it('should apply color property', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', color: 'red'},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });
      const props = color(model);
      expect(props.stroke).toEqual({value: 'red'});
    });

    it('should apply color from mark-specific config over general mark config', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        },
        config: {mark: {color: 'blue'}, point: {color: 'red'}}
      });
      const props = color(model);
      expect(props.stroke).toEqual({value: 'red'});
    });

    it('should apply stroke mark config over color mark config', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        },
        config: {mark: {color: 'red', stroke: 'blue'}}
      });
      const props = color(model);
      expect(props.stroke).toEqual({value: 'blue'});
    });

    it('should apply stroke mark config over color mark config', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        },
        config: {point: {color: 'red', stroke: 'blue'}}
      });
      const props = color(model);
      expect(props.stroke).toEqual({value: 'blue'});
    });
  });

  describe('tooltip()', () => {
    it('generates tooltip object signal for an array of tooltip fields', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          tooltip: [{field: 'Horsepower', type: 'quantitative'}, {field: 'Acceleration', type: 'quantitative'}]
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}'
      });
    });

    it('generates tooltip object signal for all encoding fields', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'}
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}'
      });
    });

    it('generates no tooltip if encoding.tooltip === null', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'},
          tooltip: null
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual(undefined);
    });

    it('generates tooltip object signal for all data if specified', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'}
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({signal: 'datum'});
    });

    it('priorizes tooltip field def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Cylinders', type: 'quantitative'},
          y: {field: 'Displacement', type: 'quantitative'},
          tooltip: [{field: 'Horsepower', type: 'quantitative'}, {field: 'Acceleration', type: 'quantitative'}]
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}'
      });
    });

    it('priorizes tooltip value def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Cylinders', type: 'quantitative'},
          y: {field: 'Displacement', type: 'quantitative'},
          tooltip: {value: 'haha'}
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({value: 'haha'});
    });

    it('generates correct keys and values for channels with axis', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point'},
        encoding: {
          x: {field: 'Date', type: 'quantitative', axis: {title: 'foo', format: '%y'}},
          y: {field: 'Displacement', type: 'quantitative', axis: {title: 'bar'}}
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"foo": format(datum["Date"], "%y"), "bar": format(datum["Displacement"], "")}'
      });
    });

    it('generates correct keys and values for channels with legends', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point'},
        encoding: {
          color: {field: 'Foobar', type: 'nominal', legend: {title: 'baz', format: 's'}}
        }
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"baz": \'\'+datum["Foobar"]}'
      });
    });
  });

  describe('midPoint()', () => {
    it('should return correctly for lat/lng', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {
          url: 'data/zipcodes.csv',
          format: {
            type: 'csv'
          }
        },
        mark: 'point',
        encoding: {
          longitude: {
            field: 'longitude',
            type: 'quantitative'
          },
          latitude: {
            field: 'latitude',
            type: 'quantitative'
          }
        }
      });

      [X, Y].forEach(channel => {
        const mixins = pointPosition(channel, model, 'zeroOrMin');
        expect(mixins[channel]['field']).toEqual(model.getName(channel));
      });
    });
  });

  describe('nonPosition', () => {
    it('respects default value for a particular channel', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'point',
        encoding: {
          x: {
            field: 'Acceleration',
            type: 'quantitative'
          },
          y: {
            field: 'Horsepower',
            type: 'quantitative'
          }
        }
      });

      const mixins = nonPosition('opacity', model);
      expect(mixins.opacity).toEqual({value: 0.7});
    });
  });

  describe('binPosition', () => {
    it(
      'generates warning for invalid binned spec without x2',
      log.wrap(logger => {
        const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = binPosition({
          fieldDef,
          channel: 'x',
          scaleName: undefined,
          reverse: false,
          mark: 'bar'
        });
        expect(props).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('x2'));
      })
    );

    it(
      'generates warning for invalid binned spec without y2',
      log.wrap(logger => {
        const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = binPosition({
          fieldDef,
          channel: 'y',
          scaleName: undefined,
          reverse: false,
          mark: 'bar'
        });
        expect(props).not.toBeDefined();
        expect(logger.warns[0]).toEqual(log.message.channelRequiredForBinned('y2'));
      })
    );
  });
});
