import {JoinAggregateTransformNode} from '../../../src/compile/data/joinaggregate';
import {makeJoinAggregateFromFacet} from '../../../src/compile/data/joinaggregatefacet';
import {Transform} from '../../../src/transform';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/joinaggregate', () => {
  it('creates correct joinaggregate nodes for calculating sort field of crossed facet', () => {
    const joinaggregate = makeJoinAggregateFromFacet(null, {
      row: {field: 'r', type: 'nominal'},
      column: {field: 'c', type: 'nominal', sort: {op: 'median', field: 'x'}}
    });

    expect(joinaggregate.assemble()).toEqual({
      type: 'joinaggregate',
      ops: ['median'],
      fields: ['x'],
      as: ['median_x_by_c'],
      groupby: ['c']
    });
  });

  it('does not create any joinaggregate nodes for crossed facet', () => {
    expect(
      makeJoinAggregateFromFacet(null, {
        row: {field: 'a', type: 'nominal'}
      })
    ).toBeNull();
  });

  it('should return a proper vg transform', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          op: 'count',
          as: 'join_count'
        }
      ],
      groupby: ['f']
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    expect(joinaggregate.assemble()).toEqual({
      type: 'joinaggregate',
      ops: ['count'],
      fields: [null],
      as: ['join_count'],
      groupby: ['f']
    });
  });

  it('should augment as with default as', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          op: 'count',
          as: undefined // intentionally omit for testing
        }
      ],
      groupby: ['f']
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    expect(joinaggregate.assemble()).toEqual({
      type: 'joinaggregate',
      ops: ['count'],
      fields: [null],
      as: ['count'],
      groupby: ['f']
    });
  });

  it('should return a proper produced fields', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          op: 'count',
          as: 'count_field'
        },
        {
          op: 'sum',
          as: 'sum_field'
        }
      ]
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    expect(joinaggregate.producedFields()).toEqual(new Set(['count_field', 'sum_field']));
  });

  it('should generate the correct dependent fields', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          field: 'f',
          op: 'mean',
          as: 'mean_f'
        }
      ],
      groupby: ['g']
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    expect(joinaggregate.dependentFields()).toEqual(new Set(['g', 'f']));
  });

  it('should generate the correct dependent fields when groupby is undefined', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          field: 'f',
          op: 'mean',
          as: 'mean_f'
        }
      ]
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    expect(joinaggregate.dependentFields()).toEqual(new Set(['f']));
  });

  it('should clone to an equivalent version', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          op: 'count',
          as: 'count'
        }
      ],
      groupby: ['f']
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    expect(joinaggregate).toEqual(joinaggregate.clone());
  });

  it('should never clone parent', () => {
    const parent = new PlaceholderDataFlowNode(null);
    const joinaggregate = new JoinAggregateTransformNode(parent, null);
    expect(joinaggregate.clone().parent).toBeNull();
  });

  it('should generate the correct hash', () => {
    const transform: Transform = {
      joinaggregate: [
        {
          op: 'count',
          as: 'count'
        }
      ],
      groupby: ['f']
    };
    const joinaggregate = new JoinAggregateTransformNode(null, transform);
    const hash = joinaggregate.hash();
    expect(hash).toBe('JoinAggregateTransform {"groupby":["f"],"joinaggregate":[{"as":"count","op":"count"}]}');
  });
});
