import {Orientation} from 'vega';
import {compositeMarkOrient} from '../../src/compositemark/common';
import {isMarkDef, MarkDef} from '../../src/mark';
import {normalize} from '../../src/normalize';
import {isLayerSpec, isUnitSpec, TopLevelSpec} from '../../src/spec';
import {NormalizedUnitSpec} from '../../src/spec/unit';
import {isAggregate, isCalculate} from '../../src/transform';
import {some} from '../../src/util';
import {defaultConfig} from '.././../src/config';
import {assertIsUnitSpec} from '../util';
import {AggregateTransform} from './../../src/transform';

describe('common', () => {
  it('should clip all parts when clip property in composite mark def is true', () => {
    const outputSpec = normalize({
      data: {url: 'data/barley.json'},
      mark: {type: 'errorbar', ticks: true, clip: true},
      encoding: {x: {field: 'yield', type: 'quantitative'}}
    });

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const markDef: MarkDef = isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark;
      expect(markDef).toBeTruthy();
      expect(markDef.clip).toBe(true);
    }
  });

  it('should keep color encoding', () => {
    const outputSpec = normalize({
      data: {url: 'data/barley.json'},
      mark: 'errorbar',
      encoding: {
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        x: {field: 'Origin', type: 'nominal'},
        color: {field: 'Origin', type: 'nominal'}
      }
    });

    assertIsUnitSpec(outputSpec);

    const encoding = outputSpec.encoding;
    expect(encoding).toBeTruthy();
    expect(encoding.color).toBeTruthy();
  });

  it('should keep axis title', () => {
    const outputSpec = normalize({
      data: {url: 'data/barley.json'},
      mark: 'errorbar',
      encoding: {
        y: {field: 'Miles_per_Gallon', type: 'quantitative', axis: {title: 'Hello Vega', grid: false}},
        x: {field: 'Origin', type: 'nominal'}
      }
    });

    assertIsUnitSpec(outputSpec);

    const encoding = outputSpec.encoding;
    expect(encoding).toBeTruthy();
    expect(encoding.y).toBeTruthy();
    expect((encoding.y as any).axis).toEqual({title: 'Hello Vega', grid: false});
  });

  it('should add timeFormat to axis when normalizing encoding with timeUnit', () => {
    const outputSpec = normalize({
      data: {url: 'data/cars.json'},
      mark: 'errorbar',
      encoding: {
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        x: {field: 'Year', type: 'ordinal', timeUnit: 'year'}
      }
    });

    assertIsUnitSpec(outputSpec);

    const encoding = outputSpec.encoding;
    expect(encoding).toBeTruthy();
    expect(encoding.x).toEqual({
      title: 'Year (year)',
      type: 'ordinal',
      field: 'year_Year',
      axis: {
        formatType: 'time'
      }
    });
  });

  it('should produce correct calculate transform when field name contains space or punctuation', () => {
    const outputSpec = normalize({
      data: {url: 'data/barley.json'},
      mark: 'errorbar',
      encoding: {x: {field: 'yield space,punctuation', type: 'quantitative'}}
    });
    const transforms = outputSpec.transform;
    expect(transforms).toBeTruthy();

    const upperCalculate = transforms[1];
    expect(isCalculate(upperCalculate) && upperCalculate.calculate).toEqual(
      'datum["center_yield space,punctuation"] + datum["extent_yield space,punctuation"]'
    );

    const lowerCalculate = transforms[2];
    expect(isCalculate(lowerCalculate) && lowerCalculate.calculate).toEqual(
      'datum["center_yield space,punctuation"] - datum["extent_yield space,punctuation"]'
    );
  });

  it('should override the default tooltip with custom tooltip', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/cars.json'},
      mark: 'errorbar',
      encoding: {
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        x: {field: 'a_field', type: 'ordinal'},
        tooltip: {field: 'a_field', type: 'ordinal'}
      }
    };
    const outputSpec = normalize(spec, defaultConfig);

    const barLayer = outputSpec as NormalizedUnitSpec;
    expect(barLayer.encoding.tooltip).toEqual(spec.encoding.tooltip);
  });

  it('should disable the default tooltip when tooltip is null', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/cars.json'},
      mark: 'errorbar',
      encoding: {
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        tooltip: null
      }
    };
    const outputSpec = normalize(spec, defaultConfig);

    const barLayer = outputSpec as NormalizedUnitSpec;
    expect(barLayer.encoding.tooltip).toBeNull();
  });

  interface TestErrorbarOrientParam {
    xType: 'ordinal' | 'temporal' | 'quantitative';
    xAgg: undefined | 'errorbar';
    yType: 'ordinal' | 'temporal' | 'quantitative';
    yAgg: undefined | 'errorbar';
    orient: Orientation;
  }

  function testErrorbarOrient(aggField: 'x-field' | 'y-field', param: TestErrorbarOrientParam) {
    const {xType, xAgg, yType, yAgg, orient} = param;
    it(`should aggregate ${aggField} in errorbar with orient=${orient[0]}, x is ${xType}${
      xAgg ? '+aggregate' : ''
    }, and y is ${yType}${yAgg ? '+aggregate' : ''}`, () => {
      const spec = {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar'},
        encoding: {
          x: {field: 'x-field', type: xType, aggregate: xAgg},
          y: {field: 'y-field', type: yType, aggregate: yAgg}
        }
      } as const;
      const outputSpec = normalize(spec, defaultConfig);

      expect(compositeMarkOrient(spec, 'errorbar')).toBe(orient);

      const aggregateTransform = outputSpec.transform[0] as AggregateTransform;

      expect(isAggregate(aggregateTransform)).toBeTruthy();
      expect(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === aggField &&
            (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      ).toBe(true);
    });
  }

  const vertical: TestErrorbarOrientParam[] = [
    {xType: 'ordinal', xAgg: undefined, yType: 'temporal', yAgg: undefined, orient: 'vertical'},
    {xType: 'ordinal', xAgg: undefined, yType: 'quantitative', yAgg: undefined, orient: 'vertical'},
    {xType: 'temporal', xAgg: undefined, yType: 'temporal', yAgg: undefined, orient: 'vertical'},
    {xType: 'temporal', xAgg: undefined, yType: 'quantitative', yAgg: undefined, orient: 'vertical'},
    {xType: 'quantitative', xAgg: undefined, yType: 'quantitative', yAgg: undefined, orient: 'vertical'},
    {xType: 'ordinal', xAgg: undefined, yType: 'temporal', yAgg: 'errorbar', orient: 'vertical'},
    {xType: 'ordinal', xAgg: undefined, yType: 'quantitative', yAgg: 'errorbar', orient: 'vertical'},
    {xType: 'temporal', xAgg: undefined, yType: 'temporal', yAgg: 'errorbar', orient: 'vertical'},
    {xType: 'temporal', xAgg: undefined, yType: 'quantitative', yAgg: 'errorbar', orient: 'vertical'},
    {xType: 'quantitative', xAgg: undefined, yType: 'quantitative', yAgg: 'errorbar', orient: 'vertical'},
    {xType: 'ordinal', xAgg: 'errorbar', yType: 'temporal', yAgg: undefined, orient: 'vertical'},
    {xType: 'ordinal', xAgg: 'errorbar', yType: 'quantitative', yAgg: undefined, orient: 'vertical'},
    {xType: 'quantitative', xAgg: undefined, yType: 'temporal', yAgg: 'errorbar', orient: 'vertical'}
  ];

  const horizontal: TestErrorbarOrientParam[] = [
    {xType: 'quantitative', xAgg: undefined, yType: 'ordinal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'quantitative', xAgg: undefined, yType: 'temporal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'quantitative', xAgg: undefined, yType: 'ordinal', yAgg: 'errorbar', orient: 'horizontal'},
    {xType: 'quantitative', xAgg: 'errorbar', yType: 'ordinal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'quantitative', xAgg: 'errorbar', yType: 'temporal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'temporal', xAgg: undefined, yType: 'ordinal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'temporal', xAgg: undefined, yType: 'ordinal', yAgg: 'errorbar', orient: 'horizontal'},
    {xType: 'temporal', xAgg: 'errorbar', yType: 'ordinal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'temporal', xAgg: 'errorbar', yType: 'temporal', yAgg: undefined, orient: 'horizontal'},
    {xType: 'quantitative', xAgg: 'errorbar', yType: 'quantitative', yAgg: undefined, orient: 'horizontal'},
    {xType: 'temporal', xAgg: 'errorbar', yType: 'quantitative', yAgg: undefined, orient: 'horizontal'}
  ];

  for (const p of vertical) {
    testErrorbarOrient('y-field', p);
  }
  for (const p of horizontal) {
    testErrorbarOrient('x-field', p);
  }
});
