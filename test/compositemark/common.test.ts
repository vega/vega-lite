/* tslint:disable:quotemark */
import {isMarkDef, MarkDef} from '../../src/mark';
import {isLayerSpec, isUnitSpec, normalize} from '../../src/spec';
import {defaultConfig} from '.././../src/config';

describe('common feature of composite marks', () => {
  it('should clip all the part when clip property in composite mark def is true', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/barley.json'},
        mark: {type: 'errorbar', tick: true, clip: true},
        encoding: {x: {field: 'yield', type: 'quantitative'}}
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const markDef: MarkDef = isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark;
      expect(markDef).toBeTruthy();
      expect(markDef.clip).toBe(true);
    }
  });
});
