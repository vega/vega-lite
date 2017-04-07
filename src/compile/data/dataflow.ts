import {isFunction} from 'util';
import {StringSet} from '../../util';
/**
 * A node in the dataflow graph.
 */
export class DataFlowNode {
  private _children: DataFlowNode[];

  private _parent: DataFlowNode;

  constructor(public readonly debugName?: string) {
    this._children = [];
    this._parent = null;
  }

  get parent() {
    return this._parent;
  }

  /**
   * Set the parent of the node and also add this not to the parent's children.
   */
  set parent(parent: DataFlowNode) {
    this._parent = parent;
    parent.addChild(this);
  }

  get children() {
    return this._children;
  }

  public numChildren() {
    return this._children.length;
  }

  public addChild(child: DataFlowNode) {
    this._children.push(child);
  }

  public removeChild(oldChild: DataFlowNode) {
    this._children.splice(this._children.indexOf(oldChild), 1);
  }

  /**
   * Remove node from the dataflow.
   */
  public remove() {
    this._children.forEach(child => child.parent = this._parent);
    this._parent.removeChild(this);
  }

  public swapWithParent() {
    const newParent = this._parent.parent;
    const parent = this._parent;

    // reconnect the children
    this._children.forEach(c => c.parent = parent);

    // remove old links
    this._children = [];  // equivalent to emoving every child link one by one
    parent.removeChild(this);
    parent.parent.removeChild(parent);


    // swap two nodes
    this.parent = newParent;
    parent.parent = this;
  }
}

export class OutputNode extends DataFlowNode {

  private _source: string;

  private _required = false;

  constructor(source: string) {
    super(source);

    this._source = source;
  }

  /**
   * Request the datasource name.
   *
   * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
   * It is crucial to requet the name from an output node to mark it as a required node.
   * If nobody ever requests the name, this datasource will not be instantiated.
   *
   * In the assemble phase, this will return the correct name.
   */
  get source() {
    this.markRequired();
    return this._source;
  }

  set source(source: string) {
    this._source = source;
  }

  public markRequired() {
    this._required = true;
  }

  get required() {
    return this._required;
  }
}

/*
 * Dataflow traits.
 */

export function isNewFieldNode(node: any): node is NewFieldNode {
  return 'produces' in node && isFunction(node.produces);
}

/**
 * Trait for nodes that create new fields.
 */
export interface NewFieldNode {
  /**
   * Set of fields that are being created by this node.
   */
  produces: () => StringSet;
}

export interface DependsOnNode {
  /**
   * Set of fields that are being created by this node.
   */
  dependsOn: () => StringSet;
}
