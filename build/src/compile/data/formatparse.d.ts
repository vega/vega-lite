import { Dict } from '../../util';
import { VgFormulaTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class ParseNode extends DataFlowNode {
    private _parse;
    clone(): ParseNode;
    constructor(parse: Dict<string>);
    static make(model: Model): ParseNode;
    readonly parse: Dict<string>;
    merge(other: ParseNode): void;
    assembleFormatParse(): Dict<string>;
    producedFields(): {
        [T: string]: boolean;
    };
    dependentFields(): {
        [T: string]: boolean;
    };
    assembleTransforms(): VgFormulaTransform[];
}
