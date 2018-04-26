"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    tslib_1.__extends(ParseNode, _super);
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
        this._parse = tslib_1.__assign({}, this._parse, other.parse);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFnQztBQUNoQyw2Q0FBc0Q7QUFDdEQsMkNBQWdFO0FBQ2hFLCtCQUFpQztBQUNqQyx5Q0FBMkM7QUFDM0MsNkNBQWlEO0FBQ2pELDZDQUFpRTtBQUNqRSxtQ0FBd0U7QUFFeEUsa0NBQTBEO0FBQzFELHVDQUF3QztBQUd4Qyx5QkFBeUIsS0FBYSxFQUFFLEtBQWE7SUFDbkQsSUFBTSxDQUFDLEdBQUcsVUFBUSxpQkFBVSxDQUFDLEtBQUssQ0FBRyxDQUFDO0lBQ3RDLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUN0QixPQUFPLGNBQVksQ0FBQyxNQUFHLENBQUM7S0FDekI7U0FBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDOUIsT0FBTyxlQUFhLENBQUMsTUFBRyxDQUFDO0tBQzFCO1NBQU0sSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE9BQU8sY0FBWSxDQUFDLE1BQUcsQ0FBQztLQUN6QjtTQUFNLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUMzQixPQUFPLFlBQVUsQ0FBQyxNQUFHLENBQUM7S0FDdkI7U0FBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxPQUFPLGVBQWEsQ0FBQyxTQUFJLFNBQVMsTUFBRyxDQUFDO0tBQ3ZDO1NBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxL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QztJQUNqQyxDQUFDO0lBRU0sc0NBQWtCLEdBQXpCO1FBQUEsaUJBY0M7UUFiQyxPQUFPLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztZQUNoQyxJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFNLE9BQU8sR0FBdUI7Z0JBQ2xDLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksTUFBQTtnQkFDSixFQUFFLEVBQUUsS0FBSzthQUNWLENBQUM7WUFDRixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUEzR0QsQ0FBK0IsdUJBQVksR0EyRzFDO0FBM0dZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt0b1NldH0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7aXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtpc051bWJlckZpZWxkRGVmLCBpc1RpbWVGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2ZvckVhY2hMZWF2ZX0gZnJvbSAnLi4vLi4vbG9naWNhbCc7XG5pbXBvcnQge2lzRmllbGRQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2lzQ2FsY3VsYXRlLCBpc0ZpbHRlciwgVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHthY2Nlc3NQYXRoLCBEaWN0LCBkdXBsaWNhdGUsIGtleXMsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRm9ybXVsYVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbihmaWVsZDogc3RyaW5nLCBwYXJzZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgZiA9IGBkYXR1bSR7YWNjZXNzUGF0aChmaWVsZCl9YDtcbiAgaWYgKHBhcnNlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBgdG9OdW1iZXIoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gYHRvQm9vbGVhbigke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGB0b1N0cmluZygke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdkYXRlJykge1xuICAgIHJldHVybiBgdG9EYXRlKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZS5pbmRleE9mKCdkYXRlOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNSwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHRpbWVQYXJzZSgke2Z9LCR7c3BlY2lmaWVyfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ3V0YzonKSA9PT0gMCkge1xuICAgIGNvbnN0IHNwZWNpZmllciA9IHBhcnNlLnNsaWNlKDQsIHBhcnNlLmxlbmd0aCk7XG4gICAgcmV0dXJuIGB1dGNQYXJzZSgke2Z9LCR7c3BlY2lmaWVyfSlgO1xuICB9IGVsc2Uge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVucmVjb2duaXplZFBhcnNlKHBhcnNlKSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX3BhcnNlOiBEaWN0PHN0cmluZz4gPSB7fTtcblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUobnVsbCwgZHVwbGljYXRlKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwYXJzZTogRGljdDxzdHJpbmc+KSB7XG4gICAgc3VwZXIocGFyZW50KTtcblxuICAgIHRoaXMuX3BhcnNlID0gcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2UocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbCkge1xuICAgIGNvbnN0IHBhcnNlID0ge307XG4gICAgY29uc3QgY2FsY0ZpZWxkTWFwID0ge307XG5cbiAgICAobW9kZWwudHJhbnNmb3JtcyB8fCBbXSkuZm9yRWFjaCgodHJhbnNmb3JtOiBUcmFuc2Zvcm0pID0+IHtcbiAgICAgIGlmIChpc0NhbGN1bGF0ZSh0cmFuc2Zvcm0pKSB7XG4gICAgICAgIGNhbGNGaWVsZE1hcFt0cmFuc2Zvcm0uYXNdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGaWx0ZXIodHJhbnNmb3JtKSkge1xuICAgICAgICBmb3JFYWNoTGVhdmUodHJhbnNmb3JtLmZpbHRlciwgKGZpbHRlcikgPT4ge1xuICAgICAgICAgIGlmIChpc0ZpZWxkUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIudGltZVVuaXQpIHtcbiAgICAgICAgICAgICAgcGFyc2VbZmlsdGVyLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHt9KTtcblxuICAgIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgICAgLy8gUGFyc2UgZW5jb2RlZCBmaWVsZHNcbiAgICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZihmaWVsZERlZiA9PiB7XG4gICAgICAgIGlmIChpc1RpbWVGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXJGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICAgICAgICBpZiAoY2FsY0ZpZWxkTWFwW2ZpZWxkRGVmLmZpZWxkXSB8fCBpc0NvdW50aW5nQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnbnVtYmVyJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9tIHBhcnNlIHNob3VsZCBvdmVycmlkZSBpbmZlcnJlZCBwYXJzZVxuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5kYXRhO1xuICAgIGlmIChkYXRhICYmIGRhdGEuZm9ybWF0ICYmIGRhdGEuZm9ybWF0LnBhcnNlKSB7XG4gICAgICBjb25zdCBwID0gZGF0YS5mb3JtYXQucGFyc2U7XG4gICAgICBrZXlzKHApLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBwYXJzZVtmaWVsZF0gPSBwW2ZpZWxkXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdlIHNob3VsZCBub3QgcGFyc2Ugd2hhdCBoYXMgYWxyZWFkeSBiZWVuIHBhcnNlZCBpbiBhIHBhcmVudFxuICAgIGNvbnN0IG1vZGVsUGFyc2UgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlO1xuICAgIGtleXMobW9kZWxQYXJzZSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBpZiAocGFyc2VbZmllbGRdICE9PSBtb2RlbFBhcnNlW2ZpZWxkXSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaWZmZXJlbnRQYXJzZShmaWVsZCwgcGFyc2VbZmllbGRdLCBtb2RlbFBhcnNlW2ZpZWxkXSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIHBhcnNlW2ZpZWxkXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChrZXlzKHBhcnNlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUGFyc2VOb2RlKHBhcmVudCwgcGFyc2UpO1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFBhcnNlTm9kZSkge1xuICAgIHRoaXMuX3BhcnNlID0gey4uLnRoaXMuX3BhcnNlLCAuLi5vdGhlci5wYXJzZX07XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cbiAgcHVibGljIGFzc2VtYmxlRm9ybWF0UGFyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlO1xuICB9XG5cbiAgLy8gZm9ybWF0IHBhcnNlIGRlcGVuZHMgYW5kIHByb2R1Y2VzIGFsbCBmaWVsZHMgaW4gaXRzIHBhcnNlXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4gdG9TZXQoa2V5cyh0aGlzLnBhcnNlKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVUcmFuc2Zvcm1zKCk6IFZnRm9ybXVsYVRyYW5zZm9ybVtdIHtcbiAgICByZXR1cm4ga2V5cyh0aGlzLl9wYXJzZSkubWFwKGZpZWxkID0+IHtcbiAgICAgIGNvbnN0IGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oZmllbGQsIHRoaXMuX3BhcnNlW2ZpZWxkXSk7XG4gICAgICBpZiAoIWV4cHIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm11bGE6IFZnRm9ybXVsYVRyYW5zZm9ybSA9IHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBleHByLFxuICAgICAgICBhczogZmllbGRcbiAgICAgIH07XG4gICAgICByZXR1cm4gZm9ybXVsYTtcbiAgICB9KS5maWx0ZXIodCA9PiB0ICE9PSBudWxsKTtcbiAgfVxufVxuIl19