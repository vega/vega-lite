import { VgData } from '../../vega.schema';
import { FacetModel } from '../facet';
import { DataFlowNode } from './dataflow';
/**
 * A node that helps us track what fields we are faceting by.
 */
export declare class FacetNode extends DataFlowNode {
    readonly model: FacetModel;
    readonly name: string;
    data: string;
    private readonly column;
    private readonly row;
    private readonly childModel;
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    constructor(parent: DataFlowNode, model: FacetModel, name: string, data: string);
    hash(): string;
    readonly fields: string[];
    /**
     * The name to reference this source is its name.
     */
    getSource(): string;
    private getChildIndependentFieldsWithStep;
    private assembleRowColumnData;
    assemble(): VgData[];
}
