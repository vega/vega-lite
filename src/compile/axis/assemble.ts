import {Axis as VgAxis} from 'vega';
import {isArray} from 'vega-util';
import {AXIS_PARTS, AXIS_PROPERTY_TYPE} from '../../axis';
import {Config} from '../../config';
import {defaultTitle, FieldDefBase} from '../../fielddef';
import {getFirstDefined, keys} from '../../util';
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

export function assembleAxes(axisComponents: AxisComponentIndex, config: Config): VgAxis[] {
  const {x = [], y = []} = axisComponents;
  return [
    ...x.map(a => assembleAxis(a, 'main', config)),
    ...x.map(a => assembleAxis(a, 'grid', config)),
    ...y.map(a => assembleAxis(a, 'main', config)),
    ...y.map(a => assembleAxis(a, 'grid', config))
  ].filter(a => a); // filter undefined
}
