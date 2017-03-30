"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../src/compile/common");
var facet_1 = require("../src/compile/facet");
var layer_1 = require("../src/compile/layer");
var unit_1 = require("../src/compile/unit");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFpRDtBQUNqRCw4Q0FBZ0Q7QUFDaEQsOENBQWdEO0FBRWhELDRDQUE4QztBQUM5QyxvQ0FBb0Y7QUFFcEYsb0JBQTJCLFNBQXVCO0lBQ2hELElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEMsTUFBTSxDQUFDLG1CQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBSEQsZ0NBR0M7QUFFRCx3QkFBK0IsSUFBYztJQUMzQyxNQUFNLENBQUMsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELHdDQUVDO0FBRUQseUJBQWdDLElBQWU7SUFDN0MsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFGRCwwQ0FFQztBQUVELHlCQUFnQyxJQUFlO0lBQzdDLE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRkQsMENBRUMifQ==