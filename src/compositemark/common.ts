import {isObject} from 'vega-util';

import {ColorMixins, GenericMarkDef, isMarkDef, MarkConfig, VL_ONLY_MARK_CONFIG_PROPERTIES} from '../mark';
import {NormalizedUnitSpec} from '../spec';

export type PartsMixins<P extends string> = {
  [part in P]?: MarkConfig
};

export type GenericCompositeMarkDef<T> = GenericMarkDef<T> & ColorMixins & {
  /**
   * Opacity of the marks.
   */
  opacity?: number;
};

export function partLayerMixins<P extends PartsMixins<any>>(
  markDef: GenericCompositeMarkDef<any> & P, part: keyof P, compositeMarkConfig: P,
  partBaseSpec: NormalizedUnitSpec
): NormalizedUnitSpec[] {
  const {color, opacity} = markDef;

  const mark = markDef.type;
  const partMarkDef: MarkConfig = markDef[part];

  if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
    return [{
      ...partBaseSpec,
      mark: {
        ...partConfigMixins(part, compositeMarkConfig),
        ...(color ? {color} : {}),
        ...(opacity ? {opacity} : {}),
        ...(isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : {type: partBaseSpec.mark}),
        style: `${mark}-${part}`,
        ...partMarkDef
      }
    }];
  }
  return [];
}

function partConfigMixins<P extends PartsMixins<any>>(
  part: keyof P,
  compositeMarkConfig: P
) {
  const configMixins = {};

  for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
    if (compositeMarkConfig && isObject(compositeMarkConfig[part]) && compositeMarkConfig[part][prop] !== undefined) {
      configMixins[prop] = compositeMarkConfig[part][prop];
    }
  }

  return configMixins;
}
