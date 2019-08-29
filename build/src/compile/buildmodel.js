import * as log from '../log';
import { isAnyConcatSpec, isFacetSpec, isLayerSpec, isRepeatSpec, isUnitSpec } from '../spec';
import { ConcatModel } from './concat';
import { FacetModel } from './facet';
import { LayerModel } from './layer';
import { RepeatModel } from './repeat';
import { UnitModel } from './unit';
export function buildModel(spec, parent, parentGivenName, unitSize, repeater, config) {
    if (isFacetSpec(spec)) {
        return new FacetModel(spec, parent, parentGivenName, repeater, config);
    }
    else if (isLayerSpec(spec)) {
        return new LayerModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    else if (isUnitSpec(spec)) {
        return new UnitModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    else if (isRepeatSpec(spec)) {
        return new RepeatModel(spec, parent, parentGivenName, repeater, config);
    }
    else if (isAnyConcatSpec(spec)) {
        return new ConcatModel(spec, parent, parentGivenName, repeater, config);
    }
    throw new Error(log.message.invalidSpec(spec));
}
//# sourceMappingURL=buildmodel.js.map