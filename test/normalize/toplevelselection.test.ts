import {TopLevelSelectionsNormalizer} from '../../src/normalize/toplevelselection';
import {GenericVConcatSpec, NormalizedSpec, NormalizedUnitSpec, TopLevel} from '../../src/spec';

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
        {name: 'one', select: 'single'},
        {name: 'two', select: 'multi'},
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
        {name: 'one', select: 'single', views: ['a']},
        {name: 'two', select: 'multi', views: ['b']},
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
    expect(normalized.vconcat[2].params).toHaveLength(0);
    expect(normalized.vconcat[3].params).toHaveLength(0);
    expect(normalized.vconcat[0].params[0].name).toBe('one');
    expect(normalized.vconcat[0].params[1].name).toBe('three');
    expect(normalized.vconcat[1].params[0].name).toBe('two');
    expect(normalized.vconcat[1].params[1].name).toBe('three');
  });
});
