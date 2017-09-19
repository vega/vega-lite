"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var spec_1 = require("../spec");
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var ConcatModel = /** @class */ (function (_super) {
    tslib_1.__extends(ConcatModel, _super);
    function ConcatModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.type = 'concat';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGdDQUFrRDtBQUVsRCwyQ0FBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDRDQUF5RDtBQUl6RDtJQUFpQyx1Q0FBZTtJQU85QyxxQkFBWSxJQUFnQixFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUE3RyxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBTzNEO1FBZGUsVUFBSSxHQUFhLFFBQVEsQ0FBQztRQVN4QyxLQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckMsS0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLG9CQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDL0UsTUFBTSxDQUFDLHVCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRU0scUNBQWUsR0FBdEI7UUFDRSw2QkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBR00sb0NBQWMsR0FBckI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLG9DQUFjLEdBQXJCO1FBQ0UsNEJBQTRCO1FBQzVCLE1BQU0sb0JBQ0osT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDLEVBQzlCLE1BQU0sRUFBRSxFQUFFLElBQ1AsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUN2QyxNQUFNLEVBQUUsTUFBTTtZQUNkLHdFQUF3RTtZQUN4RSxLQUFLLEVBQUUsTUFBTSxJQUNiO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXJDRCxDQUFpQyw0QkFBZSxHQXFDL0M7QUFyQ1ksa0NBQVcifQ==