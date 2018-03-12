import { VgGeoPointTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
export declare class GeoPointNode extends DataFlowNode {
    private projection;
    private fields;
    private as;
    clone(): GeoPointNode;
    constructor(parent: DataFlowNode, projection: string, fields: string[], as: string[]);
    static parseAll(parent: DataFlowNode, model: UnitModel): DataFlowNode;
    assemble(): VgGeoPointTransform;
}
