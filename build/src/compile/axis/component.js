import * as tslib_1 from "tslib";
import { duplicate } from '../../util';
import { Split } from '../split';
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
        return new AxisComponent(duplicate(this.explicit), duplicate(this.implicit), this.mainExtracted);
    };
    AxisComponent.prototype.hasAxisPart = function (part) {
        // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.
        if (part === 'axis') {
            // always has the axis container part
            return true;
        }
        if (part === 'grid' || part === 'title') {
            return !!this.get(part);
        }
        // Other parts are enabled by default, so they should not be false or null.
        return !isFalseOrNull(this.get(part));
    };
    return AxisComponent;
}(Split));
export { AxisComponent };
//# sourceMappingURL=component.js.map