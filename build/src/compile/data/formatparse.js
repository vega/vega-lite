import * as tslib_1 from "tslib";
import { toSet } from 'vega-util';
import { isCountingAggregateOp } from '../../aggregate';
import { isNumberFieldDef, isTimeFieldDef } from '../../fielddef';
import * as log from '../../log';
import { forEachLeaf } from '../../logical';
import { isFieldPredicate } from '../../predicate';
import { isCalculate, isFilter } from '../../transform';
import { accessPathDepth, accessPathWithDatum, duplicate, keys, removePathFromField } from '../../util';
import { isFacetModel, isUnitModel } from '../model';
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
        _this._parse = {};
        _this._parse = parse;
        return _this;
    }
    ParseNode.prototype.clone = function () {
        return new ParseNode(null, duplicate(this.parse));
    };
    ParseNode.make = function (parent, model) {
        var parse = {};
        var calcFieldMap = {};
        (model.transforms || []).forEach(function (transform) {
            if (isCalculate(transform)) {
                calcFieldMap[transform.as] = true;
            }
            else if (isFilter(transform)) {
                forEachLeaf(transform.filter, function (filter) {
                    if (isFieldPredicate(filter)) {
                        if (filter.timeUnit) {
                            parse[filter.field] = 'date';
                        }
                    }
                });
            }
        }, {});
        if (isUnitModel(model) || isFacetModel(model)) {
            // Parse encoded fields
            model.forEachFieldDef(function (fieldDef) {
                if (isTimeFieldDef(fieldDef)) {
                    parse[fieldDef.field] = 'date';
                }
                else if (isNumberFieldDef(fieldDef)) {
                    if (calcFieldMap[fieldDef.field] || isCountingAggregateOp(fieldDef.aggregate)) {
                        return;
                    }
                    parse[fieldDef.field] = 'number';
                }
                else if (accessPathDepth(fieldDef.field) > 1) {
                    // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
                    // (Parsing numbers / dates already flattens numeric and temporal fields.)
                    parse[fieldDef.field] = 'flatten';
                }
            });
        }
        // Custom parse should override inferred parse
        var data = model.data;
        if (data && data.format && data.format.parse) {
            var p_1 = data.format.parse;
            keys(p_1).forEach(function (field) {
                parse[field] = p_1[field];
            });
        }
        // We should not parse what has already been parsed in a parent
        var modelParse = model.component.data.ancestorParse;
        keys(modelParse).forEach(function (field) {
            if (parse[field] !== modelParse[field]) {
                log.warn(log.message.differentParse(field, parse[field], modelParse[field]));
            }
            else {
                delete parse[field];
            }
        });
        if (keys(parse).length === 0) {
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
        var formatParse = {};
        for (var _i = 0, _a = keys(this._parse); _i < _a.length; _i++) {
            var field = _a[_i];
            if (accessPathDepth(field) === 1) {
                formatParse[field] = this._parse[field];
            }
        }
        return formatParse;
    };
    // format parse depends and produces all fields in its parse
    ParseNode.prototype.producedFields = function () {
        return toSet(keys(this.parse));
    };
    ParseNode.prototype.dependentFields = function () {
        return toSet(keys(this.parse));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxXQUFXLEVBQUUsUUFBUSxFQUFZLE1BQU0saUJBQWlCLENBQUM7QUFDakUsT0FBTyxFQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBUSxTQUFTLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFZLE1BQU0sWUFBWSxDQUFDO0FBRXZILE9BQU8sRUFBQyxZQUFZLEVBQUUsV0FBVyxFQUFRLE1BQU0sVUFBVSxDQUFDO0FBQzFELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFeEM7OztHQUdHO0FBQ0gseUJBQXlCLEtBQWEsRUFBRSxLQUFhO0lBQ25ELElBQU0sQ0FBQyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUN0QixPQUFPLGNBQVksQ0FBQyxNQUFHLENBQUM7S0FDekI7U0FBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDOUIsT0FBTyxlQUFhLENBQUMsTUFBRyxDQUFDO0tBQzFCO1NBQU0sSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE9BQU8sY0FBWSxDQUFD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QUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3JCLE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLFVBQVUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUE5QyxDQUE4QyxDQUFDO2FBQy9ELEdBQUcsQ0FBQyxVQUFBLEtBQUs7WUFDUixJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFNLE9BQU8sR0FBdUI7Z0JBQ2xDLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksTUFBQTtnQkFDSixFQUFFLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUUsa0NBQWtDO2FBQ25FLENBQUM7WUFDRixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF2SEQsQ0FBK0IsWUFBWSxHQXVIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3RvU2V0fSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge2lzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7aXNOdW1iZXJGaWVsZERlZiwgaXNUaW1lRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtmb3JFYWNoTGVhZn0gZnJvbSAnLi4vLi4vbG9naWNhbCc7XG5pbXBvcnQge2lzRmllbGRQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2lzQ2FsY3VsYXRlLCBpc0ZpbHRlciwgVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHthY2Nlc3NQYXRoRGVwdGgsIGFjY2Vzc1BhdGhXaXRoRGF0dW0sIERpY3QsIGR1cGxpY2F0ZSwga2V5cywgcmVtb3ZlUGF0aEZyb21GaWVsZCwgU3RyaW5nU2V0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGb3JtdWxhVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkIFRoZSBmaWVsZC5cbiAqIEBwYXJhbSBwYXJzZSBXaGF0IHRvIHBhcnNlIHRoZSBmaWVsZCBhcy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHBhcnNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBmID0gYWNjZXNzUGF0aFdpdGhEYXR1bShmaWVsZCk7XG4gIGlmIChwYXJzZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gYHRvTnVtYmVyKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGB0b0Jvb2xlYW4oJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBgdG9TdHJpbmcoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlID09PSAnZGF0ZScpIHtcbiAgICByZXR1cm4gYHRvRGF0ZSgke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdmbGF0dGVuJykge1xuICAgIHJldHVybiBmO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ2RhdGU6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg1LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdGltZVBhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZigndXRjOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNCwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHV0Y1BhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UocGFyc2UpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfcGFyc2U6IERpY3Q8c3RyaW5nPiA9IHt9O1xuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlTm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5wYXJzZSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHBhcnNlOiBEaWN0PHN0cmluZz4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgdGhpcy5fcGFyc2UgPSBwYXJzZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICBjb25zdCBjYWxjRmllbGRNYXAgPSB7fTtcblxuICAgIChtb2RlbC50cmFuc2Zvcm1zIHx8IFtdKS5mb3JFYWNoKCh0cmFuc2Zvcm06IFRyYW5zZm9ybSkgPT4ge1xuICAgICAgaWYgKGlzQ2FsY3VsYXRlKHRyYW5zZm9ybSkpIHtcbiAgICAgICAgY2FsY0ZpZWxkTWFwW3RyYW5zZm9ybS5hc10gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0cmFuc2Zvcm0pKSB7XG4gICAgICAgIGZvckVhY2hMZWFmKHRyYW5zZm9ybS5maWx0ZXIsIChmaWx0ZXIpID0+IHtcbiAgICAgICAgICBpZiAoaXNGaWVsZFByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLnRpbWVVbml0KSB7XG4gICAgICAgICAgICAgIHBhcnNlW2ZpbHRlci5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCB7fSk7XG5cbiAgICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICAgIC8vIFBhcnNlIGVuY29kZWQgZmllbGRzXG4gICAgICBtb2RlbC5mb3JFYWNoRmllbGREZWYoZmllbGREZWYgPT4ge1xuICAgICAgICBpZiAoaXNUaW1lRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgICAgICAgcGFyc2VbZmllbGREZWYuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgICAgICAgaWYgKGNhbGNGaWVsZE1hcFtmaWVsZERlZi5maWVsZF0gfHwgaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyc2VbZmllbGREZWYuZmllbGRdID0gJ251bWJlcic7XG4gICAgICAgIH0gZWxzZSBpZiAoYWNjZXNzUGF0aERlcHRoKGZpZWxkRGVmLmZpZWxkKSA+IDEpIHtcbiAgICAgICAgICAvLyBGb3Igbm9uLWRhdGUvbm9uLW51bWJlciAoc3RyaW5ncyBhbmQgYm9vbGVhbnMpLCBkZXJpdmUgYSBmbGF0dGVuZWQgZmllbGQgZm9yIGEgcmVmZXJlbmNlZCBuZXN0ZWQgZmllbGQuXG4gICAgICAgICAgLy8gKFBhcnNpbmcgbnVtYmVycyAvIGRhdGVzIGFscmVhZHkgZmxhdHRlbnMgbnVtZXJpYyBhbmQgdGVtcG9yYWwgZmllbGRzLilcbiAgICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnZmxhdHRlbic7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEN1c3RvbSBwYXJzZSBzaG91bGQgb3ZlcnJpZGUgaW5mZXJyZWQgcGFyc2VcbiAgICBjb25zdCBkYXRhID0gbW9kZWwuZGF0YTtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmZvcm1hdCAmJiBkYXRhLmZvcm1hdC5wYXJzZSkge1xuICAgICAgY29uc3QgcCA9IGRhdGEuZm9ybWF0LnBhcnNlO1xuICAgICAga2V5cyhwKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgcGFyc2VbZmllbGRdID0gcFtmaWVsZF07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXZSBzaG91bGQgbm90IHBhcnNlIHdoYXQgaGFzIGFscmVhZHkgYmVlbiBwYXJzZWQgaW4gYSBwYXJlbnRcbiAgICBjb25zdCBtb2RlbFBhcnNlID0gbW9kZWwuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZTtcbiAgICBrZXlzKG1vZGVsUGFyc2UpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgaWYgKHBhcnNlW2ZpZWxkXSAhPT0gbW9kZWxQYXJzZVtmaWVsZF0pIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZGlmZmVyZW50UGFyc2UoZmllbGQsIHBhcnNlW2ZpZWxkXSwgbW9kZWxQYXJzZVtmaWVsZF0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBwYXJzZVtmaWVsZF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoa2V5cyhwYXJzZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhcnNlTm9kZShwYXJlbnQsIHBhcnNlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBQYXJzZU5vZGUpIHtcbiAgICB0aGlzLl9wYXJzZSA9IHsuLi50aGlzLl9wYXJzZSwgLi4ub3RoZXIucGFyc2V9O1xuICAgIG90aGVyLnJlbW92ZSgpO1xuICB9XG4gIHB1YmxpYyBhc3NlbWJsZUZvcm1hdFBhcnNlKCkge1xuICAgIGNvbnN0IGZvcm1hdFBhcnNlID0ge307XG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKHRoaXMuX3BhcnNlKSkge1xuICAgICAgaWYgKGFjY2Vzc1BhdGhEZXB0aChmaWVsZCkgPT09IDEpIHtcbiAgICAgICAgZm9ybWF0UGFyc2VbZmllbGRdID0gdGhpcy5fcGFyc2VbZmllbGRdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0UGFyc2U7XG4gIH1cblxuICAvLyBmb3JtYXQgcGFyc2UgZGVwZW5kcyBhbmQgcHJvZHVjZXMgYWxsIGZpZWxkcyBpbiBpdHMgcGFyc2VcbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHRvU2V0KGtleXModGhpcy5wYXJzZSkpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRyYW5zZm9ybXMob25seU5lc3RlZCA9IGZhbHNlKTogVmdGb3JtdWxhVHJhbnNmb3JtW10ge1xuICAgIHJldHVybiBrZXlzKHRoaXMuX3BhcnNlKVxuICAgICAgLmZpbHRlcihmaWVsZCA9PiBvbmx5TmVzdGVkID8gYWNjZXNzUGF0aERlcHRoKGZpZWxkKSA+IDEgOiB0cnVlKVxuICAgICAgLm1hcChmaWVsZCA9PiB7XG4gICAgICAgIGNvbnN0IGV4cHIgPSBwYXJzZUV4cHJlc3Npb24oZmllbGQsIHRoaXMuX3BhcnNlW2ZpZWxkXSk7XG4gICAgICAgIGlmICghZXhwcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybXVsYTogVmdGb3JtdWxhVHJhbnNmb3JtID0ge1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByLFxuICAgICAgICAgIGFzOiByZW1vdmVQYXRoRnJvbUZpZWxkKGZpZWxkKSAgLy8gVmVnYSBvdXRwdXQgaXMgYWx3YXlzIGZsYXR0ZW5lZFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZm9ybXVsYTtcbiAgICAgIH0pLmZpbHRlcih0ID0+IHQgIT09IG51bGwpO1xuICB9XG59XG4iXX0=