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
    function ParseNode(parent, parse) {
        var _this = _super.call(this, parent) || this;
        _this._parse = {};
        _this._parse = parse;
        return _this;
    }
    ParseNode.prototype.clone = function () {
        return new ParseNode(null, util_1.duplicate(this.parse));
    };
    ParseNode.make = function (parent, model) {
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
        return new ParseNode(parent, parse);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQWdDO0FBQ2hDLDZDQUFzRDtBQUN0RCwyQ0FBZ0U7QUFDaEUsK0JBQWlDO0FBQ2pDLHlDQUEyQztBQUMzQyw2Q0FBaUQ7QUFDakQsNkNBQWlFO0FBQ2pFLG1DQUF3RTtBQUV4RSxrQ0FBMEQ7QUFDMUQsdUNBQXdDO0FBR3hDLHlCQUF5QixLQUFhLEVBQUUsS0FBYTtJQUNuRCxJQUFNLENBQUMsR0FBRyxVQUFRLGlCQUFVLENBQUMsS0FBSyxDQUFHLENBQUM7SUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLGNBQVksQ0FBQyxNQUFHLENBQUM7SUFDMUIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsZUFBYSxDQUFDLE1BQUcsQ0FBQztJQUMzQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxjQUFZLENBQUMsTUFBRyxDQUFDO0lBQzFCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLFlBQVUsQ0FBQyxNQUFHLENBQUM7SUFDeEIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtB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WUFFRCxJQUFNLE9BQU8sR0FBdUI7Z0JBQ2xDLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksTUFBQTtnQkFDSixFQUFFLEVBQUUsS0FBSzthQUNWLENBQUM7WUFDRixNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxJQUFJLEVBQVYsQ0FBVSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQTNHRCxDQUErQix1QkFBWSxHQTJHMUM7QUEzR1ksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3RvU2V0fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtpc0NvdW50aW5nQWdncmVnYXRlT3B9IGZyb20gJy4uLy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2lzTnVtYmVyRmllbGREZWYsIGlzVGltZUZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7Zm9yRWFjaExlYXZlfSBmcm9tICcuLi8uLi9sb2dpY2FsJztcbmltcG9ydCB7aXNGaWVsZFByZWRpY2F0ZX0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7aXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2FjY2Vzc1BhdGgsIERpY3QsIGR1cGxpY2F0ZSwga2V5cywgU3RyaW5nU2V0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGb3JtdWxhVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHBhcnNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBmID0gYGRhdHVtJHthY2Nlc3NQYXRoKGZpZWxkKX1gO1xuICBpZiAocGFyc2UgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGB0b051bWJlcigke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBgdG9Cb29sZWFuKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYHRvU3RyaW5nKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2RhdGUnKSB7XG4gICAgcmV0dXJuIGB0b0RhdGUoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ2RhdGU6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg1LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdGltZVBhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZigndXRjOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNCwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHV0Y1BhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UocGFyc2UpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfcGFyc2U6IERpY3Q8c3RyaW5nPiA9IHt9O1xuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlTm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5wYXJzZSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHBhcnNlOiBEaWN0PHN0cmluZz4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgdGhpcy5fcGFyc2UgPSBwYXJzZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICBjb25zdCBjYWxjRmllbGRNYXAgPSB7fTtcblxuICAgIChtb2RlbC50cmFuc2Zvcm1zIHx8IFtdKS5mb3JFYWNoKCh0cmFuc2Zvcm06IFRyYW5zZm9ybSkgPT4ge1xuICAgICAgaWYgKGlzQ2FsY3VsYXRlKHRyYW5zZm9ybSkpIHtcbiAgICAgICAgY2FsY0ZpZWxkTWFwW3RyYW5zZm9ybS5hc10gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0cmFuc2Zvcm0pKSB7XG4gICAgICAgIGZvckVhY2hMZWF2ZSh0cmFuc2Zvcm0uZmlsdGVyLCAoZmlsdGVyKSA9PiB7XG4gICAgICAgICAgaWYgKGlzRmllbGRQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgICAgaWYgKGZpbHRlci50aW1lVW5pdCkge1xuICAgICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgICAvLyBQYXJzZSBlbmNvZGVkIGZpZWxkc1xuICAgICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZpZWxkRGVmID0+IHtcbiAgICAgICAgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGlmIChjYWxjRmllbGRNYXBbZmllbGREZWYuZmllbGRdIHx8IGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDdXN0b20gcGFyc2Ugc2hvdWxkIG92ZXJyaWRlIGluZmVycmVkIHBhcnNlXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLmRhdGE7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5mb3JtYXQgJiYgZGF0YS5mb3JtYXQucGFyc2UpIHtcbiAgICAgIGNvbnN0IHAgPSBkYXRhLmZvcm1hdC5wYXJzZTtcbiAgICAgIGtleXMocCkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIHBhcnNlW2ZpZWxkXSA9IHBbZmllbGRdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2Ugc2hvdWxkIG5vdCBwYXJzZSB3aGF0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkIGluIGEgcGFyZW50XG4gICAgY29uc3QgbW9kZWxQYXJzZSA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2U7XG4gICAga2V5cyhtb2RlbFBhcnNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGlmIChwYXJzZVtmaWVsZF0gIT09IG1vZGVsUGFyc2VbZmllbGRdKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpZmZlcmVudFBhcnNlKGZpZWxkLCBwYXJzZVtmaWVsZF0sIG1vZGVsUGFyc2VbZmllbGRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgcGFyc2VbZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUocGFyZW50LCBwYXJzZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBhcnNlKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZShvdGhlcjogUGFyc2VOb2RlKSB7XG4gICAgdGhpcy5fcGFyc2UgPSB7Li4udGhpcy5fcGFyc2UsIC4uLm90aGVyLnBhcnNlfTtcbiAgICBvdGhlci5yZW1vdmUoKTtcbiAgfVxuICBwdWJsaWMgYXNzZW1ibGVGb3JtYXRQYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICAvLyBmb3JtYXQgcGFyc2UgZGVwZW5kcyBhbmQgcHJvZHVjZXMgYWxsIGZpZWxkcyBpbiBpdHMgcGFyc2VcbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHRvU2V0KGtleXModGhpcy5wYXJzZSkpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRyYW5zZm9ybXMoKTogVmdGb3JtdWxhVHJhbnNmb3JtW10ge1xuICAgIHJldHVybiBrZXlzKHRoaXMuX3BhcnNlKS5tYXAoZmllbGQgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IHBhcnNlRXhwcmVzc2lvbihmaWVsZCwgdGhpcy5fcGFyc2VbZmllbGRdKTtcbiAgICAgIGlmICghZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9ybXVsYTogVmdGb3JtdWxhVHJhbnNmb3JtID0ge1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGV4cHIsXG4gICAgICAgIGFzOiBmaWVsZFxuICAgICAgfTtcbiAgICAgIHJldHVybiBmb3JtdWxhO1xuICAgIH0pLmZpbHRlcih0ID0+IHQgIT09IG51bGwpO1xuICB9XG59XG4iXX0=