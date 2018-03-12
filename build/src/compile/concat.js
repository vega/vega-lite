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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNEJBQThCO0FBQzlCLGdDQUE0RDtBQUU1RCwyQ0FBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDRDQUF5RDtBQUl6RDtJQUFpQywrQkFBZTtJQU85QyxxQkFBWSxJQUEwQixFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUF2SCxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBVzNEO1FBbEJlLFVBQUksR0FBYSxRQUFRLENBQUM7UUFTeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoSCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsS0FBSSxDQUFDLFNBQVMsR0FBRyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDL0UsTUFBTSxDQUFDLHVCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRU0scUNBQWUsR0FBdEI7UUFDRSw2QkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBR00sb0NBQWMsR0FBckI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLG9DQUFjLEdBQXJCO1FBQ0UsNEJBQTRCO1FBQzVCLE1BQU0sWUFDSixPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUMsRUFDOUIsTUFBTSxFQUFFLEVBQUUsSUFDUCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDdkMsTUFBTSxFQUFFLE1BQU07WUFDZCx3RUFBd0U7WUFDeEUsS0FBSyxFQUFFLE1BQU0sSUFDYjtJQUNKLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUF6Q0QsQ0FBaUMsNEJBQWUsR0F5Qy9DO0FBekNZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNWQ29uY2F0U3BlYywgTm9ybWFsaXplZENvbmNhdFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtWZ0xheW91dH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtCYXNlQ29uY2F0TW9kZWx9IGZyb20gJy4vYmFzZWNvbmNhdCc7XG5pbXBvcnQge2J1aWxkTW9kZWx9IGZyb20gJy4vYnVpbGRtb2RlbCc7XG5pbXBvcnQge3BhcnNlQ29uY2F0TGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlfSBmcm9tICcuL3JlcGVhdGVyJztcblxuZXhwb3J0IGNsYXNzIENvbmNhdE1vZGVsIGV4dGVuZHMgQmFzZUNvbmNhdE1vZGVsIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6ICdjb25jYXQnID0gJ2NvbmNhdCc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNoaWxkcmVuOiBNb2RlbFtdO1xuXG4gIHB1YmxpYyByZWFkb25seSBpc1ZDb25jYXQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogTm9ybWFsaXplZENvbmNhdFNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzcGVjLCBwYXJlbnQsIHBhcmVudEdpdmVuTmFtZSwgY29uZmlnLCBzcGVjLnJlc29sdmUpO1xuXG4gICAgaWYgKHNwZWMucmVzb2x2ZSAmJiBzcGVjLnJlc29sdmUuYXhpcyAmJiAoc3BlYy5yZXNvbHZlLmF4aXMueCA9PT0gJ3NoYXJlZCcgfHwgc3BlYy5yZXNvbHZlLmF4aXMueSA9PT0gJ3NoYXJlZCcpKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5DT05DQVRfQ0FOTk9UX1NIQVJFX0FYSVMpO1xuICAgIH1cblxuICAgIHRoaXMuaXNWQ29uY2F0ID0gaXNWQ29uY2F0U3BlYyhzcGVjKTtcblxuICAgIHRoaXMuY2hpbGRyZW4gPSAoaXNWQ29uY2F0U3BlYyhzcGVjKSA/IHNwZWMudmNvbmNhdCA6IHNwZWMuaGNvbmNhdCkubWFwKChjaGlsZCwgaSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1aWxkTW9kZWwoY2hpbGQsIHRoaXMsIHRoaXMuZ2V0TmFtZSgnY29uY2F0XycgKyBpKSwgdW5kZWZpbmVkLCByZXBlYXRlciwgY29uZmlnLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlQ29uY2F0TGF5b3V0U2l6ZSh0aGlzKTtcbiAgfVxuXG5cbiAgcHVibGljIHBhcnNlQXhpc0dyb3VwKCk6IHZvaWQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICAvLyBUT0RPOiBhbGxvdyBjdXN0b21pemF0aW9uXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgIG9mZnNldDogMTAsXG4gICAgICAuLi4odGhpcy5pc1ZDb25jYXQgPyB7Y29sdW1uczogMX0gOiB7fSksXG4gICAgICBib3VuZHM6ICdmdWxsJyxcbiAgICAgIC8vIFVzZSBhbGlnbiBlYWNoIHNvIGl0IGNhbiB3b3JrIHdpdGggbXVsdGlwbGUgcGxvdHMgd2l0aCBkaWZmZXJlbnQgc2l6ZVxuICAgICAgYWxpZ246ICdlYWNoJ1xuICAgIH07XG4gIH1cbn1cbiJdfQ==