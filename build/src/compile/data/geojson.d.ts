import { VgGeoJSONTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export declare class GeoJSONNode extends DataFlowNode {
    private fields;
    private geojson;
    private signal;
    clone(): GeoJSONNode;
    static makeAll(model: ModelWithField): GeoJSONNode[];
    constructor(fields?: string[], geojson?: string, signal?: string);
    assemble(): VgGeoJSONTransform;
}
