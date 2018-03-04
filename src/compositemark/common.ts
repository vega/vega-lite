import {GenericMarkDef, MarkConfig, VL_ONLY_MARK_CONFIG_PROPERTIES} from '../mark';

export type PartsMixins<P extends string> = {
  [part in P]?: MarkConfig
};

export function getMarkDefMixins<P extends PartsMixins<any>>(
  markDef: GenericMarkDef<any> & P, part: keyof P, cmarkConfig: P
) {
  const mark = markDef.type;
  const partMarkDef: MarkConfig = markDef[part];

  const mixins = {
    style: `${mark}-${part}`,
    ...partMarkDef,
  };

  for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
    if (cmarkConfig && cmarkConfig[part] && cmarkConfig[part][prop] !== undefined) {
      mixins[prop] = cmarkConfig[part][prop];
    }
  }

  return mixins;
}
