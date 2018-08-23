import * as tslib_1 from "tslib";
import { vgField } from '../../fielddef';
import { fieldExpr } from '../../timeunit';
import { duplicate, hash, keys, vals } from '../../util';
import { TransformNode } from './dataflow';
var TimeUnitNode = /** @class */ (function (_super) {
    tslib_1.__extends(TimeUnitNode, _super);
    function TimeUnitNode(parent, formula) {
        var _this = _super.call(this, parent) || this;
        _this.formula = formula;
        return _this;
    }
    TimeUnitNode.prototype.clone = function () {
        return new TimeUnitNode(null, duplicate(this.formula));
    };
    TimeUnitNode.makeFromEncoding = function (parent, model) {
        var formula = model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
            if (fieldDef.timeUnit) {
                var f = vgField(fieldDef, { forAs: true });
                timeUnitComponent[f] = {
                    as: f,
                    timeUnit: fieldDef.timeUnit,
                    field: fieldDef.field
                };
            }
            return timeUnitComponent;
        }, {});
        if (keys(formula).length === 0) {
            return null;
        }
        return new TimeUnitNode(parent, formula);
    };
    TimeUnitNode.makeFromTransform = function (parent, t) {
        var _a;
        return new TimeUnitNode(parent, (_a = {},
            _a[t.field] = {
                as: t.as,
                timeUnit: t.timeUnit,
                field: t.field
            },
            _a));
    };
    TimeUnitNode.prototype.merge = function (other) {
        this.formula = tslib_1.__assign({}, this.formula, other.formula);
        other.remove();
    };
    TimeUnitNode.prototype.producedFields = function () {
        var out = {};
        vals(this.formula).forEach(function (f) {
            out[f.as] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.dependentFields = function () {
        var out = {};
        vals(this.formula).forEach(function (f) {
            out[f.field] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.hash = function () {
        return "TimeUnit " + hash(this.formula);
    };
    TimeUnitNode.prototype.assemble = function () {
        return vals(this.formula).map(function (c) {
            return {
                type: 'formula',
                as: c.as,
                expr: fieldExpr(c.timeUnit, c.field)
            };
        });
    };
    return TimeUnitNode;
}(TransformNode));
export { TimeUnitNode };
//# sourceMappingURL=timeunit.js.map