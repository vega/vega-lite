/* tslint:disable:quotemark */

import {assert} from 'chai';
import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';

describe('compile/data/window', () => {
 it('creates correct window nodes for calculating sort field of crossed facet', () => {
    const window = WindowTransformNode.makeFromFacet(null, {
      row: {field: 'r', type: 'nominal'},
      column: {field: 'c', type: 'nominal', sort: {op: 'median', field: 'x'}}
    });

    expect(window.assemble()).toEqual({
      type: 'window',
      ops: ['median'],
      fields: ['x'],
      params: [null],
      as: ['median_x_by_c'],
      frame: [null, null],
      groupby: ['c'],
      sort: {
        field: [],
        order: []
      }
    });
  });

  it('does not create any window nodes for crossed facet', () => {
    assert.deepEqual(WindowTransformNode.makeFromFacet(null, {
      row: {field: 'a', type: 'nominal'}
    }), null);
  });


  it('should return a proper vg transform', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number',
        },
      ],
      ignorePeers: false,
      sort:
        [
          {
            field: 'f',
            order: 'ascending'
          }
        ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    assert.deepEqual(window.assemble(), {
      type: 'window',
      ops: ['row_number'],
      fields: [null],
      params: [null],
      sort: {
        field: ["f"],
        order: ["ascending"],
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
        },
      ],
      ignorePeers: false,
      sort:
        [
          {
            field: 'f',
            order: 'ascending'
          }
        ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    assert.deepEqual(window.assemble(), {
      type: 'window',
      ops: ['row_number'],
      fields: [null],
      params: [null],
      sort: {
        field: ["f"],
        order: ["ascending"],
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
          as: 'ordered_row_number',
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
      sort:
        [
          {
            field:'f',
            order:'ascending'
          }
        ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    assert.deepEqual({"count_field": true, "ordered_row_number": true, "sum_field": true}, window.producedFields());
  });

  it('should clone to an equivalent version', () => {
    const transform: Transform = {
      window: [
        {
          op: 'row_number',
          as: 'ordered_row_number',
        },
      ],
      ignorePeers: false,
      sort:
        [
          {
            field:'f',
            order:'ascending'
          }
        ],
      groupby: ['f'],
      frame: [null, 0]
    };
    const window = new WindowTransformNode(null, transform);
    assert.deepEqual(window, window.clone());
  });
});
