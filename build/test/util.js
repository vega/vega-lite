import { buildModel } from '../src/compile/buildmodel';
import { ConcatModel } from '../src/compile/concat';
import { FacetModel } from '../src/compile/facet';
import { LayerModel } from '../src/compile/layer';
import { RepeatModel } from '../src/compile/repeat';
import { UnitModel } from '../src/compile/unit';
import { initConfig } from '../src/config';
import { normalize } from '../src/spec';
import { isLayerSpec, isUnitSpec } from '../src/spec';
import { normalizeAutoSize } from '../src/toplevelprops';
export function parseModel(inputSpec) {
    var config = initConfig(inputSpec.config);
    var spec = normalize(inputSpec, config);
    var autosize = normalizeAutoSize(inputSpec.autosize, config.autosize, isLayerSpec(spec) || isUnitSpec(spec));
    return buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');
}
export function parseModelWithScale(inputSpec) {
    var model = parseModel(inputSpec);
    model.parseScale();
    return model;
}
export function parseUnitModel(spec) {
    return new UnitModel(spec, null, '', undefined, undefined, initConfig(spec.config), normalizeAutoSize(spec.autosize, spec.config ? spec.config.autosize : undefined, true).type === 'fit');
}
export function parseUnitModelWithScale(spec) {
    var model = parseUnitModel(spec);
    model.parseScale();
    return model;
}
export function parseUnitModelWithScaleAndLayoutSize(spec) {
    var model = parseUnitModelWithScale(spec);
    model.parseLayoutSize();
    return model;
}
export function parseLayerModel(spec) {
    return new LayerModel(spec, null, '', undefined, undefined, initConfig(spec.config), normalizeAutoSize(spec.autosize, spec.config ? spec.config.autosize : undefined, true).type === 'fit');
}
export function parseFacetModel(spec) {
    return new FacetModel(spec, null, '', undefined, initConfig(spec.config));
}
export function parseFacetModelWithScale(spec) {
    var model = parseFacetModel(spec);
    model.parseScale();
    return model;
}
export function parseRepeatModel(spec) {
    return new RepeatModel(spec, null, '', undefined, initConfig(spec.config));
}
export function parseConcatModel(spec) {
    return new ConcatModel(spec, null, '', undefined, initConfig(spec.config));
}
//# sourceMappingURL=util.js.map