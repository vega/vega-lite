"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var aggregate_1 = require("../../aggregate");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFvRDtBQUVwRCw2Q0FBc0Q7QUFDdEQsMkNBQW9EO0FBQ3BELDJDQUFpRjtBQUNqRixxREFBaUM7QUFDakMseUNBQTBDO0FBQzFDLDZDQUFzSDtBQUN0SCxtQ0FBdUM7QUFFdkMsbUNBQXVIO0FBRXZILGtDQUEwRDtBQUMxRCxrQ0FBK0I7QUFDL0IsdUNBQXdDO0FBR3hDOzs7R0FHRztBQUNILHlCQUF5QixLQUFhLEVBQUUsS0FBYTtJQUNuRCxJQUFNLENBQUMsR0FBRywwQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdEIsT0FBTyxjQUFZLENBQUMsTUFBRyxDQUFDO0tBQ3pCO1NBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQzlCLE9BQU8sZUFBYSxDQUFDLE1BQUcsQ0FBQztLQUMxQjtTQUFNLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM3QixPQUFPLGNBQVksQ0FBQyxNQUFHLENBQUM7S0FDekI7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsT0FBTyxZQUFVLENBQUMsTUFBRyxDQUFDO0tBQ3ZCO1NBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7U0FBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxPQUFPLGVBQWEsQ0FBQyxTQUFJLFNBQVMsTUFBRyxDQUFDO0tBQ3ZDO1NBQU0sSUFBSSxLQUFLLENB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QUNFLE9BQU8saUJBQUssQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLHNDQUFrQixHQUF6QixVQUEwQixVQUFrQjtRQUE1QyxpQkFnQkM7UUFoQnlCLDJCQUFBLEVBQUEsa0JBQWtCO1FBQzFDLE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDckIsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsVUFBVSxDQUFDLENBQUMsQ0FBQyxzQkFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUE5QyxDQUE4QyxDQUFDO2FBQy9ELEdBQUcsQ0FBQyxVQUFBLEtBQUs7WUFDUixJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFNLE9BQU8sR0FBdUI7Z0JBQ2xDLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksTUFBQTtnQkFDSixFQUFFLEVBQUUsMEJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUUsa0NBQWtDO2FBQ25FLENBQUM7WUFDRixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF2TUQsQ0FBK0IsdUJBQVksR0F1TTFDO0FBdk1ZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlciwgaXNTdHJpbmcsIHRvU2V0fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtBbmNlc3RvclBhcnNlfSBmcm9tICcuJztcbmltcG9ydCB7aXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtEYXRlVGltZSwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0IHtpc051bWJlckZpZWxkRGVmLCBpc1NjYWxlRmllbGREZWYsIGlzVGltZUZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7Zm9yRWFjaExlYWZ9IGZyb20gJy4uLy4uL2xvZ2ljYWwnO1xuaW1wb3J0IHtpc0ZpZWxkRXF1YWxQcmVkaWNhdGUsIGlzRmllbGRPbmVPZlByZWRpY2F0ZSwgaXNGaWVsZFByZWRpY2F0ZSwgaXNGaWVsZFJhbmdlUHJlZGljYXRlfSBmcm9tICcuLi8uLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtpc1NvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge0ZpbHRlclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7YWNjZXNzUGF0aERlcHRoLCBhY2Nlc3NQYXRoV2l0aERhdHVtLCBEaWN0LCBkdXBsaWNhdGUsIGtleXMsIHJlbW92ZVBhdGhGcm9tRmllbGQsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRm9ybXVsYVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTcGxpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbi8qKlxuICogQHBhcmFtIGZpZWxkIFRoZSBmaWVsZC5cbiAqIEBwYXJhbSBwYXJzZSBXaGF0IHRvIHBhcnNlIHRoZSBmaWVsZCBhcy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHBhcnNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBmID0gYWNjZXNzUGF0aFdpdGhEYXR1bShmaWVsZCk7XG4gIGlmIChwYXJzZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gYHRvTnVtYmVyKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGB0b0Jvb2xlYW4oJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBgdG9TdHJpbmcoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnZGF0ZScpIHtcbiAgICByZXR1cm4gYHRvRGF0ZSgke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdmbGF0dGVuJykge1xuICAgIHJldHVybiBmO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ2RhdGU6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg1LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdGltZVBhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZigndXRjOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNCwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHV0Y1BhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UocGFyc2UpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfcGFyc2U6IERpY3Q8c3RyaW5nPjtcblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUobnVsbCwgZHVwbGljYXRlKHRoaXMuX3BhcnNlKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcGFyc2U6IERpY3Q8c3RyaW5nPikge1xuICAgIHN1cGVyKHBhcmVudCk7XG5cbiAgICB0aGlzLl9wYXJzZSA9IHBhcnNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwYXJzZSBub2RlIGZyb20gYSBkYXRhLmZvcm1hdC5wYXJzZSBhbmQgdXBkYXRlcyBhbmNlc3RvclBhcnNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtYWtlRXhwbGljaXQocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbCwgYW5jZXN0b3JQYXJzZTogQW5jZXN0b3JQYXJzZSkge1xuICAgIC8vIEN1c3RvbSBwYXJzZVxuICAgIGxldCBleHBsaWNpdCA9IHt9O1xuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5kYXRhO1xuICAgIGlmIChkYXRhICYmIGRhdGEuZm9ybWF0ICYmIGRhdGEuZm9ybWF0LnBhcnNlKSB7XG4gICAgICBleHBsaWNpdCA9IGRhdGEuZm9ybWF0LnBhcnNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1ha2VXaXRoQW5jZXN0b3JzKHBhcmVudCwgZXhwbGljaXQsIHt9LCBhbmNlc3RvclBhcnNlKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUltcGxpY2l0RnJvbUZpbHRlclRyYW5zZm9ybShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgdHJhbnNmb3JtOiBGaWx0ZXJUcmFuc2Zvcm0sIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpIHtcbiAgICBjb25zdCBwYXJzZSA9IHt9O1xuICAgIGZvckVhY2hMZWFmKHRyYW5zZm9ybS5maWx0ZXIsIGZpbHRlciA9PiB7XG4gICAgICBpZiAoaXNGaWVsZFByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRkIGEgcGFyc2Ugbm9kZSBmb3IgZmlsdGVycyB3aXRoIGZpbHRlciBvYmplY3RzXG4gICAgICAgIGxldCB2YWw6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBEYXRlVGltZSA9IG51bGw7XG5cbiAgICAgICAgLy8gRm9yIEVxdWFsRmlsdGVyLCBqdXN0IHVzZSB0aGUgZXF1YWwgcHJvcGVydHkuXG4gICAgICAgIC8vIEZvciBSYW5nZUZpbHRlciBhbmQgT25lT2ZGaWx0ZXIsIGFsbCBhcnJheSBtZW1iZXJzIHNob3VsZCBoYXZlXG4gICAgICAgIC8vIHRoZSBzYW1lIHR5cGUsIHNvIHdlIG9ubHkgdXNlIHRoZSBmaXJzdCBvbmUuXG4gICAgICAgIGlmIChpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgIHZhbCA9IGZpbHRlci5lcXVhbDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgIHZhbCA9IGZpbHRlci5yYW5nZVswXTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkT25lT2ZQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgIHZhbCA9IChmaWx0ZXIub25lT2YgfHwgZmlsdGVyWydpbiddKVswXTtcbiAgICAgICAgfSAvLyBlbHNlIC0tIGZvciBmaWx0ZXIgZXhwcmVzc2lvbiwgd2UgY2FuJ3QgaW5mZXIgYW55dGhpbmdcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIGlmIChpc0RhdGVUaW1lKHZhbCkpIHtcbiAgICAgICAgICAgIHBhcnNlW2ZpbHRlci5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ251bWJlcic7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ3N0cmluZyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbHRlci50aW1lVW5pdCkge1xuICAgICAgICAgIHBhcnNlW2ZpbHRlci5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChrZXlzKHBhcnNlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1ha2VXaXRoQW5jZXN0b3JzKHBhcmVudCwge30sIHBhcnNlLCBhbmNlc3RvclBhcnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcGFyc2Ugbm9kZSBmb3IgaW1wbGljaXQgcGFyc2luZyBmcm9tIGEgbW9kZWwgYW5kIHVwZGF0ZXMgYW5jZXN0b3JQYXJzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogTW9kZWwsIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpIHtcbiAgICBjb25zdCBpbXBsaWNpdCA9IHt9O1xuXG4gICAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgICAvLyBQYXJzZSBlbmNvZGVkIGZpZWxkc1xuICAgICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZpZWxkRGVmID0+IHtcbiAgICAgICAgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGltcGxpY2l0W2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGlmICghaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICAgICAgICAgIGltcGxpY2l0W2ZpZWxkRGVmLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhY2Nlc3NQYXRoRGVwdGgoZmllbGREZWYuZmllbGQpID4gMSkge1xuICAgICAgICAgIC8vIEZvciBub24tZGF0ZS9ub24tbnVtYmVyIChzdHJpbmdzIGFuZCBib29sZWFucyksIGRlcml2ZSBhIGZsYXR0ZW5lZCBmaWVsZCBmb3IgYSByZWZlcmVuY2VkIG5lc3RlZCBmaWVsZC5cbiAgICAgICAgICAvLyAoUGFyc2luZyBudW1iZXJzIC8gZGF0ZXMgYWxyZWFkeSBmbGF0dGVucyBudW1lcmljIGFuZCB0ZW1wb3JhbCBmaWVsZHMuKVxuICAgICAgICAgIGlmICghKGZpZWxkRGVmLmZpZWxkIGluIGltcGxpY2l0KSkge1xuICAgICAgICAgICAgaW1wbGljaXRbZmllbGREZWYuZmllbGRdID0gJ2ZsYXR0ZW4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpc1NjYWxlRmllbGREZWYoZmllbGREZWYpICYmIGlzU29ydEZpZWxkKGZpZWxkRGVmLnNvcnQpICYmIGFjY2Vzc1BhdGhEZXB0aChmaWVsZERlZi5zb3J0LmZpZWxkKSA+IDEpIHtcbiAgICAgICAgICAvLyBGbGF0dGVuIGZpZWxkcyB0aGF0IHdlIHNvcnQgYnkgYnV0IHRoYXQgYXJlIG5vdCBvdGhlcndpc2UgZmxhdHRlbmVkLlxuICAgICAgICAgIGlmICghKGZpZWxkRGVmLnNvcnQuZmllbGQgaW4gaW1wbGljaXQpKSB7XG4gICAgICAgICAgICBpbXBsaWNpdFtmaWVsZERlZi5zb3J0LmZpZWxkXSA9ICdmbGF0dGVuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1ha2VXaXRoQW5jZXN0b3JzKHBhcmVudCwge30sIGltcGxpY2l0LCBhbmNlc3RvclBhcnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcGFyc2Ugbm9kZSBmcm9tIFwiZXhwbGljaXRcIiBwYXJzZSBhbmQgXCJpbXBsaWNpdFwiIHBhcnNlIGFuZCB1cGRhdGVzIGFuY2VzdG9yUGFyc2UuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBtYWtlV2l0aEFuY2VzdG9ycyhwYXJlbnQ6IERhdGFGbG93Tm9kZSwgZXhwbGljaXQ6IERpY3Q8c3RyaW5nPiwgaW1wbGljaXQ6IERpY3Q8c3RyaW5nPiwgYW5jZXN0b3JQYXJzZTogQW5jZXN0b3JQYXJzZSkge1xuICAgIC8vIFdlIHNob3VsZCBub3QgcGFyc2Ugd2hhdCBoYXMgYWxyZWFkeSBiZWVuIHBhcnNlZCBpbiBhIHBhcmVudCAoZXhwbGljaXRseSBvciBpbXBsaWNpdGx5KSBvciB3aGF0IGhhcyBiZWVuIGRlcml2ZWQgKG1ha2VkIGFzIFwiZGVyaXZlZFwiKS4gV2UgYWxzbyBkb24ndCBuZWVkIHRvIGZsYXR0ZW4gYSBmaWVsZCB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkLlxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyhpbXBsaWNpdCkpIHtcbiAgICAgIGNvbnN0IHBhcnNlZEFzID0gYW5jZXN0b3JQYXJzZS5nZXRXaXRoRXhwbGljaXQoZmllbGQpO1xuICAgICAgaWYgKHBhcnNlZEFzLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gV2UgYWx3YXlzIGlnbm9yZSBkZXJpdmVkIGZpZWxkcyBldmVuIGlmIHRoZXkgYXJlIGltcGxpY2l0bHkgZGVmaW5lZCBiZWNhdXNlIHdlIGV4cGVjdCB1c2VycyB0byBjcmVhdGUgdGhlIHJpZ2h0IHR5cGVzLlxuICAgICAgICBpZiAocGFyc2VkQXMuZXhwbGljaXQgfHwgcGFyc2VkQXMudmFsdWUgPT09IGltcGxpY2l0W2ZpZWxkXSB8fCBwYXJzZWRBcy52YWx1ZSA9PT0gJ2Rlcml2ZWQnIHx8IGltcGxpY2l0W2ZpZWxkXSA9PT0gJ2ZsYXR0ZW4nKSB7XG4gICAgICAgICAgZGVsZXRlIGltcGxpY2l0W2ZpZWxkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaWZmZXJlbnRQYXJzZShmaWVsZCwgaW1wbGljaXRbZmllbGRdLCBwYXJzZWRBcy52YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKGV4cGxpY2l0KSkge1xuICAgICAgY29uc3QgcGFyc2VkQXMgPSBhbmNlc3RvclBhcnNlLmdldChmaWVsZCk7XG4gICAgICBpZiAocGFyc2VkQXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEb24ndCBwYXJzZSBhIGZpZWxkIGFnYWluIGlmIGl0IGhhcyBiZWVuIHBhcnNlZCB3aXRoIHRoZSBzYW1lIHR5cGUgYWxyZWFkeS5cbiAgICAgICAgaWYgKHBhcnNlZEFzID09PSBleHBsaWNpdFtmaWVsZF0pIHtcbiAgICAgICAgICBkZWxldGUgZXhwbGljaXRbZmllbGRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpZmZlcmVudFBhcnNlKGZpZWxkLCBleHBsaWNpdFtmaWVsZF0sIHBhcnNlZEFzKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYXJzZSA9IG5ldyBTcGxpdChleHBsaWNpdCwgaW1wbGljaXQpO1xuXG4gICAgLy8gYWRkIHRoZSBmb3JtYXQgcGFyc2UgZnJvbSB0aGlzIG1vZGVsIHNvIHRoYXQgY2hpbGRyZW4gZG9uJ3QgcGFyc2UgdGhlIHNhbWUgZmllbGQgYWdhaW5cbiAgICBhbmNlc3RvclBhcnNlLmNvcHlBbGwocGFyc2UpO1xuXG4gICAgLy8gY29weSBvbmx5IG5vbi1udWxsIHBhcnNlc1xuICAgIGNvbnN0IHAgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKHBhcnNlLmNvbWJpbmUoKSkpIHtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcnNlLmdldChrZXkpO1xuICAgICAgaWYgKHZhbCAhPT0gbnVsbCkge1xuICAgICAgICBwW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGtleXMocCkubGVuZ3RoID09PSAwIHx8IGFuY2VzdG9yUGFyc2UucGFyc2VOb3RoaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhcnNlTm9kZShwYXJlbnQsIHApO1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFBhcnNlTm9kZSkge1xuICAgIHRoaXMuX3BhcnNlID0gey4uLnRoaXMuX3BhcnNlLCAuLi5vdGhlci5wYXJzZX07XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZW1ibGUgYW4gb2JqZWN0IGZvciBWZWdhJ3MgZm9ybWF0LnBhcnNlIHByb3BlcnR5LlxuICAgKi9cbiAgcHVibGljIGFzc2VtYmxlRm9ybWF0UGFyc2UoKSB7XG4gICAgY29uc3QgZm9ybWF0UGFyc2UgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXModGhpcy5fcGFyc2UpKSB7XG4gICAgICBjb25zdCBwID0gdGhpcy5fcGFyc2VbZmllbGRdO1xuICAgICAgaWYgKGFjY2Vzc1BhdGhEZXB0aChmaWVsZCkgPT09IDEpIHtcbiAgICAgICAgZm9ybWF0UGFyc2VbZmllbGRdID0gcDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdFBhcnNlO1xuICB9XG5cbiAgLy8gZm9ybWF0IHBhcnNlIGRlcGVuZHMgYW5kIHByb2R1Y2VzIGFsbCBmaWVsZHMgaW4gaXRzIHBhcnNlXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMuX3BhcnNlKSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHRvU2V0KGtleXModGhpcy5fcGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRyYW5zZm9ybXMob25seU5lc3RlZCA9IGZhbHNlKTogVmdGb3JtdWxhVHJhbnNmb3JtW10ge1xuICAgIHJldHVybiBrZXlzKHRoaXMuX3BhcnNlKVxuICAgICAgLmZpbHRlcihmaWVsZCA9PiBvbmx5TmVzdGVkID8gYWNjZXNzUGF0aERlcHRoKGZpZWxkKSA+IDEgOiB0cnVlKVxuICAgICAgLm1hcChmaWVsZCA9PiB7XG4gICAgICAgIGNvbnN0IGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oZmllbGQsIHRoaXMuX3BhcnNlW2ZpZWxkXSk7XG4gICAgICAgIGlmICghZXhwcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybXVsYTogVmdGb3JtdWxhVHJhbnNmb3JtID0ge1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByLFxuICAgICAgICAgIGFzOiByZW1vdmVQYXRoRnJvbUZpZWxkKGZpZWxkKSAgLy8gVmVnYSBvdXRwdXQgaXMgYWx3YXlzIGZsYXR0ZW5lZFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZm9ybXVsYTtcbiAgICAgIH0pLmZpbHRlcih0ID0+IHQgIT09IG51bGwpO1xuICB9XG59XG4iXX0=