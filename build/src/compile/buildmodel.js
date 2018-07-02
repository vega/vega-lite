import * as log from '../log';
import { isConcatSpec, isFacetSpec, isLayerSpec, isRepeatSpec, isUnitSpec } from '../spec';
import { ConcatModel } from './concat';
import { FacetModel } from './facet';
import { LayerModel } from './layer';
import { RepeatModel } from './repeat';
import { UnitModel } from './unit';
export function buildModel(spec, parent, parentGivenName, unitSize, repeater, config, fit) {
    if (isFacetSpec(spec)) {
        return new FacetModel(spec, parent, parentGivenName, repeater, config);
    }
    if (isLayerSpec(spec)) {
        return new LayerModel(spec, parent, parentGivenName, unitSize, repeater, config, fit);
    }
    if (isUnitSpec(spec)) {
        return new UnitModel(spec, parent, parentGivenName, unitSize, repeater, config, fit);
    }
    if (isRepeatSpec(spec)) {
        return new RepeatModel(spec, parent, parentGivenName, repeater, config);
    }
    if (isConcatSpec(spec)) {
        return new ConcatModel(spec, parent, parentGivenName, repeater, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
//# sourceMappingURL=buildmodel.js.map