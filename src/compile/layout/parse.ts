import {defaultScaleConfig, hasDiscreteDomain} from '../../scale';
import {isVgRangeStep} from '../../vega.schema';
import {LayerModel} from '../layer';
import {Model} from '../model';
import {makeImplicit, Split} from '../split';
import {UnitModel} from '../unit';
import {LayoutSize, LayoutSizeComponent} from './component';


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
  // TODO(https://github.com/vega/vega-lite/issues/2198): merge size
}

function parseUnitLayoutSize(model: UnitModel) {
  const layoutSizeComponent = model.component.layoutSize = new Split<LayoutSize>();
  const width = parseUnitLayoutSizeForChannel(model, 'width');
  const height = parseUnitLayoutSizeForChannel(model, 'height');
  layoutSizeComponent.setWithExplicit('width', width);
  layoutSizeComponent.setWithExplicit('height', height);
}

function parseUnitLayoutSizeForChannel(model: UnitModel, sizeType: 'width' | 'height') {
  if (model[sizeType]) {
    return {explicit: true, value: model[sizeType]};
  } else {
    const channel = sizeType === 'width' ? 'x' : 'y';
    const config = model.config;
    const scaleComponent = model.getScaleComponent(channel);


    if (scaleComponent) {
      const scaleType = scaleComponent.get('type');
      const range = scaleComponent.get('range');

      if (hasDiscreteDomain(scaleType) && isVgRangeStep(range)) {
        // For discrete domain with range.step, use dynamic width/height
        return makeImplicit(undefined);
      } else {
        // FIXME(https://github.com/vega/vega-lite/issues/1975): revise config.cell name
        // Otherwise, read this from cell config
        return makeImplicit(config.cell[sizeType]);
      }
    } else {
      // No scale - set default size
      if (sizeType === 'width' && model.mark() === 'text') {
        // width for text mark without x-field is a bit wider than typical range step
        return makeImplicit(config.scale.textXRangeStep);
      }

      // Set width/height equal to rangeStep config or if rangeStep is null, use value from default scale config.
      return makeImplicit(config.scale.rangeStep || defaultScaleConfig.rangeStep);
    }
  }
}
