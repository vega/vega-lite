import {Axis as VgAxis, NewSignal} from 'vega';
import {isArray} from 'vega-util';
import {AXIS_PARTS, AXIS_PROPERTY_TYPE} from '../../axis';
import {POSITION_SCALE_CHANNELS} from '../../channel';
import {defaultTitle, FieldDefBase} from '../../channeldef';
import {Config} from '../../config';
import {getFirstDefined, keys} from '../../util';
import {Model} from '../model';
import {AxisComponent, AxisComponentIndex} from './component';

function assembleTitle(title: string | FieldDefBase<string>[], config: Config) {
  if (isArray(title)) {
    return title.map(fieldDef => defaultTitle(fieldDef, config)).join(', ');
  }
  return title;
}

export function assembleAxis(
  axisCmpt: AxisComponent,
  kind: 'main' | 'grid',
  config: Config,
  opt: {
    header: boolean; // whether this is called via a header
  } = {header: false}
): VgAxis {
  const {orient, scale, title, zindex, ...axis} = axisCmpt.combine();

  // Remove properties that are not valid for this kind of axis
  keys(axis).forEach(key => {
    const propType = AXIS_PROPERTY_TYPE[key];
    if (propType && propType !== kind && propType !== 'both') {
      delete axis[key];
    }
  });

  if (kind === 'grid') {
    if (!axis.grid) {
      return undefined;
    }

    // Remove unnecessary encode block
    if (axis.encode) {
      // Only need to keep encode block for grid
      const {grid} = axis.encode;
      axis.encode = {
        ...(grid ? {grid} : {})
      };

      if (keys(axis.encode).length === 0) {
        delete axis.encode;
      }
    }

    return {
      scale,
      orient,
      ...axis,
      domain: false,
      labels: false,

      // Always set min/maxExtent to 0 to ensure that `config.axis*.minExtent` and `config.axis*.maxExtent`
      // would not affect gridAxis
      maxExtent: 0,
      minExtent: 0,
      ticks: false,
      zindex: getFirstDefined(zindex, 0) // put grid behind marks by default
    };
  } else {
    // kind === 'main'

    if (!opt.header && axisCmpt.mainExtracted) {
      // if mainExtracted has been extracted to a separate facet
      return undefined;
    }

    // Remove unnecessary encode block
    if (axis.encode) {
      for (const part of AXIS_PARTS) {
        if (!axisCmpt.hasAxisPart(part)) {
          delete axis.encode[part];
        }
      }
      if (keys(axis.encode).length === 0) {
        delete axis.encode;
      }
    }

    const titleString = assembleTitle(title, config);

    return {
      scale,
      orient,
      grid: false,
      ...(titleString ? {title: titleString} : {}),
      ...axis,
      zindex: getFirstDefined(zindex, 1) // put axis line above marks by default
    };
  }
}

/**
 * Add axis signals so grid line works correctly
 * (Fix https://github.com/vega/vega-lite/issues/4226)
 */
export function assembleAxisSignals(model: Model): NewSignal[] {
  const {axes} = model.component;
  for (const channel of POSITION_SCALE_CHANNELS) {
    if (axes[channel]) {
      for (const axis of axes[channel]) {
        if (!axis.get('gridScale')) {
          // If there is x-axis but no y-scale for gridScale, need to set height/weight so x-axis can draw the grid with the right height.  Same for y-axis and width.

          const sizeType = channel === 'x' ? 'height' : 'width';
          return [
            {
              name: sizeType,
              update: model.getSizeSignalRef(sizeType).signal
            }
          ];
        }
      }
    }
  }
  return [];
}

export function assembleAxes(axisComponents: AxisComponentIndex, config: Config): VgAxis[] {
  const {x = [], y = []} = axisComponents;
  return [
    ...x.map(a => assembleAxis(a, 'main', config)),
    ...x.map(a => assembleAxis(a, 'grid', config)),
    ...y.map(a => assembleAxis(a, 'main', config)),
    ...y.map(a => assembleAxis(a, 'grid', config))
  ].filter(a => a); // filter undefined
}
