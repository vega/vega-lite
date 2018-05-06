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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWZsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBOztHQUVHO0FBQ0g7SUFLRSxzQkFBWSxNQUFvQixFQUFrQixTQUFrQjtRQUFsQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBSjVELGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRS9CLFlBQU8sR0FBaUIsSUFBSSxDQUFDO1FBR25DLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw0QkFBSyxHQUFaO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNJLHFDQUFjLEdBQXJCO1FBQ0UsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU0sc0NBQWUsR0FBdEI7UUFDRSxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxzQkFBSSxnQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7UUFFRDs7V0FFRzthQUNILFVBQVcsTUFBb0I7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDOzs7T0FSQTtJQVVELHNCQUFJLGtDQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFTSxrQ0FBVyxHQUFsQjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVNLCtCQUFRLEdBQWYsVUFBZ0IsS0FBbUI7UUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMs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U0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDcEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFpQkQ7Ozs7Ozs7O09BUUc7SUFDSSw4QkFBUyxHQUFoQjtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFTSwrQkFBVSxHQUFqQjtRQUNFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSw4QkFBUyxHQUFoQixVQUFpQixNQUFjO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFwREQsQ0FBZ0MsWUFBWSxHQW9EM0M7QUFwRFksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7RGF0YVNvdXJjZVR5cGV9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEaWN0LCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbi8qKlxuICogQSBub2RlIGluIHRoZSBkYXRhZmxvdyB0cmVlLlxuICovXG5leHBvcnQgY2xhc3MgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfY2hpbGRyZW46IERhdGFGbG93Tm9kZVtdID0gW107XG5cbiAgcHJpdmF0ZSBfcGFyZW50OiBEYXRhRmxvd05vZGUgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwdWJsaWMgcmVhZG9ubHkgZGVidWdOYW1lPzogc3RyaW5nKSB7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsb25lIHRoaXMgbm9kZSB3aXRoIGEgZGVlcCBjb3B5IGJ1dCBkb24ndCBjbG9uZSBsaW5rcyB0byBjaGlsZHJlbiBvciBwYXJlbnRzLlxuICAgKi9cbiAgcHVibGljIGNsb25lKCk6IERhdGFGbG93Tm9kZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2xvbmUgbm9kZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBvZiBmaWVsZHMgdGhhdCBhcmUgYmVpbmcgY3JlYXRlZCBieSB0aGlzIG5vZGUuXG4gICAqL1xuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCk6IFN0cmluZ1NldCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0IHBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcGFyZW50IG9mIHRoZSBub2RlIGFuZCBhbHNvIGFkZCB0aGlzIG5vdCB0byB0aGUgcGFyZW50J3MgY2hpbGRyZW4uXG4gICAqL1xuICBzZXQgcGFyZW50KHBhcmVudDogRGF0YUZsb3dOb2RlKSB7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gIH1cblxuICBwdWJsaWMgbnVtQ2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuLmxlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRDaGlsZChjaGlsZDogRGF0YUZsb3dOb2RlKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQ2hpbGQob2xkQ2hpbGQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHRoaXMuX2NoaWxkcmVuLnNwbGljZSh0aGlzLl9jaGlsZHJlbi5pbmRleE9mKG9sZENoaWxkKSwgMSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG5vZGUgZnJvbSB0aGUgZGF0YWZsb3cuXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5fY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICB9XG4gICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhbm90aGVyIG5vZGUgYXMgYSBwYXJlbnQgb2YgdGhpcyBub2RlLlxuICAgKi9cbiAgcHVibGljIGluc2VydEFzUGFyZW50T2Yob3RoZXI6IERhdGFGbG93Tm9kZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IG90aGVyLnBhcmVudDtcbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgb3RoZXIucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBzd2FwV2l0aFBhcmVudCgpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XG4gICAgY29uc3QgbmV3UGFyZW50ID0gcGFyZW50LnBhcmVudDtcblxuICAgIC8vIHJlY29ubmVjdCB0aGUgY2hpbGRyZW5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuX2NoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIG9sZCBsaW5rc1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107ICAvLyBlcXVpdmFsZW50IHRvIHJlbW92aW5nIGV2ZXJ5IGNoaWxkIGxpbmsgb25lIGJ5IG9uZVxuICAgIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICBwYXJlbnQucGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudCk7XG5cblxuICAgIC8vIHN3YXAgdHdvIG5vZGVzXG4gICAgdGhpcy5wYXJlbnQgPSBuZXdQYXJlbnQ7XG4gICAgcGFyZW50LnBhcmVudCA9IHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE91dHB1dE5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9zb3VyY2U6IHN0cmluZztcblxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIGNsb25lKCk6IHRoaXMge1xuICAgIGNvbnN0IGNsb25lT2JqID0gbmV3ICg8YW55PnRoaXMuY29uc3RydWN0b3IpO1xuICAgIGNsb25lT2JqLmRlYnVnTmFtZSA9ICdjbG9uZV8nICsgdGhpcy5kZWJ1Z05hbWU7XG4gICAgY2xvbmVPYmouX3NvdXJjZSA9IHRoaXMuX3NvdXJjZTtcbiAgICBjbG9uZU9iai5fbmFtZSA9ICdjbG9uZV8nICsgdGhpcy5fbmFtZTtcbiAgICBjbG9uZU9iai50eXBlID0gdGhpcy50eXBlO1xuICAgIGNsb25lT2JqLnJlZkNvdW50cyA9IHRoaXMucmVmQ291bnRzO1xuICAgIGNsb25lT2JqLnJlZkNvdW50c1tjbG9uZU9iai5fbmFtZV0gPSAwO1xuICAgIHJldHVybiBjbG9uZU9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gc291cmNlIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2UuIFdpbGwgY2hhbmdlIGluIGFzc2VtYmxlLlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgb3V0cHV0IG5vZGUuXG4gICAqIEBwYXJhbSByZWZDb3VudHMgQSBnbG9iYWwgcmVmIGNvdW50ZXIgbWFwLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHNvdXJjZTogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgdHlwZTogRGF0YVNvdXJjZVR5cGUsIHByaXZhdGUgcmVhZG9ubHkgcmVmQ291bnRzOiBEaWN0PG51bWJlcj4pIHtcbiAgICBzdXBlcihwYXJlbnQsIHNvdXJjZSk7XG5cbiAgICB0aGlzLl9zb3VyY2UgPSB0aGlzLl9uYW1lID0gc291cmNlO1xuXG4gICAgaWYgKHRoaXMucmVmQ291bnRzICYmICEodGhpcy5fbmFtZSBpbiB0aGlzLnJlZkNvdW50cykpIHtcbiAgICAgIHRoaXMucmVmQ291bnRzW3RoaXMuX25hbWVdID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0aGUgZGF0YXNvdXJjZSBuYW1lIGFuZCBpbmNyZWFzZSB0aGUgcmVmIGNvdW50ZXIuXG4gICAqXG4gICAqIER1cmluZyB0aGUgcGFyc2luZyBwaGFzZSwgdGhpcyB3aWxsIHJldHVybiB0aGUgc2ltcGxlIG5hbWUgc3VjaCBhcyAnbWFpbicgb3IgJ3JhdycuXG4gICAqIEl0IGlzIGNydWNpYWwgdG8gcmVxdWVzdCB0aGUgbmFtZSBmcm9tIGFuIG91dHB1dCBub2RlIHRvIG1hcmsgaXQgYXMgYSByZXF1aXJlZCBub2RlLlxuICAgKiBJZiBub2JvZHkgZXZlciByZXF1ZXN0cyB0aGUgbmFtZSwgdGhpcyBkYXRhc291cmNlIHdpbGwgbm90IGJlIGluc3RhbnRpYXRlZCBpbiB0aGUgYXNzZW1ibGUgcGhhc2UuXG4gICAqXG4gICAqIEluIHRoZSBhc3NlbWJsZSBwaGFzZSwgdGhpcyB3aWxsIHJldHVybiB0aGUgY29ycmVjdCBuYW1lLlxuICAgKi9cbiAgcHVibGljIGdldFNvdXJjZSgpIHtcbiAgICB0aGlzLnJlZkNvdW50c1t0aGlzLl9uYW1lXSsrO1xuICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XG4gIH1cblxuICBwdWJsaWMgaXNSZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnJlZkNvdW50c1t0aGlzLl9uYW1lXTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTb3VyY2Uoc291cmNlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XG4gIH1cbn1cbiJdfQ==