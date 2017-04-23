"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var SourceNode = (function (_super) {
    tslib_1.__extends(SourceNode, _super);
    function SourceNode(model) {
        var _this = _super.call(this) || this;
        var data = model.data || { name: 'source' };
        if (data_1.isInlineData(data)) {
            _this._data = {
                values: data.values,
                format: { type: 'json' }
            };
        }
        else if (data_1.isUrlData(data)) {
            // Extract extension from URL using snippet from
            // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
            var defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
            if (!util_1.contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
                defaultExtension = 'json';
            }
            var dataFormat = data.format || {};
            // For backward compatibility for former `data.formatType` property
            var formatType = dataFormat.type || data['formatType'];
            var property = dataFormat.property, feature = dataFormat.feature, mesh = dataFormat.mesh;
            var format = tslib_1.__assign({ type: formatType ? formatType : defaultExtension }, (property ? { property: property } : {}), (feature ? { feature: feature } : {}), (mesh ? { mesh: mesh } : {}));
            _this._data = {
                url: data.url,
                format: format
            };
        }
        else if (data_1.isNamedData(data)) {
            _this._name = data.name;
            _this._data = {};
        }
        return _this;
    }
    Object.defineProperty(SourceNode.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    SourceNode.prototype.hasName = function () {
        return !!this._name;
    };
    Object.defineProperty(SourceNode.prototype, "dataName", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SourceNode.prototype, "parent", {
        set: function (parent) {
            throw new Error('Source nodes have to be roots.');
        },
        enumerable: true,
        configurable: true
    });
    SourceNode.prototype.remove = function () {
        throw new Error('Source nodes are roots and cannot be removed.');
    };
    /**
     * Return a unique identifir for this data source.
     */
    SourceNode.prototype.hash = function () {
        if (data_1.isInlineData(this._data)) {
            return util_1.hash(this._data);
        }
        else if (data_1.isUrlData(this._data)) {
            return this._data.url + " " + util_1.hash(this._data.format);
        }
        else {
            return this._name;
        }
    };
    SourceNode.prototype.assemble = function () {
        return tslib_1.__assign({ name: this._name }, this._data, { transform: [] });
    };
    return SourceNode;
}(dataflow_1.DataFlowNode));
exports.SourceNode = SourceNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQTRFO0FBQzVFLG1DQUEwQztBQUcxQyx1Q0FBd0M7QUFFeEM7SUFBZ0Msc0NBQVk7SUFLMUMsb0JBQVksS0FBWTtRQUF4QixZQUNFLGlCQUFPLFNBcUNSO1FBbkNDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsS0FBSSxDQUFDLEtBQUssR0FBRztnQkFDWCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7YUFDdkIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsZ0RBQWdEO1lBQ2hELHdHQUF3RztZQUN4RyxJQUFJLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEUsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1lBQzVCLENBQUM7WUFDRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUVyQyxtRUFBbUU7WUFDbkUsSUFBTSxVQUFVLEdBQWUsVUFBVSxDQUFDLElBQUks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