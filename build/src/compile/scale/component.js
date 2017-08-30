"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var split_1 = require("../split");
var ScaleComponent = (function (_super) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLGtDQUF5QztBQVN6QztJQUFvQywwQ0FBMEI7SUFLNUQsd0JBQVksSUFBWSxFQUFFLGdCQUFxQztRQUEvRCxZQUNFLGtCQUNFLEVBQUUsRUFBTSwrQkFBK0I7UUFDdkMsRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFFLG9DQUFvQztTQUM3QyxTQUVGO1FBVk0sWUFBTSxHQUFHLEtBQUssQ0FBQztRQUVmLGFBQU8sR0FBdUIsRUFBRSxDQUFDO1FBT3RDLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7O0lBQ2pELENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFaRCxDQUFvQyxhQUFLLEdBWXhDO0FBWlksd0NBQWMifQ==