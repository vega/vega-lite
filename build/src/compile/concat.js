"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = require("../log");
var spec_1 = require("../spec");
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var ConcatModel = /** @class */ (function (_super) {
    tslib_1.__extends(ConcatModel, _super);
    function ConcatModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.type = 'concat';
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.CONCAT_CANNOT_SHARE_AXIS);
        }
        _this.isVConcat = spec_1.isVConcatSpec(spec);
        _this.children = (spec_1.isVConcatSpec(spec) ? spec.vconcat : spec.hconcat).map(function (child, i) {
            return buildmodel_1.buildModel(child, _this, _this.getName('concat_' + i), undefined, repeater, config, false);
        });
        return _this;
    }
    ConcatModel.prototype.parseLayoutSize = function () {
        parse_1.parseConcatLayoutSize(this);
    };
    ConcatModel.prototype.parseAxisGroup = function () {
        return null;
    };
    ConcatModel.prototype.assembleLayout = function () {
        // TODO: allow customization
        return tslib_1.__assign({ padding: { row: 10, column: 10 }, offset: 10 }, (this.isVConcat ? { columns: 1 } : {}), { bounds: 'full', 
            // Use align each so it can work with multiple plots with different size
            align: 'each' });
    };
    return ConcatModel;
}(baseconcat_1.BaseConcatModel));
exports.ConcatModel = ConcatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRCQUE4QjtBQUM5QixnQ0FBa0Q7QUFFbEQsMkNBQTZDO0FBQzdDLDJDQUF3QztBQUN4Qyw0Q0FBeUQ7QUFJekQ7SUFBaUMsdUNBQWU7SUFPOUMscUJBQVksSUFBZ0IsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBN0csWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQVczRDtRQWxCZSxVQUFJLEdBQWEsUUFBUSxDQUFDO1FBU3hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEgsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDakQsQ0FBQztRQUVELEtBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsb0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO1lBQy9FLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEtBQUssRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEcsQ0FBQyxDQUFDLENBQUM7O0lBQ0wsQ0FBQztJQUVNLHFDQUFlLEdBQXRCO1FBQ0UsNkJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUdNLG9DQUFjLEdBQXJCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxvQ0FBYyxHQUFyQjtRQUNFLDRCQUE0QjtRQUM1QixNQUFNLG9CQUNKLE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxFQUM5QixNQUFNLEVBQUUsRUFBRSxJQUNQLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUN2QyxNQUFNLEVBQUUsTUFBTTtZQUNkLHdFQUF3RTtZQUN4RSxLQUFLLEVBQUUsTUFBTSxJQUNiO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXpDRCxDQUFpQyw0QkFBZSxHQXlDL0M7QUF6Q1ksa0NBQVcifQ==