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
//# sourceMappingURL=component.js.map