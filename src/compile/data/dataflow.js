import * as log from '../../log/index.js';
import {uniqueId} from '../../util.js';
/**
 * A node in the dataflow tree.
 */
export class DataFlowNode {
  debugName;
  _children = [];
  _parent = null;
  _hash;
  constructor(parent, debugName) {
    this.debugName = debugName;
    if (parent) {
      this.parent = parent;
    }
  }
  /**
   * Clone this node with a deep copy but don't clone links to children or parents.
   */
  clone() {
    throw new Error('Cannot clone node');
  }
  get parent() {
    return this._parent;
  }
  /**
   * Set the parent of the node and also add this node to the parent's children.
   */
  set parent(parent) {
    this._parent = parent;
    if (parent) {
      parent.addChild(this);
    }
  }
  get children() {
    return this._children;
  }
  numChildren() {
    return this._children.length;
  }
  addChild(child, loc) {
    // do not add the same child twice
    if (this._children.includes(child)) {
      log.warn(log.message.ADD_SAME_CHILD_TWICE);
      return;
    }
    if (loc !== undefined) {
      this._children.splice(loc, 0, child);
    } else {
      this._children.push(child);
    }
  }
  removeChild(oldChild) {
    const loc = this._children.indexOf(oldChild);
    this._children.splice(loc, 1);
    return loc;
  }
  /**
   * Remove node from the dataflow.
   */
  remove() {
    let loc = this._parent.removeChild(this);
    for (const child of this._children) {
      // do not use the set method because we want to insert at a particular location
      child._parent = this._parent;
      this._parent.addChild(child, loc++);
    }
  }
  /**
   * Insert another node as a parent of this node.
   */
  insertAsParentOf(other) {
    const parent = other.parent;
    parent.removeChild(this);
    this.parent = parent;
    other.parent = this;
  }
  swapWithParent() {
    const parent = this._parent;
    const newParent = parent.parent;
    // reconnect the children
    for (const child of this._children) {
      child.parent = parent;
    }
    // remove old links
    this._children = []; // equivalent to removing every child link one by one
    parent.removeChild(this);
    const loc = parent.parent.removeChild(parent);
    // swap two nodes but maintain order in children
    this._parent = newParent;
    newParent.addChild(this, loc);
    parent.parent = this;
  }
}
export class OutputNode extends DataFlowNode {
  type;
  refCounts;
  _source;
  _name;
  clone() {
    const cloneObj = new this.constructor();
    cloneObj.debugName = `clone_${this.debugName}`;
    cloneObj._source = this._source;
    cloneObj._name = `clone_${this._name}`;
    cloneObj.type = this.type;
    cloneObj.refCounts = this.refCounts;
    cloneObj.refCounts[cloneObj._name] = 0;
    return cloneObj;
  }
  /**
   * @param source The name of the source. Will change in assemble.
   * @param type The type of the output node.
   * @param refCounts A global ref counter map.
   */
  constructor(parent, source, type, refCounts) {
    super(parent, source);
    this.type = type;
    this.refCounts = refCounts;
    this._source = this._name = source;
    if (this.refCounts && !(this._name in this.refCounts)) {
      this.refCounts[this._name] = 0;
    }
  }
  dependentFields() {
    return new Set();
  }
  producedFields() {
    return new Set();
  }
  hash() {
    if (this._hash === undefined) {
      this._hash = `Output ${uniqueId()}`;
    }
    return this._hash;
  }
  /**
   * Request the datasource name and increase the ref counter.
   *
   * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
   * It is crucial to request the name from an output node to mark it as a required node.
   * If nobody ever requests the name, this datasource will not be instantiated in the assemble phase.
   *
   * In the assemble phase, this will return the correct name.
   */
  getSource() {
    this.refCounts[this._name]++;
    return this._source;
  }
  isRequired() {
    return !!this.refCounts[this._name];
  }
  setSource(source) {
    this._source = source;
  }
}
//# sourceMappingURL=dataflow.js.map
