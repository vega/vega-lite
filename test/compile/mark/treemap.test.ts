import {compile} from '../../../src/index.js';

describe('treemap mark', () => {
  it('should compile a treemap spec with stratify hierarchy', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {id: 1, parent: null, name: 'Root', size: 0},
          {id: 2, parent: 1, name: 'A', size: 100},
          {id: 3, parent: 1, name: 'B', size: 200},
          {id: 4, parent: 2, name: 'A1', size: 50},
          {id: 5, parent: 2, name: 'A2', size: 30},
          {id: 6, parent: 3, name: 'B1', size: 120},
          {id: 7, parent: 3, name: 'B2', size: 80},
        ],
      },
      mark: 'treemap',
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        size: {field: 'size', type: 'quantitative'},
        color: {field: 'name', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;

    // Find the data source with transforms
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    expect(dataWithTransforms).toBeDefined();
    const transforms = dataWithTransforms.transform;

    const stratifyTransform = transforms.find((t: any) => t.type === 'stratify') as any;
    expect(stratifyTransform).toBeDefined();
    expect(stratifyTransform.key).toBe('id');
    expect(stratifyTransform.parentKey).toBe('parent');

    const treemapTransform = transforms.find((t: any) => t.type === 'treemap') as any;
    expect(treemapTransform).toBeDefined();
    expect(treemapTransform.field).toBe('size');
    expect(treemapTransform.method).toBeUndefined();
    expect(treemapTransform.size).toEqual([{signal: 'width'}, {signal: 'height'}]);

    // Check that mark is rect
    const marks = vegaSpec.marks;
    expect(marks).toBeDefined();
    expect(marks[0].type).toBe('rect');

    // Check that encoding maps x0/y0/x1/y1 to x/x2/y/y2
    const encode = marks[0].encode.update;
    expect(encode.x).toEqual({field: 'x0'});
    expect(encode.x2).toEqual({field: 'x1'});
    expect(encode.y).toEqual({field: 'y0'});
    expect(encode.y2).toEqual({field: 'y1'});

    // Check color scale exists
    const colorScale = vegaSpec.scales.find((s: any) => s.name === 'color');
    expect(colorScale).toBeDefined();
    expect(colorScale.type).toBe('ordinal');

    // Size should NOT have a scale (handled by layout)
    const sizeScale = vegaSpec.scales.find((s: any) => s.name === 'size');
    expect(sizeScale).toBeUndefined();

    // Default nodes='leaves' should add a filter
    const filterTransform = transforms.find((t: any) => t.type === 'filter') as any;
    expect(filterTransform).toBeDefined();
    expect(filterTransform.expr).toBe('!datum.children');
  });

  it('should compile a treemap without size encoding (defaults to node count)', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {id: 1, parent: null, name: 'Root'},
          {id: 2, parent: 1, name: 'A'},
          {id: 3, parent: 1, name: 'B'},
        ],
      },
      mark: 'treemap',
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        color: {field: 'name', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    const treemapTransform = dataWithTransforms.transform.find((t: any) => t.type === 'treemap') as any;

    // No field specified — layout defaults to node count
    expect(treemapTransform.field).toBeUndefined();
  });

  it('should compile a treemap spec with nest hierarchy', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {origin: 'USA', cyl: 8, hp: 130},
          {origin: 'USA', cyl: 4, hp: 90},
          {origin: 'Europe', cyl: 4, hp: 100},
        ],
      },
      mark: 'treemap',
      encoding: {
        hierarchy: {nest: [{field: 'origin'}, {field: 'cyl'}]},
        size: {field: 'hp', type: 'quantitative'},
        color: {field: 'origin', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    const transforms = dataWithTransforms.transform;

    const nestTransform = transforms.find((t: any) => t.type === 'nest') as any;
    expect(nestTransform).toBeDefined();
    expect(nestTransform.keys).toEqual(['origin', 'cyl']);

    const treemapTransform = transforms.find((t: any) => t.type === 'treemap') as any;
    expect(treemapTransform).toBeDefined();
    expect(treemapTransform.field).toBe('hp');

    // Should NOT have a stratify transform
    const stratifyTransform = transforms.find((t: any) => t.type === 'stratify');
    expect(stratifyTransform).toBeUndefined();

    // Default nodes='leaves' filter
    const filterTransform = transforms.find((t: any) => t.type === 'filter') as any;
    expect(filterTransform.expr).toBe('!datum.children');
  });

  it('should pass mark def properties to the treemap layout transform', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [{id: 1, parent: null, name: 'Root', size: 0}],
      },
      mark: {type: 'treemap', method: 'binary', padding: 2, round: true},
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        size: {field: 'size', type: 'quantitative'},
        color: {field: 'name', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    const treemapTransform = dataWithTransforms.transform.find((t: any) => t.type === 'treemap') as any;

    expect(treemapTransform.method).toBe('binary');
    expect(treemapTransform.padding).toBe(2);
    expect(treemapTransform.round).toBe(true);
  });

  it('should filter to leaves by default', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {id: 1, parent: null, name: 'Root'},
          {id: 2, parent: 1, name: 'A'},
        ],
      },
      mark: 'treemap',
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        color: {field: 'name', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    const filterTransform = dataWithTransforms.transform.find((t: any) => t.type === 'filter') as any;
    expect(filterTransform).toBeDefined();
    expect(filterTransform.expr).toBe('!datum.children');
  });

  it('should filter to internal nodes when nodes is "internal"', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {id: 1, parent: null, name: 'Root'},
          {id: 2, parent: 1, name: 'A'},
        ],
      },
      mark: {type: 'treemap', nodes: 'internal'},
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        color: {field: 'name', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    const filterTransform = dataWithTransforms.transform.find((t: any) => t.type === 'filter') as any;
    expect(filterTransform).toBeDefined();
    expect(filterTransform.expr).toBe('datum.children');
  });

  it('should not add a filter when nodes is "all"', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {id: 1, parent: null, name: 'Root'},
          {id: 2, parent: 1, name: 'A'},
        ],
      },
      mark: {type: 'treemap', nodes: 'all'},
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        color: {field: 'name', type: 'nominal'},
      },
    });

    const vegaSpec = spec.spec;
    const dataWithTransforms = vegaSpec.data.find((d: any) => d.transform?.length > 0);
    const filterTransform = dataWithTransforms.transform.find((t: any) => t.type === 'filter');
    expect(filterTransform).toBeUndefined();
  });
});
