"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * A node in the dataflow tree.
 */
var DataFlowNode = (function () {
    function DataFlowNode(debugName) {
        this.debugName = debugName;
        this._children = [];
        this._parent = null;
    }
    /**
     * Clone this node with a deep copy but don't clone links to children or parents.
     */
    DataFlowNode.prototype.clone = function () {
        throw new Error('Cannot clone node');
    };
    /**
     * Set of fields that are being created by this node.
     */
    DataFlowNode.prototype.producedFields = function () {
        return {};
    };
    DataFlowNode.prototype.dependentFields = function () {
        return {};
    };
    Object.defineProperty(DataFlowNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        /**
         * Set the parent of the node and also add this not to the parent's children.
         */
        set: function (parent) {
            this._parent = parent;
            parent.addChild(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataFlowNode.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    DataFlowNode.prototype.numChildren = function () {
        return this._children.length;
    };
    DataFlowNode.prototype.addChild = function (child) {
        this._children.push(child);
    };
    DataFlowNode.prototype.removeChild = function (oldChild) {
        this._children.splice(this._children.indexOf(oldChild), 1);
    };
    /**
     * Remove node from the dataflow.
     */
    DataFlowNode.prototype.remove = function () {
        var _this = this;
        this._children.forEach(function (child) { return child.parent = _this._parent; });
        this._parent.removeChild(this);
    };
    DataFlowNode.prototype.swapWithParent = function () {
        var parent = this._parent;
        var newParent = parent.parent;
        // reconnect the children
        this._children.forEach(function (c) { return c.parent = parent; });
        // remove old links
        this._children = []; // equivalent to removing every child link one by one
        parent.removeChild(this);
        parent.parent.removeChild(parent);
        // swap two nodes
        this.parent = newParent;
        parent.parent = this;
    };
    return DataFlowNode;
}());
exports.DataFlowNode = DataFlowNode;
var OutputNode = (function (_super) {
    tslib_1.__extends(OutputNode, _super);
    function OutputNode(source, type) {
        var _this = _super.call(this, source) || this;
        _this.type = type;
        _this._refcount = 0;
        _this._source = source;
        return _this;
    }
    OutputNode.prototype.clone = function () {
        var cloneObj = new this.constructor;
        cloneObj._source = this._source;
        cloneObj.debugName = 'clone_' + this.debugName;
        cloneObj._refcount = this._refcount;
        return cloneObj;
    };
    Object.defineProperty(OutputNode.prototype, "source", {
        /**
         * Request the datasource name.
         *
         * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
         * It is crucial to request the name from an output node to mark it as a required node.
         * If nobody ever requests the name, this datasource will not be instantiated in the assemble phase.
         *
         * In the assemble phase, this will return the correct name.
         */
        get: function () {
            this._refcount++;
            return this._source;
        },
        set: function (source) {
            this._source = source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutputNode.prototype, "required", {
        get: function () {
            return this._refcount > 0;
        },
        enumerable: true,
        configurable: true
    });
    return OutputNode;
}(DataFlowNode));
exports.OutputNode = OutputNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWZsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBOztHQUVHO0FBQ0g7SUFLRSxzQkFBNEIsU0FBa0I7UUFBbEIsY0FBUyxHQUFULFNBQVMsQ0FBUztRQUp0QyxjQUFTLEdBQW1CLEVBQUUsQ0FBQztRQUUvQixZQUFPLEdBQWlCLElBQUksQ0FBQztJQUVhLENBQUM7SUFFbkQ7O09BRUc7SUFDSSw0QkFBSyxHQUFaO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNJLHFDQUFjLEdBQXJCO1FBQ0UsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFTSxzQ0FBZSxHQUF0QjtRQUNFLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsc0JBQUksZ0NBQU07YUFBVjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7UUFFRDs7V0FFRzthQUNILFVBQVcsTUFBb0I7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDOzs7T0FSQTtJQVVELHNCQUFJLGtDQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVNLGtDQUFXLEdBQWxCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFFTSwrQkFBUSxHQUFmLFVBQWdCLEtBQW1CO1FBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTSxrQ0FBVyxHQUFsQixVQUFt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