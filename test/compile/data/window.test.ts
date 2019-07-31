import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/window', () => {
  it('should return a proper vg transform', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number'
        }
      ],
      ignorePeers: false,
      sort: [
        {
          field: 'f',
          order: 'ascending'
        }
      ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    expect(window.assemble()).toEqual({
      type: 'window',
      ops: ['row_number'],
      fields: [null],
      params: [null],
      sort: {
        field: ['f'],
        order: ['ascending']
      },
      ignorePeers: false,
      as: ['ordered_row_number'],
      frame: [null, 0],
      groupby: ['f']
    });
  });

  it('should augment as with default as', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: undefined // intentionally omit for testing
        }
      ],
      ignorePeers: false,
      sort: [
        {
          field: 'f',
          order: 'ascending'
        }
      ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    expect(window.assemble()).toEqual({
      type: 'window',
      ops: ['row_number'],
      fields: [null],
      params: [null],
      sort: {
        field: ['f'],
        order: ['ascending']
      },
      ignorePeers: false,
      as: ['row_number'],
      frame: [null, 0],
      groupby: ['f']
    });
  });

  it('should return a proper produced fields', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number'
        },
        {
          op: 'count',
          as: 'count_field'
        },
        {
          op: 'sum',
          as: 'sum_field'
        }
      ],
      ignorePeers: false,
      sort: [
        {
          field: 'f',
          order: 'ascending'
        }
      ],
      groupby: ['g'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    expect(window.producedFields()).toEqual(new Set(['count_field', 'ordered_row_number', 'sum_field']));
  });

  it('should generate the correct dependent fields', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number'
        }
      ],
      ignorePeers: false,
      sort: [
        {
          field: 'f',
          order: 'ascending'
        }
      ],
      groupby: ['g'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    expect(window.dependentFields()).toEqual(new Set(['g', 'f']));
  });

  it('should generate the correct dependent fields when groupby and sort are undefined', () => {
    const transform: Transform = {
      window: [
        {
          field: 'w',
          op: 'row_number',
          as: 'ordered_row_number'
        }
      ],
      ignorePeers: false,
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    expect(window.dependentFields()).toEqual(new Set(['w']));
  });

  it('should clone to an equivalent version', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number'
        }
      ],
      ignorePeers: false,
      sort: [
        {
          field: 'f',
          order: 'ascending'
        }
      ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    expect(window).toEqual(window.clone());
  });

  it('should never clone parent', () => {
    const parent = new PlaceholderDataFlowNode(null);
    const window = new WindowTransformNode(parent, null);
    expect(window.clone().parent).toBeNull();
  });

  it('should generate the correct hash', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number'
        }
      ],
      ignorePeers: false,
      sort: [
        {
          field: 'f',
          order: 'ascending'
        }
      ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    const hash = window.hash();
    expect(hash).toBe(
      'WindowTransform {"frame":[null,0],"groupby":["f"],"ignorePeers":false,"sort":[{"field":"f","order":"ascending"}],"window":[{"as":"ordered_row_number","op":"row_number"}]}'
    );
  });
});
