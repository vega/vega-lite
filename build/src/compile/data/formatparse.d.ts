import { Dict, StringSet } from '../../util';
import { VgFormulaTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class ParseNode extends DataFlowNode {
    private _parse;
    clone(): ParseNode;
    constructor(parent: DataFlowNode, parse: Dict<string>);
    static make(parent: DataFlowNode, model: Model): ParseNode;
    readonly parse: Dict<string>;
    merge(other: ParseNode): void;
    assembleFormatParse(): Dict<string>;
    producedFields(): StringSet;
    dependentFields(): StringSet;
    assembleTransforms(): VgFormulaTransform[];
}
