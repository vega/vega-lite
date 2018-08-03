"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buildmodel_1 = require("../src/compile/buildmodel");
var concat_1 = require("../src/compile/concat");
var facet_1 = require("../src/compile/facet");
var layer_1 = require("../src/compile/layer");
var repeat_1 = require("../src/compile/repeat");
var unit_1 = require("../src/compile/unit");
var config_1 = require("../src/config");
var spec_1 = require("../src/spec");
var spec_2 = require("../src/spec");
var toplevelprops_1 = require("../src/toplevelprops");
function parseModel(inputSpec) {
    var config = config_1.initConfig(inputSpec.config);
    var spec = spec_1.normalize(inputSpec, config);
    var autosize = toplevelprops_1.normalizeAutoSize(inputSpec.autosize, config.autosize, spec_2.isLayerSpec(spec) || spec_2.isUnitSpec(spec));
    return buildmodel_1.buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');
}
exports.parseModel = parseModel;
function parseModelWithScale(inputSpec) {
    var model = parseModel(inputSpec);
    model.parseScale();
    return model;
}
exports.parseModelWithScale = parseModelWithScale;
function parseUnitModel(spec) {
    return new unit_1.UnitModel(spec, null, '', undefined, undefined, config_1.initConfig(spec.config), toplevelprops_1.normalizeAutoSize(spec.autosize, spec.config ? spec.config.autosize : undefined, true).type === 'fit');
}
exports.parseUnitModel = parseUnitModel;
function parseUnitModelWithScale(spec) {
    var model = parseUnitModel(spec);
    model.parseScale();
    return model;
}
exports.parseUnitModelWithScale = parseUnitModelWithScale;
function parseUnitModelWithScaleAndLayoutSize(spec) {
    var model = parseUnitModelWithScale(spec);
    model.parseLayoutSize();
    return model;
}
exports.parseUnitModelWithScaleAndLayoutSize = parseUnitModelWithScaleAndLayoutSize;
function parseLayerModel(spec) {
    return new layer_1.LayerModel(spec, null, '', undefined, undefined, config_1.initConfig(spec.config), toplevelprops_1.normalizeAutoSize(spec.autosize, spec.config ? spec.config.autosize : undefined, true).type === 'fit');
}
exports.parseLayerModel = parseLayerModel;
function parseFacetModel(spec) {
    return new facet_1.FacetModel(spec, null, '', undefined, config_1.initConfig(spec.config));
}
exports.parseFacetModel = parseFacetModel;
function parseFacetModelWithScale(spec) {
    var model = parseFacetModel(spec);
    model.parseScale();
    return model;
}
exports.parseFacetModelWithScale = parseFacetModelWithScale;
function parseRepeatModel(spec) {
    return new repeat_1.RepeatModel(spec, null, '', undefined, config_1.initConfig(spec.config));
}
exports.parseRepeatModel = parseRepeatModel;
function parseConcatModel(spec) {
    return new concat_1.ConcatModel(spec, null, '', undefined, config_1.initConfig(spec.config));
}
exports.parseConcatModel = parseConcatModel;
//# sourceMappingURL=util.js.map