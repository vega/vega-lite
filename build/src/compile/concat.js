"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var spec_1 = require("../spec");
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var ConcatModel = /** @class */ (function (_super) {
    __extends(ConcatModel, _super);
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
        return __assign({ padding: { row: 10, column: 10 }, offset: 10 }, (this.isVConcat ? { columns: 1 } : {}), { bounds: 'full', 
            // Use align each so it can work with multiple plots with different size
            align: 'each' });
    };
    return ConcatModel;
}(baseconcat_1.BaseConcatModel));
exports.ConcatModel = ConcatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNEJBQThCO0FBQzlCLGdDQUFrRDtBQUVsRCwyQ0FBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDRDQUF5RDtBQUl6RDtJQUFpQywrQkFBZTtJQU85QyxxQkFBWSxJQUFnQixFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUE3RyxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBVzNEO1FBbEJlLFVBQUksR0FBYSxRQUFRLENBQUM7UUFTeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoSCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsS0FBSSxDQUFDLFNBQVMsR0FBRyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDL0UsTUFBTSxDQUFDLHVCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRU0scUNBQWUsR0FBdEI7UUFDRSw2QkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBR00sb0NBQWMsR0FBckI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLG9DQUFjLEdBQXJCO1FBQ0UsNEJBQTRCO1FBQzVCLE1BQU0sWUFDSixPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUMsRUFDOUIsTUFBTSxFQUFFLEVBQUUsSUFDUCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDdkMsTUFBTSxFQUFFLE1BQU07WUFDZCx3RUFBd0U7WUFDeEUsS0FBSyxFQUFFLE1BQU0sSUFDYjtJQUNKLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUF6Q0QsQ0FBaUMsNEJBQWUsR0F5Qy9DO0FBekNZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7Q29uY2F0U3BlYywgaXNWQ29uY2F0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge1ZnTGF5b3V0fSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0Jhc2VDb25jYXRNb2RlbH0gZnJvbSAnLi9iYXNlY29uY2F0JztcbmltcG9ydCB7YnVpbGRNb2RlbH0gZnJvbSAnLi9idWlsZG1vZGVsJztcbmltcG9ydCB7cGFyc2VDb25jYXRMYXlvdXRTaXplfSBmcm9tICcuL2xheW91dHNpemUvcGFyc2UnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWV9IGZyb20gJy4vcmVwZWF0ZXInO1xuXG5leHBvcnQgY2xhc3MgQ29uY2F0TW9kZWwgZXh0ZW5kcyBCYXNlQ29uY2F0TW9kZWwge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ2NvbmNhdCcgPSAnY29uY2F0JztcblxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cbiAgcHVibGljIHJlYWRvbmx5IGlzVkNvbmNhdDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBDb25jYXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZywgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgc3BlYy5yZXNvbHZlKTtcblxuICAgIGlmIChzcGVjLnJlc29sdmUgJiYgc3BlYy5yZXNvbHZlLmF4aXMgJiYgKHNwZWMucmVzb2x2ZS5heGlzLnggPT09ICdzaGFyZWQnIHx8IHNwZWMucmVzb2x2ZS5heGlzLnkgPT09ICdzaGFyZWQnKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuQ09OQ0FUX0NBTk5PVF9TSEFSRV9BWElTKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzVkNvbmNhdCA9IGlzVkNvbmNhdFNwZWMoc3BlYyk7XG5cbiAgICB0aGlzLmNoaWxkcmVuID0gKGlzVkNvbmNhdFNwZWMoc3BlYykgPyBzcGVjLnZjb25jYXQgOiBzcGVjLmhjb25jYXQpLm1hcCgoY2hpbGQsIGkpID0+IHtcbiAgICAgIHJldHVybiBidWlsZE1vZGVsKGNoaWxkLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2NvbmNhdF8nICsgaSksIHVuZGVmaW5lZCwgcmVwZWF0ZXIsIGNvbmZpZywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZUNvbmNhdExheW91dFNpemUodGhpcyk7XG4gIH1cblxuXG4gIHB1YmxpYyBwYXJzZUF4aXNHcm91cCgpOiB2b2lkIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dCB7XG4gICAgLy8gVE9ETzogYWxsb3cgY3VzdG9taXphdGlvblxuICAgIHJldHVybiB7XG4gICAgICBwYWRkaW5nOiB7cm93OiAxMCwgY29sdW1uOiAxMH0sXG4gICAgICBvZmZzZXQ6IDEwLFxuICAgICAgLi4uKHRoaXMuaXNWQ29uY2F0ID8ge2NvbHVtbnM6IDF9IDoge30pLFxuICAgICAgYm91bmRzOiAnZnVsbCcsXG4gICAgICAvLyBVc2UgYWxpZ24gZWFjaCBzbyBpdCBjYW4gd29yayB3aXRoIG11bHRpcGxlIHBsb3RzIHdpdGggZGlmZmVyZW50IHNpemVcbiAgICAgIGFsaWduOiAnZWFjaCdcbiAgICB9O1xuICB9XG59XG4iXX0=