import {defaultConfig} from '../../src/config.js';
import * as log from '../../src/log/index.js';
import {normalize} from '../../src/normalize/index.js';
import {assertIsLayerSpec} from '../util.js';

describe('normalizeDensity', () => {
  it('should produce correct layered specs for density with default settings', () => {
    const output = normalize(
      {
        data: {
          url: 'data/movies.json',
        },
        mark: 'density',
        encoding: {
          x: {
            field: 'IMDB Rating',
            type: 'quantitative',
          },
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);

    expect(output.transform).toBeDefined();
    expect(output.transform!.length).toBe(1);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
    });

    expect(output.layer).toBeDefined();
    expect(output.layer!.length).toBe(1);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({type: 'area', orient: 'vertical'});
      expect(layer0.encoding).toEqual({
        x: {
          field: 'value',
          type: 'quantitative',
          title: 'IMDB Rating',
        },
        y: {
          field: 'density',
          type: 'quantitative',
          stack: null,
        },
      });
    }
  });

  it('should support bandwidth parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', bandwidth: 0.3},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      bandwidth: 0.3,
    });
  });

  it('should support extent parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', extent: [0, 10]},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      extent: [0, 10],
    });
  });

  it('should support cumulative parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', cumulative: true},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      cumulative: true,
    });
  });

  it('should support counts parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', counts: true},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      counts: true,
    });
  });

  it('should support steps parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', steps: 100},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      steps: 100,
    });
  });

  it('should support minsteps and maxsteps parameters', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', minsteps: 50, maxsteps: 300},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      minsteps: 50,
      maxsteps: 300,
    });
  });

  it('should support groupby via color encoding', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: 'density',
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
    });
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect(layer0.encoding).toMatchObject({
        color: {field: 'Genre', type: 'nominal'},
      });
    }
  });

  it('should support additional area mark properties like interpolate', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', interpolate: 'monotone'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'vertical',
        interpolate: 'monotone',
      });
    }
  });

  it('should support opacity on the density mark', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', opacity: 0.5},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'vertical',
        opacity: 0.5,
      });
    }
  });

  it('should support tension parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', tension: 0.8},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'vertical',
        tension: 0.8,
      });
    }
  });

  it('should support horizontal orientation by specifying y as the continuous field', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: 'density',
        encoding: {
          y: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
    });
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'horizontal',
      });
    }
    if ('encoding' in layer0) {
      expect(layer0.encoding).toEqual({
        y: {field: 'value', type: 'quantitative', title: 'IMDB Rating'},
        x: {field: 'density', type: 'quantitative', stack: null},
      });
    }
  });

  it('should apply config defaults for density', () => {
    const config = {
      density: {
        bandwidth: 0.5,
        steps: 50,
      },
    };
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: 'density',
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      config,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      bandwidth: 0.5,
      steps: 50,
    });
  });

  it('should allow mark properties to override config defaults', () => {
    const config = {
      density: {
        bandwidth: 0.5,
        steps: 50,
      },
    };
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', bandwidth: 1.0},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      config,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      bandwidth: 1.0,
      steps: 50,
    });
  });

  it('should render as a stroke-only area with y2 trick when line: true', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', line: true},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);

    // Three extra transforms after the density transform: two window + one calculate
    expect(output.transform).toBeDefined();
    expect(output.transform!.length).toBe(4);
    expect(output.transform![1]).toMatchObject({window: [{op: 'row_number', as: '_density_rn'}]});
    expect(output.transform![2]).toMatchObject({window: [{op: 'count', as: '_density_n'}], frame: [null, null]});
    expect(output.transform![3]).toMatchObject({calculate: expect.stringContaining('_density_rn'), as: '_density_y2'});

    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'vertical',
        filled: false,
      });
    }
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe(null);
      // y2 uses the computed field that suppresses the baseline stroke
      expect((layer0.encoding!.y2 as {field?: string}).field).toBe('_density_y2');
    }
  });

  it('should include groupby on window transforms for line:true with color groupby', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', line: true},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform!.length).toBe(4);
    // window transforms must groupby the same field as the density transform
    expect(output.transform![1]).toMatchObject({
      window: [{op: 'row_number', as: '_density_rn'}],
      groupby: ['Genre'],
    });
    expect(output.transform![2]).toMatchObject({
      window: [{op: 'count', as: '_density_n'}],
      frame: [null, null],
      groupby: ['Genre'],
    });
  });

  it('should not stack when grouping by color', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: 'density',
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe(null);
    }
  });

  it('should support stroke properties for line density', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {
          type: 'density',
          line: true,
          strokeWidth: 2,
          strokeDash: [5, 3],
        },
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'vertical',
        filled: false,
        strokeWidth: 2,
        strokeDash: [5, 3],
      });
    }
  });

  it('should support fill properties for area density', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {
          type: 'density',
          fill: 'steelblue',
          fillOpacity: 0.5,
        },
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toMatchObject({
        type: 'area',
        orient: 'vertical',
        fill: 'steelblue',
        fillOpacity: 0.5,
      });
    }
  });

  it('should support point overlay', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {
          type: 'density',
          point: true,
        },
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toMatchObject({
        type: 'area',
        orient: 'vertical',
        point: true,
      });
    }
  });

  it('should not forward fill/fillOpacity in line mode since filled:false uses stroke', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {
          type: 'density',
          line: true,
          fill: 'steelblue',
          fillOpacity: 0.5,
        },
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      // line:true uses filled:false — fill/fillOpacity are not forwarded
      expect(layer0.mark).toEqual({
        type: 'area',
        orient: 'vertical',
        filled: false,
      });
      expect((layer0.mark as any).fill).toBeUndefined();
      expect((layer0.mark as any).fillOpacity).toBeUndefined();
    }
  });

  it('should support stacked density with stack: "center" for stream graph', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', stack: 'center'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
    });
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe('center');
    }
  });

  it('should support stacked density with stack: "normalize" for normalized stream', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', stack: 'normalize'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe('normalize');
    }
  });

  it('should support stacked density with stack: "zero" for baseline stacking', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', stack: 'zero'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe('zero');
    }
  });

  it('should default to no stacking when stack is not specified', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: 'density',
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe(null);
    }
  });

  it('should support resolve parameter', () => {
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', resolve: 'independent'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      defaultConfig,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'independent',
    });
  });

  it('should apply resolve from config', () => {
    const config = {
      density: {
        resolve: 'independent' as const,
      },
    };
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: 'density',
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      config,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'independent',
    });
  });

  it('should allow mark resolve to override config resolve', () => {
    const config = {
      density: {
        resolve: 'independent' as const,
      },
    };
    const output = normalize(
      {
        data: {url: 'data/movies.json'},
        mark: {type: 'density', resolve: 'shared'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          color: {field: 'Genre', type: 'nominal'},
        },
      },
      config,
    );

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'shared',
    });
  });

  it('should warn when "as" is specified on the density mark', () => {
    log.wrap((localLogger) => {
      normalize(
        {
          data: {url: 'data/movies.json'},
          mark: {type: 'density', as: ['x', 'y']} as any,
          encoding: {
            x: {field: 'IMDB Rating', type: 'quantitative'},
          },
        },
        defaultConfig,
      );
      expect(localLogger.warns[0]).toEqual(log.message.densityMarkAsNotSupported());
    });
  });
});
