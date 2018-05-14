import * as tslib_1 from "tslib";
import { isString } from 'util';
import { isNumber, toSet } from 'vega-util';
import { isCountingAggregateOp } from '../../aggregate';
import { isDateTime } from '../../datetime';
import { isNumberFieldDef, isTimeFieldDef } from '../../fielddef';
import * as log from '../../log';
import { forEachLeaf } from '../../logical';
import { isFieldEqualPredicate, isFieldOneOfPredicate, isFieldPredicate, isFieldRangePredicate } from '../../predicate';
import { accessPathDepth, accessPathWithDatum, duplicate, keys, removePathFromField } from '../../util';
import { isFacetModel, isUnitModel } from '../model';
import { Split } from '../split';
import { DataFlowNode } from './dataflow';
/**
 * @param field The field.
 * @param parse What to parse the field as.
 */
function parseExpression(field, parse) {
    var f = accessPathWithDatum(field);
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
        return new ParseNode(null, duplicate(this._parse));
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
        forEachLeaf(transform.filter, function (filter) {
            if (isFieldPredicate(filter)) {
                // Automatically add a parse node for filters with filter objects
                var val = null;
                // For EqualFilter, just use the equal property.
                // For RangeFilter and OneOfFilter, all array members should have
                // the same type, so we only use the first one.
                if (isFieldEqualPredicate(filter)) {
                    val = filter.equal;
                }
                else if (isFieldRangePredicate(filter)) {
                    val = filter.range[0];
                }
                else if (isFieldOneOfPredicate(filter)) {
                    val = (filter.oneOf || filter['in'])[0];
                } // else -- for filter expression, we can't infer anything
                if (val) {
                    if (isDateTime(val)) {
                        parse[filter.field] = 'date';
                    }
                    else if (isNumber(val)) {
                        parse[filter.field] = 'number';
                    }
                    else if (isString(val)) {
                        parse[filter.field] = 'string';
                    }
                }
                if (filter.timeUnit) {
                    parse[filter.field] = 'date';
                }
            }
        });
        if (keys(parse).length === 0) {
            return null;
        }
        return this.makeWithAncestors(parent, {}, parse, ancestorParse);
    };
    /**
     * Creates a parse node for implicit parsing from a model and updates ancestorParse.
     */
    ParseNode.makeImplicitFromEncoding = function (parent, model, ancestorParse) {
        var implicit = {};
        if (isUnitModel(model) || isFacetModel(model)) {
            // Parse encoded fields
            model.forEachFieldDef(function (fieldDef) {
                if (isTimeFieldDef(fieldDef)) {
                    implicit[fieldDef.field] = 'date';
                }
                else if (isNumberFieldDef(fieldDef)) {
                    if (isCountingAggregateOp(fieldDef.aggregate)) {
                        return;
                    }
                    implicit[fieldDef.field] = 'number';
                }
                else if (accessPathDepth(fieldDef.field) > 1) {
                    // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
                    // (Parsing numbers / dates already flattens numeric and temporal fields.)
                    implicit[fieldDef.field] = 'flatten';
                }
            });
        }
        return this.makeWithAncestors(parent, {}, implicit, ancestorParse);
    };
    /**
     * Creates a parse node from "explicit" parse and "implicit" parse and updates ancestorParse.
     */
    ParseNode.makeWithAncestors = function (parent, explicit, implicit, ancestorParse) {
        // We should not parse what has already been parsed in a parent (explicitly or implicitly) or what has been derived (maked as "derived").
        for (var _i = 0, _a = keys(implicit); _i < _a.length; _i++) {
            var field = _a[_i];
            var parsedAs = ancestorParse.getWithExplicit(field);
            if (parsedAs.value !== undefined) {
                // We always ignore derived fields even if they are implicitly defined because we expect users to create the right types.
                if (parsedAs.explicit || parsedAs.value === implicit[field] || parsedAs.value === 'derived') {
                    delete implicit[field];
                }
                else {
                    log.warn(log.message.differentParse(field, implicit[field], parsedAs.value));
                }
            }
        }
        for (var _b = 0, _c = keys(explicit); _b < _c.length; _b++) {
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
        var parse = new Split(explicit, implicit);
        // add the format parse from this model so that children don't parse the same field again
        ancestorParse.copyAll(parse);
        // copy only non-null parses
        var p = {};
        for (var _d = 0, _e = keys(parse.combine()); _d < _e.length; _d++) {
            var key = _e[_d];
            var val = parse.get(key);
            if (val !== null) {
                p[key] = val;
            }
        }
        if (keys(p).length === 0 || ancestorParse.parseNothing) {
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
        for (var _i = 0, _a = keys(this._parse); _i < _a.length; _i++) {
            var field = _a[_i];
            var p = this._parse[field];
            if (accessPathDepth(field) === 1) {
                formatParse[field] = p;
            }
        }
        return formatParse;
    };
    // format parse depends and produces all fields in its parse
    ParseNode.prototype.producedFields = function () {
        return toSet(keys(this._parse));
    };
    ParseNode.prototype.dependentFields = function () {
        return toSet(keys(this._parse));
    };
    ParseNode.prototype.assembleTransforms = function (onlyNested) {
        var _this = this;
        if (onlyNested === void 0) { onlyNested = false; }
        return keys(this._parse)
            .filter(function (field) { return onlyNested ? accessPathDepth(field) > 1 : true; })
            .map(function (field) {
            var expr = parseExpression(field, _this._parse[field]);
            if (!expr) {
                return null;
            }
            var formula = {
                type: 'formula',
                expr: expr,
                as: removePathFromField(field) // Vega output is always flattened
            };
            return formula;
        }).filter(function (t) { return t !== null; });
    };
    return ParseNode;
}(DataFlowNode));
export { ParseNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRTFDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBVyxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEUsT0FBTyxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUMscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV0SCxPQUFPLEVBQUMsZUFBZSxFQUFFLG1CQUFtQixFQUFRLFNBQVMsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQVksTUFBTSxZQUFZLENBQUM7QUFFdkgsT0FBTyxFQUFDLFlBQVksRUFBRSxXQUFXLEVBQVEsTUFBTSxVQUFVLENBQUM7QUFDMUQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR3hDOzs7R0FHRztBQUNILHlCQUF5QixLQUFhLEVBQUUsS0FBYTtJQUNuRCxJQUFNLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdEIsT0FBTyxjQUFZLENBQUMsTUFBRyxDQUFDO0tBQ3pC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LENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxtQ0FBZSxHQUF0QjtRQUNFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sc0NBQWtCLEdBQXpCLFVBQTBCLFVBQWtCO1FBQTVDLGlCQWdCQztRQWhCeUIsMkJBQUEsRUFBQSxrQkFBa0I7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNyQixNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxVQUFVLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBOUMsQ0FBOEMsQ0FBQzthQUMvRCxHQUFHLENBQUMsVUFBQSxLQUFLO1lBQ1IsSUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxPQUFPLEdBQXVCO2dCQUNsQyxJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLE1BQUE7Z0JBQ0osRUFBRSxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFFLGtDQUFrQzthQUNuRSxDQUFDO1lBQ0YsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBak1ELENBQStCLFlBQVksR0FpTTFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndXRpbCc7XG5pbXBvcnQge2lzTnVtYmVyLCB0b1NldH0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7QW5jZXN0b3JQYXJzZX0gZnJvbSAnLic7XG5pbXBvcnQge2lzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7RGF0ZVRpbWUsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7aXNOdW1iZXJGaWVsZERlZiwgaXNUaW1lRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtmb3JFYWNoTGVhZn0gZnJvbSAnLi4vLi4vbG9naWNhbCc7XG5pbXBvcnQge2lzRmllbGRFcXVhbFByZWRpY2F0ZSwgaXNGaWVsZE9uZU9mUHJlZGljYXRlLCBpc0ZpZWxkUHJlZGljYXRlLCBpc0ZpZWxkUmFuZ2VQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge0ZpbHRlclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7YWNjZXNzUGF0aERlcHRoLCBhY2Nlc3NQYXRoV2l0aERhdHVtLCBEaWN0LCBkdXBsaWNhdGUsIGtleXMsIHJlbW92ZVBhdGhGcm9tRmllbGQsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRm9ybXVsYVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTcGxpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbi8qKlxuICogQHBhcmFtIGZpZWxkIFRoZSBmaWVsZC5cbiAqIEBwYXJhbSBwYXJzZSBXaGF0IHRvIHBhcnNlIHRoZSBmaWVsZCBhcy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHBhcnNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBmID0gYWNjZXNzUGF0aFdpdGhEYXR1bShmaWVsZCk7XG4gIGlmIChwYXJzZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gYHRvTnVtYmVyKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGB0b0Jvb2xlYW4oJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBgdG9TdHJpbmcoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnZGF0ZScpIHtcbiAgICByZXR1cm4gYHRvRGF0ZSgke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdmbGF0dGVuJykge1xuICAgIHJldHVybiBmO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ2RhdGU6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg1LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdGltZVBhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZigndXRjOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNCwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHV0Y1BhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UocGFyc2UpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfcGFyc2U6IERpY3Q8c3RyaW5nPjtcblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUobnVsbCwgZHVwbGljYXRlKHRoaXMuX3BhcnNlKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcGFyc2U6IERpY3Q8c3RyaW5nPikge1xuICAgIHN1cGVyKHBhcmVudCk7XG5cbiAgICB0aGlzLl9wYXJzZSA9IHBhcnNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwYXJzZSBub2RlIGZyb20gYSBkYXRhLmZvcm1hdC5wYXJzZSBhbmQgdXBkYXRlcyBhbmNlc3RvclBhcnNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtYWtlRXhwbGljaXQocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbCwgYW5jZXN0b3JQYXJzZTogQW5jZXN0b3JQYXJzZSkge1xuICAgIC8vIEN1c3RvbSBwYXJzZVxuICAgIGxldCBleHBsaWNpdCA9IHt9O1xuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5kYXRhO1xuICAgIGlmIChkYXRhICYmIGRhdGEuZm9ybWF0ICYmIGRhdGEuZm9ybWF0LnBhcnNlKSB7XG4gICAgICBleHBsaWNpdCA9IGRhdGEuZm9ybWF0LnBhcnNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1ha2VXaXRoQW5jZXN0b3JzKHBhcmVudCwgZXhwbGljaXQsIHt9LCBhbmNlc3RvclBhcnNlKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUltcGxpY2l0RnJvbUZpbHRlclRyYW5zZm9ybShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgdHJhbnNmb3JtOiBGaWx0ZXJUcmFuc2Zvcm0sIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpIHtcbiAgICBjb25zdCBwYXJzZSA9IHt9O1xuICAgIGZvckVhY2hMZWFmKHRyYW5zZm9ybS5maWx0ZXIsIGZpbHRlciA9PiB7XG4gICAgICBpZiAoaXNGaWVsZFByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRkIGEgcGFyc2Ugbm9kZSBmb3IgZmlsdGVycyB3aXRoIGZpbHRlciBvYmplY3RzXG4gICAgICAgIGxldCB2YWw6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBEYXRlVGltZSA9IG51bGw7XG5cbiAgICAgICAgLy8gRm9yIEVxdWFsRmlsdGVyLCBqdXN0IHVzZSB0aGUgZXF1YWwgcHJvcGVydHkuXG4gICAgICAgIC8vIEZvciBSYW5nZUZpbHRlciBhbmQgT25lT2ZGaWx0ZXIsIGFsbCBhcnJheSBtZW1iZXJzIHNob3VsZCBoYXZlXG4gICAgICAgIC8vIHRoZSBzYW1lIHR5cGUsIHNvIHdlIG9ubHkgdXNlIHRoZSBmaXJzdCBvbmUuXG4gICAgICAgIGlmIChpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgIHZhbCA9IGZpbHRlci5lcXVhbDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgIHZhbCA9IGZpbHRlci5yYW5nZVswXTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkT25lT2ZQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgIHZhbCA9IChmaWx0ZXIub25lT2YgfHwgZmlsdGVyWydpbiddKVswXTtcbiAgICAgICAgfSAvLyBlbHNlIC0tIGZvciBmaWx0ZXIgZXhwcmVzc2lvbiwgd2UgY2FuJ3QgaW5mZXIgYW55dGhpbmdcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIGlmIChpc0RhdGVUaW1lKHZhbCkpIHtcbiAgICAgICAgICAgIHBhcnNlW2ZpbHRlci5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ251bWJlcic7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ3N0cmluZyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbHRlci50aW1lVW5pdCkge1xuICAgICAgICAgIHBhcnNlW2ZpbHRlci5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChrZXlzKHBhcnNlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1ha2VXaXRoQW5jZXN0b3JzKHBhcmVudCwge30sIHBhcnNlLCBhbmNlc3RvclBhcnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcGFyc2Ugbm9kZSBmb3IgaW1wbGljaXQgcGFyc2luZyBmcm9tIGEgbW9kZWwgYW5kIHVwZGF0ZXMgYW5jZXN0b3JQYXJzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogTW9kZWwsIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpIHtcbiAgICBjb25zdCBpbXBsaWNpdCA9IHt9O1xuXG4gICAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgICAvLyBQYXJzZSBlbmNvZGVkIGZpZWxkc1xuICAgICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZpZWxkRGVmID0+IHtcbiAgICAgICAgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGltcGxpY2l0W2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGlmIChpc0NvdW50aW5nQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBsaWNpdFtmaWVsZERlZi5maWVsZF0gPSAnbnVtYmVyJztcbiAgICAgICAgfSBlbHNlIGlmIChhY2Nlc3NQYXRoRGVwdGgoZmllbGREZWYuZmllbGQpID4gMSkge1xuICAgICAgICAgIC8vIEZvciBub24tZGF0ZS9ub24tbnVtYmVyIChzdHJpbmdzIGFuZCBib29sZWFucyksIGRlcml2ZSBhIGZsYXR0ZW5lZCBmaWVsZCBmb3IgYSByZWZlcmVuY2VkIG5lc3RlZCBmaWVsZC5cbiAgICAgICAgICAvLyAoUGFyc2luZyBudW1iZXJzIC8gZGF0ZXMgYWxyZWFkeSBmbGF0dGVucyBudW1lcmljIGFuZCB0ZW1wb3JhbCBmaWVsZHMuKVxuICAgICAgICAgIGltcGxpY2l0W2ZpZWxkRGVmLmZpZWxkXSA9ICdmbGF0dGVuJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWFrZVdpdGhBbmNlc3RvcnMocGFyZW50LCB7fSwgaW1wbGljaXQsIGFuY2VzdG9yUGFyc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwYXJzZSBub2RlIGZyb20gXCJleHBsaWNpdFwiIHBhcnNlIGFuZCBcImltcGxpY2l0XCIgcGFyc2UgYW5kIHVwZGF0ZXMgYW5jZXN0b3JQYXJzZS5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIG1ha2VXaXRoQW5jZXN0b3JzKHBhcmVudDogRGF0YUZsb3dOb2RlLCBleHBsaWNpdDogRGljdDxzdHJpbmc+LCBpbXBsaWNpdDogRGljdDxzdHJpbmc+LCBhbmNlc3RvclBhcnNlOiBBbmNlc3RvclBhcnNlKSB7XG4gICAgLy8gV2Ugc2hvdWxkIG5vdCBwYXJzZSB3aGF0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkIGluIGEgcGFyZW50IChleHBsaWNpdGx5IG9yIGltcGxpY2l0bHkpIG9yIHdoYXQgaGFzIGJlZW4gZGVyaXZlZCAobWFrZWQgYXMgXCJkZXJpdmVkXCIpLlxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyhpbXBsaWNpdCkpIHtcbiAgICAgIGNvbnN0IHBhcnNlZEFzID0gYW5jZXN0b3JQYXJzZS5nZXRXaXRoRXhwbGljaXQoZmllbGQpO1xuICAgICAgaWYgKHBhcnNlZEFzLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gV2UgYWx3YXlzIGlnbm9yZSBkZXJpdmVkIGZpZWxkcyBldmVuIGlmIHRoZXkgYXJlIGltcGxpY2l0bHkgZGVmaW5lZCBiZWNhdXNlIHdlIGV4cGVjdCB1c2VycyB0byBjcmVhdGUgdGhlIHJpZ2h0IHR5cGVzLlxuICAgICAgICBpZiAocGFyc2VkQXMuZXhwbGljaXQgfHwgcGFyc2VkQXMudmFsdWUgPT09IGltcGxpY2l0W2ZpZWxkXSB8fCBwYXJzZWRBcy52YWx1ZSA9PT0gJ2Rlcml2ZWQnKSB7XG4gICAgICAgICAgZGVsZXRlIGltcGxpY2l0W2ZpZWxkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaWZmZXJlbnRQYXJzZShmaWVsZCwgaW1wbGljaXRbZmllbGRdLCBwYXJzZWRBcy52YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKGV4cGxpY2l0KSkge1xuICAgICAgY29uc3QgcGFyc2VkQXMgPSBhbmNlc3RvclBhcnNlLmdldChmaWVsZCk7XG4gICAgICBpZiAocGFyc2VkQXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEb24ndCBwYXJzZSBhIGZpZWxkIGFnYWluIGlmIGl0IGhhcyBiZWVuIHBhcnNlZCB3aXRoIHRoZSBzYW1lIHR5cGUgYWxyZWFkeS5cbiAgICAgICAgaWYgKHBhcnNlZEFzID09PSBleHBsaWNpdFtmaWVsZF0pIHtcbiAgICAgICAgICBkZWxldGUgZXhwbGljaXRbZmllbGRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpZmZlcmVudFBhcnNlKGZpZWxkLCBleHBsaWNpdFtmaWVsZF0sIHBhcnNlZEFzKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYXJzZSA9IG5ldyBTcGxpdChleHBsaWNpdCwgaW1wbGljaXQpO1xuXG4gICAgLy8gYWRkIHRoZSBmb3JtYXQgcGFyc2UgZnJvbSB0aGlzIG1vZGVsIHNvIHRoYXQgY2hpbGRyZW4gZG9uJ3QgcGFyc2UgdGhlIHNhbWUgZmllbGQgYWdhaW5cbiAgICBhbmNlc3RvclBhcnNlLmNvcHlBbGwocGFyc2UpO1xuXG4gICAgLy8gY29weSBvbmx5IG5vbi1udWxsIHBhcnNlc1xuICAgIGNvbnN0IHAgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKHBhcnNlLmNvbWJpbmUoKSkpIHtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcnNlLmdldChrZXkpO1xuICAgICAgaWYgKHZhbCAhPT0gbnVsbCkge1xuICAgICAgICBwW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGtleXMocCkubGVuZ3RoID09PSAwIHx8IGFuY2VzdG9yUGFyc2UucGFyc2VOb3RoaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhcnNlTm9kZShwYXJlbnQsIHApO1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IFBhcnNlTm9kZSkge1xuICAgIHRoaXMuX3BhcnNlID0gey4uLnRoaXMuX3BhcnNlLCAuLi5vdGhlci5wYXJzZX07XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZW1ibGUgYW4gb2JqZWN0IGZvciBWZWdhJ3MgZm9ybWF0LnBhcnNlIHByb3BlcnR5LlxuICAgKi9cbiAgcHVibGljIGFzc2VtYmxlRm9ybWF0UGFyc2UoKSB7XG4gICAgY29uc3QgZm9ybWF0UGFyc2UgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXModGhpcy5fcGFyc2UpKSB7XG4gICAgICBjb25zdCBwID0gdGhpcy5fcGFyc2VbZmllbGRdO1xuICAgICAgaWYgKGFjY2Vzc1BhdGhEZXB0aChmaWVsZCkgPT09IDEpIHtcbiAgICAgICAgZm9ybWF0UGFyc2VbZmllbGRdID0gcDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdFBhcnNlO1xuICB9XG5cbiAgLy8gZm9ybWF0IHBhcnNlIGRlcGVuZHMgYW5kIHByb2R1Y2VzIGFsbCBmaWVsZHMgaW4gaXRzIHBhcnNlXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMuX3BhcnNlKSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHRvU2V0KGtleXModGhpcy5fcGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRyYW5zZm9ybXMob25seU5lc3RlZCA9IGZhbHNlKTogVmdGb3JtdWxhVHJhbnNmb3JtW10ge1xuICAgIHJldHVybiBrZXlzKHRoaXMuX3BhcnNlKVxuICAgICAgLmZpbHRlcihmaWVsZCA9PiBvbmx5TmVzdGVkID8gYWNjZXNzUGF0aERlcHRoKGZpZWxkKSA+IDEgOiB0cnVlKVxuICAgICAgLm1hcChmaWVsZCA9PiB7XG4gICAgICAgIGNvbnN0IGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oZmllbGQsIHRoaXMuX3BhcnNlW2ZpZWxkXSk7XG4gICAgICAgIGlmICghZXhwcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybXVsYTogVmdGb3JtdWxhVHJhbnNmb3JtID0ge1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByLFxuICAgICAgICAgIGFzOiByZW1vdmVQYXRoRnJvbUZpZWxkKGZpZWxkKSAgLy8gVmVnYSBvdXRwdXQgaXMgYWx3YXlzIGZsYXR0ZW5lZFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZm9ybXVsYTtcbiAgICAgIH0pLmZpbHRlcih0ID0+IHQgIT09IG51bGwpO1xuICB9XG59XG4iXX0=