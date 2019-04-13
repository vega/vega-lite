import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, SHAPE } from '../../channel';
import { isValueDef } from '../../channeldef';
import { GEOJSON } from '../../type';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
export class GeoJSONNode extends DataFlowNode {
    constructor(parent, fields, geojson, signal) {
        super(parent);
        this.fields = fields;
        this.geojson = geojson;
        this.signal = signal;
    }
    clone() {
        return new GeoJSONNode(null, duplicate(this.fields), this.geojson, this.signal);
    }
    static parseAll(parent, model) {
        if (model.component.projection && !model.component.projection.isFit) {
            return parent;
        }
        let geoJsonCounter = 0;
        [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach((coordinates) => {
            const pair = coordinates.map(channel => model.channelHasField(channel)
                ? model.fieldDef(channel).field
                : isValueDef(model.encoding[channel])
                    ? { expr: model.encoding[channel].value + '' }
                    : undefined);
            if (pair[0] || pair[1]) {
                parent = new GeoJSONNode(parent, pair, null, model.getName(`geojson_${geoJsonCounter++}`));
            }
        });
        if (model.channelHasField(SHAPE)) {
            const fieldDef = model.fieldDef(SHAPE);
            if (fieldDef.type === GEOJSON) {
                parent = new GeoJSONNode(parent, null, fieldDef.field, model.getName(`geojson_${geoJsonCounter++}`));
            }
        }
        return parent;
    }
    assemble() {
        return Object.assign({ type: 'geojson' }, (this.fields ? { fields: this.fields } : {}), (this.geojson ? { geojson: this.geojson } : {}), { signal: this.signal });
    }
}
//# sourceMappingURL=geojson.js.map