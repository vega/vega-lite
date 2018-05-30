"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var aggregate_1 = require("../../aggregate");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var logical_1 = require("../../logical");
var predicate_1 = require("../../predicate");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var model_1 = require("../model");
var split_1 = require("../split");
var dataflow_1 = require("./dataflow");
/**
 * @param field The field.
 * @param parse What to parse the field as.
 */
function parseExpression(field, parse) {
    var f = util_1.accessPathWithDatum(field);
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
    else if (parse === 'flatten') {
        return f;
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
        _this._parse = parse;
        return _this;
    }
    ParseNode.prototype.clone = function () {
        return new ParseNode(null, util_1.duplicate(this._parse));
    };
    /**
     * Creates a parse node from a data.format.parse and updates ancestorParse.
     */
    ParseNode.makeExplicit = function (parent, model, ancestorParse) {
        // Custom parse
        var explicit = {};
        var data = model.data;
        if (data && data.format && data.format.parse) {
            explicit = data.format.parse;
        }
        return this.makeWithAncestors(parent, explicit, {}, ancestorParse);
    };
    ParseNode.makeImplicitFromFilterTransform = function (parent, transform, ancestorParse) {
        var parse = {};
        logical_1.forEachLeaf(transform.filter, function (filter) {
            if (predicate_1.isFieldPredicate(filter)) {
                // Automatically add a parse node for filters with filter objects
                var val = null;
                // For EqualFilter, just use the equal property.
                // For RangeFilter and OneOfFilter, all array members should have
                // the same type, so we only use the first one.
                if (predicate_1.isFieldEqualPredicate(filter)) {
                    val = filter.equal;
                }
                else if (predicate_1.isFieldRangePredicate(filter)) {
                    val = filter.range[0];
                }
                else if (predicate_1.isFieldOneOfPredicate(filter)) {
                    val = (filter.oneOf || filter['in'])[0];
                } // else -- for filter expression, we can't infer anything
                if (val) {
                    if (datetime_1.isDateTime(val)) {
                        parse[filter.field] = 'date';
                    }
                    else if (vega_util_1.isNumber(val)) {
                        parse[filter.field] = 'number';
                    }
                    else if (vega_util_1.isString(val)) {
                        parse[filter.field] = 'string';
                    }
                }
                if (filter.timeUnit) {
                    parse[filter.field] = 'date';
                }
            }
        });
        if (util_1.keys(parse).length === 0) {
            return null;
        }
        return this.makeWithAncestors(parent, {}, parse, ancestorParse);
    };
    /**
     * Creates a parse node for implicit parsing from a model and updates ancestorParse.
     */
    ParseNode.makeImplicitFromEncoding = function (parent, model, ancestorParse) {
        var implicit = {};
        if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
            // Parse encoded fields
            model.forEachFieldDef(function (fieldDef) {
                if (fielddef_1.isTimeFieldDef(fieldDef)) {
                    implicit[fieldDef.field] = 'date';
                }
                else if (fielddef_1.isNumberFieldDef(fieldDef)) {
                    if (!aggregate_1.isCountingAggregateOp(fieldDef.aggregate)) {
                        implicit[fieldDef.field] = 'number';
                    }
                }
                else if (util_1.accessPathDepth(fieldDef.field) > 1) {
                    // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
                    // (Parsing numbers / dates already flattens numeric and temporal fields.)
                    if (!(fieldDef.field in implicit)) {
                        implicit[fieldDef.field] = 'flatten';
                    }
                }
                else if (fielddef_1.isScaleFieldDef(fieldDef) && sort_1.isSortField(fieldDef.sort) && util_1.accessPathDepth(fieldDef.sort.field) > 1) {
                    // Flatten fields that we sort by but that are not otherwise flattened.
                    if (!(fieldDef.sort.field in implicit)) {
                        implicit[fieldDef.sort.field] = 'flatten';
                    }
                }
            });
        }
        return this.makeWithAncestors(parent, {}, implicit, ancestorParse);
    };
    /**
     * Creates a parse node from "explicit" parse and "implicit" parse and updates ancestorParse.
     */
    ParseNode.makeWithAncestors = function (parent, explicit, implicit, ancestorParse) {
        // We should not parse what has already been parsed in a parent (explicitly or implicitly) or what has been derived (maked as "derived"). We also don't need to flatten a field that has already been parsed.
        for (var _i = 0, _a = util_1.keys(implicit); _i < _a.length; _i++) {
            var field = _a[_i];
            var parsedAs = ancestorParse.getWithExplicit(field);
            if (parsedAs.value !== undefined) {
                // We always ignore derived fields even if they are implicitly defined because we expect users to create the right types.
                if (parsedAs.explicit || parsedAs.value === implicit[field] || parsedAs.value === 'derived' || implicit[field] === 'flatten') {
                    delete implicit[field];
                }
                else {
                    log.warn(log.message.differentParse(field, implicit[field], parsedAs.value));
                }
            }
        }
        for (var _b = 0, _c = util_1.keys(explicit); _b < _c.length; _b++) {
            var field = _c[_b];
            var parsedAs = ancestorParse.get(field);
            if (parsedAs !== undefined) {
                // Don't parse a field again if it has been parsed with the same type already.
                if (parsedAs === explicit[field]) {
                    delete explicit[field];
                }
                else {
                    log.warn(log.message.differentParse(field, explicit[field], parsedAs));
                }
            }
        }
        var parse = new split_1.Split(explicit, implicit);
        // add the format parse from this model so that children don't parse the same field again
        ancestorParse.copyAll(parse);
        // copy only non-null parses
        var p = {};
        for (var _d = 0, _e = util_1.keys(parse.combine()); _d < _e.length; _d++) {
            var key = _e[_d];
            var val = parse.get(key);
            if (val !== null) {
                p[key] = val;
            }
        }
        if (util_1.keys(p).length === 0 || ancestorParse.parseNothing) {
            return null;
        }
        return new ParseNode(parent, p);
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
    /**
     * Assemble an object for Vega's format.parse property.
     */
    ParseNode.prototype.assembleFormatParse = function () {
        var formatParse = {};
        for (var _i = 0, _a = util_1.keys(this._parse); _i < _a.length; _i++) {
            var field = _a[_i];
            var p = this._parse[field];
            if (util_1.accessPathDepth(field) === 1) {
                formatParse[field] = p;
            }
        }
        return formatParse;
    };
    // format parse depends and produces all fields in its parse
    ParseNode.prototype.producedFields = function () {
        return vega_util_1.toSet(util_1.keys(this._parse));
    };
    ParseNode.prototype.dependentFields = function () {
        return vega_util_1.toSet(util_1.keys(this._parse));
    };
    ParseNode.prototype.assembleTransforms = function (onlyNested) {
        var _this = this;
        if (onlyNested === void 0) { onlyNested = false; }
        return util_1.keys(this._parse)
            .filter(function (field) { return onlyNested ? util_1.accessPathDepth(field) > 1 : true; })
            .map(function (field) {
            var expr = parseExpression(field, _this._parse[field]);
            if (!expr) {
                return null;
            }
            var formula = {
                type: 'formula',
                expr: expr,
                as: util_1.removePathFromField(field) // Vega output is always flattened
            };
            return formula;
        }).filter(function (t) { return t !== null; });
    };
    return ParseNode;
}(dataflow_1.DataFlowNode));
exports.ParseNode = ParseNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFvRDtBQUVwRCw2Q0FBc0Q7QUFDdEQsMkNBQW9EO0FBQ3BELDJDQUFpRjtBQUNqRiwrQkFBaUM7QUFDakMseUNBQTBDO0FBQzFDLDZDQUFzSDtBQUN0SCxtQ0FBdUM7QUFFdkMsbUNBQXVIO0FBRXZILGtDQUEwRDtBQUMxRCxrQ0FBK0I7QUFDL0IsdUNBQXdDO0FBR3hDOzs7R0FHRztBQUNILHlCQUF5QixLQUFhLEVBQUUsS0FBYTtJQUNuRCxJQUFNLENBQUMsR0FBRywwQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdEIsT0FBTyxjQUFZLENBQUMsTUFBRyxDQUFDO0tBQ3pCO1NBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQzlCLE9BQU8sZUFBYSxDQUFDLE1BQUcsQ0FBQztLQUMxQjtTQUFNLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM3QixPQUFPLGNBQVksQ0FBQyxNQUFHLENBQUM7S0FDekI7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsT0FBTyxZQUFVLENBQUMsTUFBRyxDQUFDO0tBQ3ZCO1NBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7U0FBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxPQUFPLGVBQWEsQ0FBQyxTQUFJLFNBQVMsTUFBRyxDQUFDO0tBQ3ZDO1NBQU0sSUFBSSxLQUFLLENB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V0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxzQ0FBa0IsR0FBekIsVUFBMEIsVUFBa0I7UUFBNUMsaUJBZ0JDO1FBaEJ5QiwyQkFBQSxFQUFBLGtCQUFrQjtRQUMxQyxPQUFPLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3JCLE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLFVBQVUsQ0FBQyxDQUFDLENBQUMsc0JBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBOUMsQ0FBOEMsQ0FBQzthQUMvRCxHQUFHLENBQUMsVUFBQSxLQUFLO1lBQ1IsSUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxPQUFPLEdBQXVCO2dCQUNsQyxJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLE1BQUE7Z0JBQ0osRUFBRSxFQUFFLDBCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFFLGtDQUFrQzthQUNuRSxDQUFDO1lBQ0YsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBdk1ELENBQStCLHVCQUFZLEdBdU0xQztBQXZNWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXIsIGlzU3RyaW5nLCB0b1NldH0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7QW5jZXN0b3JQYXJzZX0gZnJvbSAnLic7XG5pbXBvcnQge2lzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7RGF0ZVRpbWUsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7aXNOdW1iZXJGaWVsZERlZiwgaXNTY2FsZUZpZWxkRGVmLCBpc1RpbWVGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2ZvckVhY2hMZWFmfSBmcm9tICcuLi8uLi9sb2dpY2FsJztcbmltcG9ydCB7aXNGaWVsZEVxdWFsUHJlZGljYXRlLCBpc0ZpZWxkT25lT2ZQcmVkaWNhdGUsIGlzRmllbGRQcmVkaWNhdGUsIGlzRmllbGRSYW5nZVByZWRpY2F0ZX0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7aXNTb3J0RmllbGR9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0IHtGaWx0ZXJUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2FjY2Vzc1BhdGhEZXB0aCwgYWNjZXNzUGF0aFdpdGhEYXR1bSwgRGljdCwgZHVwbGljYXRlLCBrZXlzLCByZW1vdmVQYXRoRnJvbUZpZWxkLCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0Zvcm11bGFUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7U3BsaXR9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZCBUaGUgZmllbGQuXG4gKiBAcGFyYW0gcGFyc2UgV2hhdCB0byBwYXJzZSB0aGUgZmllbGQgYXMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbihmaWVsZDogc3RyaW5nLCBwYXJzZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgZiA9IGFjY2Vzc1BhdGhXaXRoRGF0dW0oZmllbGQpO1xuICBpZiAocGFyc2UgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGB0b051bWJlcigke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBgdG9Cb29sZWFuKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYHRvU3RyaW5nKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2RhdGUnKSB7XG4gICAgcmV0dXJuIGB0b0RhdGUoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnZmxhdHRlbicpIHtcbiAgICByZXR1cm4gZjtcbiAgfSBlbHNlIGlmIChwYXJzZS5pbmRleE9mKCdkYXRlOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNSwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHRpbWVQYXJzZSgke2Z9LCR7c3BlY2lmaWVyfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ3V0YzonKSA9PT0gMCkge1xuICAgIGNvbnN0IHNwZWNpZmllciA9IHBhcnNlLnNsaWNlKDQsIHBhcnNlLmxlbmd0aCk7XG4gICAgcmV0dXJuIGB1dGNQYXJzZSgke2Z9LCR7c3BlY2lmaWVyfSlgO1xuICB9IGVsc2Uge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnVucmVjb2duaXplZFBhcnNlKHBhcnNlKSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX3BhcnNlOiBEaWN0PHN0cmluZz47XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgUGFyc2VOb2RlKG51bGwsIGR1cGxpY2F0ZSh0aGlzLl9wYXJzZSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHBhcnNlOiBEaWN0PHN0cmluZz4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgdGhpcy5fcGFyc2UgPSBwYXJzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcGFyc2Ugbm9kZSBmcm9tIGEgZGF0YS5mb3JtYXQucGFyc2UgYW5kIHVwZGF0ZXMgYW5jZXN0b3JQYXJzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUV4cGxpY2l0KHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogTW9kZWwsIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpIHtcbiAgICAvLyBDdXN0b20gcGFyc2VcbiAgICBsZXQgZXhwbGljaXQgPSB7fTtcbiAgICBjb25zdCBkYXRhID0gbW9kZWwuZGF0YTtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmZvcm1hdCAmJiBkYXRhLmZvcm1hdC5wYXJzZSkge1xuICAgICAgZXhwbGljaXQgPSBkYXRhLmZvcm1hdC5wYXJzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tYWtlV2l0aEFuY2VzdG9ycyhwYXJlbnQsIGV4cGxpY2l0LCB7fSwgYW5jZXN0b3JQYXJzZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VJbXBsaWNpdEZyb21GaWx0ZXJUcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHRyYW5zZm9ybTogRmlsdGVyVHJhbnNmb3JtLCBhbmNlc3RvclBhcnNlOiBBbmNlc3RvclBhcnNlKSB7XG4gICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICBmb3JFYWNoTGVhZih0cmFuc2Zvcm0uZmlsdGVyLCBmaWx0ZXIgPT4ge1xuICAgICAgaWYgKGlzRmllbGRQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGFkZCBhIHBhcnNlIG5vZGUgZm9yIGZpbHRlcnMgd2l0aCBmaWx0ZXIgb2JqZWN0c1xuICAgICAgICBsZXQgdmFsOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgRGF0ZVRpbWUgPSBudWxsO1xuXG4gICAgICAgIC8vIEZvciBFcXVhbEZpbHRlciwganVzdCB1c2UgdGhlIGVxdWFsIHByb3BlcnR5LlxuICAgICAgICAvLyBGb3IgUmFuZ2VGaWx0ZXIgYW5kIE9uZU9mRmlsdGVyLCBhbGwgYXJyYXkgbWVtYmVycyBzaG91bGQgaGF2ZVxuICAgICAgICAvLyB0aGUgc2FtZSB0eXBlLCBzbyB3ZSBvbmx5IHVzZSB0aGUgZmlyc3Qgb25lLlxuICAgICAgICBpZiAoaXNGaWVsZEVxdWFsUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgICB2YWwgPSBmaWx0ZXIuZXF1YWw7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNGaWVsZFJhbmdlUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgICB2YWwgPSBmaWx0ZXIucmFuZ2VbMF07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNGaWVsZE9uZU9mUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgICB2YWwgPSAoZmlsdGVyLm9uZU9mIHx8IGZpbHRlclsnaW4nXSlbMF07XG4gICAgICAgIH0gLy8gZWxzZSAtLSBmb3IgZmlsdGVyIGV4cHJlc3Npb24sIHdlIGNhbid0IGluZmVyIGFueXRoaW5nXG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICBpZiAoaXNEYXRlVGltZSh2YWwpKSB7XG4gICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIodmFsKSkge1xuICAgICAgICAgICAgcGFyc2VbZmlsdGVyLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgcGFyc2VbZmlsdGVyLmZpZWxkXSA9ICdzdHJpbmcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWx0ZXIudGltZVVuaXQpIHtcbiAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoa2V5cyhwYXJzZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tYWtlV2l0aEFuY2VzdG9ycyhwYXJlbnQsIHt9LCBwYXJzZSwgYW5jZXN0b3JQYXJzZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHBhcnNlIG5vZGUgZm9yIGltcGxpY2l0IHBhcnNpbmcgZnJvbSBhIG1vZGVsIGFuZCB1cGRhdGVzIGFuY2VzdG9yUGFyc2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsLCBhbmNlc3RvclBhcnNlOiBBbmNlc3RvclBhcnNlKSB7XG4gICAgY29uc3QgaW1wbGljaXQgPSB7fTtcblxuICAgIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgICAgLy8gUGFyc2UgZW5jb2RlZCBmaWVsZHNcbiAgICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZihmaWVsZERlZiA9PiB7XG4gICAgICAgIGlmIChpc1RpbWVGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICAgICAgICBpbXBsaWNpdFtmaWVsZERlZi5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXJGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICAgICAgICBpZiAoIWlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgICAgICBpbXBsaWNpdFtmaWVsZERlZi5maWVsZF0gPSAnbnVtYmVyJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYWNjZXNzUGF0aERlcHRoKGZpZWxkRGVmLmZpZWxkKSA+IDEpIHtcbiAgICAgICAgICAvLyBGb3Igbm9uLWRhdGUvbm9uLW51bWJlciAoc3RyaW5ncyBhbmQgYm9vbGVhbnMpLCBkZXJpdmUgYSBmbGF0dGVuZWQgZmllbGQgZm9yIGEgcmVmZXJlbmNlZCBuZXN0ZWQgZmllbGQuXG4gICAgICAgICAgLy8gKFBhcnNpbmcgbnVtYmVycyAvIGRhdGVzIGFscmVhZHkgZmxhdHRlbnMgbnVtZXJpYyBhbmQgdGVtcG9yYWwgZmllbGRzLilcbiAgICAgICAgICBpZiAoIShmaWVsZERlZi5maWVsZCBpbiBpbXBsaWNpdCkpIHtcbiAgICAgICAgICAgIGltcGxpY2l0W2ZpZWxkRGVmLmZpZWxkXSA9ICdmbGF0dGVuJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTY2FsZUZpZWxkRGVmKGZpZWxkRGVmKSAmJiBpc1NvcnRGaWVsZChmaWVsZERlZi5zb3J0KSAmJiBhY2Nlc3NQYXRoRGVwdGgoZmllbGREZWYuc29ydC5maWVsZCkgPiAxKSB7XG4gICAgICAgICAgLy8gRmxhdHRlbiBmaWVsZHMgdGhhdCB3ZSBzb3J0IGJ5IGJ1dCB0aGF0IGFyZSBub3Qgb3RoZXJ3aXNlIGZsYXR0ZW5lZC5cbiAgICAgICAgICBpZiAoIShmaWVsZERlZi5zb3J0LmZpZWxkIGluIGltcGxpY2l0KSkge1xuICAgICAgICAgICAgaW1wbGljaXRbZmllbGREZWYuc29ydC5maWVsZF0gPSAnZmxhdHRlbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tYWtlV2l0aEFuY2VzdG9ycyhwYXJlbnQsIHt9LCBpbXBsaWNpdCwgYW5jZXN0b3JQYXJzZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHBhcnNlIG5vZGUgZnJvbSBcImV4cGxpY2l0XCIgcGFyc2UgYW5kIFwiaW1wbGljaXRcIiBwYXJzZSBhbmQgdXBkYXRlcyBhbmNlc3RvclBhcnNlLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgbWFrZVdpdGhBbmNlc3RvcnMocGFyZW50OiBEYXRhRmxvd05vZGUsIGV4cGxpY2l0OiBEaWN0PHN0cmluZz4sIGltcGxpY2l0OiBEaWN0PHN0cmluZz4sIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpIHtcbiAgICAvLyBXZSBzaG91bGQgbm90IHBhcnNlIHdoYXQgaGFzIGFscmVhZHkgYmVlbiBwYXJzZWQgaW4gYSBwYXJlbnQgKGV4cGxpY2l0bHkgb3IgaW1wbGljaXRseSkgb3Igd2hhdCBoYXMgYmVlbiBkZXJpdmVkIChtYWtlZCBhcyBcImRlcml2ZWRcIikuIFdlIGFsc28gZG9uJ3QgbmVlZCB0byBmbGF0dGVuIGEgZmllbGQgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIHBhcnNlZC5cbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXMoaW1wbGljaXQpKSB7XG4gICAgICBjb25zdCBwYXJzZWRBcyA9IGFuY2VzdG9yUGFyc2UuZ2V0V2l0aEV4cGxpY2l0KGZpZWxkKTtcbiAgICAgIGlmIChwYXJzZWRBcy52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFdlIGFsd2F5cyBpZ25vcmUgZGVyaXZlZCBmaWVsZHMgZXZlbiBpZiB0aGV5IGFyZSBpbXBsaWNpdGx5IGRlZmluZWQgYmVjYXVzZSB3ZSBleHBlY3QgdXNlcnMgdG8gY3JlYXRlIHRoZSByaWdodCB0eXBlcy5cbiAgICAgICAgaWYgKHBhcnNlZEFzLmV4cGxpY2l0IHx8IHBhcnNlZEFzLnZhbHVlID09PSBpbXBsaWNpdFtmaWVsZF0gfHwgcGFyc2VkQXMudmFsdWUgPT09ICdkZXJpdmVkJyB8fCBpbXBsaWNpdFtmaWVsZF0gPT09ICdmbGF0dGVuJykge1xuICAgICAgICAgIGRlbGV0ZSBpbXBsaWNpdFtmaWVsZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZGlmZmVyZW50UGFyc2UoZmllbGQsIGltcGxpY2l0W2ZpZWxkXSwgcGFyc2VkQXMudmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyhleHBsaWNpdCkpIHtcbiAgICAgIGNvbnN0IHBhcnNlZEFzID0gYW5jZXN0b3JQYXJzZS5nZXQoZmllbGQpO1xuICAgICAgaWYgKHBhcnNlZEFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gRG9uJ3QgcGFyc2UgYSBmaWVsZCBhZ2FpbiBpZiBpdCBoYXMgYmVlbiBwYXJzZWQgd2l0aCB0aGUgc2FtZSB0eXBlIGFscmVhZHkuXG4gICAgICAgIGlmIChwYXJzZWRBcyA9PT0gZXhwbGljaXRbZmllbGRdKSB7XG4gICAgICAgICAgZGVsZXRlIGV4cGxpY2l0W2ZpZWxkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaWZmZXJlbnRQYXJzZShmaWVsZCwgZXhwbGljaXRbZmllbGRdLCBwYXJzZWRBcykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGFyc2UgPSBuZXcgU3BsaXQoZXhwbGljaXQsIGltcGxpY2l0KTtcblxuICAgIC8vIGFkZCB0aGUgZm9ybWF0IHBhcnNlIGZyb20gdGhpcyBtb2RlbCBzbyB0aGF0IGNoaWxkcmVuIGRvbid0IHBhcnNlIHRoZSBzYW1lIGZpZWxkIGFnYWluXG4gICAgYW5jZXN0b3JQYXJzZS5jb3B5QWxsKHBhcnNlKTtcblxuICAgIC8vIGNvcHkgb25seSBub24tbnVsbCBwYXJzZXNcbiAgICBjb25zdCBwID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cyhwYXJzZS5jb21iaW5lKCkpKSB7XG4gICAgICBjb25zdCB2YWwgPSBwYXJzZS5nZXQoa2V5KTtcbiAgICAgIGlmICh2YWwgIT09IG51bGwpIHtcbiAgICAgICAgcFtrZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChrZXlzKHApLmxlbmd0aCA9PT0gMCB8fCBhbmNlc3RvclBhcnNlLnBhcnNlTm90aGluZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUocGFyZW50LCBwKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBQYXJzZU5vZGUpIHtcbiAgICB0aGlzLl9wYXJzZSA9IHsuLi50aGlzLl9wYXJzZSwgLi4ub3RoZXIucGFyc2V9O1xuICAgIG90aGVyLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VtYmxlIGFuIG9iamVjdCBmb3IgVmVnYSdzIGZvcm1hdC5wYXJzZSBwcm9wZXJ0eS5cbiAgICovXG4gIHB1YmxpYyBhc3NlbWJsZUZvcm1hdFBhcnNlKCkge1xuICAgIGNvbnN0IGZvcm1hdFBhcnNlID0ge307XG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKHRoaXMuX3BhcnNlKSkge1xuICAgICAgY29uc3QgcCA9IHRoaXMuX3BhcnNlW2ZpZWxkXTtcbiAgICAgIGlmIChhY2Nlc3NQYXRoRGVwdGgoZmllbGQpID09PSAxKSB7XG4gICAgICAgIGZvcm1hdFBhcnNlW2ZpZWxkXSA9IHA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXRQYXJzZTtcbiAgfVxuXG4gIC8vIGZvcm1hdCBwYXJzZSBkZXBlbmRzIGFuZCBwcm9kdWNlcyBhbGwgZmllbGRzIGluIGl0cyBwYXJzZVxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4gdG9TZXQoa2V5cyh0aGlzLl9wYXJzZSkpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMuX3BhcnNlKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVUcmFuc2Zvcm1zKG9ubHlOZXN0ZWQgPSBmYWxzZSk6IFZnRm9ybXVsYVRyYW5zZm9ybVtdIHtcbiAgICByZXR1cm4ga2V5cyh0aGlzLl9wYXJzZSlcbiAgICAgIC5maWx0ZXIoZmllbGQgPT4gb25seU5lc3RlZCA/IGFjY2Vzc1BhdGhEZXB0aChmaWVsZCkgPiAxIDogdHJ1ZSlcbiAgICAgIC5tYXAoZmllbGQgPT4ge1xuICAgICAgICBjb25zdCBleHByID0gcGFyc2VFeHByZXNzaW9uKGZpZWxkLCB0aGlzLl9wYXJzZVtmaWVsZF0pO1xuICAgICAgICBpZiAoIWV4cHIpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvcm11bGE6IFZnRm9ybXVsYVRyYW5zZm9ybSA9IHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZXhwcixcbiAgICAgICAgICBhczogcmVtb3ZlUGF0aEZyb21GaWVsZChmaWVsZCkgIC8vIFZlZ2Egb3V0cHV0IGlzIGFsd2F5cyBmbGF0dGVuZWRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZvcm11bGE7XG4gICAgICB9KS5maWx0ZXIodCA9PiB0ICE9PSBudWxsKTtcbiAgfVxufVxuIl19