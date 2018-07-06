/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X, Y} from '../../../src/channel';
import {binPosition, color, pointPosition, tooltip} from '../../../src/compile/mark/mixins';
import {FieldDef} from '../../../src/fielddef';
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
      assert.deepEqual(colorMixins.fill, {field: 'gender', scale: 'color'});
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
      assert.deepEqual(colorMixins.stroke, {field: 'gender', scale: 'color'});
      assert.propertyVal(colorMixins.fill, 'value', 'transparent');
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
      assert.deepEqual(colorMixins.stroke, {field: 'gender', scale: 'stroke'});
      assert.propertyVal(colorMixins.fill, 'value', 'transparent');
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
        assert.isUndefined(colorMixins.stroke);
        assert.deepEqual(colorMixins.fill, {field: 'gender', scale: 'fill'});
        assert.equal(logger.warns[0], log.message.droppingColor('encoding', {fill: true}));
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
        assert.isUndefined(colorMixins.stroke);
        assert.deepEqual(colorMixins.fill, {field: 'gender', scale: 'fill'});
        assert.equal(logger.warns[0], log.message.droppingColor('property', {fill: true}));
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
        assert.deepEqual(props.stroke, {value: 'blue'});
        assert.equal(logger.warns[0], log.message.droppingColor('property', {stroke: true}));
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
        assert.isUndefined(props.stroke);
        assert.equal(logger.warns[0], log.message.droppingColor('property', {fill: true}));
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
      assert.deepEqual(props.stroke, {value: 'red'});
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
      assert.deepEqual(props.stroke, {value: 'red'});
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
      assert.deepEqual(props.stroke, {value: 'blue'});
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
      assert.deepEqual(props.stroke, {value: 'blue'});
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
      assert.deepEqual(props.tooltip, {
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
      assert.deepEqual(props.tooltip, {
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}'
      });
    });

    it('generates tooltip object signal for all data if specified', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {fields: 'data'}},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'}
        }
      });
      const props = tooltip(model);
      assert.deepEqual(props.tooltip, {signal: 'datum'});
    });

    it('priorizes tooltip field def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {fields: 'data'}},
        encoding: {
          x: {field: 'Cylinders', type: 'quantitative'},
          y: {field: 'Displacement', type: 'quantitative'},
          tooltip: [{field: 'Horsepower', type: 'quantitative'}, {field: 'Acceleration', type: 'quantitative'}]
        }
      });
      const props = tooltip(model);
      assert.deepEqual(props.tooltip, {
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}'
      });
    });

    it('priorizes tooltip value def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {fields: 'data'}},
        encoding: {
          x: {field: 'Cylinders', type: 'quantitative'},
          y: {field: 'Displacement', type: 'quantitative'},
          tooltip: {value: 'haha'}
        }
      });
      const props = tooltip(model);
      assert.deepEqual(props.tooltip, {value: 'haha'});
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
        assert.equal(mixins[channel].field, model.getName(channel));
      });
    });
  });

  describe('binPosition', () => {
    it(
      'generates warning for invalid binned spec without x2',
      log.wrap(logger => {
        const fieldDef: FieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = binPosition(fieldDef, undefined, 'x', undefined, undefined, undefined);
        assert.isUndefined(props);
        assert.equal(logger.warns[0], log.message.channelRequiredForBinned('x2'));
      })
    );

    it(
      'generates warning for invalid binned spec without y2',
      log.wrap(logger => {
        const fieldDef: FieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
        const props = binPosition(fieldDef, undefined, 'y', undefined, undefined, undefined);
        assert.isUndefined(props);
        assert.equal(logger.warns[0], log.message.channelRequiredForBinned('y2'));
      })
    );
  });
});
