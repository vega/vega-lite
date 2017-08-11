"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var spec_1 = require("../spec");
var concat_1 = require("./concat");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var repeat_1 = require("./repeat");
var unit_1 = require("./unit");
function buildModel(spec, parent, parentGivenName, unitSize, repeater, config) {
    if (spec_1.isFacetSpec(spec)) {
        return new facet_1.FacetModel(spec, parent, parentGivenName, repeater, config);
    }
    if (spec_1.isLayerSpec(spec)) {
        return new layer_1.LayerModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    if (spec_1.isUnitSpec(spec)) {
        return new unit_1.UnitModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    if (spec_1.isRepeatSpec(spec)) {
        return new repeat_1.RepeatModel(spec, parent, parentGivenName, repeater, config);
    }
    if (spec_1.isConcatSpec(spec)) {
        return new concat_1.ConcatModel(spec, parent, parentGivenName, repeater, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.buildModel = buildModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRtb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2J1aWxkbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0QkFBOEI7QUFDOUIsZ0NBQWlIO0FBQ2pILG1DQUFxQztBQUNyQyxpQ0FBbUM7QUFDbkMsaUNBQW1DO0FBRW5DLG1DQUFxQztBQUVyQywrQkFBaUM7QUFFakMsb0JBQTJCLElBQVUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDM0UsUUFBMEIsRUFBRSxRQUF1QixFQUFFLE1BQWM7SUFDbkUsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsaUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxvQkFBVyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksb0JBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBdkJELGdDQXVCQyJ9