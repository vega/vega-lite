"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var filter_1 = require("../../filter");
var log = require("../../log");
var transform_1 = require("../../transform");
var type_1 = require("../../type");
var util_1 = require("../../util");
var model_1 = require("../model");
var dataflow_1 = require("./dataflow");
function parseExpression(field, parse) {
    var f = "datum[\"" + field + "\"]";
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
        var specifier = parse.slice(6, parse.length - 1); // specifier is in "" or ''
        return "timeParse(" + f + ",\"" + specifier + "\")";
    }
    else {
        log.warn(log.message.unrecognizedParse(parse));
        return null;
    }
}
var ParseNode = (function (_super) {
    tslib_1.__extends(ParseNode, _super);
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
        var calcFieldMap = model.transforms.filter(transform_1.isCalculate).reduce(function (fieldMap, formula) {
            fieldMap[formula.as] = true;
            return fieldMap;
        }, {});
        // Parse filter fields
        model.transforms.filter(transform_1.isFilter).forEach(function (transform) {
            var filter = transform.filter;
            if (!util_1.isArray(filter)) {
                filter = [filter];
            }
            filter.forEach(function (f) {
                var val = null;
                // For EqualFilter, just use the equal property.
                // For RangeFilter and OneOfFilter, all array members should have
                // the same type, so we only use the first one.
                if (filter_1.isEqualFilter(f)) {
                    val = f.equal;
                }
                else if (filter_1.isRangeFilter(f)) {
                    val = f.range[0];
                }
                else if (filter_1.isOneOfFilter(f)) {
                    val = (f.oneOf || f['in'])[0];
                } // else -- for filter expression, we can't infer anything
                if (val) {
                    if (datetime_1.isDateTime(val)) {
                        parse[f['field']] = 'date';
                    }
                    else if (util_1.isNumber(val)) {
                        parse[f['field']] = 'number';
                    }
                    else if (util_1.isString(val)) {
                        parse[f['field']] = 'string';
                    }
                }
            });
        });
        if (model instanceof model_1.ModelWithField) {
            // Parse encoded fields
            model.forEachFieldDef(function (fieldDef) {
                if (fieldDef.type === type_1.TEMPORAL) {
                    parse[fieldDef.field] = 'date';
                }
                else if (fieldDef.type === type_1.QUANTITATIVE) {
                    if (fielddef_1.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
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
        this._parse = util_1.extend(this._parse, other.parse);
        other.remove();
    };
    ParseNode.prototype.assembleFormatParse = function () {
        return this._parse;
    };
    ParseNode.prototype.assembleTransforms = function () {
        var _this = this;
        return Object.keys(this._parse).map(function (field) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFvRDtBQUNwRCwyQ0FBaUQ7QUFDakQsdUNBQXlFO0FBQ3pFLCtCQUFpQztBQUNqQyw2Q0FBMkY7QUFDM0YsbUNBQWtEO0FBQ2xELG1DQUFzRjtBQUV0RixrQ0FBK0M7QUFDL0MsdUNBQXdDO0FBR3hDLHlCQUF5QixLQUFhLEVBQUUsS0FBYTtJQUNuRCxJQUFNLENBQUMsR0FBRyxhQUFVLEtBQUssUUFBSSxDQUFDO0lBQzlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxjQUFZLENBQUMsTUFBRyxDQUFDO0lBQzFCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLGVBQWEsQ0FBQyxNQUFHLENBQUM7SUFDM0IsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsY0FBWSxDQUFDLE1BQUcsQ0FBQztJQUMxQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxZQUFVLENBQUMsTUFBRyxDQUFDO0lBQ3hCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FB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