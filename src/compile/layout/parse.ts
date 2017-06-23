import {defaultScaleConfig, hasDiscreteDomain} from '../../scale';
import {isVgRangeStep} from '../../vega.schema';
import {LayerModel} from '../layer';
import {Model} from '../model';
import {defaultTieBreaker, Explicit, makeImplicit, mergeValuesWithExplicit, Split} from '../split';
import {UnitModel} from '../unit';
import {LayoutSize, LayoutSizeComponent, LayoutSizeIndex} from './component';

export function parseLayoutSize(model: Model) {
  if (model instanceof UnitModel) {
    parseUnitLayoutSize(model);
  } else {
    parseNonUnitLayoutSize(model);
  }
}

function parseNonUnitLayoutSize(model: Model) {
  for (const child of model.children) {
    parseLayoutSize(child);
  }

  // Merge size
  const layoutSizeCmpt = model.component.layoutSize;
  layoutSizeCmpt.setWithExplicit('width', parseNonUnitLayoutSizeForChannel(model, 'x'));
  layoutSizeCmpt.setWithExplicit('height', parseNonUnitLayoutSizeForChannel(model, 'y'));
}

function parseNonUnitLayoutSizeForChannel(model: Model, channel: 'x' | 'y'): Explicit<LayoutSize> {
  const sizeType = channel === 'x' ? 'width' : 'height';
  if (model.component.scales[channel]) {
    let layoutSize: Explicit<LayoutSize>;
    // If scale is shared, we can merge the layout size
    for (const child of model.children) {
      if (!layoutSize) {
        layoutSize = child.component.layoutSize.getWithExplicit(sizeType);
      } else {
        layoutSize = mergeValuesWithExplicit<LayoutSizeIndex, LayoutSize>(layoutSize, child.component.layoutSize.getWithExplicit(sizeType), sizeType, 'layout', defaultTieBreaker);
      }

      // Rename size and set child's size as merged.
      model.renameLayoutSize(child.getSizeSignalRef(sizeType).signal, model.getSizeSignalRef(sizeType).signal);
      child.component.layoutSize.set(sizeType, 'merged', false);
    }
  }
  return {
    explicit: false,
    value: 'max-child'
  };
}

function parseUnitLayoutSize(model: UnitModel) {
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
      // TODO: possibly consider range step's explicit level here?
      return 'range-step';
    } else {
      // FIXME(https://github.com/vega/vega-lite/issues/1975): revise config.cell name
      // Otherwise, read this from cell config
      return config.cell[sizeType];
    }
  } else {
    // No scale - set default size
    if (sizeType === 'width' && model.mark() === 'text') {
      // width for text mark without x-field is a bit wider than typical range step
      return config.scale.textXRangeStep;
    }

    // Set width/height equal to rangeStep config or if rangeStep is null, use value from default scale config.
    return config.scale.rangeStep || defaultScaleConfig.rangeStep;
  }

}
