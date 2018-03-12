"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
    __extends(OutputNode, _super);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWZsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtBOztHQUVHO0FBQ0g7SUFLRSxzQkFBWSxNQUFvQixFQUFrQixTQUFrQjtRQUFsQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBSjVELGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRS9CLFlBQU8sR0FBaUIsSUFBSSxDQUFDO1FBR25DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNEJBQUssR0FBWjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxxQ0FBYyxHQUFyQjtRQUNFLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU0sc0NBQWUsR0FBdEI7UUFDRSxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELHNCQUFJLGdDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO1FBRUQ7O1dBRUc7YUFDSCxVQUFXLE1BQW9CO1lBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQzs7O09BUkE7SUFVRCxzQkFBSSxrQ0FBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFTSxrQ0FBVyxHQUFsQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUMvQixDQUFDO0lBRU0s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QyxLQUFLLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFCLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBaUJEOzs7Ozs7OztPQVFHO0lBQ0ksOEJBQVMsR0FBaEI7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFTSwrQkFBVSxHQUFqQjtRQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLDhCQUFTLEdBQWhCLFVBQWlCLE1BQWM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQXBERCxDQUFnQyxZQUFZLEdBb0QzQztBQXBEWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtEYXRhU291cmNlVHlwZX0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0RpY3QsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cblxuLyoqXG4gKiBBIG5vZGUgaW4gdGhlIGRhdGFmbG93IHRyZWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9jaGlsZHJlbjogRGF0YUZsb3dOb2RlW10gPSBbXTtcblxuICBwcml2YXRlIF9wYXJlbnQ6IERhdGFGbG93Tm9kZSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHB1YmxpYyByZWFkb25seSBkZWJ1Z05hbWU/OiBzdHJpbmcpIHtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvbmUgdGhpcyBub2RlIHdpdGggYSBkZWVwIGNvcHkgYnV0IGRvbid0IGNsb25lIGxpbmtzIHRvIGNoaWxkcmVuIG9yIHBhcmVudHMuXG4gICAqL1xuICBwdWJsaWMgY2xvbmUoKTogRGF0YUZsb3dOb2RlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjbG9uZSBub2RlJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9mIGZpZWxkcyB0aGF0IGFyZSBiZWluZyBjcmVhdGVkIGJ5IHRoaXMgbm9kZS5cbiAgICovXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXQgcGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYXJlbnQgb2YgdGhlIG5vZGUgYW5kIGFsc28gYWRkIHRoaXMgbm90IHRvIHRoZSBwYXJlbnQncyBjaGlsZHJlbi5cbiAgICovXG4gIHNldCBwYXJlbnQocGFyZW50OiBEYXRhRmxvd05vZGUpIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgfVxuXG4gIHB1YmxpYyBudW1DaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGFkZENoaWxkKGNoaWxkOiBEYXRhRmxvd05vZGUpIHtcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVDaGlsZChvbGRDaGlsZDogRGF0YUZsb3dOb2RlKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4uc3BsaWNlKHRoaXMuX2NoaWxkcmVuLmluZGV4T2Yob2xkQ2hpbGQpLCAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbm9kZSBmcm9tIHRoZSBkYXRhZmxvdy5cbiAgICovXG4gIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLl9jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyZW50ID0gdGhpcy5fcGFyZW50O1xuICAgIH1cbiAgICB0aGlzLl9wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGFub3RoZXIgbm9kZSBhcyBhIHBhcmVudCBvZiB0aGlzIG5vZGUuXG4gICAqL1xuICBwdWJsaWMgaW5zZXJ0QXNQYXJlbnRPZihvdGhlcjogRGF0YUZsb3dOb2RlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gb3RoZXIucGFyZW50O1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICBvdGhlci5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIHN3YXBXaXRoUGFyZW50KCkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICBjb25zdCBuZXdQYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuXG4gICAgLy8gcmVjb25uZWN0IHRoZSBjaGlsZHJlblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5fY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgb2xkIGxpbmtzXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTsgIC8vIGVxdWl2YWxlbnQgdG8gcmVtb3ZpbmcgZXZlcnkgY2hpbGQgbGluayBvbmUgYnkgb25lXG4gICAgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgIHBhcmVudC5wYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50KTtcblxuXG4gICAgLy8gc3dhcCB0d28gbm9kZXNcbiAgICB0aGlzLnBhcmVudCA9IG5ld1BhcmVudDtcbiAgICBwYXJlbnQucGFyZW50ID0gdGhpcztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3V0cHV0Tm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX3NvdXJjZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX25hbWU6IHN0cmluZztcblxuICBwdWJsaWMgY2xvbmUoKTogdGhpcyB7XG4gICAgY29uc3QgY2xvbmVPYmogPSBuZXcgKDxhbnk+dGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgY2xvbmVPYmouZGVidWdOYW1lID0gJ2Nsb25lXycgKyB0aGlzLmRlYnVnTmFtZTtcbiAgICBjbG9uZU9iai5fc291cmNlID0gdGhpcy5fc291cmNlO1xuICAgIGNsb25lT2JqLl9uYW1lID0gJ2Nsb25lXycgKyB0aGlzLl9uYW1lO1xuICAgIGNsb25lT2JqLnR5cGUgPSB0aGlzLnR5cGU7XG4gICAgY2xvbmVPYmoucmVmQ291bnRzID0gdGhpcy5yZWZDb3VudHM7XG4gICAgY2xvbmVPYmoucmVmQ291bnRzW2Nsb25lT2JqLl9uYW1lXSA9IDA7XG4gICAgcmV0dXJuIGNsb25lT2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzb3VyY2UgVGhlIG5hbWUgb2YgdGhlIHNvdXJjZS4gV2lsbCBjaGFuZ2UgaW4gYXNzZW1ibGUuXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBvdXRwdXQgbm9kZS5cbiAgICogQHBhcmFtIHJlZkNvdW50cyBBIGdsb2JhbCByZWYgY291bnRlciBtYXAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgc291cmNlOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSB0eXBlOiBEYXRhU291cmNlVHlwZSwgcHJpdmF0ZSByZWFkb25seSByZWZDb3VudHM6IERpY3Q8bnVtYmVyPikge1xuICAgIHN1cGVyKHBhcmVudCwgc291cmNlKTtcblxuICAgIHRoaXMuX3NvdXJjZSA9IHRoaXMuX25hbWUgPSBzb3VyY2U7XG5cbiAgICBpZiAodGhpcy5yZWZDb3VudHMgJiYgISh0aGlzLl9uYW1lIGluIHRoaXMucmVmQ291bnRzKSkge1xuICAgICAgdGhpcy5yZWZDb3VudHNbdGhpcy5fbmFtZV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRoZSBkYXRhc291cmNlIG5hbWUgYW5kIGluY3JlYXNlIHRoZSByZWYgY291bnRlci5cbiAgICpcbiAgICogRHVyaW5nIHRoZSBwYXJzaW5nIHBoYXNlLCB0aGlzIHdpbGwgcmV0dXJuIHRoZSBzaW1wbGUgbmFtZSBzdWNoIGFzICdtYWluJyBvciAncmF3Jy5cbiAgICogSXQgaXMgY3J1Y2lhbCB0byByZXF1ZXN0IHRoZSBuYW1lIGZyb20gYW4gb3V0cHV0IG5vZGUgdG8gbWFyayBpdCBhcyBhIHJlcXVpcmVkIG5vZGUuXG4gICAqIElmIG5vYm9keSBldmVyIHJlcXVlc3RzIHRoZSBuYW1lLCB0aGlzIGRhdGFzb3VyY2Ugd2lsbCBub3QgYmUgaW5zdGFudGlhdGVkIGluIHRoZSBhc3NlbWJsZSBwaGFzZS5cbiAgICpcbiAgICogSW4gdGhlIGFzc2VtYmxlIHBoYXNlLCB0aGlzIHdpbGwgcmV0dXJuIHRoZSBjb3JyZWN0IG5hbWUuXG4gICAqL1xuICBwdWJsaWMgZ2V0U291cmNlKCkge1xuICAgIHRoaXMucmVmQ291bnRzW3RoaXMuX25hbWVdKys7XG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcbiAgfVxuXG4gIHB1YmxpYyBpc1JlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMucmVmQ291bnRzW3RoaXMuX25hbWVdO1xuICB9XG5cbiAgcHVibGljIHNldFNvdXJjZShzb3VyY2U6IHN0cmluZykge1xuICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcbiAgfVxufVxuIl19