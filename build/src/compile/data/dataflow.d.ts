import { DataSourceType } from '../../data';
import { StringSet } from '../../util';
/**
 * A node in the dataflow tree.
 */
export declare class DataFlowNode {
    readonly debugName: string;
    private _children;
    private _parent;
    constructor(debugName?: string);
    /**
     * Clone this node with a deep copy but don't clone links to children or parents.
     */
    clone(): DataFlowNode;
    /**
     * Set of fields that are being created by this node.
     */
    producedFields(): StringSet;
    dependentFields(): StringSet;
    /**
     * Set the parent of the node and also add this not to the parent's children.
     */
    parent: DataFlowNode;
    readonly children: DataFlowNode[];
    numChildren(): number;
    addChild(child: DataFlowNode): void;
    removeChild(oldChild: DataFlowNode): void;
    /**
     * Remove node from the dataflow.
     */
    remove(): void;
    swapWithParent(): void;
}
export declare class OutputNode extends DataFlowNode {
    readonly type: DataSourceType;
    private _source;
    private _refcount;
    clone(): this;
    constructor(source: string, type: DataSourceType);
    /**
     * Request the datasource name.
     *
     * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
     * It is crucial to request the name from an output node to mark it as a required node.
     * If nobody ever requests the name, this datasource will not be instantiated in the assemble phase.
     *
     * In the assemble phase, this will return the correct name.
     */
    source: string;
    readonly required: boolean;
}
