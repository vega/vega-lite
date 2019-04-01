import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2 } from '../../channel';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
export class GeoPointNode extends DataFlowNode {
    constructor(parent, projection, fields, as) {
        super(parent);
        this.projection = projection;
        this.fields = fields;
        this.as = as;
    }
    clone() {
        return new GeoPointNode(null, this.projection, duplicate(this.fields), duplicate(this.as));
    }
    static parseAll(parent, model) {
        if (!model.projectionName()) {
            return parent;
        }
        [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach((coordinates) => {
            const pair = coordinates.map(channel => model.channelHasField(channel) ? model.fieldDef(channel).field : undefined);
            const suffix = coordinates[0] === LONGITUDE2 ? '2' : '';
            if (pair[0] || pair[1]) {
                parent = new GeoPointNode(parent, model.projectionName(), pair, [
                    model.getName('x' + suffix),
                    model.getName('y' + suffix)
                ]);
            }
        });
        return parent;
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