import { __rest } from "tslib";
import * as log from '../log';
import { isConcatSpec, isHConcatSpec, isVConcatSpec } from './concat';
import { isFacetSpec } from './facet';
import { isLayerSpec } from './layer';
import { isRepeatSpec } from './repeat';
import { isUnitSpec } from './unit';
export class SpecMapper {
    map(spec, params) {
        if (isFacetSpec(spec)) {
            return this.mapFacet(spec, params);
        }
        else if (isRepeatSpec(spec)) {
            return this.mapRepeat(spec, params);
        }
        else if (isHConcatSpec(spec)) {
            return this.mapHConcat(spec, params);
        }
        else if (isVConcatSpec(spec)) {
            return this.mapVConcat(spec, params);
        }
        else if (isConcatSpec(spec)) {
            return this.mapConcat(spec, params);
        }
        else {
            return this.mapLayerOrUnit(spec, params);
        }
    }
    mapLayerOrUnit(spec, params) {
        if (isLayerSpec(spec)) {
            return this.mapLayer(spec, params);
        }
        else if (isUnitSpec(spec)) {
            return this.mapUnit(spec, params);
        }
        throw new Error(log.message.invalidSpec(spec));
    }
    mapLayer(spec, params) {
        return Object.assign(Object.assign({}, spec), { layer: spec.layer.map(subspec => this.mapLayerOrUnit(subspec, params)) });
    }
    mapHConcat(spec, params) {
        return Object.assign(Object.assign({}, spec), { hconcat: spec.hconcat.map(subspec => this.map(subspec, params)) });
    }
    mapVConcat(spec, params) {
        return Object.assign(Object.assign({}, spec), { vconcat: spec.vconcat.map(subspec => this.map(subspec, params)) });
    }
    mapConcat(spec, params) {
        const { concat } = spec, rest = __rest(spec, ["concat"]);
        return Object.assign(Object.assign({}, rest), { concat: concat.map(subspec => this.map(subspec, params)) });
    }
    mapFacet(spec, params) {
        return Object.assign(Object.assign({}, spec), { 
            // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
            spec: this.map(spec.spec, params) });
    }
    mapRepeat(spec, params) {
        return Object.assign(Object.assign({}, spec), { spec: this.map(spec.spec, params) });
    }
}
//# sourceMappingURL=map.js.map