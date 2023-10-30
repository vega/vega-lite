import { COMMON_LEGEND_PROPERTY_INDEX } from '../../legend';
import { keys } from '../../util';
import { Split } from '../split';
const LEGEND_COMPONENT_PROPERTY_INDEX = {
    ...COMMON_LEGEND_PROPERTY_INDEX,
    disable: 1,
    labelExpr: 1,
    selections: 1,
    // channel scales
    opacity: 1,
    shape: 1,
    stroke: 1,
    fill: 1,
    size: 1,
    strokeWidth: 1,
    strokeDash: 1,
    // encode
    encode: 1
};
export const LEGEND_COMPONENT_PROPERTIES = keys(LEGEND_COMPONENT_PROPERTY_INDEX);
export class LegendComponent extends Split {
}
//# sourceMappingURL=component.js.map