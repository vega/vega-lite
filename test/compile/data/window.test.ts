/* tslint:disable:quotemark */

import {assert} from 'chai';
import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';

describe('compile/data/window', () => {
  describe('TestWindowTransform()', () => {
    it ('should return a proper vg transform', () => {
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
      assert.deepEqual(window.assemble(), {
        type: 'window',
        ops: ['row_number'],
        fields: [null],
        params: [null],
        sort : {
          field: ["f"],
          order: ["ascending"],
        },
        ignorePeers: false,
        as: ['ordered_row_number'],
        frame: [null, 0],
        groupby: ['f']
      });
    });
    it ('should return a producer proper fields', () => {
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
    it ('should clone to an equivalent version', () => {
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
});
