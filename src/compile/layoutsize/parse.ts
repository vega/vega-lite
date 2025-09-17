import {getPositionScaleChannel, getSizeChannel, POSITION_SCALE_CHANNELS} from '../../channel.js';
import {getViewConfigContinuousSize, getViewConfigDiscreteSize} from '../../config.js';
import {hasDiscreteDomain} from '../../scale.js';
import {isStep} from '../../spec/base.js';
import {isVgRangeStep} from '../../vega.schema.js';
import {ConcatModel} from '../concat.js';
import {Model} from '../model.js';
import {defaultScaleResolve} from '../resolve.js';
import {Explicit, mergeValuesWithExplicit} from '../split.js';
import {UnitModel} from '../unit.js';
import {getSizeTypeFromLayoutSizeType, LayoutSize, LayoutSizeIndex, LayoutSizeType} from './component.js';

export function parseLayerLayoutSize(model: Model) {
  parseChildrenLayoutSize(model);

  parseNonUnitLayoutSizeForChannel(model, 'width');
  parseNonUnitLayoutSizeForChannel(model, 'height');
}

export function parseConcatLayoutSize(model: ConcatModel) {
  parseChildrenLayoutSize(model);

  // for columns === 1 (vconcat), we can completely merge width. Otherwise, we can treat merged width as childWidth.
  const widthType = model.layout.columns === 1 ? 'width' : 'childWidth';

  // for columns === undefined (hconcat), we can completely merge height. Otherwise, we can treat merged height as childHeight.
  const heightType = model.layout.columns === undefined ? 'height' : 'childHeight';

  parseNonUnitLayoutSizeForChannel(model, widthType);
  parseNonUnitLayoutSizeForChannel(model, heightType);
}

export function parseChildrenLayoutSize(model: Model) {
  for (const child of model.children) {
    child.parseLayoutSize();
  }
}

/**
 * Merge child layout size (width or height).
 */
function parseNonUnitLayoutSizeForChannel(model: Model, layoutSizeType: LayoutSizeType) {
  /*
   * For concat, the parent width or height might not be the same as the children's shared height.
   * For example, hconcat's subviews may share width, but the shared width is not the hconcat view's width.
   *
   * layoutSizeType represents the output of the view (could be childWidth/childHeight/width/height)
   * while the sizeType represents the properties of the child.
   */
  const sizeType = getSizeTypeFromLayoutSizeType(layoutSizeType);
  const channel = getPositionScaleChannel(sizeType);
  const resolve = model.component.resolve;
  const layoutSizeCmpt = model.component.layoutSize;

  let mergedSize: Explicit<LayoutSize>;
  // Try to merge layout size
  for (const child of model.children) {
    const childSize = child.component.layoutSize.getWithExplicit(sizeType);
    const scaleResolve = resolve.scale[channel] ?? defaultScaleResolve(channel, model);
    if (scaleResolve === 'independent' && childSize.value === 'step') {
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
      model.renameSignal(child.getName(sizeType), model.getName(layoutSizeType));
      child.component.layoutSize.set(sizeType, 'merged', false);
    }
    layoutSizeCmpt.setWithExplicit(layoutSizeType, mergedSize);
  } else {
    layoutSizeCmpt.setWithExplicit(layoutSizeType, {
      explicit: false,
      value: undefined,
    });
  }
}

export function parseUnitLayoutSize(model: UnitModel) {
  const {size, component} = model;
  for (const channel of POSITION_SCALE_CHANNELS) {
    const sizeType = getSizeChannel(channel);

    if (size[sizeType] != undefined && size[sizeType] != null) {
      const specifiedSize = size[sizeType];
      component.layoutSize.set(sizeType, isStep(specifiedSize) ? 'step' : specifiedSize, true);
    } else {
      const defaultSize = defaultUnitSize(model, sizeType);
      component.layoutSize.set(sizeType, defaultSize, false);
    }
  }
}

function defaultUnitSize(model: UnitModel, sizeType: 'width' | 'height'): LayoutSize {
  const channel = sizeType === 'width' ? 'x' : 'y';
  const config = model.config;
  const scaleComponent = model.getScaleComponent(channel);

  if (scaleComponent) {
    const scaleType = scaleComponent.get('type');
    const range = scaleComponent.get('range');

    if (hasDiscreteDomain(scaleType)) {
      const size = getViewConfigDiscreteSize(config.view, sizeType);
      if (isVgRangeStep(range) || isStep(size)) {
        // For discrete domain with range.step, use dynamic width/height
        return 'step';
      } else {
        return size;
      }
    } else {
      return getViewConfigContinuousSize(config.view, sizeType);
    }
  } else if (model.hasProjection || model.mark === 'arc') {
    // arc should use continuous size by default otherwise the pie is extremely small
    return getViewConfigContinuousSize(config.view, sizeType);
  } else {
    const size = getViewConfigDiscreteSize(config.view, sizeType);
    return isStep(size) ? size.step : size;
  }
}
