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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var log = require("../../log");
var dataflow_1 = require("./dataflow");
var source_1 = require("./source");
var LookupNode = /** @class */ (function (_super) {
    __extends(LookupNode, _super);
    function LookupNode(transform, secondary) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        _this.secondary = secondary;
        return _this;
    }
    LookupNode.make = function (model, transform, counter) {
        var sources = model.component.data.sources;
        var s = new source_1.SourceNode(transform.from.data);
        var fromSource = sources[s.hash()];
        if (!fromSource) {
            sources[s.hash()] = s;
            fromSource = s;
        }
        var fromOutputName = model.getName("lookup_" + counter);
        var fromOutputNode = new dataflow_1.OutputNode(fromOutputName, 'lookup', model.component.data.outputNodeRefCounts);
        fromOutputNode.parent = fromSource;
        model.component.data.outputNodes[fromOutputName] = fromOutputNode;
        return new LookupNode(transform, fromOutputNode.getSource());
    };
    LookupNode.prototype.producedFields = function () {
        return vega_util_1.toSet(this.transform.from.fields || ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as]));
    };
    LookupNode.prototype.assemble = function () {
        var foreign;
        if (this.transform.from.fields) {
            // lookup a few fields and add create a flat output
            foreign = __assign({ values: this.transform.from.fields }, this.transform.as ? { as: ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as]) } : {});
        }
        else {
            // lookup full record and nest it
            var asName = this.transform.as;
            if (!vega_util_1.isString(asName)) {
                log.warn(log.message.NO_FIELDS_NEEDS_AS);
                asName = '_lookup';
            }
            foreign = {
                as: [asName]
            };
        }
        return __assign({ type: 'lookup', from: this.secondary, key: this.transform.from.key, fields: [this.transform.lookup] }, foreign, (this.transform.default ? { default: this.transform.default } : {}));
    };
    return LookupNode;
}(dataflow_1.DataFlowNode));
exports.LookupNode = LookupNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9va3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9sb29rdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBMEM7QUFDMUMsK0JBQWlDO0FBS2pDLHVDQUFvRDtBQUNwRCxtQ0FBb0M7QUFFcEM7SUFBZ0MsOEJBQVk7SUFDMUMsb0JBQTRCLFNBQTBCLEVBQWtCLFNBQWlCO1FBQXpGLFlBQ0UsaUJBQU8sU0FDUjtRQUYyQixlQUFTLEdBQVQsU0FBUyxDQUFpQjtRQUFrQixlQUFTLEdBQVQsU0FBUyxDQUFROztJQUV6RixDQUFDO0lBRWEsZUFBSSxHQUFsQixVQUFtQixLQUFZLEVBQUUsU0FBMEIsRUFBRSxPQUFlO1FBQzFFLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM3QyxJQUFNLENBQUMsR0FBRyxJQUFJLG1CQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFVLE9BQVMsQ0FBQyxDQUFDO1FBQzFELElBQU0sY0FBYyxHQUFHLElBQUkscUJBQVUsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDMUcsY0FBYyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7UUFFbkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGNBQWMsQ0FBQztRQUVsRSxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTSxtQ0FBYyxHQUFyQjtRQUNFLE1BQU0sQ0FBQyxpQkFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ILENBQUM7SUFFTSw2QkFBUSxHQUFmO1FBQ0UsSUFBSSxPQUFtQyxDQUFDO1FBRXhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0IsbURBQW1EO1lBQ25ELE9BQU8sY0FDTCxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUNwSCxDQUFDO1FBQ0osQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04saUNBQWlDO1lBQ2pDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQ3JCLENBQUM7WUFFRCxPQUFPLEdBQUc7Z0JBQ1IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO2FBQ2IsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLFlBQ0osSUFBSSxFQUFFLFFBQVEsRUFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFDcEIsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFDNUIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFDNUIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNwRTtJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUExREQsQ0FBZ0MsdUJBQVksR0EwRDNDO0FBMURZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZywgdG9TZXR9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7TG9va3VwVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0xvb2t1cFRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGUsIE91dHB1dE5vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuL3NvdXJjZSc7XG5cbmV4cG9ydCBjbGFzcyBMb29rdXBOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHRyYW5zZm9ybTogTG9va3VwVHJhbnNmb3JtLCBwdWJsaWMgcmVhZG9ubHkgc2Vjb25kYXJ5OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlKG1vZGVsOiBNb2RlbCwgdHJhbnNmb3JtOiBMb29rdXBUcmFuc2Zvcm0sIGNvdW50ZXI6IG51bWJlcikge1xuICAgIGNvbnN0IHNvdXJjZXMgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5zb3VyY2VzO1xuICAgIGNvbnN0IHMgPSBuZXcgU291cmNlTm9kZSh0cmFuc2Zvcm0uZnJvbS5kYXRhKTtcbiAgICBsZXQgZnJvbVNvdXJjZSA9IHNvdXJjZXNbcy5oYXNoKCldO1xuICAgIGlmICghZnJvbVNvdXJjZSkge1xuICAgICAgc291cmNlc1tzLmhhc2goKV0gPSBzO1xuICAgICAgZnJvbVNvdXJjZSA9IHM7XG4gICAgfVxuXG4gICAgY29uc3QgZnJvbU91dHB1dE5hbWUgPSBtb2RlbC5nZXROYW1lKGBsb29rdXBfJHtjb3VudGVyfWApO1xuICAgIGNvbnN0IGZyb21PdXRwdXROb2RlID0gbmV3IE91dHB1dE5vZGUoZnJvbU91dHB1dE5hbWUsICdsb29rdXAnLCBtb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICBmcm9tT3V0cHV0Tm9kZS5wYXJlbnQgPSBmcm9tU291cmNlO1xuXG4gICAgbW9kZWwuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXNbZnJvbU91dHB1dE5hbWVdID0gZnJvbU91dHB1dE5vZGU7XG5cbiAgICByZXR1cm4gbmV3IExvb2t1cE5vZGUodHJhbnNmb3JtLCBmcm9tT3V0cHV0Tm9kZS5nZXRTb3VyY2UoKSk7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKTogU3RyaW5nU2V0IHtcbiAgICByZXR1cm4gdG9TZXQodGhpcy50cmFuc2Zvcm0uZnJvbS5maWVsZHMgfHwgKCh0aGlzLnRyYW5zZm9ybS5hcyBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXMudHJhbnNmb3JtLmFzIDogW3RoaXMudHJhbnNmb3JtLmFzXSkpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnTG9va3VwVHJhbnNmb3JtIHtcbiAgICBsZXQgZm9yZWlnbjogUGFydGlhbDxWZ0xvb2t1cFRyYW5zZm9ybT47XG5cbiAgICBpZiAodGhpcy50cmFuc2Zvcm0uZnJvbS5maWVsZHMpIHtcbiAgICAgIC8vIGxvb2t1cCBhIGZldyBmaWVsZHMgYW5kIGFkZCBjcmVhdGUgYSBmbGF0IG91dHB1dFxuICAgICAgZm9yZWlnbiA9IHtcbiAgICAgICAgdmFsdWVzOiB0aGlzLnRyYW5zZm9ybS5mcm9tLmZpZWxkcyxcbiAgICAgICAgLi4uIHRoaXMudHJhbnNmb3JtLmFzID8ge2FzOiAoKHRoaXMudHJhbnNmb3JtLmFzIGluc3RhbmNlb2YgQXJyYXkpID8gdGhpcy50cmFuc2Zvcm0uYXMgOiBbdGhpcy50cmFuc2Zvcm0uYXNdKX0gOiB7fVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbG9va3VwIGZ1bGwgcmVjb3JkIGFuZCBuZXN0IGl0XG4gICAgICBsZXQgYXNOYW1lID0gdGhpcy50cmFuc2Zvcm0uYXM7XG4gICAgICBpZiAoIWlzU3RyaW5nKGFzTmFtZSkpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTk9fRklFTERTX05FRURTX0FTKTtcbiAgICAgICAgYXNOYW1lID0gJ19sb29rdXAnO1xuICAgICAgfVxuXG4gICAgICBmb3JlaWduID0ge1xuICAgICAgICBhczogW2FzTmFtZV1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdsb29rdXAnLFxuICAgICAgZnJvbTogdGhpcy5zZWNvbmRhcnksXG4gICAgICBrZXk6IHRoaXMudHJhbnNmb3JtLmZyb20ua2V5LFxuICAgICAgZmllbGRzOiBbdGhpcy50cmFuc2Zvcm0ubG9va3VwXSxcbiAgICAgIC4uLmZvcmVpZ24sXG4gICAgICAuLi4odGhpcy50cmFuc2Zvcm0uZGVmYXVsdCA/IHtkZWZhdWx0OiB0aGlzLnRyYW5zZm9ybS5kZWZhdWx0fSA6IHt9KVxuICAgIH07XG4gIH1cbn1cbiJdfQ==