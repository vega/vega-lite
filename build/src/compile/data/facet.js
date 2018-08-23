import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { isBinning } from '../../bin';
import { COLUMN, ROW } from '../../channel';
import { vgField } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain } from '../../scale';
import { isSortField } from '../../sort';
import { isVgRangeStep } from '../../vega.schema';
import { assembleDomain, getFieldFromDomain } from '../scale/domain';
import { sortArrayIndexField } from './calculate';
import { DataFlowNode } from './dataflow';
/**
 * A node that helps us track what fields we are faceting by.
 */
var FacetNode = /** @class */ (function (_super) {
    tslib_1.__extends(FacetNode, _super);
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    function FacetNode(parent, model, name, data) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.name = name;
        _this.data = data;
        for (var _i = 0, _a = [COLUMN, ROW]; _i < _a.length; _i++) {
            var channel = _a[_i];
            var fieldDef = model.facet[channel];
            if (fieldDef) {
                var bin = fieldDef.bin, sort = fieldDef.sort;
                _this[channel] = tslib_1.__assign({ name: model.getName(channel + "_domain"), fields: [vgField(fieldDef)].concat((isBinning(bin) ? [vgField(fieldDef, { binSuffix: 'end' })] : [])) }, (isSortField(sort)
                    ? { sortField: sort }
                    : isArray(sort)
                        ? { sortIndexField: sortArrayIndexField(fieldDef, channel) }
                        : {}));
            }
        }
        _this.childModel = model.child;
        return _this;
    }
    Object.defineProperty(FacetNode.prototype, "fields", {
        get: function () {
            return ((this.column && this.column.fields) || []).concat(((this.row && this.row.fields) || []));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The name to reference this source is its name.
     */
    FacetNode.prototype.getSource = function () {
        return this.name;
    };
    FacetNode.prototype.getChildIndependentFieldsWithStep = function () {
        var childIndependentFieldsWithStep = {};
        for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
            var channel = _a[_i];
            var childScaleComponent = this.childModel.component.scales[channel];
            if (childScaleComponent && !childScaleComponent.merged) {
                var type = childScaleComponent.get('type');
                var range = childScaleComponent.get('range');
                if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                    var domain = assembleDomain(this.childModel, channel);
                    var field = getFieldFromDomain(domain);
                    if (field) {
                        childIndependentFieldsWithStep[channel] = field;
                    }
                    else {
                        log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                    }
                }
            }
        }
        return childIndependentFieldsWithStep;
    };
    FacetNode.prototype.assembleRowColumnData = function (channel, crossedDataName, childIndependentFieldsWithStep) {
        var childChannel = channel === 'row' ? 'y' : 'x';
        var fields = [];
        var ops = [];
        var as = [];
        if (childIndependentFieldsWithStep[childChannel]) {
            if (crossedDataName) {
                // If there is a crossed data, calculate max
                fields.push("distinct_" + childIndependentFieldsWithStep[childChannel]);
                ops.push('max');
            }
            else {
                // If there is no crossed data, just calculate distinct
                fields.push(childIndependentFieldsWithStep[childChannel]);
                ops.push('distinct');
            }
            // Although it is technically a max, just name it distinct so it's easier to refer to it
            as.push("distinct_" + childIndependentFieldsWithStep[childChannel]);
        }
        var _a = this[channel], sortField = _a.sortField, sortIndexField = _a.sortIndexField;
        if (sortField) {
            var op = sortField.op, field = sortField.field;
            fields.push(field);
            ops.push(op);
            as.push(vgField(sortField, { forAs: true }));
        }
        else if (sortIndexField) {
            fields.push(sortIndexField);
            ops.push('max');
            as.push(sortIndexField);
        }
        return {
            name: this[channel].name,
            // Use data from the crossed one if it exist
            source: crossedDataName || this.data,
            transform: [
                tslib_1.__assign({ type: 'aggregate', groupby: this[channel].fields }, (fields.length
                    ? {
                        fields: fields,
                        ops: ops,
                        as: as
                    }
                    : {}))
            ]
        };
    };
    FacetNode.prototype.assemble = function () {
        var data = [];
        var crossedDataName = null;
        var childIndependentFieldsWithStep = this.getChildIndependentFieldsWithStep();
        if (this.column && this.row && (childIndependentFieldsWithStep.x || childIndependentFieldsWithStep.y)) {
            // Need to create a cross dataset to correctly calculate cardinality
            crossedDataName = "cross_" + this.column.name + "_" + this.row.name;
            var fields = [].concat(childIndependentFieldsWithStep.x ? [childIndependentFieldsWithStep.x] : [], childIndependentFieldsWithStep.y ? [childIndependentFieldsWithStep.y] : []);
            var ops = fields.map(function () { return 'distinct'; });
            data.push({
                name: crossedDataName,
                source: this.data,
                transform: [
                    {
                        type: 'aggregate',
                        groupby: this.column.fields.concat(this.row.fields),
                        fields: fields,
                        ops: ops
                    }
                ]
            });
        }
        for (var _i = 0, _a = [COLUMN, ROW]; _i < _a.length; _i++) {
            var channel = _a[_i];
            if (this[channel]) {
                data.push(this.assembleRowColumnData(channel, crossedDataName, childIndependentFieldsWithStep));
            }
        }
        return data;
    };
    return FacetNode;
}(DataFlowNode));
export { FacetNode };
//# sourceMappingURL=facet.js.map