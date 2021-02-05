import {normalize} from '../../src';
import {TopLevelSelectionsNormalizer} from '../../src/normalize/toplevelselection';
import {GenericVConcatSpec, NormalizedSpec, NormalizedUnitSpec, TopLevel, TopLevelSpec} from '../../src/spec';

const selectionNormalizer = new TopLevelSelectionsNormalizer();
const unit: NormalizedUnitSpec = {
  data: {url: 'data/cars.json'},
  mark: 'point',
  encoding: {
    x: {field: 'Horsepower', type: 'quantitative'},
    y: {field: 'Miles_per_Gallon', type: 'quantitative'}
  }
};

describe('TopLevelSelectionNormalizer', () => {
  it('should push top-level selections to all units by default', () => {
    const spec: TopLevel<NormalizedSpec> = {
      params: [
        {name: 'one', select: 'point'},
        {name: 'two', select: 'point'},
        {name: 'three', select: 'interval'},
        {name: 'four', expr: 'true'},
        {name: 'five', bind: {input: 'range'}}
      ],
      vconcat: [{...unit}, {...unit}]
    };

    const normalized = selectionNormalizer.map(spec, {config: null}) as TopLevel<
      GenericVConcatSpec<NormalizedUnitSpec>
    >;
    expect(normalized.params).toHaveLength(2);
    expect(normalized.vconcat[0].params).toHaveLength(3);
    expect(normalized.vconcat[1].params).toHaveLength(3);
  });

  it('should push top-level selections to given units', () => {
    const spec: TopLevel<NormalizedSpec> = {
      params: [
        {name: 'one', select: 'point', views: ['a']},
        {name: 'two', select: 'point', views: ['b']},
        {name: 'three', select: 'interval', views: ['a', 'b']},
        {name: 'four', expr: 'true'},
        {name: 'five', bind: {input: 'range'}}
      ],
      vconcat: [{name: 'a', ...unit}, {name: 'b', ...unit}, {name: 'c', ...unit}, {...unit}]
    };

    const normalized = selectionNormalizer.map(spec, {config: null}) as TopLevel<
      GenericVConcatSpec<NormalizedUnitSpec>
    >;
    expect(normalized.params).toHaveLength(2);
    expect(normalized.vconcat[0].params).toHaveLength(2);
    expect(normalized.vconcat[1].params).toHaveLength(2);
    expect(normalized.vconcat[2].params).toBeUndefined();
    expect(normalized.vconcat[3].params).toBeUndefined();
    expect(normalized.vconcat[0].params[0].name).toBe('one');
    expect(normalized.vconcat[0].params[1].name).toBe('three');
    expect(normalized.vconcat[1].params[0].name).toBe('two');
    expect(normalized.vconcat[1].params[1].name).toBe('three');
  });

  it('should handle nested paths', () => {
    const spec: TopLevelSpec = {
      params: [
        {name: 'one', select: 'point', views: ['child__row_Acceleration']},
        {name: 'two', select: 'point', views: [['child__row_Horsepower', 'b']]},
        {name: 'three', select: 'interval', views: ['a', ['child__row_Horsepower', 'b', 'c']]},
        {name: 'four', expr: 'true'},
        {name: 'five', bind: {input: 'range'}}
      ],
      repeat: {row: ['Horsepower', 'Acceleration']},
      spec: {
        layer: [
          {name: 'a', ...unit},
          {
            name: 'b',
            layer: [{name: 'c', ...unit}, {...unit}]
          }
        ]
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.params).toHaveLength(2);

    expect(normalized.concat[0].name).toBe('child__row_Horsepower');
    expect(normalized.concat[0].params).toBeUndefined();

    expect(normalized.concat[0].layer[0].name).toBe('a');
    expect(normalized.concat[0].layer[0].params).toHaveLength(1);
    expect(normalized.concat[0].layer[0].params[0].name).toBe('three');

    expect(normalized.concat[0].layer[1].name).toBe('b');
    expect(normalized.concat[0].layer[1].params).toBeUndefined();
    expect(normalized.concat[0].layer[1].layer[0].name).toBe('c');
    expect(normalized.concat[0].layer[1].layer[0].params).toHaveLength(2);
    expect(normalized.concat[0].layer[1].layer[0].params[0].name).toBe('two');
    expect(normalized.concat[0].layer[1].layer[0].params[1].name).toBe('three');
    expect(normalized.concat[0].layer[1].layer[1].params).toHaveLength(1);
    expect(normalized.concat[0].layer[1].layer[1].params[0].name).toBe('two');

    expect(normalized.concat[1].name).toBe('child__row_Acceleration');
    expect(normalized.concat[1].params).toBeUndefined();

    expect(normalized.concat[1].layer[0].name).toBe('a');
    expect(normalized.concat[1].layer[0].params).toHaveLength(2);
    expect(normalized.concat[1].layer[0].params[0].name).toBe('one');
    expect(normalized.concat[1].layer[0].params[1].name).toBe('three');

    expect(normalized.concat[1].layer[1].name).toBe('b');
    expect(normalized.concat[1].layer[1].params).toBeUndefined();
    expect(normalized.concat[1].layer[1].layer[0].name).toBe('c');
    expect(normalized.concat[1].layer[1].layer[0].params).toHaveLength(1);
    expect(normalized.concat[1].layer[1].layer[0].params[0].name).toBe('one');
    expect(normalized.concat[1].layer[1].layer[1].params).toHaveLength(1);
    expect(normalized.concat[1].layer[1].layer[1].params[0].name).toBe('one');
  });
});
