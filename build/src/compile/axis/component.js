"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var split_1 = require("../split");
function isFalseOrNull(v) {
    return v === false || v === null;
}
var AxisComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AxisComponent, _super);
    function AxisComponent(explicit, implicit, mainExtracted) {
        if (explicit === void 0) { explicit = {}; }
        if (implicit === void 0) { implicit = {}; }
        if (mainExtracted === void 0) { mainExtracted = false; }
        var _this = _super.call(this) || this;
        _this.explicit = explicit;
        _this.implicit = implicit;
        _this.mainExtracted = mainExtracted;
        return _this;
    }
    AxisComponent.prototype.clone = function () {
        return new AxisComponent(util_1.duplicate(this.explicit), util_1.duplicate(this.implicit), this.mainExtracted);
    };
    AxisComponent.prototype.hasAxisPart = function (part) {
        // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.
        if (part === 'axis') { // always has the axis container part
            return true;
        }
        if (part === 'grid' || part === 'title') {
            return !!this.get(part);
        }
        // Other parts are enabled by default, so they should not be false or null.
        return !isFalseOrNull(this.get(part));
    };
    return AxisComponent;
}(split_1.Split));
exports.AxisComponent = AxisComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbUNBQTJDO0FBRTNDLGtDQUErQjtBQUcvQix1QkFBdUIsQ0FBaUI7SUFDdEMsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUM7QUFDbkMsQ0FBQztBQU9EO0lBQW1DLHlDQUF5QjtJQUMxRCx1QkFDa0IsUUFBMEMsRUFDMUMsUUFBMEMsRUFDbkQsYUFBcUI7UUFGWix5QkFBQSxFQUFBLGFBQTBDO1FBQzFDLHlCQUFBLEVBQUEsYUFBMEM7UUFDbkQsOEJBQUEsRUFBQSxxQkFBcUI7UUFIOUIsWUFLRSxpQkFBTyxTQUNSO1FBTGlCLGNBQVEsR0FBUixRQUFRLENBQWtDO1FBQzFDLGNBQVEsR0FBUixRQUFRLENBQWtDO1FBQ25ELG1CQUFhLEdBQWIsYUFBYSxDQUFROztJQUc5QixDQUFDO0lBRU0sNkJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxhQUFhLENBQ3RCLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUN4QixnQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUM3QyxDQUFDO0lBQ0osQ0FBQztJQUVNLG1DQUFXLEdBQWxCLFVBQW1CLElBQWM7UUFDL0IsMkdBQTJHO1FBRTNHLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRSxFQUFFLHFDQUFxQztZQUMxRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDdkMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QjtRQUNELDJFQUEyRTtRQUMzRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBN0JELENBQW1DLGFBQUssR0E2QnZDO0FBN0JZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBeGlzLCBBeGlzUGFydH0gZnJvbSAnLi4vLi4vYXhpcyc7XG5pbXBvcnQge0ZpZWxkRGVmQmFzZX0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtkdXBsaWNhdGUsIE9taXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0F4aXN9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7U3BsaXR9IGZyb20gJy4uL3NwbGl0JztcblxuXG5mdW5jdGlvbiBpc0ZhbHNlT3JOdWxsKHY6IGJvb2xlYW4gfCBudWxsKSB7XG4gIHJldHVybiB2ID09PSBmYWxzZSB8fCB2ID09PSBudWxsO1xufVxuXG5leHBvcnQgdHlwZSBBeGlzQ29tcG9uZW50UHJvcHMgPSBPbWl0PFZnQXhpcywgJ3RpdGxlJz4gJiB7XG5cbiAgdGl0bGU6IHN0cmluZyB8IEZpZWxkRGVmQmFzZTxzdHJpbmc+W107XG59O1xuXG5leHBvcnQgY2xhc3MgQXhpc0NvbXBvbmVudCBleHRlbmRzIFNwbGl0PEF4aXNDb21wb25lbnRQcm9wcz4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgZXhwbGljaXQ6IFBhcnRpYWw8QXhpc0NvbXBvbmVudFByb3BzPiA9IHt9LFxuICAgIHB1YmxpYyByZWFkb25seSBpbXBsaWNpdDogUGFydGlhbDxBeGlzQ29tcG9uZW50UHJvcHM+ID0ge30sXG4gICAgcHVibGljIG1haW5FeHRyYWN0ZWQgPSBmYWxzZVxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQXhpc0NvbXBvbmVudChcbiAgICAgIGR1cGxpY2F0ZSh0aGlzLmV4cGxpY2l0KSxcbiAgICAgIGR1cGxpY2F0ZSh0aGlzLmltcGxpY2l0KSwgdGhpcy5tYWluRXh0cmFjdGVkXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNBeGlzUGFydChwYXJ0OiBBeGlzUGFydCkge1xuICAgIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjU1MikgdGhpcyBtZXRob2QgY2FuIGJlIHdyb25nIGlmIHVzZXJzIHVzZSBhIFZlZ2EgdGhlbWUuXG5cbiAgICBpZiAocGFydCA9PT0gJ2F4aXMnKSB7IC8vIGFsd2F5cyBoYXMgdGhlIGF4aXMgY29udGFpbmVyIHBhcnRcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwYXJ0ID09PSAnZ3JpZCcgfHwgcGFydCA9PT0gJ3RpdGxlJykge1xuICAgICAgcmV0dXJuICEhdGhpcy5nZXQocGFydCk7XG4gICAgfVxuICAgIC8vIE90aGVyIHBhcnRzIGFyZSBlbmFibGVkIGJ5IGRlZmF1bHQsIHNvIHRoZXkgc2hvdWxkIG5vdCBiZSBmYWxzZSBvciBudWxsLlxuICAgIHJldHVybiAhaXNGYWxzZU9yTnVsbCh0aGlzLmdldChwYXJ0KSk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBeGlzQ29tcG9uZW50SW5kZXgge1xuICB4PzogQXhpc0NvbXBvbmVudFtdO1xuICB5PzogQXhpc0NvbXBvbmVudFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF4aXNJbmRleCB7XG4gIHg/OiBBeGlzO1xuICB5PzogQXhpcztcbn1cbiJdfQ==