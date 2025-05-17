import {isNumber} from 'vega-util';
import {hasProperty, keys} from '../util.js';
import {isConcatSpec, isVConcatSpec} from './concat.js';
import {isFacetMapping, isFacetSpec} from './facet.js';
export function getStepFor({step, offsetIsDiscrete}) {
  if (offsetIsDiscrete) {
    return step.for ?? 'offset';
  } else {
    return 'position';
  }
}
export function isStep(size) {
  return hasProperty(size, 'step');
}
export function isFrameMixins(o) {
  return hasProperty(o, 'view') || hasProperty(o, 'width') || hasProperty(o, 'height');
}
export const DEFAULT_SPACING = 20;
const COMPOSITION_LAYOUT_INDEX = {
  align: 1,
  bounds: 1,
  center: 1,
  columns: 1,
  spacing: 1,
};
const COMPOSITION_LAYOUT_PROPERTIES = keys(COMPOSITION_LAYOUT_INDEX);
export function extractCompositionLayout(spec, specType, config) {
  const compositionConfig = config[specType];
  const layout = {};
  // Apply config first
  const {spacing: spacingConfig, columns} = compositionConfig;
  if (spacingConfig !== undefined) {
    layout.spacing = spacingConfig;
  }
  if (columns !== undefined) {
    if ((isFacetSpec(spec) && !isFacetMapping(spec.facet)) || isConcatSpec(spec)) {
      layout.columns = columns;
    }
  }
  if (isVConcatSpec(spec)) {
    layout.columns = 1;
  }
  // Then copy properties from the spec
  for (const prop of COMPOSITION_LAYOUT_PROPERTIES) {
    if (spec[prop] !== undefined) {
      if (prop === 'spacing') {
        const spacing = spec[prop];
        layout[prop] = isNumber(spacing)
          ? spacing
          : {
              row: spacing.row ?? spacingConfig,
              column: spacing.column ?? spacingConfig,
            };
      } else {
        layout[prop] = spec[prop];
      }
    }
  }
  return layout;
}
//# sourceMappingURL=base.js.map
