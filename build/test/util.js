"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../src/compile/common");
var facet_1 = require("../src/compile/facet");
var layer_1 = require("../src/compile/layer");
var unit_1 = require("../src/compile/unit");
var config_1 = require("../src/config");
var spec_1 = require("../src/spec");
function parseModel(inputSpec) {
    var spec = spec_1.normalize(inputSpec);
    return common_1.buildModel(spec, null, '', config_1.initConfig(inputSpec.config));
}
exports.parseModel = parseModel;
function parseUnitModel(spec) {
    return new unit_1.UnitModel(spec, null, '', config_1.initConfig(spec.config));
}
exports.parseUnitModel = parseUnitModel;
function parseLayerModel(spec) {
    return new layer_1.LayerModel(spec, null, '', config_1.initConfig(spec.config));
}
exports.parseLayerModel = parseLayerModel;
function parseFacetModel(spec) {
    return new facet_1.FacetModel(spec, null, '', config_1.initConfig(spec.config));
}
exports.parseFacetModel = parseFacetModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFpRDtBQUNqRCw4Q0FBZ0Q7QUFDaEQsOENBQWdEO0FBRWhELDRDQUE4QztBQUM5Qyx3Q0FBeUM7QUFDekMsb0NBQThGO0FBRTlGLG9CQUEyQixTQUFpQztJQUMxRCxJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sQ0FBQyxtQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLG1CQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUhELGdDQUdDO0FBRUQsd0JBQStCLElBQXdCO0lBQ3JELE1BQU0sQ0FBQyxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRkQsd0NBRUM7QUFFRCx5QkFBZ0MsSUFBeUI7SUFDdkQsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxtQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFGRCwwQ0FFQztBQUVELHlCQUFnQyxJQUF5QjtJQUN2RCxNQUFNLENBQUMsSUFBSSxrQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUZELDBDQUVDIn0=