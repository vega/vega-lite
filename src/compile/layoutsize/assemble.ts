import {InitSignal, NewSignal} from 'vega';
import {getViewConfigContinuousSize} from '../../config.js';
import {hasDiscreteDomain} from '../../scale.js';
import {getFirstDefined} from '../../util.js';
import {isSignalRef, isVgRangeStep, VgRangeStep} from '../../vega.schema.js';
import {signalOrStringValue} from '../common.js';
import {isFacetModel, Model} from '../model.js';
import {ScaleComponent} from '../scale/component.js';
import {LayoutSizeType} from './component.js';

export function assembleLayoutSignals(model: Model): NewSignal[] {
  return [
    ...sizeSignals(model, 'width'),
    ...sizeSignals(model, 'height'),
    ...sizeSignals(model, 'childWidth'),
    ...sizeSignals(model, 'childHeight'),
  ];
}

export function sizeSignals(model: Model, sizeType: LayoutSizeType): (NewSignal | InitSignal)[] {
  const channel = sizeType === 'width' ? 'x' : 'y';
  const size = model.component.layoutSize.get(sizeType);
  if (size == null || size === 'merged') {
    return [];
  }

  // Read size signal name from name map, just in case it is the top-level size signal that got renamed.
  const name = model.getSizeSignalRef(sizeType).signal;

  if (size === 'step') {
    const scaleComponent = model.getScaleComponent(channel);

    if (scaleComponent) {
      const type = scaleComponent.get('type');
      const range = scaleComponent.get('range');

      if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
        const scaleName = model.scaleName(channel);

        if (isFacetModel(model.parent)) {
          // If parent is facet and this is an independent scale, return only signal signal
          // as the width/height will be calculated using the cardinality from
          // facet's aggregate rather than reading from scale domain
          const parentResolve = model.parent.component.resolve;
          if (parentResolve.scale[channel] === 'independent') {
            return [stepSignal(scaleName, range)];
          }
        }

        return [
          stepSignal(scaleName, range),
          {
            name,
            update: sizeExpr(scaleName, scaleComponent, `domain('${scaleName}').length`),
          },
        ];
      }
    }
    /* istanbul ignore next: Condition should not happen -- only for warning in development. */
    throw new Error('layout size is step although width/height is not step.');
  } else if (size == 'container') {
    const isWidth = name.endsWith('width');
    const expr = isWidth ? 'containerSize()[0]' : 'containerSize()[1]';
    const defaultValue = getViewConfigContinuousSize(model.config.view, isWidth ? 'width' : 'height');
    const safeExpr = `isFinite(${expr}) ? ${expr} : ${defaultValue}`;
    return [{name, init: safeExpr, on: [{update: safeExpr, events: 'window:resize'}]}];
  } else {
    return [
      {
        name,
        value: size,
      },
    ];
  }
}

function stepSignal(scaleName: string, range: VgRangeStep): NewSignal {
  const name = `${scaleName}_step`;
  if (isSignalRef(range.step)) {
    return {name, update: range.step.signal};
  } else {
    return {name, value: range.step};
  }
}

export function sizeExpr(scaleName: string, scaleComponent: ScaleComponent, cardinality: string) {
  const type = scaleComponent.get('type');
  const padding = scaleComponent.get('padding');
  const paddingOuter = getFirstDefined(scaleComponent.get('paddingOuter'), padding);

  let paddingInner = scaleComponent.get('paddingInner');
  paddingInner =
    type === 'band'
      ? // only band has real paddingInner
        paddingInner !== undefined
        ? paddingInner
        : padding
      : // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
        // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
        1;
  return `bandspace(${cardinality}, ${signalOrStringValue(paddingInner)}, ${signalOrStringValue(
    paddingOuter,
  )}) * ${scaleName}_step`;
}
