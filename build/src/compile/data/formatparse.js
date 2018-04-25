import * as tslib_1 from "tslib";
import { toSet } from 'vega-util';
import { isCountingAggregateOp } from '../../aggregate';
import { isNumberFieldDef, isTimeFieldDef } from '../../fielddef';
import * as log from '../../log';
import { forEachLeave } from '../../logical';
import { isFieldPredicate } from '../../predicate';
import { isCalculate, isFilter } from '../../transform';
import { accessPath, duplicate, keys } from '../../util';
import { isFacetModel, isUnitModel } from '../model';
import { DataFlowNode } from './dataflow';
function parseExpression(field, parse) {
    var f = "datum" + accessPath(field);
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
                forEachLeave(transform.filter, function (filter) {
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
        return this._parse;
    };
    // format parse depends and produces all fields in its parse
    ParseNode.prototype.producedFields = function () {
        return toSet(keys(this.parse));
    };
    ParseNode.prototype.dependentFields = function () {
        return toSet(keys(this.parse));
    };
    ParseNode.prototype.assembleTransforms = function () {
        var _this = this;
        return keys(this._parse).map(function (field) {
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
}(DataFlowNode));
export { ParseNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxXQUFXLEVBQUUsUUFBUSxFQUFZLE1BQU0saUJBQWlCLENBQUM7QUFDakUsT0FBTyxFQUFDLFVBQVUsRUFBUSxTQUFTLEVBQUUsSUFBSSxFQUFZLE1BQU0sWUFBWSxDQUFDO0FBRXhFLE9BQU8sRUFBQyxZQUFZLEVBQUUsV0FBVyxFQUFRLE1BQU0sVUFBVSxDQUFDO0FBQzFELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFHeEMseUJBQXlCLEtBQWEsRUFBRSxLQUFhO0lBQ25ELElBQU0sQ0FBQyxHQUFHLFVBQVEsVUFBVSxDQUFDLEtBQUssQ0FBRyxDQUFDO0lBQ3RDLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUN0QixPQUFPLGNBQVksQ0FBQyxNQUFHLENBQUM7S0FDekI7U0FBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDOUIsT0FBTyxlQUFhLENBQUMsTUFBRyxDQUFDO0tBQzFCO1NBQU0sSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE9BQU8sY0FBWSxDQUFDLE1BQUcsQ0FBQztLQUN6QjtTQUFNLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUMzQixPQUFPLFlBQVUsQ0FBQyxNQUFHLENBQUM7S0FDdkI7U0FBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxPQUFPLGVBQWEsQ0FBQyxTQUFJLFNBQVMsTUFBRyxDQUFDO0tBQ3ZDO1NBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsT0FBTyxjQUFZLENBQUMsU0FBSSxTQUFTLE1BQUcsQ0FBQztLQUN0QztTQUFNO1FBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUM7S0FDYjtBQUNILENBQUM7QUFFRDtJQUErQixxQ0FBWTtJQU96QyxtQkFBWSxNQUFvQixFQUFFLEtBQW1CO1FBQXJELFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBR2Q7UUFWTyxZQUFNLEdBQWlCLEVBQUUsQ0FBQztRQVNoQyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7SUFDdEIsQ0FBQztJQVJNLHlCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQVFhLGNBQUksR0FBbEIsVUFBbUIsTUFBb0IsRUFBRSxLQUFZO1FBQ25ELElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFeEIsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQW9CO1lBQ3BELElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUMxQixZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNuQztpQkFBTSxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDOUIsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBQyxNQUFNO29CQUNwQyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUM1QixJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7NEJBQ25CLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO3lCQUM5QjtxQkFDRjtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdDLHVCQUF1QjtZQUN2QixLQUFLLENBQUMsZUFBZSxDQUFDLFVBQUEsUUFBUTtnQkFDNUIsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzVCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO2lCQUNoQztxQkFBTSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUNyQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUkscUJBQXFCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUM3RSxPQUFPO3FCQUNSO29CQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO2lCQUNsQztZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCw4Q0FBOEM7UUFDOUMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQzVDLElBQU0sR0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO2dCQUNuQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCwrREFBK0Q7UUFDL0QsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQzVCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUU7aUJBQU07Z0JBQ0wsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxzQkFBVyw0QkFBSzthQUFoQjtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDOzs7T0FBQTtJQUVNLHlCQUFLLEdBQVosVUFBYSxLQUFnQjtRQUMzQixJQUFJLENBQUMsTUFBTSx3QkFBTyxJQUFJLENBQUMsTUFBTSxFQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUNNLHVDQUFtQixHQUExQjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsNERBQTREO0lBQ3JELGtDQUFjLEdBQXJCO1FBQ0UsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxtQ0FBZSxHQUF0QjtRQUNFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sc0NBQWtCLEdBQXpCO1FBQUEsaUJBY0M7UUFiQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztZQUNoQyxJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFNLE9BQU8sR0FBdUI7Z0JBQ2xDLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksTUFBQTtnQkFDSixFQUFFLEVBQUUsS0FBSzthQUNWLENBQUM7WUFDRixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUEzR0QsQ0FBK0IsWUFBWSxHQTJHMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3RvU2V0fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtpc0NvdW50aW5nQWdncmVnYXRlT3B9IGZyb20gJy4uLy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2lzTnVtYmVyRmllbGREZWYsIGlzVGltZUZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7Zm9yRWFjaExlYXZlfSBmcm9tICcuLi8uLi9sb2dpY2FsJztcbmltcG9ydCB7aXNGaWVsZFByZWRpY2F0ZX0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7aXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2FjY2Vzc1BhdGgsIERpY3QsIGR1cGxpY2F0ZSwga2V5cywgU3RyaW5nU2V0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGb3JtdWxhVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHBhcnNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBmID0gYGRhdHVtJHthY2Nlc3NQYXRoKGZpZWxkKX1gO1xuICBpZiAocGFyc2UgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGB0b051bWJlcigke2Z9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBgdG9Cb29sZWFuKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYHRvU3RyaW5nKCR7Zn0pYDtcbiAgfSBlbHNlIGlmIChwYXJzZSA9PT0gJ2RhdGUnKSB7XG4gICAgcmV0dXJuIGB0b0RhdGUoJHtmfSlgO1xuICB9IGVsc2UgaWYgKHBhcnNlLmluZGV4T2YoJ2RhdGU6JykgPT09IDApIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBwYXJzZS5zbGljZSg1LCBwYXJzZS5sZW5ndGgpO1xuICAgIHJldHVybiBgdGltZVBhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSBpZiAocGFyc2UuaW5kZXhPZigndXRjOicpID09PSAwKSB7XG4gICAgY29uc3Qgc3BlY2lmaWVyID0gcGFyc2Uuc2xpY2UoNCwgcGFyc2UubGVuZ3RoKTtcbiAgICByZXR1cm4gYHV0Y1BhcnNlKCR7Zn0sJHtzcGVjaWZpZXJ9KWA7XG4gIH0gZWxzZSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UocGFyc2UpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfcGFyc2U6IERpY3Q8c3RyaW5nPiA9IHt9O1xuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlTm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5wYXJzZSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHBhcnNlOiBEaWN0PHN0cmluZz4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgdGhpcy5fcGFyc2UgPSBwYXJzZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICBjb25zdCBjYWxjRmllbGRNYXAgPSB7fTtcblxuICAgIChtb2RlbC50cmFuc2Zvcm1zIHx8IFtdKS5mb3JFYWNoKCh0cmFuc2Zvcm06IFRyYW5zZm9ybSkgPT4ge1xuICAgICAgaWYgKGlzQ2FsY3VsYXRlKHRyYW5zZm9ybSkpIHtcbiAgICAgICAgY2FsY0ZpZWxkTWFwW3RyYW5zZm9ybS5hc10gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0cmFuc2Zvcm0pKSB7XG4gICAgICAgIGZvckVhY2hMZWF2ZSh0cmFuc2Zvcm0uZmlsdGVyLCAoZmlsdGVyKSA9PiB7XG4gICAgICAgICAgaWYgKGlzRmllbGRQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICAgICAgaWYgKGZpbHRlci50aW1lVW5pdCkge1xuICAgICAgICAgICAgICBwYXJzZVtmaWx0ZXIuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgICAvLyBQYXJzZSBlbmNvZGVkIGZpZWxkc1xuICAgICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZpZWxkRGVmID0+IHtcbiAgICAgICAgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgICAgICAgIGlmIChjYWxjRmllbGRNYXBbZmllbGREZWYuZmllbGRdIHx8IGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDdXN0b20gcGFyc2Ugc2hvdWxkIG92ZXJyaWRlIGluZmVycmVkIHBhcnNlXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLmRhdGE7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5mb3JtYXQgJiYgZGF0YS5mb3JtYXQucGFyc2UpIHtcbiAgICAgIGNvbnN0IHAgPSBkYXRhLmZvcm1hdC5wYXJzZTtcbiAgICAgIGtleXMocCkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIHBhcnNlW2ZpZWxkXSA9IHBbZmllbGRdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2Ugc2hvdWxkIG5vdCBwYXJzZSB3aGF0IGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkIGluIGEgcGFyZW50XG4gICAgY29uc3QgbW9kZWxQYXJzZSA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2U7XG4gICAga2V5cyhtb2RlbFBhcnNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGlmIChwYXJzZVtmaWVsZF0gIT09IG1vZGVsUGFyc2VbZmllbGRdKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpZmZlcmVudFBhcnNlKGZpZWxkLCBwYXJzZVtmaWVsZF0sIG1vZGVsUGFyc2VbZmllbGRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgcGFyc2VbZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXJzZU5vZGUocGFyZW50LCBwYXJzZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBhcnNlKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZShvdGhlcjogUGFyc2VOb2RlKSB7XG4gICAgdGhpcy5fcGFyc2UgPSB7Li4udGhpcy5fcGFyc2UsIC4uLm90aGVyLnBhcnNlfTtcbiAgICBvdGhlci5yZW1vdmUoKTtcbiAgfVxuICBwdWJsaWMgYXNzZW1ibGVGb3JtYXRQYXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2U7XG4gIH1cblxuICAvLyBmb3JtYXQgcGFyc2UgZGVwZW5kcyBhbmQgcHJvZHVjZXMgYWxsIGZpZWxkcyBpbiBpdHMgcGFyc2VcbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHRvU2V0KGtleXModGhpcy5wYXJzZSkpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB0b1NldChrZXlzKHRoaXMucGFyc2UpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRyYW5zZm9ybXMoKTogVmdGb3JtdWxhVHJhbnNmb3JtW10ge1xuICAgIHJldHVybiBrZXlzKHRoaXMuX3BhcnNlKS5tYXAoZmllbGQgPT4ge1xuICAgICAgY29uc3QgZXhwciA9IHBhcnNlRXhwcmVzc2lvbihmaWVsZCwgdGhpcy5fcGFyc2VbZmllbGRdKTtcbiAgICAgIGlmICghZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9ybXVsYTogVmdGb3JtdWxhVHJhbnNmb3JtID0ge1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGV4cHIsXG4gICAgICAgIGFzOiBmaWVsZFxuICAgICAgfTtcbiAgICAgIHJldHVybiBmb3JtdWxhO1xuICAgIH0pLmZpbHRlcih0ID0+IHQgIT09IG51bGwpO1xuICB9XG59XG4iXX0=