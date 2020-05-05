import {color} from '../../../../src/compile/mark/encode';
import * as log from '../../../../src/log';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/color', () => {
  it('color should be mapped to fill for bar', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        x: {
          field: 'gender',
          type: 'nominal',
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

  it('combines color with fill when filled=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {
          field: 'gender',
          type: 'nominal',
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
    expect(colorMixins.stroke).toEqual({field: 'gender', scale: 'color'});
    expect(colorMixins.fill).toEqual({field: 'gender', scale: 'fill'});
  });

  it('ignores color property if fill is specified', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {type: 'point', color: 'red'},
      encoding: {
        x: {
          field: 'gender',
          type: 'nominal',
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
    expect(colorMixins.stroke).toEqual({value: 'red'});
    expect(colorMixins.fill).toEqual({field: 'gender', scale: 'fill'});
  });

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

  it('combines color with fill', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {type: 'point', color: 'red', fill: 'blue'},
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'}
      }
    });
    const props = color(model);
    expect(props.stroke).toEqual({value: 'red'});
  });

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

  it('should apply stroke mark config over color point config', () => {
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
