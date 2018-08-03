"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var split_1 = require("../split");
var ScaleComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ScaleComponent, _super);
    function ScaleComponent(name, typeWithExplicit) {
        var _this = _super.call(this, {}, // no initial explicit property
        { name: name } // name as initial implicit property
        ) || this;
        _this.merged = false;
        _this.domains = [];
        _this.setWithExplicit('type', typeWithExplicit);
        return _this;
    }
    return ScaleComponent;
}(split_1.Split));
exports.ScaleComponent = ScaleComponent;
//# sourceMappingURL=component.js.map