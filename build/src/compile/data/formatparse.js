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
var vega_util_1 = require("vega-util");
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
        return vega_util_1.toSet(util_1.keys(this.parse));
    };
    ParseNode.prototype.dependentFields = function () {
        return vega_util_1.toSet(util_1.keys(this.parse));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQWdDO0FBQ2hDLDZDQUFzRDtBQUN0RCwyQ0FBZ0U7QUFDaEUsK0JBQWlDO0FBQ2pDLHlDQUEyQztBQUMzQyw2Q0FBaUQ7QUFDakQsNkNBQWlFO0FBQ2pFLG1DQUF3RTtBQUV4RSxrQ0FBMEQ7QUFDMUQsdUNBQXdDO0FBR3hDLHlCQUF5QixLQUFhLEVBQUUsS0FBYTtJQUNuRCxJQUFNLENBQUMsR0FBRyxVQUFRLGlCQUFVLENBQUMsS0FBSyxDQUFHLENBQUM7SUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLGNBQVksQ0FBQyxNQUFHLENBQUM7SUFDMUIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsZUFBYSxDQUFDLE1BQUcsQ0FBQztJQUMzQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxjQUFZLENBQUMsTUFBRyxDQUFDO0lBQzFCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLFlBQVUsQ0FBQyxNQUFHLENBQUM7SUFDeEIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtB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SSxNQUFBO2dCQUNKLEVBQUUsRUFBRSxLQUFLO2FBQ1YsQ0FBQztZQUNGLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBM0dELENBQStCLHVCQUFZLEdBMkcxQztBQTNHWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dG9TZXR9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge2lzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7aXNOdW1iZXJGaWVsZERlZiwgaXNUaW1lRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtmb3JFYWNoTGVhdmV9IGZyb20gJy4uLy4uL2xvZ2ljYWwnO1xuaW1wb3J0IHtpc0ZpZWxkUHJlZGljYXRlfSBmcm9tICcuLi8uLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtpc0NhbGN1bGF0ZSwgaXNGaWx0ZXIsIFRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7YWNjZXNzUGF0aCwgRGljdCwgZHVwbGljYXRlLCBrZXlzLCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0Zvcm11bGFUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5mdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgcGFyc2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGYgPSBgZGF0dW0ke2FjY2Vzc1BhdGgoZmllbGQpfWA7XG4gIGlmIChwYXJzZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gYHRvTnVtYmVyKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGB0b0Jvb2xlYW4oJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBgdG9TdHJpbmcoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnZGF0ZScpIHtcbiAgICByZXR1cm4gYHRvRGF0ZSgke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZignZGF0ZTonKSA9PT0gMCkge1xuICAgIGNvbnN0IHNwZWNpZmllciA9IHBhcnNlLnNsaWNlKDUsIHBhcnNlLmxlbmd0aCk7XG4gICAgcmV0dXJuIGB0aW1lUGFyc2UoJHtmfSwke3NwZWNpZmllcn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZS5pbmRleE9mKCd1dGM6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg0LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdXRjUGFyc2UoJHtmfSwke3NwZWNpZmllcn0pYDtcbiAgfSBlbHNlIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS51bnJlY29nbml6ZWRQYXJzZShwYXJzZSkpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9wYXJzZTogRGljdDxzdHJpbmc+ID0ge307XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgUGFyc2VOb2RlKGR1cGxpY2F0ZSh0aGlzLnBhcnNlKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJzZTogRGljdDxzdHJpbmc+KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3BhcnNlID0gcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2UobW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICBjb25zdCBjYWxjRmllbGRNYXAgPSB7fTtcblxuICAgIChtb2RlbC50cmFuc2Zvcm1zIHx8IFtdKS5mb3JFYWNoKCh0cmFuc2Zvcm06IFRyYW5zZm9ybSkgPT4ge1xuICAgICAgaWYgKGlzQ2FsY3VsYXRlKHRyYW5zZm9ybSkpIHtcbiAgICAgICAgY2FsY0ZpZWxkTWFwW3RyYW5zZm9ybS5hc10gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0cmFuc2Zvcm0pKSB7XG4gICAgICAgIGZvckVhY2hMZWF2ZSh0cmFuc2Zvcm0uZmlsdGVyLCAoZmlsdGVyKSA9PiB7XG4gICAgICAgICAgaWYgKGlzRmllbGRQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgICAgaWYgKGZpbHRlci50aW1lVW5pdCkge1xuICAgICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgICAvLyBQYXJzZSBlbmNvZGVkIGZpZWxkc1xuICAgICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZpZWxkRGVmID0+IHtcbiAgICAgICAgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGlmIChjYWxjRmllbGRNYXBbZmllbGREZWYuZmllbGRdIHx8IGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDdXN0b20gcGFyc2Ugc2hvdWxkIG92ZXJyaWRlIGluZmVycmVkIHBhcnNlXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLmRhdGE7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5mb3JtYXQgJiYgZGF0YS5mb3JtYXQucGFyc2UpIHtcbiAgICAgIGNvbnN0IHAgPSBkYXRhLmZvcm1hdC5wYXJzZTtcbiAgICAgIGtleXMocCkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIHBhcnNlW2ZpZWxkXSA9IHBbZmllbGRdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2Ugc2hvdWxkIG5vdCBwYXJzZSB3aGF0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkIGluIGEgcGFyZW50XG4gICAgY29uc3QgbW9kZWxQYXJzZSA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2U7XG4gICAga2V5cyhtb2RlbFBhcnNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGlmIChwYXJzZVtmaWVsZF0gIT09IG1vZGVsUGFyc2VbZmllbGRdKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpZmZlcmVudFBhcnNlKGZpZWxkLCBwYXJzZVtmaWVsZF0sIG1vZGVsUGFyc2VbZmllbGRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgcGFyc2VbZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUocGFyc2UpO1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFBhcnNlTm9kZSkge1xuICAgIHRoaXMuX3BhcnNlID0gey4uLnRoaXMuX3BhcnNlLCAuLi5vdGhlci5wYXJzZX07XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cbiAgcHVibGljIGFzc2VtYmxlRm9ybWF0UGFyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlO1xuICB9XG5cbiAgLy8gZm9ybWF0IHBhcnNlIGRlcGVuZHMgYW5kIHByb2R1Y2VzIGFsbCBmaWVsZHMgaW4gaXRzIHBhcnNlXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4gdG9TZXQoa2V5cyh0aGlzLnBhcnNlKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVUcmFuc2Zvcm1zKCk6IFZnRm9ybXVsYVRyYW5zZm9ybVtdIHtcbiAgICByZXR1cm4ga2V5cyh0aGlzLl9wYXJzZSkubWFwKGZpZWxkID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oZmllbGQsIHRoaXMuX3BhcnNlW2ZpZWxkXSk7XG4gICAgICBpZiAoIWV4cHIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm11bGE6IFZnRm9ybXVsYVRyYW5zZm9ybSA9IHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBleHByLFxuICAgICAgICBhczogZmllbGRcbiAgICAgIH07XG4gICAgICByZXR1cm4gZm9ybXVsYTtcbiAgICB9KS5maWx0ZXIodCA9PiB0ICE9PSBudWxsKTtcbiAgfVxufVxuIl19