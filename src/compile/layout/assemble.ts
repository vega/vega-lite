import {Channel, COLUMN, ROW, X, Y} from '../../channel';
import {MAIN} from '../../data';
import {ResolveMapping} from '../../resolve';
import {hasDiscreteDomain, scaleCompatible} from '../../scale';
import {extend, isArray, keys, StringSet} from '../../util';
import {isVgRangeStep, VgData, VgFormulaTransform, VgRangeStep, VgSignal, VgTransform} from '../../vega.schema';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model, ModelWithField} from '../model';
import {ScaleComponent} from '../scale/component';
import {UnitModel} from '../unit';

export type LayoutAssembleParams = {
  mode: 'combined'
} | {
  mode: 'outer' | 'inner',
  resolve: ResolveMapping
};

export function assembleLayoutSignals(model: Model, params: LayoutAssembleParams): VgSignal[] {
  return [].concat(
    sizeSignals(model, 'width', params),
    sizeSignals(model, 'height', params)
  );
}

export function sizeSignals(model: Model, sizeType: 'width' | 'height', params: LayoutAssembleParams): VgSignal[] {
  const {mode} = params;
  const resolve = params.mode === 'combined' ? undefined : params.resolve;
  const channel = sizeType==='width' ? 'x' : 'y';
  const size = model.component.layoutSize.get(sizeType);
  if (!size || size === 'merged') {
    return [];
  }

  // Read size signal name from name map, just in case it is the top-level size signal that got renamed.
  const name = model.getSizeSignalRef(sizeType).signal;

  if (size === 'range-step') {
    const scaleComponent = model.getScaleComponent(channel);
    if (scaleComponent) {
      const type = scaleComponent.get('type');
      const range = scaleComponent.get('range');

      if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
        const scaleName = model.scaleName(channel);

        if (mode !== 'combined' && resolve && resolve[channel].scale === 'independent') {
          // Independent scale with inner/outer mode requires nested signal
          if (mode === 'outer') {
            // For outer, only return the outer signal placeholder that receives push: "outer"
            return [{name}];
          } else if (mode === 'inner') {
            // For inner, output step signal, inner size formula signal, and another signal that pushes the signal outside.
            const innerName = name + '_inner';
            return [
              stepSignal(scaleName, range),
              {
                name: innerName,
                update: sizeExpr(scaleName, scaleComponent),
              }, {
                name,
                push: 'outer',
                on: [{
                  events: {signal: innerName},
                  update: innerName
                }]
              }
            ];
          }
        } else if (mode !== 'inner') {
          // For combined mode or outer signals of shared scale, no need to do nested signals, just output step signal and size formula signal
          return [
            stepSignal(scaleName, range),
            {
              name: name,
              update: sizeExpr(scaleName, scaleComponent),
            }
          ];
        } else {
          // For inner signals of shared scale, return nothing.
          return [];
        }
      }
    }
    /* istanbul ignore next: Condition should not happen -- only for warning in development. */
    throw new Error('layout size is range step although there is no rangeStep.');
  } else {
    // Size is constant number
    if (mode !== 'inner') {
      return [{
        name,
        update: `${size}`
      }];
    } else {
      return [];
    }
  }
}

function stepSignal(scaleName: string, range: VgRangeStep) {
  return {
    name: scaleName + '_step',
    value: range.step,
  };
}

function sizeExpr(scaleName: string, scaleComponent: ScaleComponent) {
  const type = scaleComponent.get('type');
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
  return `bandspace(${cardinality}, ${paddingInner}, ${paddingOuter}) * ${scaleName}_step`;
}


