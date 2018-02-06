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
var aggregate_1 = require("../../aggregate");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var logical_1 = require("../../logical");
var predicate_1 = require("../../predicate");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var model_1 = require("../model");
var dataflow_1 = require("./dataflow");
function parseExpression(field, parse) {
    var f = "datum" + util_1.accessPath(field);
    if (parse === 'number') {
        return "toNumber(" + f + ")";
    }
    else if (parse === 'boolean') {
        return "toBoolean(" + f + ")";
    }
    else if (parse === 'string') {
        return "toString(" + f + ")";
    }
    else if (parse === 'date') {
        return "toDate(" + f + ")";
    }
    else if (parse.indexOf('date:') === 0) {
        var specifier = parse.slice(5, parse.length);
        return "timeParse(" + f + "," + specifier + ")";
    }
    else if (parse.indexOf('utc:') === 0) {
        var specifier = parse.slice(4, parse.length);
        return "utcParse(" + f + "," + specifier + ")";
    }
    else {
        log.warn(log.message.unrecognizedParse(parse));
        return null;
    }
}
var ParseNode = /** @class */ (function (_super) {
    __extends(ParseNode, _super);
    function ParseNode(parse) {
        var _this = _super.call(this) || this;
        _this._parse = {};
        _this._parse = parse;
        return _this;
    }
    ParseNode.prototype.clone = function () {
        return new ParseNode(util_1.duplicate(this.parse));
    };
    ParseNode.make = function (model) {
        var parse = {};
        var calcFieldMap = {};
        (model.transforms || []).forEach(function (transform) {
            if (transform_1.isCalculate(transform)) {
                calcFieldMap[transform.as] = true;
            }
            else if (transform_1.isFilter(transform)) {
                logical_1.forEachLeave(transform.filter, function (filter) {
                    if (predicate_1.isFieldPredicate(filter)) {
                        if (filter.timeUnit) {
                            parse[filter.field] = 'date';
                        }
                    }
                });
            }
        }, {});
        if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
            // Parse encoded fields
            model.forEachFieldDef(function (fieldDef) {
                if (fielddef_1.isTimeFieldDef(fieldDef)) {
                    parse[fieldDef.field] = 'date';
                }
                else if (fielddef_1.isNumberFieldDef(fieldDef)) {
                    if (calcFieldMap[fieldDef.field] || aggregate_1.isCountingAggregateOp(fieldDef.aggregate)) {
                        return;
                    }
                    parse[fieldDef.field] = 'number';
                }
            });
        }
        // Custom parse should override inferred parse
        var data = model.data;
        if (data && data.format && data.format.parse) {
            var p_1 = data.format.parse;
            util_1.keys(p_1).forEach(function (field) {
                parse[field] = p_1[field];
            });
        }
        // We should not parse what has already been parsed in a parent
        var modelParse = model.component.data.ancestorParse;
        util_1.keys(modelParse).forEach(function (field) {
            if (parse[field] !== modelParse[field]) {
                log.warn(log.message.differentParse(field, parse[field], modelParse[field]));
            }
            else {
                delete parse[field];
            }
        });
        if (util_1.keys(parse).length === 0) {
            return null;
        }
        return new ParseNode(parse);
    };
    Object.defineProperty(ParseNode.prototype, "parse", {
        get: function () {
            return this._parse;
        },
        enumerable: true,
        configurable: true
    });
    ParseNode.prototype.merge = function (other) {
        this._parse = __assign({}, this._parse, other.parse);
        other.remove();
    };
    ParseNode.prototype.assembleFormatParse = function () {
        return this._parse;
    };
    // format parse depends and produces all fields in its parse
    ParseNode.prototype.producedFields = function () {
        return util_1.toSet(util_1.keys(this.parse));
    };
    ParseNode.prototype.dependentFields = function () {
        return util_1.toSet(util_1.keys(this.parse));
    };
    ParseNode.prototype.assembleTransforms = function () {
        var _this = this;
        return util_1.keys(this._parse).map(function (field) {
            var expr = parseExpression(field, _this._parse[field]);
            if (!expr) {
                return null;
            }
            var formula = {
                type: 'formula',
                expr: expr,
                as: field
            };
            return formula;
        }).filter(function (t) { return t !== null; });
    };
    return ParseNode;
}(dataflow_1.DataFlowNode));
exports.ParseNode = ParseNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXNEO0FBQ3RELDJDQUFnRTtBQUNoRSwrQkFBaUM7QUFDakMseUNBQTJDO0FBQzNDLDZDQUFpRDtBQUNqRCw2Q0FBaUU7QUFDakUsbUNBQStFO0FBRS9FLGtDQUEwRDtBQUMxRCx1Q0FBd0M7QUFHeEMseUJBQXlCLEtBQWEsRUFBRSxLQUFhO0lBQ25ELElBQU0sQ0FBQyxHQUFHLFVBQVEsaUJBQVUsQ0FBQyxLQUFLLENBQUcsQ0FBQztJQUN0QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsY0FBWSxDQUFDLE1BQUcsQ0FBQztJQUMxQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxlQUFhLENBQUMsTUFBRyxDQUFDO0lBQzNCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLGNBQVksQ0FBQyxNQUFHLENBQUM7SUFDMUIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsWUFBVSxDQUFDLE1BQUcsQ0FBQztJQUN4QixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMs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QUUsRUFBRSxLQUFLO2FBQ1YsQ0FBQztZQUNGLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBM0dELENBQStCLHVCQUFZLEdBMkcxQztBQTNHWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtpc051bWJlckZpZWxkRGVmLCBpc1RpbWVGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2ZvckVhY2hMZWF2ZX0gZnJvbSAnLi4vLi4vbG9naWNhbCc7XG5pbXBvcnQge2lzRmllbGRQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2lzQ2FsY3VsYXRlLCBpc0ZpbHRlciwgVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHthY2Nlc3NQYXRoLCBEaWN0LCBkdXBsaWNhdGUsIGtleXMsIFN0cmluZ1NldCwgdG9TZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0Zvcm11bGFUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5mdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgcGFyc2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGYgPSBgZGF0dW0ke2FjY2Vzc1BhdGgoZmllbGQpfWA7XG4gIGlmIChwYXJzZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gYHRvTnVtYmVyKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGB0b0Jvb2xlYW4oJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBgdG9TdHJpbmcoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnZGF0ZScpIHtcbiAgICByZXR1cm4gYHRvRGF0ZSgke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZignZGF0ZTonKSA9PT0gMCkge1xuICAgIGNvbnN0IHNwZWNpZmllciA9IHBhcnNlLnNsaWNlKDUsIHBhcnNlLmxlbmd0aCk7XG4gICAgcmV0dXJuIGB0aW1lUGFyc2UoJHtmfSwke3NwZWNpZmllcn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZS5pbmRleE9mKCd1dGM6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg0LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdXRjUGFyc2UoJHtmfSwke3NwZWNpZmllcn0pYDtcbiAgfSBlbHNlIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS51bnJlY29nbml6ZWRQYXJzZShwYXJzZSkpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9wYXJzZTogRGljdDxzdHJpbmc+ID0ge307XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgUGFyc2VOb2RlKGR1cGxpY2F0ZSh0aGlzLnBhcnNlKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJzZTogRGljdDxzdHJpbmc+KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3BhcnNlID0gcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2UobW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICBjb25zdCBjYWxjRmllbGRNYXAgPSB7fTtcblxuICAgIChtb2RlbC50cmFuc2Zvcm1zIHx8IFtdKS5mb3JFYWNoKCh0cmFuc2Zvcm06IFRyYW5zZm9ybSkgPT4ge1xuICAgICAgaWYgKGlzQ2FsY3VsYXRlKHRyYW5zZm9ybSkpIHtcbiAgICAgICAgY2FsY0ZpZWxkTWFwW3RyYW5zZm9ybS5hc10gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0cmFuc2Zvcm0pKSB7XG4gICAgICAgIGZvckVhY2hMZWF2ZSh0cmFuc2Zvcm0uZmlsdGVyLCAoZmlsdGVyKSA9PiB7XG4gICAgICAgICAgaWYgKGlzRmllbGRQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgICAgaWYgKGZpbHRlci50aW1lVW5pdCkge1xuICAgICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgICAvLyBQYXJzZSBlbmNvZGVkIGZpZWxkc1xuICAgICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZpZWxkRGVmID0+IHtcbiAgICAgICAgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGlmIChjYWxjRmllbGRNYXBbZmllbGREZWYuZmllbGRdIHx8IGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDdXN0b20gcGFyc2Ugc2hvdWxkIG92ZXJyaWRlIGluZmVycmVkIHBhcnNlXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLmRhdGE7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5mb3JtYXQgJiYgZGF0YS5mb3JtYXQucGFyc2UpIHtcbiAgICAgIGNvbnN0IHAgPSBkYXRhLmZvcm1hdC5wYXJzZTtcbiAgICAgIGtleXMocCkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIHBhcnNlW2ZpZWxkXSA9IHBbZmllbGRdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2Ugc2hvdWxkIG5vdCBwYXJzZSB3aGF0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkIGluIGEgcGFyZW50XG4gICAgY29uc3QgbW9kZWxQYXJzZSA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2U7XG4gICAga2V5cyhtb2RlbFBhcnNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGlmIChwYXJzZVtmaWVsZF0gIT09IG1vZGVsUGFyc2VbZmllbGRdKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpZmZlcmVudFBhcnNlKGZpZWxkLCBwYXJzZVtmaWVsZF0sIG1vZGVsUGFyc2VbZmllbGRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgcGFyc2VbZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUocGFyc2UpO1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFBhcnNlTm9kZSkge1xuICAgIHRoaXMuX3BhcnNlID0gey4uLnRoaXMuX3BhcnNlLCAuLi5vdGhlci5wYXJzZX07XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cbiAgcHVibGljIGFzc2VtYmxlRm9ybWF0UGFyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlO1xuICB9XG5cbiAgLy8gZm9ybWF0IHBhcnNlIGRlcGVuZHMgYW5kIHByb2R1Y2VzIGFsbCBmaWVsZHMgaW4gaXRzIHBhcnNlXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4gdG9TZXQoa2V5cyh0aGlzLnBhcnNlKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVUcmFuc2Zvcm1zKCk6IFZnRm9ybXVsYVRyYW5zZm9ybVtdIHtcbiAgICByZXR1cm4ga2V5cyh0aGlzLl9wYXJzZSkubWFwKGZpZWxkID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oZmllbGQsIHRoaXMuX3BhcnNlW2ZpZWxkXSk7XG4gICAgICBpZiAoIWV4cHIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm11bGE6IFZnRm9ybXVsYVRyYW5zZm9ybSA9IHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBleHByLFxuICAgICAgICBhczogZmllbGRcbiAgICAgIH07XG4gICAgICByZXR1cm4gZm9ybXVsYTtcbiAgICB9KS5maWx0ZXIodCA9PiB0ICE9PSBudWxsKTtcbiAgfVxufVxuIl19