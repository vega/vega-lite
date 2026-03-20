import {compile} from '../../../src/index.js';

describe('treemap hierarchy inheritance in layer', () => {
  it('should inherit hierarchy and size from parent encoding', () => {
    const spec = compile({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 400,
      height: 300,
      data: {
        values: [
          {id: 1, parent: null, name: 'Root', size: 0},
          {id: 2, parent: 1, name: 'A', size: 100},
          {id: 3, parent: 1, name: 'B', size: 200},
        ],
      },
      encoding: {
        hierarchy: {
          key: {field: 'id'},
          parentKey: {field: 'parent'},
        },
        size: {field: 'size', type: 'quantitative'},
      },
      layer: [
        {
          mark: {type: 'treemap', nodes: 'internal'},
          encoding: {
            color: {field: 'name', type: 'nominal'},
          },
        },
        {
          mark: {type: 'treemap', nodes: 'leaves', fill: 'transparent', stroke: '#fff'},
          encoding: {
            tooltip: [
              {field: 'name', type: 'nominal'},
              {field: 'size', type: 'quantitative'},
            ],
          },
        },
      ],
    });

    const vegaSpec = spec.spec;

    // Both layers should produce rect marks
    const marks = vegaSpec.marks;
    expect(marks).toHaveLength(2);
    expect(marks[0].type).toBe('rect');
    expect(marks[1].type).toBe('rect');

    // Both layers should have treemap transforms (hierarchy inherited from parent)
    const dataSources = vegaSpec.data.filter((d: any) => d.transform?.some((t: any) => t.type === 'treemap'));
    expect(dataSources).toHaveLength(2);

    // Layer 0: internal nodes (filter: datum.children)
    const internalSource = dataSources.find((d: any) =>
      d.transform.some((t: any) => t.type === 'filter' && t.expr === 'datum.children'),
    );
    expect(internalSource).toBeDefined();

    // Layer 1: leaves (filter: !datum.children)
    const leavesSource = dataSources.find((d: any) =>
      d.transform.some((t: any) => t.type === 'filter' && t.expr === '!datum.children'),
    );
    expect(leavesSource).toBeDefined();
  });
});
