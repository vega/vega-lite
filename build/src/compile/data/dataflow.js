"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * A node in the dataflow tree.
 */
var DataFlowNode = /** @class */ (function () {
    function DataFlowNode(parent, debugName) {
        this.debugName = debugName;
        this._children = [];
        this._parent = null;
        if (parent) {
            this.parent = parent;
        }
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
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parent = this._parent;
        }
        this._parent.removeChild(this);
    };
    /**
     * Insert another node as a parent of this node.
     */
    DataFlowNode.prototype.insertAsParentOf = function (other) {
        var parent = other.parent;
        parent.removeChild(this);
        this.parent = parent;
        other.parent = this;
    };
    DataFlowNode.prototype.swapWithParent = function () {
        var parent = this._parent;
        var newParent = parent.parent;
        // reconnect the children
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parent = parent;
        }
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
var OutputNode = /** @class */ (function (_super) {
    tslib_1.__extends(OutputNode, _super);
    /**
     * @param source The name of the source. Will change in assemble.
     * @param type The type of the output node.
     * @param refCounts A global ref counter map.
     */
    function OutputNode(parent, source, type, refCounts) {
        var _this = _super.call(this, parent, source) || this;
        _this.type = type;
        _this.refCounts = refCounts;
        _this._source = _this._name = source;
        if (_this.refCounts && !(_this._name in _this.refCounts)) {
            _this.refCounts[_this._name] = 0;
        }
        return _this;
    }
    OutputNode.prototype.clone = function () {
        var cloneObj = new this.constructor;
        cloneObj.debugName = 'clone_' + this.debugName;
        cloneObj._source = this._source;
        cloneObj._name = 'clone_' + this._name;
        cloneObj.type = this.type;
        cloneObj.refCounts = this.refCounts;
        cloneObj.refCounts[cloneObj._name] = 0;
        return cloneObj;
    };
    /**
     * Request the datasource name and increase the ref counter.
     *
     * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
     * It is crucial to request the name from an output node to mark it as a required node.
     * If nobody ever requests the name, this datasource will not be instantiated in the assemble phase.
     *
     * In the assemble phase, this will return the correct name.
     */
    OutputNode.prototype.getSource = function () {
        this.refCounts[this._name]++;
        return this._source;
    };
    OutputNode.prototype.isRequired = function () {
        return !!this.refCounts[this._name];
    };
    OutputNode.prototype.setSource = function (source) {
        this._source = source;
    };
    return OutputNode;
}(DataFlowNode));
exports.OutputNode = OutputNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWZsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBOztHQUVHO0FBQ0g7SUFLRSxzQkFBWSxNQUFvQixFQUFrQixTQUFrQjtRQUFsQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBSjVELGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRS9CLFlBQU8sR0FBaUIsSUFBSSxDQUFDO1FBR25DLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw0QkFBSyxHQUFaO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNJLHFDQUFjLEdBQXJCO1FBQ0UsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU0sc0NBQWUsR0FBdEI7UUFDRSxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxzQkFBSSxnQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7UUFFRDs7V0FFRzthQUNILFVBQVcsTUFBb0I7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDOzs7T0FSQTtJQVVELHNCQUFJLGtDQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFTSxrQ0FBVyxHQUFsQjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVNLCtCQUFRLEdBQWYsVUFBZ0IsS0FBbUI7UUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMs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UUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3BDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBaUJEOzs7Ozs7OztPQVFHO0lBQ0ksOEJBQVMsR0FBaEI7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sK0JBQVUsR0FBakI7UUFDRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sOEJBQVMsR0FBaEIsVUFBaUIsTUFBYztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN4QixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBcERELENBQWdDLFlBQVksR0FvRDNDO0FBcERZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge0RhdGFTb3VyY2VUeXBlfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7RGljdCwgU3RyaW5nU2V0fSBmcm9tICcuLi8uLi91dGlsJztcblxuXG4vKipcbiAqIEEgbm9kZSBpbiB0aGUgZGF0YWZsb3cgdHJlZS5cbiAqL1xuZXhwb3J0IGNsYXNzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX2NoaWxkcmVuOiBEYXRhRmxvd05vZGVbXSA9IFtdO1xuXG4gIHByaXZhdGUgX3BhcmVudDogRGF0YUZsb3dOb2RlID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHVibGljIHJlYWRvbmx5IGRlYnVnTmFtZT86IHN0cmluZykge1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9uZSB0aGlzIG5vZGUgd2l0aCBhIGRlZXAgY29weSBidXQgZG9uJ3QgY2xvbmUgbGlua3MgdG8gY2hpbGRyZW4gb3IgcGFyZW50cy5cbiAgICovXG4gIHB1YmxpYyBjbG9uZSgpOiBEYXRhRmxvd05vZGUge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNsb25lIG5vZGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgb2YgZmllbGRzIHRoYXQgYXJlIGJlaW5nIGNyZWF0ZWQgYnkgdGhpcyBub2RlLlxuICAgKi9cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldCBwYXJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBhcmVudCBvZiB0aGUgbm9kZSBhbmQgYWxzbyBhZGQgdGhpcyBub3QgdG8gdGhlIHBhcmVudCdzIGNoaWxkcmVuLlxuICAgKi9cbiAgc2V0IHBhcmVudChwYXJlbnQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gIH1cblxuICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICB9XG5cbiAgcHVibGljIG51bUNoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goY2hpbGQpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZUNoaWxkKG9sZENoaWxkOiBEYXRhRmxvd05vZGUpIHtcbiAgICB0aGlzLl9jaGlsZHJlbi5zcGxpY2UodGhpcy5fY2hpbGRyZW4uaW5kZXhPZihvbGRDaGlsZCksIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBub2RlIGZyb20gdGhlIGRhdGFmbG93LlxuICAgKi9cbiAgcHVibGljIHJlbW92ZSgpIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuX2NoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuICAgIHRoaXMuX3BhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYW5vdGhlciBub2RlIGFzIGEgcGFyZW50IG9mIHRoaXMgbm9kZS5cbiAgICovXG4gIHB1YmxpYyBpbnNlcnRBc1BhcmVudE9mKG90aGVyOiBEYXRhRmxvd05vZGUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBvdGhlci5wYXJlbnQ7XG4gICAgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIG90aGVyLnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBwdWJsaWMgc3dhcFdpdGhQYXJlbnQoKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xuICAgIGNvbnN0IG5ld1BhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG5cbiAgICAvLyByZWNvbm5lY3QgdGhlIGNoaWxkcmVuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLl9jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyZW50ID0gcGFyZW50O1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBvbGQgbGlua3NcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdOyAgLy8gZXF1aXZhbGVudCB0byByZW1vdmluZyBldmVyeSBjaGlsZCBsaW5rIG9uZSBieSBvbmVcbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgcGFyZW50LnBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQpO1xuXG5cbiAgICAvLyBzd2FwIHR3byBub2Rlc1xuICAgIHRoaXMucGFyZW50ID0gbmV3UGFyZW50O1xuICAgIHBhcmVudC5wYXJlbnQgPSB0aGlzO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfc291cmNlOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBjbG9uZSgpOiB0aGlzIHtcbiAgICBjb25zdCBjbG9uZU9iaiA9IG5ldyAoPGFueT50aGlzLmNvbnN0cnVjdG9yKTtcbiAgICBjbG9uZU9iai5kZWJ1Z05hbWUgPSAnY2xvbmVfJyArIHRoaXMuZGVidWdOYW1lO1xuICAgIGNsb25lT2JqLl9zb3VyY2UgPSB0aGlzLl9zb3VyY2U7XG4gICAgY2xvbmVPYmouX25hbWUgPSAnY2xvbmVfJyArIHRoaXMuX25hbWU7XG4gICAgY2xvbmVPYmoudHlwZSA9IHRoaXMudHlwZTtcbiAgICBjbG9uZU9iai5yZWZDb3VudHMgPSB0aGlzLnJlZkNvdW50cztcbiAgICBjbG9uZU9iai5yZWZDb3VudHNbY2xvbmVPYmouX25hbWVdID0gMDtcbiAgICByZXR1cm4gY2xvbmVPYmo7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHNvdXJjZSBUaGUgbmFtZSBvZiB0aGUgc291cmNlLiBXaWxsIGNoYW5nZSBpbiBhc3NlbWJsZS5cbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIG91dHB1dCBub2RlLlxuICAgKiBAcGFyYW0gcmVmQ291bnRzIEEgZ2xvYmFsIHJlZiBjb3VudGVyIG1hcC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBzb3VyY2U6IHN0cmluZywgcHVibGljIHJlYWRvbmx5IHR5cGU6IERhdGFTb3VyY2VUeXBlLCBwcml2YXRlIHJlYWRvbmx5IHJlZkNvdW50czogRGljdDxudW1iZXI+KSB7XG4gICAgc3VwZXIocGFyZW50LCBzb3VyY2UpO1xuXG4gICAgdGhpcy5fc291cmNlID0gdGhpcy5fbmFtZSA9IHNvdXJjZTtcblxuICAgIGlmICh0aGlzLnJlZkNvdW50cyAmJiAhKHRoaXMuX25hbWUgaW4gdGhpcy5yZWZDb3VudHMpKSB7XG4gICAgICB0aGlzLnJlZkNvdW50c1t0aGlzLl9uYW1lXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdGhlIGRhdGFzb3VyY2UgbmFtZSBhbmQgaW5jcmVhc2UgdGhlIHJlZiBjb3VudGVyLlxuICAgKlxuICAgKiBEdXJpbmcgdGhlIHBhcnNpbmcgcGhhc2UsIHRoaXMgd2lsbCByZXR1cm4gdGhlIHNpbXBsZSBuYW1lIHN1Y2ggYXMgJ21haW4nIG9yICdyYXcnLlxuICAgKiBJdCBpcyBjcnVjaWFsIHRvIHJlcXVlc3QgdGhlIG5hbWUgZnJvbSBhbiBvdXRwdXQgbm9kZSB0byBtYXJrIGl0IGFzIGEgcmVxdWlyZWQgbm9kZS5cbiAgICogSWYgbm9ib2R5IGV2ZXIgcmVxdWVzdHMgdGhlIG5hbWUsIHRoaXMgZGF0YXNvdXJjZSB3aWxsIG5vdCBiZSBpbnN0YW50aWF0ZWQgaW4gdGhlIGFzc2VtYmxlIHBoYXNlLlxuICAgKlxuICAgKiBJbiB0aGUgYXNzZW1ibGUgcGhhc2UsIHRoaXMgd2lsbCByZXR1cm4gdGhlIGNvcnJlY3QgbmFtZS5cbiAgICovXG4gIHB1YmxpYyBnZXRTb3VyY2UoKSB7XG4gICAgdGhpcy5yZWZDb3VudHNbdGhpcy5fbmFtZV0rKztcbiAgICByZXR1cm4gdGhpcy5fc291cmNlO1xuICB9XG5cbiAgcHVibGljIGlzUmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5yZWZDb3VudHNbdGhpcy5fbmFtZV07XG4gIH1cblxuICBwdWJsaWMgc2V0U291cmNlKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICB9XG59XG4iXX0=