import {Channel, COLUMN, ROW, X, Y} from '../../channel';
import {MAIN} from '../../data';
import {hasDiscreteDomain, scaleCompatible} from '../../scale';
import {extend, isArray, keys, StringSet} from '../../util';
import {isVgRangeStep, VgData, VgFormulaTransform, VgSignal, VgTransform} from '../../vega.schema';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model, ModelWithField} from '../model';
import {ScaleComponent} from '../scale/component';
import {UnitModel} from '../unit';

export function assembleLayoutSignals(model: Model): VgSignal[] {
  const signals: VgSignal[] = [];
  const width = sizeExpr(model, 'width');
  if (width !== undefined) {
    signals.push({name: model.getName('width'), update: width});
  }
  const height = sizeExpr(model, 'height');
  if (height !== undefined) {
    signals.push({name: model.getName('height'), update: sizeExpr(model, 'height')});
  }
  return signals;
}

export function sizeExpr(model: Model, sizeType: 'width' | 'height'): string {
  const channel = sizeType==='width' ? 'x' : 'y';
  const size = model.component.layoutSize.get(sizeType);
  if (size === 'merged') {
    return undefined;
  } else if (size === 'range-step') {
    const scaleComponent = model.getScaleComponent(channel);

    if (scaleComponent) {
      const type = scaleComponent.get('type');
      const range = scaleComponent.get('range');

      if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
        const scaleName = model.scaleName(channel);

        const cardinality = `domain('${scaleName}').length`;
        const padding = scaleComponent.get('padding');
        let paddingOuter = scaleComponent.get('paddingOuter');
        paddingOuter = paddingOuter !== undefined ? paddingOuter : padding;

        let paddingInner = scaleComponent.get('paddingInner');
        paddingInner = type === 'band' ?
          // only band has real paddingInner
          (paddingInner !== undefined ? paddingInner : padding) :
          // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
          // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
          1;

        return `bandspace(${cardinality}, ${paddingInner}, ${paddingOuter}) * ${range.step}`;
      }
    }
    /* istanbul ignore next: Condition should not happen -- only for warning in development. */
    throw new Error('layout size is range step although there is no rangeStep.');
  } else if (size ==='max-child') {
    const childrenSizeSignals = model.children.map(
      child => child.getName(sizeType)
    ).join(', ');
    return `max(${childrenSizeSignals})`;
  }
  return `${size}`;
}

