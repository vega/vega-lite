import {parse, View} from 'vega';

import {rangedOffsetBaseline} from '../../../src/compile/scale/rangedOffset.js';
import {compile} from '../../../src/compile/compile.js';
import {TopLevelSpec} from '../../../src/spec/index.js';
import {parseUnitModelWithScale} from '../../util.js';

describe('rangedOffsetBaseline', () => {
  async function evaluateYAxisBandPosition(domain: number[], reverse = false, height?: number) {
    const {spec} = compile({
      height,
      data: {
        values: [
          {category: 'A', offset: domain[0], value: 1},
          {category: 'A', offset: domain[1], value: 2},
        ],
      },
      mark: 'bar',
      encoding: {
        x: {field: 'value', type: 'quantitative'},
        y: {field: 'category', type: 'nominal'},
        yOffset: {field: 'offset', type: 'quantitative', scale: {domain, reverse}},
      },
    } as TopLevelSpec);

    const axis = spec.axes?.find((candidate) => candidate.scale === 'y' && candidate.bandPosition !== undefined);
    if (!axis || typeof axis.bandPosition !== 'object' || !('signal' in axis.bandPosition)) {
      throw new Error('Expected a signal-valued y-axis bandPosition.');
    }

    spec.signals = [
      ...(spec.signals ?? []),
      {name: 'test_ranged_offset_band_position', update: axis.bandPosition.signal},
    ];
    const view = new View(parse(spec), {renderer: 'none'});
    await view.runAsync();
    return view.signal('test_ranged_offset_band_position') as number;
  }

  it.each([
    {name: 'the lower endpoint for a positive domain', domain: [10, 20], expected: 1},
    {name: 'the upper endpoint for a negative domain', domain: [-20, -10], expected: 0},
    {name: 'zero for a diverging domain', domain: [-20, 10], expected: 1 / 3},
    {name: 'zero for a reversed diverging scale', domain: [-20, 10], reverse: true, expected: 2 / 3},
  ])('positions the baseline at $name', async ({domain, reverse, expected}) => {
    expect(await evaluateYAxisBandPosition(domain, reverse)).toBeCloseTo(expected);
  });

  it('falls back to mid-band when the base bandwidth is zero', async () => {
    expect(await evaluateYAxisBandPosition([10, 20], false, 0)).toBe(0.5);
  });

  it('falls back to mid-band for an unsupported offset scale', () => {
    const model = parseUnitModelWithScale({
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'nominal'},
        yOffset: {field: 'c', type: 'quantitative'},
      },
    });
    model.getScaleComponent('yOffset').set('type', 'quantize', true);

    expect(rangedOffsetBaseline(model, 'y')).toEqual({
      offset: {signal: 'bandwidth("y") / 2'},
      bandPosition: 0.5,
    });
  });

  it('falls back to zero when the offset scale is disabled', () => {
    const model = parseUnitModelWithScale({
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'nominal'},
        yOffset: {field: 'c', type: 'quantitative', scale: null},
      },
    });

    expect(rangedOffsetBaseline(model, 'y')).toEqual({offset: {value: 0}, bandPosition: 0});
  });

  it('falls back to the center for a point base scale', () => {
    const model = parseUnitModelWithScale({
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'nominal'},
        yOffset: {field: 'c', type: 'quantitative'},
      },
    });
    model.getScaleComponent('y').set('type', 'point', true);

    expect(rangedOffsetBaseline(model, 'y')).toEqual({offset: {value: 0}, bandPosition: 0.5});
  });

  it.each(['shared', 'independent'] as const)('resolves %s layered offset scale names', async (resolve) => {
    const {spec} = compile({
      data: {values: [{category: 'A', first: 1, second: 2, value: 1}]},
      layer: [
        {
          mark: 'bar',
          encoding: {
            x: {field: 'value', type: 'quantitative'},
            y: {field: 'category', type: 'nominal'},
            yOffset: {field: 'first', type: 'quantitative'},
          },
        },
        {
          mark: 'bar',
          encoding: {
            x: {field: 'value', type: 'quantitative'},
            y: {field: 'category', type: 'nominal'},
            yOffset: {field: 'second', type: 'quantitative'},
          },
        },
      ],
      resolve: {scale: {yOffset: resolve}},
    } as TopLevelSpec);

    const scaleNames = resolve === 'shared' ? ['yOffset', 'yOffset'] : ['layer_0_yOffset', 'layer_1_yOffset'];
    spec.marks.forEach((mark, index) => {
      expect(((mark.encode.update.y2 as any).offset as {signal: string}).signal).toContain(
        `extent(domain("${scaleNames[index]}"))`,
      );
    });

    const view = new View(parse(spec), {renderer: 'none'});
    await view.runAsync();
  });
});
