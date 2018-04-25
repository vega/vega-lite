import {GenericMarkDef, isMarkDef, MarkConfig, VL_ONLY_MARK_CONFIG_PROPERTIES} from '../mark';
import {NormalizedUnitSpec} from '../spec';

export type PartsMixins<P extends string> = {
  [part in P]?: MarkConfig
};

export function partLayerMixins<P extends PartsMixins<any>>(
  markDef: GenericMarkDef<any> & P, part: keyof P, compositeMarkConfig: P,
  baseSpec: NormalizedUnitSpec,
  shownByDefault: boolean = true
): NormalizedUnitSpec[] {
  if (markDef[part] || (markDef[part] === undefined && shownByDefault)) {
    return [{
      ...baseSpec,
      mark: {
        ...(isMarkDef(baseSpec.mark) ? baseSpec.mark : {type: baseSpec.mark}),
        ...getMarkDefMixins(markDef, part, compositeMarkConfig)
      }
    }];
  }
  return [];
}

function getMarkDefMixins<P extends PartsMixins<any>>(
  markDef: GenericMarkDef<any> & P, part: keyof P, compositeMarkConfig: P
) {
  const mark = markDef.type;
  const partMarkDef: MarkConfig = markDef[part];

  const configMixins = {};

  for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
    if (compositeMarkConfig && compositeMarkConfig[part] && compositeMarkConfig[part][prop] !== undefined) {
      configMixins[prop] = compositeMarkConfig[part][prop];
    }
  }

  return {
    style: `${mark}-${part}`,
    ...configMixins,
    ...partMarkDef,
  };
}
