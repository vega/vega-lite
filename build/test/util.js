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
    var autosize = toplevelprops_1.normalizeAutoSize(inputSpec.autosize, spec_2.isLayerSpec(spec) || spec_2.isUnitSpec(spec));
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
    return new unit_1.UnitModel(spec, null, '', undefined, undefined, config_1.initConfig(spec.config), toplevelprops_1.normalizeAutoSize(spec.autosize, true).type === 'fit');
}
exports.parseUnitModel = parseUnitModel;
function parseUnitModelWithScale(spec) {
    var model = parseUnitModel(spec);
    model.parseScale();
    return model;
}
exports.parseUnitModelWithScale = parseUnitModelWithScale;
function parseUnitModelWithScaleMarkDefLayoutSize(spec) {
    var model = parseUnitModelWithScale(spec);
    model.parseMarkDef();
    model.parseLayoutSize();
    return model;
}
exports.parseUnitModelWithScaleMarkDefLayoutSize = parseUnitModelWithScaleMarkDefLayoutSize;
function parseUnitModelWithScaleAndLayoutSize(spec) {
    var model = parseUnitModelWithScale(spec);
    model.parseLayoutSize();
    return model;
}
exports.parseUnitModelWithScaleAndLayoutSize = parseUnitModelWithScaleAndLayoutSize;
function parseLayerModel(spec) {
    return new layer_1.LayerModel(spec, null, '', undefined, undefined, config_1.initConfig(spec.config), toplevelprops_1.normalizeAutoSize(spec.autosize, true).type === 'fit');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdEQUFxRDtBQUNyRCxnREFBa0Q7QUFDbEQsOENBQWdEO0FBQ2hELDhDQUFnRDtBQUVoRCxnREFBa0Q7QUFDbEQsNENBQThDO0FBQzlDLHdDQUF5QztBQUN6QyxvQ0FTcUI7QUFDckIsb0NBQW9EO0FBQ3BELHNEQUF1RDtBQUV2RCxvQkFBMkIsU0FBK0I7SUFDeEQsSUFBTSxNQUFNLEdBQUcsbUJBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsSUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsSUFBTSxRQUFRLEdBQUcsaUNBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxrQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5RixNQUFNLENBQUMsdUJBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO0FBQzNGLENBQUM7QUFMRCxnQ0FLQztBQUVELDZCQUFvQyxTQUErQjtJQUNqRSxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBSkQsa0RBSUM7QUFFRCx3QkFBK0IsSUFBd0I7SUFDckQsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGlDQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO0FBQzdJLENBQUM7QUFGRCx3Q0FFQztBQUVELGlDQUF3QyxJQUF3QjtJQUM5RCxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBSkQsMERBSUM7QUFFRCxrREFBeUQsSUFBd0I7SUFDL0UsSUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUxELDRGQUtDO0FBRUQsOENBQXFELElBQXdCO0lBQzNFLElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUpELG9GQUlDO0FBR0QseUJBQWdDLElBQXlCO0lBQ3ZELE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxtQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxpQ0FBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQztBQUM5SSxDQUFDO0FBRkQsMENBRUM7QUFFRCx5QkFBZ0MsSUFBeUI7SUFDdkQsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRkQsMENBRUM7QUFFRCxrQ0FBeUMsSUFBeUI7SUFDaEUsSUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUpELDREQUlDO0FBRUQsMEJBQWlDLElBQTBCO0lBQ3pELE1BQU0sQ0FBQyxJQUFJLG9CQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELDRDQUVDO0FBRUQsMEJBQWlDLElBQTBCO0lBQ3pELE1BQU0sQ0FBQyxJQUFJLG9CQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELDRDQUVDIn0=