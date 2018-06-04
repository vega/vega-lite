"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var selection_1 = require("../../selection");
var dataflow_1 = require("./dataflow");
var IdentifierNode = /** @class */ (function (_super) {
    tslib_1.__extends(IdentifierNode, _super);
    function IdentifierNode(parent) {
        return _super.call(this, parent) || this;
    }
    IdentifierNode.prototype.clone = function () {
        return new IdentifierNode(null);
    };
    IdentifierNode.prototype.producedFields = function () {
        var _a;
        return _a = {}, _a[selection_1.SELECTION_ID] = true, _a;
    };
    IdentifierNode.prototype.assemble = function () {
        return { type: 'identifier', as: selection_1.SELECTION_ID };
    };
    return IdentifierNode;
}(dataflow_1.DataFlowNode));
exports.IdentifierNode = IdentifierNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2luZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUE2QztBQUc3Qyx1Q0FBd0M7QUFFeEM7SUFBb0MsMENBQVk7SUFLOUMsd0JBQVksTUFBb0I7ZUFDOUIsa0JBQU0sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQU5NLDhCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFNTSx1Q0FBYyxHQUFyQjs7UUFDRSxnQkFBUSxHQUFDLHdCQUFZLElBQUcsSUFBSSxLQUFFO0lBQ2hDLENBQUM7SUFFTSxpQ0FBUSxHQUFmO1FBQ0UsT0FBTyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLHdCQUFZLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBaEJELENBQW9DLHVCQUFZLEdBZ0IvQztBQWhCWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U0VMRUNUSU9OX0lEfSBmcm9tICcuLi8uLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0lkZW50aWZpZXJUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZXhwb3J0IGNsYXNzIElkZW50aWZpZXJOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgSWRlbnRpZmllck5vZGUobnVsbCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4ge1tTRUxFQ1RJT05fSURdOiB0cnVlfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0lkZW50aWZpZXJUcmFuc2Zvcm0ge1xuICAgIHJldHVybiB7dHlwZTogJ2lkZW50aWZpZXInLCBhczogU0VMRUNUSU9OX0lEfTtcbiAgfVxufVxuIl19