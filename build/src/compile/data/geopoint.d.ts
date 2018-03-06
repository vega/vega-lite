import { VgGeoPointTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export declare class GeoPointNode extends DataFlowNode {
    private projection;
    private fields;
    private as;
    clone(): GeoPointNode;
    constructor(projection: string, fields: string[], as: string[]);
    static makeAll(model: ModelWithField): GeoPointNode[];
    assemble(): VgGeoPointTransform;
}
