import { DataSourceType } from '../../data';
import { Dict } from '../../util';
/**
 * A node in the dataflow tree.
 */
export declare class DataFlowNode {
    readonly debugName?: string;
    private _children;
    private _parent;
    protected _hash: string | number;
    constructor(parent: DataFlowNode, debugName?: string);
    /**
     * Clone this node with a deep copy but don't clone links to children or parents.
     */
    clone(): DataFlowNode;
    /**
     * Return a hash of the node.
     */
    hash(): string | number;
    /**
     * Set of fields that are being created by this node.
     */
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    /**
    * Set the parent of the node and also add this not to the parent's children.
    */
    parent: DataFlowNode;
    readonly children: DataFlowNode[];
    numChildren(): number;
    addChild(child: DataFlowNode, loc?: number): void;
    removeChild(oldChild: DataFlowNode): number;
    /**
     * Remove node from the dataflow.
     */
    remove(): void;
    /**
     * Insert another node as a parent of this node.
     */
    insertAsParentOf(other: DataFlowNode): void;
    swapWithParent(): void;
}
export declare class OutputNode extends DataFlowNode {
    readonly type: DataSourceType;
    private readonly refCounts;
    private _source;
    private _name;
    clone(): this;
    /**
     * @param source The name of the source. Will change in assemble.
     * @param type The type of the output node.
     * @param refCounts A global ref counter map.
     */
    constructor(parent: DataFlowNode, source: string, type: DataSourceType, refCounts: Dict<number>);
    /**
     * Request the datasource name and increase the ref counter.
     *
     * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
     * It is crucial to request the name from an output node to mark it as a required node.
     * If nobody ever requests the name, this datasource will not be instantiated in the assemble phase.
     *
     * In the assemble phase, this will return the correct name.
     */
    getSource(): string;
    isRequired(): boolean;
    setSource(source: string): void;
}
