"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = tslib_1.__importStar(require("../log"));
var spec_1 = require("../spec");
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var ConcatModel = /** @class */ (function (_super) {
    tslib_1.__extends(ConcatModel, _super);
    function ConcatModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, spec.resolve) || this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGtEQUE4QjtBQUM5QixnQ0FBNEQ7QUFFNUQsMkNBQTZDO0FBQzdDLDJDQUF3QztBQUN4Qyw0Q0FBeUQ7QUFJekQ7SUFBaUMsdUNBQWU7SUFPOUMscUJBQVksSUFBMEIsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBdkgsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FXckU7UUFsQmUsVUFBSSxHQUFhLFFBQVEsQ0FBQztRQVN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsRUFBRTtZQUMvRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUNoRDtRQUVELEtBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsb0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO1lBQy9FLE9BQU8sdUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSSxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDOztJQUNMLENBQUM7SUFFTSxxQ0FBZSxHQUF0QjtRQUNFLDZCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFHTSxvQ0FBYyxHQUFyQjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLG9DQUFjLEdBQXJCO1FBQ0UsNEJBQTRCO1FBQzVCLDBCQUNFLE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxFQUM5QixNQUFNLEVBQUUsRUFBRSxJQUNQLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUN2QyxNQUFNLEVBQUUsTUFBTTtZQUNkLHdFQUF3RTtZQUN4RSxLQUFLLEVBQUUsTUFBTSxJQUNiO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXpDRCxDQUFpQyw0QkFBZSxHQXlDL0M7QUF6Q1ksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtpc1ZDb25jYXRTcGVjLCBOb3JtYWxpemVkQ29uY2F0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge1ZnTGF5b3V0fSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0Jhc2VDb25jYXRNb2RlbH0gZnJvbSAnLi9iYXNlY29uY2F0JztcbmltcG9ydCB7YnVpbGRNb2RlbH0gZnJvbSAnLi9idWlsZG1vZGVsJztcbmltcG9ydCB7cGFyc2VDb25jYXRMYXlvdXRTaXplfSBmcm9tICcuL2xheW91dHNpemUvcGFyc2UnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWV9IGZyb20gJy4vcmVwZWF0ZXInO1xuXG5leHBvcnQgY2xhc3MgQ29uY2F0TW9kZWwgZXh0ZW5kcyBCYXNlQ29uY2F0TW9kZWwge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ2NvbmNhdCcgPSAnY29uY2F0JztcblxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cbiAgcHVibGljIHJlYWRvbmx5IGlzVkNvbmNhdDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBOb3JtYWxpemVkQ29uY2F0U3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHJlcGVhdGVyLCBzcGVjLnJlc29sdmUpO1xuXG4gICAgaWYgKHNwZWMucmVzb2x2ZSAmJiBzcGVjLnJlc29sdmUuYXhpcyAmJiAoc3BlYy5yZXNvbHZlLmF4aXMueCA9PT0gJ3NoYXJlZCcgfHwgc3BlYy5yZXNvbHZlLmF4aXMueSA9PT0gJ3NoYXJlZCcpKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5DT05DQVRfQ0FOTk9UX1NIQVJFX0FYSVMpO1xuICAgIH1cblxuICAgIHRoaXMuaXNWQ29uY2F0ID0gaXNWQ29uY2F0U3BlYyhzcGVjKTtcblxuICAgIHRoaXMuY2hpbGRyZW4gPSAoaXNWQ29uY2F0U3BlYyhzcGVjKSA/IHNwZWMudmNvbmNhdCA6IHNwZWMuaGNvbmNhdCkubWFwKChjaGlsZCwgaSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1aWxkTW9kZWwoY2hpbGQsIHRoaXMsIHRoaXMuZ2V0TmFtZSgnY29uY2F0XycgKyBpKSwgdW5kZWZpbmVkLCByZXBlYXRlciwgY29uZmlnLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlQ29uY2F0TGF5b3V0U2l6ZSh0aGlzKTtcbiAgfVxuXG5cbiAgcHVibGljIHBhcnNlQXhpc0dyb3VwKCk6IHZvaWQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICAvLyBUT0RPOiBhbGxvdyBjdXN0b21pemF0aW9uXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgIG9mZnNldDogMTAsXG4gICAgICAuLi4odGhpcy5pc1ZDb25jYXQgPyB7Y29sdW1uczogMX0gOiB7fSksXG4gICAgICBib3VuZHM6ICdmdWxsJyxcbiAgICAgIC8vIFVzZSBhbGlnbiBlYWNoIHNvIGl0IGNhbiB3b3JrIHdpdGggbXVsdGlwbGUgcGxvdHMgd2l0aCBkaWZmZXJlbnQgc2l6ZVxuICAgICAgYWxpZ246ICdlYWNoJ1xuICAgIH07XG4gIH1cbn1cbiJdfQ==