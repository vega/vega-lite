import { isString } from 'vega-util';
import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2 } from '../../channel';
import { getFieldOrDatumDef, isDatumDef, isFieldDef, isValueDef } from '../../channeldef';
import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
export class GeoPointNode extends DataFlowNode {
    clone() {
        return new GeoPointNode(null, this.projection, duplicate(this.fields), duplicate(this.as));
    }
    constructor(parent, projection, fields, as) {
        super(parent);
        this.projection = projection;
        this.fields = fields;
        this.as = as;
    }
    static parseAll(parent, model) {
        if (!model.projectionName()) {
            return parent;
        }
        for (const coordinates of [
            [LONGITUDE, LATITUDE],
            [LONGITUDE2, LATITUDE2]
        ]) {
            const pair = coordinates.map(channel => {
                const def = getFieldOrDatumDef(model.encoding[channel]);
                return isFieldDef(def)
                    ? def.field
                    : isDatumDef(def)
                        ? { expr: `${def.datum}` }
                        : isValueDef(def)
                            ? { expr: `${def['value']}` }
                            : undefined;
            });
            const suffix = coordinates[0] === LONGITUDE2 ? '2' : '';
            if (pair[0] || pair[1]) {
                parent = new GeoPointNode(parent, model.projectionName(), pair, [
                    model.getName(`x${suffix}`),
                    model.getName(`y${suffix}`)
                ]);
            }
        }
        return parent;
    }
    dependentFields() {
        return new Set(this.fields.filter(isString));
    }
    producedFields() {
        return new Set(this.as);
    }
    hash() {
        return `Geopoint ${this.projection} ${hash(this.fields)} ${hash(this.as)}`;
    }
    assemble() {
        return {
            type: 'geopoint',
            projection: this.projection,
            fields: this.fields,
            as: this.as
        };
    }
}
//# sourceMappingURL=geopoint.js.map