import {defaultConfig} from '../../src/config.js';
import {compile} from '../../src/compile/compile.js';
import * as log from '../../src/log/index.js';
import {normalize} from '../../src/normalize/index.js';
import {assertIsLayerSpec} from '../util.js';

describe('normalizeDensity', () => {
  const defaultEncoding = {
    x: {field: 'IMDB Rating', type: 'quantitative'},
  };

  const colorEncoding = {
    ...defaultEncoding,
    color: {field: 'Genre', type: 'nominal'},
  };

  type NormalizeInput = Parameters<typeof normalize>[0];
  type NormalizeConfig = Parameters<typeof normalize>[1];

  function normalizeDensitySpec(spec: Record<string, unknown>, config: NormalizeConfig = defaultConfig) {
    return normalize(
      {
        data: {url: 'data/movies.json'},
        ...spec,
      } as NormalizeInput,
      config,
    );
  }

  it('should produce correct layered specs for density with default settings', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: defaultEncoding,
    });

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
      expect(layer0.mark).toEqual({type: 'line', orient: 'vertical'});
      expect(layer0.encoding).toEqual({
        x: {
          field: 'value',
          type: 'quantitative',
          title: 'IMDB Rating',
        },
        y: {
          field: 'density',
          type: 'quantitative',
        },
      });
    }
  });

  it.each([
    ['bandwidth', {bandwidth: 0.3}],
    ['extent', {extent: [0, 10]}],
    ['cumulative', {cumulative: true}],
    ['counts', {counts: true}],
    ['steps', {steps: 100}],
    ['minsteps and maxsteps', {minsteps: 50, maxsteps: 300}],
  ])('should support %s parameter', (_label, transformProps) => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', ...transformProps},
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      ...transformProps,
    });
  });

  it('should support groupby via color encoding', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: {
        ...defaultEncoding,
        color: {field: 'Genre', type: 'nominal'},
      },
    });

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'independent',
    });
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect(layer0.encoding).toMatchObject({
        color: {field: 'Genre', type: 'nominal'},
      });
    }
  });

  it('should support additional area mark properties like interpolate', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', interpolate: 'monotone'},
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'line',
        orient: 'vertical',
        interpolate: 'monotone',
      });
    }
  });

  it('should support opacity on the density mark', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', opacity: 0.5},
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'line',
        orient: 'vertical',
        opacity: 0.5,
      });
    }
  });

  it('should support tension parameter', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', tension: 0.8},
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'line',
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
        type: 'line',
        orient: 'horizontal',
      });
    }
    if ('encoding' in layer0) {
      expect(layer0.encoding).toEqual({
        y: {field: 'value', type: 'quantitative', title: 'IMDB Rating'},
        x: {field: 'density', type: 'quantitative'},
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

  it('should produce a line mark by default (no fill or fillOpacity set)', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);

    // Default: no fill/fillOpacity → line mark, no stack on density axis
    expect(output.transform).toBeDefined();
    expect(output.transform!.length).toBe(1);

    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({type: 'line', orient: 'vertical'});
    }
    if ('encoding' in layer0) {
      // No stack property on y encoding for line marks
      expect((layer0.encoding!.y as any).stack).toBeUndefined();
    }
  });

  it('should produce a line mark with groupby color when no fill is set', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    // Only the density transform — no window transforms
    expect(output.transform!.length).toBe(1);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'independent',
    });
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect((layer0.mark as any).type).toBe('line');
    }
  });

  it('should not stack when grouping by color (line mark has no stack)', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      // Default (no fill) → line mark
      expect((layer0.mark as any).type).toBe('line');
    }
    if ('encoding' in layer0) {
      // Line marks have no stack encoding
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBeUndefined();
    }
  });

  it('should support stroke properties and produce a line mark when no fill is set', () => {
    const output = normalizeDensitySpec({
      mark: {
        type: 'density',
        strokeWidth: 2,
        strokeDash: [5, 3],
      },
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect(layer0.mark).toEqual({
        type: 'line',
        orient: 'vertical',
        strokeWidth: 2,
        strokeDash: [5, 3],
      });
    }
  });

  it('should support fill properties for area density', () => {
    const output = normalizeDensitySpec({
      mark: {
        type: 'density',
        fill: 'steelblue',
        fillOpacity: 0.5,
      },
      encoding: defaultEncoding,
    });

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

  it('should produce an area mark when fill or fillOpacity is set', () => {
    const output = normalizeDensitySpec({
      mark: {
        type: 'density',
        fillOpacity: 0.5,
      },
      encoding: defaultEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      // fillOpacity set → area mark with stack: null
      expect((layer0.mark as any).type).toBe('area');
      expect((layer0.mark as any).fillOpacity).toBe(0.5);
      expect((layer0.mark as any).filled).toBeUndefined();
    }
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe(null);
    }
  });

  it('should produce an area mark when fill is set as an encoding channel', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: {
        ...defaultEncoding,
        fill: {field: 'Genre', type: 'nominal'},
      },
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      // fill encoding channel → area mark
      expect((layer0.mark as any).type).toBe('area');
    }
    if ('encoding' in layer0) {
      // area mark → stack: null on density axis
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe(null);
    }
  });

  it.each([
    ['center', undefined],
    ['normalize', undefined],
    ['zero', undefined],
  ] as const)('should support stacked density with stack: "%s"', (stack, expectedResolve) => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', stack, fill: 'steelblue'},
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      ...(expectedResolve ? {resolve: expectedResolve} : {}),
    });
    const layer0 = output.layer![0];
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe(stack);
    }
  });

  it('should default resolve to independent for area density with stack omitted', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', fill: 'steelblue'},
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'independent',
    });
  });

  it('should keep shared resolve by default for area density with stack: zero', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', fill: 'steelblue', stack: 'zero'},
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
    });
  });

  it('should default to no stacking when stack is not specified (line mark)', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      // No fill → line mark, no stack property on density axis
      expect((layer0.mark as any).type).toBe('line');
    }
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBeUndefined();
    }
  });

  it('should allow stacking on line density when stack is explicitly specified', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', stack: 'zero'},
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    const layer0 = output.layer![0];
    if ('mark' in layer0) {
      expect((layer0.mark as any).type).toBe('line');
    }
    if ('encoding' in layer0) {
      expect((layer0.encoding!.y as {stack?: unknown}).stack).toBe('zero');
    }
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
    });
  });

  it('should default resolve to independent for grouped line density', () => {
    const output = normalizeDensitySpec({
      mark: 'density',
      encoding: colorEncoding,
    });

    assertIsLayerSpec(output);
    expect(output.transform![0]).toEqual({
      density: 'IMDB Rating',
      groupby: ['Genre'],
      resolve: 'independent',
    });
  });

  it('should support resolve parameter', () => {
    const output = normalizeDensitySpec({
      mark: {type: 'density', resolve: 'independent'},
      encoding: colorEncoding,
    });

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
    const output = normalizeDensitySpec(
      {
        mark: 'density',
        encoding: colorEncoding,
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
    const output = normalizeDensitySpec(
      {
        mark: {type: 'density', resolve: 'shared'},
        encoding: colorEncoding,
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

  describe('overlay and fill opacity', () => {
    it('should default fillOpacity to 0.5 when fill is set on the mark', () => {
      const output = normalizeDensitySpec({
        mark: {type: 'density', fill: 'steelblue'},
        encoding: defaultEncoding,
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(1);
      const layer0 = output.layer[0];
      if ('mark' in layer0) {
        expect((layer0.mark as any).type).toBe('area');
        expect((layer0.mark as any).fillOpacity).toBe(0.5);
        expect((layer0.mark as any).fill).toBe('steelblue');
      }
    });

    it('should default fillOpacity to 0.5 when fill is set as an encoding channel', () => {
      const output = normalizeDensitySpec({
        mark: 'density',
        encoding: {
          ...defaultEncoding,
          fill: {field: 'Genre', type: 'nominal'},
        },
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(1);
      const layer0 = output.layer[0];
      if ('mark' in layer0) {
        expect((layer0.mark as any).type).toBe('area');
        expect((layer0.mark as any).fillOpacity).toBe(0.5);
      }
    });

    it('should respect explicit fillOpacity and not default it', () => {
      const output = normalizeDensitySpec({
        mark: {type: 'density', fill: 'steelblue', fillOpacity: 0.3},
        encoding: defaultEncoding,
      });

      assertIsLayerSpec(output);
      const layer0 = output.layer[0];
      if ('mark' in layer0) {
        expect((layer0.mark as any).fillOpacity).toBe(0.3);
      }
    });

    it('should produce 2-layer spec (area + line) when fill and color are both set', () => {
      const output = normalizeDensitySpec({
        mark: {type: 'density', fill: 'steelblue'},
        encoding: colorEncoding,
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(2);

      const [areaLayer, lineLayer] = output.layer as any[];
      // Layer 0: area with fill, no color
      expect(areaLayer.mark.type).toBe('area');
      expect(areaLayer.mark.fill).toBe('steelblue');
      expect(areaLayer.mark.fillOpacity).toBe(0.5);
      expect(areaLayer.encoding.fill).toBeUndefined();
      expect(areaLayer.encoding.color).toBeUndefined();

      // Layer 1: line with color encoding, no fill
      expect(lineLayer.mark.type).toBe('line');
      expect(lineLayer.encoding.color).toEqual({field: 'Genre', type: 'nominal'});
      // Line layer density axis has no stack
      expect(lineLayer.encoding.y.stack).toBeUndefined();
    });

    it('should produce 2-layer spec when fill encoding and color encoding are both set', () => {
      const output = normalizeDensitySpec({
        mark: 'density',
        encoding: {
          ...colorEncoding,
          fill: {field: 'Genre', type: 'nominal'},
        },
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(2);

      const [areaLayer, lineLayer] = output.layer as any[];
      expect(areaLayer.mark.type).toBe('area');
      expect(areaLayer.encoding.fill).toEqual({field: 'Genre', type: 'nominal'});
      expect(areaLayer.encoding.color).toBeUndefined();

      expect(lineLayer.mark.type).toBe('line');
      expect(lineLayer.encoding.color).toEqual({field: 'Genre', type: 'nominal'});
      expect(lineLayer.encoding.fill).toBeUndefined();
    });

    it('should produce 2-layer spec when fill mark prop and stroke markDef prop are both set', () => {
      const output = normalizeDensitySpec({
        mark: {type: 'density', fill: 'steelblue', stroke: 'black', strokeWidth: 2},
        encoding: defaultEncoding,
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(2);

      const [areaLayer, lineLayer] = output.layer as any[];
      expect(areaLayer.mark.type).toBe('area');
      expect(areaLayer.mark.fill).toBe('steelblue');
      // stroke props not forwarded to area
      expect(areaLayer.mark.stroke).toBeUndefined();
      expect(areaLayer.mark.strokeWidth).toBeUndefined();

      expect(lineLayer.mark.type).toBe('line');
      expect(lineLayer.mark.stroke).toBe('black');
      expect(lineLayer.mark.strokeWidth).toBe(2);
    });

    it('should allow stacked area with stacked line outline when stack is explicitly set', () => {
      const output = normalizeDensitySpec({
        mark: {type: 'density', fill: 'steelblue', stroke: 'black', stack: 'zero'},
        encoding: colorEncoding,
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(2);

      const [areaLayer, lineLayer] = output.layer as any[];
      expect(areaLayer.mark.type).toBe('area');
      expect(lineLayer.mark.type).toBe('line');
      expect(areaLayer.encoding.y.stack).toBe('zero');
      expect(lineLayer.encoding.y.stack).toBe('zero');
    });

    it('should allow stacked line outline with fill and stroke encodings when stack is explicitly set', () => {
      const output = normalizeDensitySpec({
        mark: {type: 'density', stack: 'zero'},
        encoding: {
          ...defaultEncoding,
          fill: {field: 'Genre', type: 'nominal'},
          stroke: {field: 'Genre', type: 'nominal'},
        },
      });

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(2);

      const [areaLayer, lineLayer] = output.layer as any[];
      expect(areaLayer.mark.type).toBe('area');
      expect(lineLayer.mark.type).toBe('line');
      expect(areaLayer.encoding.y.stack).toBe('zero');
      expect(lineLayer.encoding.y.stack).toBe('zero');
      expect(areaLayer.encoding.stroke).toBeUndefined();
      expect(lineLayer.encoding.stroke).toEqual({field: 'Genre', type: 'nominal'});
    });

    it('should compile stacked fill+stroke overlay to stacked y fields for both area and line', () => {
      const {spec: compiled} = compile({
        data: {url: 'data/movies.json'},
        mark: {type: 'density', stack: 'zero'},
        encoding: {
          x: {field: 'IMDB Rating', type: 'quantitative'},
          fill: {field: 'Genre', type: 'nominal'},
          stroke: {field: 'Genre', type: 'nominal'},
        },
      } as any);

      const groups = (compiled.marks ?? []) as any[];
      const innerMarks = groups.map((g) => g.marks?.[0]).filter(Boolean);
      const areaMark = innerMarks.find((m) => m.type === 'area');
      const lineMark = innerMarks.find((m) => m.type === 'line');

      expect(areaMark).toBeDefined();
      expect(lineMark).toBeDefined();
      expect(areaMark.encode.update.y.field).toMatch(/_end$/);
      expect(lineMark.encode.update.y.field).toMatch(/_end$/);
    });

    it('should preserve grouping in both layers when fill and stroke come from density config', () => {
      const output = normalizeDensitySpec(
        {
          mark: 'density',
          encoding: {
            ...defaultEncoding,
            color: {field: 'Genre', type: 'nominal'},
          },
        },
        {
          density: {
            fill: 'steelblue',
            stroke: 'black',
          },
        },
      );

      assertIsLayerSpec(output);
      expect(output.layer.length).toBe(2);

      const [areaLayer, lineLayer] = output.layer as any[];

      expect(areaLayer.mark.type).toBe('area');
      expect(lineLayer.mark.type).toBe('line');

      // Grouping field stays present for both layers (line via color, area via injected detail)
      expect(lineLayer.encoding.color).toEqual({field: 'Genre', type: 'nominal'});
      expect(areaLayer.encoding.detail).toEqual({field: 'Genre'});
    });

    it('should append missing groupby field to existing detail object in overlay area layer', () => {
      const output = normalizeDensitySpec(
        {
          mark: 'density',
          encoding: {
            ...defaultEncoding,
            color: {field: 'Genre', type: 'nominal'},
            detail: {field: 'Origin', type: 'nominal'},
          },
        },
        {
          density: {
            fill: 'steelblue',
            stroke: 'black',
          },
        },
      );

      assertIsLayerSpec(output);
      const [areaLayer, lineLayer] = output.layer as any[];

      expect(areaLayer.mark.type).toBe('area');
      expect(lineLayer.mark.type).toBe('line');
      expect(areaLayer.encoding.detail).toEqual([{field: 'Origin', type: 'nominal'}, {field: 'Genre'}]);
      expect(lineLayer.encoding.detail).toEqual({field: 'Origin', type: 'nominal'});
    });

    it('should append missing groupby field to existing detail array in overlay area layer', () => {
      const output = normalizeDensitySpec(
        {
          mark: 'density',
          encoding: {
            ...defaultEncoding,
            color: {field: 'Genre', type: 'nominal'},
            detail: [
              {field: 'Origin', type: 'nominal'},
              {field: 'MPAA Rating', type: 'nominal'},
            ],
          },
        },
        {
          density: {
            fill: 'steelblue',
            stroke: 'black',
          },
        },
      );

      assertIsLayerSpec(output);
      const [areaLayer, lineLayer] = output.layer as any[];

      expect(areaLayer.mark.type).toBe('area');
      expect(lineLayer.mark.type).toBe('line');
      expect(areaLayer.encoding.detail).toEqual([
        {field: 'Origin', type: 'nominal'},
        {field: 'MPAA Rating', type: 'nominal'},
        {field: 'Genre'},
      ]);
      expect(lineLayer.encoding.detail).toEqual([
        {field: 'Origin', type: 'nominal'},
        {field: 'MPAA Rating', type: 'nominal'},
      ]);
    });
  });
});
