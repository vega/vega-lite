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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdEQUFxRDtBQUNyRCxnREFBa0Q7QUFDbEQsOENBQWdEO0FBQ2hELDhDQUFnRDtBQUVoRCxnREFBa0Q7QUFDbEQsNENBQThDO0FBQzlDLHdDQUF5QztBQUN6QyxvQ0FTcUI7QUFDckIsb0NBQW9EO0FBQ3BELHNEQUF1RDtBQUV2RCxvQkFBMkIsU0FBK0I7SUFDeEQsSUFBTSxNQUFNLEdBQUcsbUJBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsSUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsSUFBTSxRQUFRLEdBQUcsaUNBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGtCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9HLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDM0YsQ0FBQztBQUxELGdDQUtDO0FBRUQsNkJBQW9DLFNBQStCO0lBQ2pFLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFKRCxrREFJQztBQUVELHdCQUErQixJQUF3QjtJQUNyRCxNQUFNLENBQUMsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsaUNBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQztBQUM3TCxDQUFDO0FBRkQsd0NBRUM7QUFFRCxpQ0FBd0MsSUFBd0I7SUFDOUQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUpELDBEQUlDO0FBRUQsOENBQXFELElBQXdCO0lBQzNFLElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUpELG9GQUlDO0FBR0QseUJBQWdDLElBQXlCO0lBQ3ZELE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxtQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxpQ0FBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO0FBQzlMLENBQUM7QUFGRCwwQ0FFQztBQUVELHlCQUFnQyxJQUF5QjtJQUN2RCxNQUFNLENBQUMsSUFBSSxrQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxtQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFGRCwwQ0FFQztBQUVELGtDQUF5QyxJQUF5QjtJQUNoRSxJQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBSkQsNERBSUM7QUFFRCwwQkFBaUMsSUFBMEI7SUFDekQsTUFBTSxDQUFDLElBQUksb0JBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRkQsNENBRUM7QUFFRCwwQkFBaUMsSUFBMEI7SUFDekQsTUFBTSxDQUFDLElBQUksb0JBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRkQsNENBRUMifQ==