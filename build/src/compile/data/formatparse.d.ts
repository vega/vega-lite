import { AncestorParse } from '.';
import { Parse } from '../../data';
import { FilterTransform } from '../../transform';
import { VgFormulaTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class ParseNode extends DataFlowNode {
    private _parse;
    clone(): ParseNode;
    constructor(parent: DataFlowNode, parse: Parse);
    hash(): string;
    /**
     * Creates a parse node from a data.format.parse and updates ancestorParse.
     */
    static makeExplicit(parent: DataFlowNode, model: Model, ancestorParse: AncestorParse): ParseNode;
    static makeImplicitFromFilterTransform(parent: DataFlowNode, transform: FilterTransform, ancestorParse: AncestorParse): ParseNode;
    /**
     * Creates a parse node for implicit parsing from a model and updates ancestorParse.
     */
    static makeImplicitFromEncoding(parent: DataFlowNode, model: Model, ancestorParse: AncestorParse): ParseNode;
    /**
     * Creates a parse node from "explicit" parse and "implicit" parse and updates ancestorParse.
     */
    private static makeWithAncestors;
    readonly parse: Parse;
    merge(other: ParseNode): void;
    /**
     * Assemble an object for Vega's format.parse property.
     */
    assembleFormatParse(): {};
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    assembleTransforms(onlyNested?: boolean): VgFormulaTransform[];
}
