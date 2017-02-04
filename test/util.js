"use strict";
var common_1 = require("../src/compile/common");
var unit_1 = require("../src/compile/unit");
var facet_1 = require("../src/compile/facet");
var layer_1 = require("../src/compile/layer");
var spec_1 = require("../src/spec");
function parseModel(inputSpec) {
    var spec = spec_1.normalize(inputSpec);
    return common_1.buildModel(spec, null, '');
}
exports.parseModel = parseModel;
function parseUnitModel(spec) {
    return new unit_1.UnitModel(spec, null, '');
}
exports.parseUnitModel = parseUnitModel;
function parseLayerModel(spec) {
    return new layer_1.LayerModel(spec, null, '');
}
exports.parseLayerModel = parseLayerModel;
function parseFacetModel(spec) {
    return new facet_1.FacetModel(spec, null, '');
}
exports.parseFacetModel = parseFacetModel;
//# sourceMappingURL=util.js.map