import { Dict } from '../../util';
import { Model } from './../model';
import { DataFlowNode } from './dataflow';
export declare class ParseNode extends DataFlowNode {
    private _parse;
    constructor(parse: Dict<string>);
    static make(model: Model): ParseNode;
    readonly parse: Dict<string>;
    merge(other: ParseNode): void;
    assemble(): Dict<string>;
}
