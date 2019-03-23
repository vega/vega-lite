import { VgGeoJSONTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
export declare class GeoJSONNode extends DataFlowNode {
    private fields?;
    private geojson?;
    private signal?;
    clone(): GeoJSONNode;
    static parseAll(parent: DataFlowNode, model: UnitModel): DataFlowNode;
    constructor(parent: DataFlowNode, fields?: string[], geojson?: string, signal?: string);
    assemble(): VgGeoJSONTransform;
}
