import {VgAxis} from '../../vega.schema';
import {AxisComponent, AxisComponentIndex} from './component';


const mainAxisReducer = getAxisReducer('main');
const gridAxisReducer = getAxisReducer('grid');

function getAxisReducer(axisType: 'main' | 'grid') {
  return (axes: VgAxis[], axis: AxisComponent) => {
    if (axis[axisType]) {
      // Need to cast here so it's not longer partial type.
      axes.push(axis[axisType].combine() as VgAxis);
    }
    return axes;
  };
}

export function assembleAxes(axisComponents: AxisComponentIndex): VgAxis[] {
  return [].concat(
    axisComponents.x ? [].concat(
      axisComponents.x.reduce(mainAxisReducer, []),
      axisComponents.x.reduce(gridAxisReducer, [])
    ) : [],
    axisComponents.y ? [].concat(
      axisComponents.y.reduce(mainAxisReducer, []),
      axisComponents.y.reduce(gridAxisReducer, []),
    ) : []
  );
}

