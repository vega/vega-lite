import * as tslib_1 from "tslib";
import { isInlineData, isNamedData, isUrlData } from '../../data';
import { contains, hash } from '../../util';
import { DataFlowNode } from './dataflow';
var SourceNode = /** @class */ (function (_super) {
    tslib_1.__extends(SourceNode, _super);
    function SourceNode(data) {
        var _this = _super.call(this, null) || this;
        data = data || { name: 'source' };
        if (isInlineData(data)) {
            _this._data = { values: data.values };
        }
        else if (isUrlData(data)) {
            _this._data = { url: data.url };
            if (!data.format) {
                data.format = {};
            }
            if (!data.format || !data.format.type) {
                // Extract extension from URL using snippet from
                // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
                var defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
                if (!contains(['json', 'csv', 'tsv', 'dsv', 'topojson'], defaultExtension)) {
                    defaultExtension = 'json';
                }
                // defaultExtension has type string but we ensure that it is DataFormatType above
                data.format.type = defaultExtension;
            }
        }
        else if (isNamedData(data)) {
            _this._data = {};
        }
        // any dataset can be named
        if (data.name) {
            _this._name = data.name;
        }
        if (data.format) {
            var _a = data.format, _b = _a.parse, parse = _b === void 0 ? null : _b, format = tslib_1.__rest(_a, ["parse"]);
            _this._data.format = format;
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
     * Return a unique identifier for this data source.
     */
    SourceNode.prototype.hash = function () {
        if (isInlineData(this._data)) {
            if (!this._hash) {
                // Hashing can be expensive for large inline datasets.
                this._hash = hash(this._data);
            }
            return this._hash;
        }
        else if (isUrlData(this._data)) {
            return hash([this._data.url, this._data.format]);
        }
        else {
            return this._name;
        }
    };
    SourceNode.prototype.assemble = function () {
        return tslib_1.__assign({ name: this._name }, this._data, { transform: [] });
    };
    return SourceNode;
}(DataFlowNode));
export { SourceNode };
//# sourceMappingURL=source.js.map