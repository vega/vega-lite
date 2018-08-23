import * as tslib_1 from "tslib";
import { isArray, isString } from 'vega-util';
import { isFieldDef, vgField } from '../../fielddef';
import { duplicate, getFirstDefined, hash } from '../../util';
import { sortParams } from '../common';
import { TransformNode } from './dataflow';
function getStackByFields(model) {
    return model.stack.stackBy.reduce(function (fields, by) {
        var fieldDef = by.fieldDef;
        var _field = vgField(fieldDef);
        if (_field) {
            fields.push(_field);
        }
        return fields;
    }, []);
}
function isValidAsArray(as) {
    return isArray(as) && as.every(function (s) { return isString(s); }) && as.length > 1;
}
var StackNode = /** @class */ (function (_super) {
    tslib_1.__extends(StackNode, _super);
    function StackNode(parent, stack) {
        var _this = _super.call(this, parent) || this;
        _this._stack = stack;
        return _this;
    }
    StackNode.prototype.clone = function () {
        return new StackNode(null, duplicate(this._stack));
    };
    StackNode.makeFromTransform = function (parent, stackTransform) {
        var stack = stackTransform.stack, groupby = stackTransform.groupby, as = stackTransform.as, _a = stackTransform.offset, offset = _a === void 0 ? 'zero' : _a;
        var sortFields = [];
        var sortOrder = [];
        if (stackTransform.sort !== undefined) {
            for (var _i = 0, _b = stackTransform.sort; _i < _b.length; _i++) {
                var sortField = _b[_i];
                sortFields.push(sortField.field);
                sortOrder.push(getFirstDefined(sortField.order, 'ascending'));
            }
        }
        var sort = {
            field: sortFields,
            order: sortOrder
        };
        var normalizedAs;
        if (isValidAsArray(as)) {
            normalizedAs = as;
        }
        else if (isString(as)) {
            normalizedAs = [as, as + '_end'];
        }
        else {
            normalizedAs = [stackTransform.stack + '_start', stackTransform.stack + '_end'];
        }
        return new StackNode(parent, {
            stackField: stack,
            groupby: groupby,
            offset: offset,
            sort: sort,
            facetby: [],
            as: normalizedAs
        });
    };
    StackNode.makeFromEncoding = function (parent, model) {
        var stackProperties = model.stack;
        if (!stackProperties) {
            return null;
        }
        var dimensionFieldDef;
        if (stackProperties.groupbyChannel) {
            dimensionFieldDef = model.fieldDef(stackProperties.groupbyChannel);
        }
        var stackby = getStackByFields(model);
        var orderDef = model.encoding.order;
        var sort;
        if (isArray(orderDef) || isFieldDef(orderDef)) {
            sort = sortParams(orderDef);
        }
        else {
            // default = descending by stackFields
            // FIXME is the default here correct for binned fields?
            sort = stackby.reduce(function (s, field) {
                s.field.push(field);
                s.order.push('descending');
                return s;
            }, { field: [], order: [] });
        }
        return new StackNode(parent, {
            dimensionFieldDef: dimensionFieldDef,
            stackField: model.vgField(stackProperties.fieldChannel),
            facetby: [],
            stackby: stackby,
            sort: sort,
            offset: stackProperties.offset,
            impute: stackProperties.impute,
            as: [
                model.vgField(stackProperties.fieldChannel, { suffix: 'start', forAs: true }),
                model.vgField(stackProperties.fieldChannel, { suffix: 'end', forAs: true })
            ]
        });
    };
    Object.defineProperty(StackNode.prototype, "stack", {
        get: function () {
            return this._stack;
        },
        enumerable: true,
        configurable: true
    });
    StackNode.prototype.addDimensions = function (fields) {
        this._stack.facetby = this._stack.facetby.concat(fields);
    };
    StackNode.prototype.dependentFields = function () {
        var out = {};
        out[this._stack.stackField] = true;
        this.getGroupbyFields().forEach(function (f) { return (out[f] = true); });
        this._stack.facetby.forEach(function (f) { return (out[f] = true); });
        var field = this._stack.sort.field;
        isArray(field) ? field.forEach(function (f) { return (out[f] = true); }) : (out[field] = true);
        return out;
    };
    StackNode.prototype.producedFields = function () {
        return this._stack.as.reduce(function (result, item) {
            result[item] = true;
            return result;
        }, {});
    };
    StackNode.prototype.hash = function () {
        return "Stack " + hash(this._stack);
    };
    StackNode.prototype.getGroupbyFields = function () {
        var _a = this._stack, dimensionFieldDef = _a.dimensionFieldDef, impute = _a.impute, groupby = _a.groupby;
        if (dimensionFieldDef) {
            if (dimensionFieldDef.bin) {
                if (impute) {
                    // For binned group by field with impute, we calculate bin_mid
                    // as we cannot impute two fields simultaneously
                    return [vgField(dimensionFieldDef, { binSuffix: 'mid' })];
                }
                return [
                    // For binned group by field without impute, we need both bin (start) and bin_end
                    vgField(dimensionFieldDef, {}),
                    vgField(dimensionFieldDef, { binSuffix: 'end' })
                ];
            }
            return [vgField(dimensionFieldDef)];
        }
        return groupby || [];
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var _a = this._stack, facetby = _a.facetby, dimensionFieldDef = _a.dimensionFieldDef, field = _a.stackField, stackby = _a.stackby, sort = _a.sort, offset = _a.offset, impute = _a.impute, as = _a.as;
        // Impute
        if (impute && dimensionFieldDef) {
            if (dimensionFieldDef.bin) {
                // As we can only impute one field at a time, we need to calculate
                // mid point for a binned field
                transform.push({
                    type: 'formula',
                    expr: '(' +
                        vgField(dimensionFieldDef, { expr: 'datum' }) +
                        '+' +
                        vgField(dimensionFieldDef, { expr: 'datum', binSuffix: 'end' }) +
                        ')/2',
                    as: vgField(dimensionFieldDef, { binSuffix: 'mid', forAs: true })
                });
            }
            transform.push({
                type: 'impute',
                field: field,
                groupby: stackby,
                key: vgField(dimensionFieldDef, { binSuffix: 'mid' }),
                method: 'value',
                value: 0
            });
        }
        // Stack
        transform.push({
            type: 'stack',
            groupby: this.getGroupbyFields().concat(facetby),
            field: field,
            sort: sort,
            as: as,
            offset: offset
        });
        return transform;
    };
    return StackNode;
}(TransformNode));
export { StackNode };
//# sourceMappingURL=stack.js.map