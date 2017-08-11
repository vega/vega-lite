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
function parseModel(inputSpec) {
    var config = config_1.initConfig(inputSpec.config);
    var spec = spec_1.normalize(inputSpec, config);
    return buildmodel_1.buildModel(spec, null, '', undefined, undefined, config);
}
exports.parseModel = parseModel;
function parseModelWithScale(inputSpec) {
    var model = parseModel(inputSpec);
    model.parseScale();
    return model;
}
exports.parseModelWithScale = parseModelWithScale;
function parseUnitModel(spec) {
    return new unit_1.UnitModel(spec, null, '', undefined, undefined, config_1.initConfig(spec.config));
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
    return new layer_1.LayerModel(spec, null, '', undefined, undefined, config_1.initConfig(spec.config));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdEQUFxRDtBQUNyRCxnREFBa0Q7QUFDbEQsOENBQWdEO0FBQ2hELDhDQUFnRDtBQUVoRCxnREFBa0Q7QUFDbEQsNENBQThDO0FBRTlDLHdDQUF5QztBQUN6QyxvQ0FBOEg7QUFFOUgsb0JBQTJCLFNBQStCO0lBQ3hELElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUpELGdDQUlDO0FBRUQsNkJBQW9DLFNBQStCO0lBQ2pFLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFKRCxrREFJQztBQUVELHdCQUErQixJQUF3QjtJQUNyRCxNQUFNLENBQUMsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsd0NBRUM7QUFFRCxpQ0FBd0MsSUFBd0I7SUFDOUQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUpELDBEQUlDO0FBRUQsa0RBQXlELElBQXdCO0lBQy9FLElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFMRCw0RkFLQztBQUVELDhDQUFxRCxJQUF3QjtJQUMzRSxJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFKRCxvRkFJQztBQUdELHlCQUFnQyxJQUF5QjtJQUN2RCxNQUFNLENBQUMsSUFBSSxrQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRkQsMENBRUM7QUFFRCx5QkFBZ0MsSUFBeUI7SUFDdkQsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRkQsMENBRUM7QUFFRCxrQ0FBeUMsSUFBeUI7SUFDaEUsSUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUpELDREQUlDO0FBRUQsMEJBQWlDLElBQTBCO0lBQ3pELE1BQU0sQ0FBQyxJQUFJLG9CQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELDRDQUVDO0FBRUQsMEJBQWlDLElBQTBCO0lBQ3pELE1BQU0sQ0FBQyxJQUFJLG9CQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELDRDQUVDIn0=