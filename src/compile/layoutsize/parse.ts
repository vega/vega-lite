import {defaultScaleConfig, hasDiscreteDomain} from '../../scale';
import {isVgRangeStep} from '../../vega.schema';
import {ConcatModel} from '../concat';
import {Model} from '../model';
import {Explicit, mergeValuesWithExplicit} from '../split';
import {UnitModel} from '../unit';
import {LayoutSize, LayoutSizeIndex} from './component';

export function parseLayerLayoutSize(model: Model) {
  parseChildrenLayoutSize(model);

  const layoutSizeCmpt = model.component.layoutSize;
  layoutSizeCmpt.setWithExplicit('width', parseNonUnitLayoutSizeForChannel(model, 'width'));
  layoutSizeCmpt.setWithExplicit('height', parseNonUnitLayoutSizeForChannel(model, 'height'));
}

export const parseRepeatLayoutSize = parseLayerLayoutSize;

export function parseConcatLayoutSize(model: ConcatModel) {
  parseChildrenLayoutSize(model);
  const layoutSizeCmpt = model.component.layoutSize;

  const sizeTypeToMerge = model.isVConcat ? 'width' : 'height';
  layoutSizeCmpt.setWithExplicit(sizeTypeToMerge, parseNonUnitLayoutSizeForChannel(model, sizeTypeToMerge));
}

export function parseChildrenLayoutSize(model: Model) {
  for (const child of model.children) {
    child.parseLayoutSize();
  }
}

function parseNonUnitLayoutSizeForChannel(model: Model, sizeType: 'width' | 'height'): Explicit<LayoutSize> {
  const channel = sizeType === 'width' ? 'x' : 'y';
  const resolve = model.component.resolve;

  let mergedSize: Explicit<LayoutSize>;
  // Try to merge layout size
  for (const child of model.children) {
    const childSize = child.component.layoutSize.getWithExplicit(sizeType);
    const scaleResolve = resolve.scale[channel];
    if (scaleResolve === 'independent' && childSize.value === 'range-step') {
      // Do not merge independent scales with range-step as their size depends
      // on the scale domains, which can be different between scales.
      mergedSize = undefined;
      break;
    }

    if (mergedSize) {
      if (scaleResolve === 'independent' && mergedSize.value !== childSize.value) {
        // For independent scale, only merge if all the sizes are the same.
        // If the values are different, abandon the merge!
        mergedSize = undefined;
        break;
      }
      mergedSize = mergeValuesWithExplicit<LayoutSizeIndex, LayoutSize>(mergedSize, childSize, sizeType, '');
    } else {
      mergedSize = childSize;
    }
  }

  if (mergedSize) {
    // If merged, rename size and set size of all children.
    for (const child of model.children) {
      model.renameSignal(child.getName(sizeType), model.getName(sizeType));
      child.component.layoutSize.set(sizeType, 'merged', false);
    }
    return mergedSize;
  } else {
    // Otherwise, there is no merged size.
    return {
      explicit: false,
      value: undefined
    };
  }
}

export function parseUnitLayoutSize(model: UnitModel) {
  const layoutSizeComponent = model.component.layoutSize;
  if (!layoutSizeComponent.explicit.width) {
    const width = defaultUnitSize(model, 'width');
    layoutSizeComponent.set('width', width, false);
  }

  if (!layoutSizeComponent.explicit.height) {
    const height = defaultUnitSize(model, 'height');
    layoutSizeComponent.set('height', height, false);
  }
}

function defaultUnitSize(model: UnitModel, sizeType: 'width' | 'height'): LayoutSize {
  const channel = sizeType === 'width' ? 'x' : 'y';
  const config = model.config;
  const scaleComponent = model.getScaleComponent(channel);

  if (scaleComponent) {
    const scaleType = scaleComponent.get('type');
    const range = scaleComponent.get('range');

    if (hasDiscreteDomain(scaleType) && isVgRangeStep(range)) {
      // For discrete domain with range.step, use dynamic width/height
      return 'range-step';
    } else {
      return config.view[sizeType];
    }
  } else if (model.hasProjection) {
    return config.view[sizeType];
  } else {
    // No scale - set default size
    if (sizeType === 'width' && model.mark === 'text') {
      // width for text mark without x-field is a bit wider than typical range step
      return config.scale.textXRangeStep;
    }

    // Set width/height equal to rangeStep config or if rangeStep is null, use value from default scale config.
    return config.scale.rangeStep || defaultScaleConfig.rangeStep;
  }
}
