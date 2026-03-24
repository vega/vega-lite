import {defaultConfig} from '../../src/config.js';
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

  it('should render as line when line: true', () => {
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
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'line',
        orient: 'vertical',
      });
    }
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBeUndefined();
    }
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
});
