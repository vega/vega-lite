import * as tslib_1 from "tslib";
import { isNumber, isString, toSet } from 'vega-util';
import { isCountingAggregateOp } from '../../aggregate';
import { isDateTime } from '../../datetime';
import { isNumberFieldDef, isScaleFieldDef, isTimeFieldDef } from '../../fielddef';
import * as log from '../../log';
import { forEachLeaf } from '../../logical';
import { isFieldEqualPredicate, isFieldOneOfPredicate, isFieldPredicate, isFieldRangePredicate } from '../../predicate';
import { isSortField } from '../../sort';
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
                    if (!isCountingAggregateOp(fieldDef.aggregate)) {
                        implicit[fieldDef.field] = 'number';
                    }
                }
                else if (accessPathDepth(fieldDef.field) > 1) {
                    // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
                    // (Parsing numbers / dates already flattens numeric and temporal fields.)
                    if (!(fieldDef.field in implicit)) {
                        implicit[fieldDef.field] = 'flatten';
                    }
                }
                else if (isScaleFieldDef(fieldDef) &&
                    isSortField(fieldDef.sort) &&
                    accessPathDepth(fieldDef.sort.field) > 1) {
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
        for (var _i = 0, _a = keys(implicit); _i < _a.length; _i++) {
            var field = _a[_i];
            var parsedAs = ancestorParse.getWithExplicit(field);
            if (parsedAs.value !== undefined) {
                // We always ignore derived fields even if they are implicitly defined because we expect users to create the right types.
                if (parsedAs.explicit ||
                    parsedAs.value === implicit[field] ||
                    parsedAs.value === 'derived' ||
                    implicit[field] === 'flatten') {
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
            .filter(function (field) { return (onlyNested ? accessPathDepth(field) > 1 : true); })
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
        })
            .filter(function (t) { return t !== null; });
    };
    return ParseNode;
}(DataFlowNode));
export { ParseNode };
//# sourceMappingURL=formatparse.js.map