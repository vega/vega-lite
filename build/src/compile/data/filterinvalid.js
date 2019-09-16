import { isScaleChannel } from '../../channel';
import { vgField as fieldRef } from '../../channeldef';
import { isPathMark } from '../../mark';
import { hasContinuousDomain } from '../../scale';
import { keys, hash } from '../../util';
import { getMarkPropOrConfig } from '../common';
import { DataFlowNode } from './dataflow';
export class FilterInvalidNode extends DataFlowNode {
    constructor(parent, filter) {
        super(parent);
        this.filter = filter;
    }
    clone() {
        return new FilterInvalidNode(null, Object.assign({}, this.filter));
    }
    static make(parent, model) {
        const { config, mark, markDef } = model;
        const invalid = getMarkPropOrConfig('invalid', markDef, config);
        if (invalid !== 'filter') {
            return null;
        }
        const filter = model.reduceFieldDef((aggregator, fieldDef, channel) => {
            const scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);
            if (scaleComponent) {
                const scaleType = scaleComponent.get('type');
                // While discrete domain scales can handle invalid values, continuous scales can't.
                // Thus, for non-path marks, we have to filter null for scales with continuous domains.
                // (For path marks, we will use "defined" property and skip these values instead.)
                if (hasContinuousDomain(scaleType) && !fieldDef.aggregate && !isPathMark(mark)) {
                    aggregator[fieldDef.field] = fieldDef;
                }
            }
            return aggregator;
        }, {});
        if (!keys(filter).length) {
            return null;
        }
        return new FilterInvalidNode(parent, filter);
    }
    dependentFields() {
        return new Set(keys(this.filter));
    }
    producedFields() {
        return new Set(); // filter does not produce any new fields
    }
    hash() {
        return `FilterInvalid ${hash(this.filter)}`;
    }
    /**
     * Create the VgTransforms for each of the filtered fields.
     */
    assemble() {
        const filters = keys(this.filter).reduce((vegaFilters, field) => {
            const fieldDef = this.filter[field];
            const ref = fieldRef(fieldDef, { expr: 'datum' });
            if (fieldDef !== null) {
                vegaFilters.push(`${ref} !== null`);
                vegaFilters.push(`!isNaN(${ref})`);
            }
            return vegaFilters;
        }, []);
        return filters.length > 0
            ? {
                type: 'filter',
                expr: filters.join(' && ')
            }
            : null;
    }
}
//# sourceMappingURL=filterinvalid.js.map