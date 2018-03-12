import {AXIS_PARTS, AXIS_PROPERTY_TYPE} from '../../axis';
import {keys} from '../../util';
import {VgAxis} from '../../vega.schema';
import {AxisComponent, AxisComponentIndex} from './component';


export function assembleAxis(
  axisCmpt: AxisComponent,
  kind: 'main' | 'grid',
  opt: {
    header: boolean // whether this is called via a header
  } = {header: false}
): VgAxis {
  const {orient, scale, ...axis} = axisCmpt.combine();

  // Remove properties that are not valid for this kind of axis
  keys(axis).forEach((key) => {
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

      zindex: 0 // put grid behind marks
    };
  } else { // kind === 'main'

    if (!opt.header && axisCmpt.mainExtracted) {
      // if mainExtracted has been extracted to a separate facet
      return undefined;
    }

    // Remove unnecessary encode block
    if (axis.encode) {
      for (const part of AXIS_PARTS) {
        if (
          !axisCmpt.hasAxisPart(part)
        ) {
          delete axis.encode[part];
        }
      }
      if (keys(axis.encode).length === 0) {
        delete axis.encode;
      }
    }

    return {
      scale,
      orient,
      ...axis,

      zindex: 1
    };
  }
}

export function assembleAxes(axisComponents: AxisComponentIndex): VgAxis[] {
  const {x=[], y=[]} = axisComponents;
  return [
    ...x.map(a => assembleAxis(a, 'main')),
    ...x.map(a => assembleAxis(a, 'grid')),
    ...y.map(a => assembleAxis(a, 'main')),
    ...y.map(a => assembleAxis(a, 'grid'))
  ].filter(a => a); // filter undefined
}
