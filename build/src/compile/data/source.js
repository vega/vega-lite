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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var SourceNode = /** @class */ (function (_super) {
    __extends(SourceNode, _super);
    function SourceNode(data) {
        var _this = _super.call(this) || this;
        data = data || { name: 'source' };
        if (data_1.isInlineData(data)) {
            _this._data = { values: data.values };
        }
        else if (data_1.isUrlData(data)) {
            _this._data = { url: data.url };
            if (!data.format) {
                data.format = {};
            }
            if (!data.format || !data.format.type) {
                // Extract extension from URL using snippet from
                // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
                var defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
                if (!util_1.contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
                    defaultExtension = 'json';
                }
                // defaultExtension has type string but we ensure that it is DataFormatType above
                data.format.type = defaultExtension;
            }
        }
        else if (data_1.isNamedData(data)) {
            _this._name = data.name;
            _this._data = {};
        }
        if (!data_1.isNamedData(data) && data.format) {
            var _a = data.format, _b = _a.parse, parse = _b === void 0 ? null : _b, format = __rest(_a, ["parse"]);
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
        if (data_1.isInlineData(this._data)) {
            if (!this._hash) {
                // Hashing can be expensive for large inline datasets.
                this._hash = util_1.hash(this._data);
            }
            return this._hash;
        }
        else if (data_1.isUrlData(this._data)) {
            return util_1.hash([this._data.url, this._data.format]);
        }
        else {
            return this._name;
        }
    };
    SourceNode.prototype.assemble = function () {
        return __assign({ name: this._name }, this._data, { transform: [] });
    };
    return SourceNode;
}(dataflow_1.DataFlowNode));
exports.SourceNode = SourceNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0Y7QUFDdEYsbUNBQTBDO0FBRTFDLHVDQUF3QztBQUV4QztJQUFnQyw4QkFBWTtJQU8xQyxvQkFBWSxJQUFVO1FBQXRCLFlBQ0UsaUJBQU8sU0FpQ1I7UUEvQkMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUVoQyxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ25CLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGdEQUFnRDtnQkFDaEQsd0dBQXdHO2dCQUN4RyxJQUFJLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztnQkFDNUIsQ0FBQztnQkFFRCxpRkFBaUY7Z0JBQ2pGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLGdCQUFrQyxDQUFDO1lBQ3hELENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN2QixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQU0sZ0JBQXVDLEVBQXRDLGFBQVksRUFBWixpQ0FBWSxFQUFFLDhCQUF3QixDQUFDO1lBQzlDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM3QixDQUFDOztJQUNILENBQUM7SUFFRCxzQkFBSSw0QkFBSTthQUFSO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFFTSw0QkFBTyxHQUFkO1FBQ0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxzQkFBSSxnQ0FBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQUVELFVBQWEsSUFBWTtZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNwQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDhCQUFNO2FBQVYsVUFBVyxNQUFvQjtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDcEQsQ0FBQzs7O09BQUE7SUFFTSwyQkFBTSxHQUFiO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7T0FFRztJQUNJLHlCQUFJLEdBQVg7UUFDRSxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxXQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFTSw2QkFBUSxHQUFmO1FBQ0UsTUFBTSxZQUNKLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxJQUNiLElBQUksQ0FBQyxLQUFLLElBQ2IsU0FBUyxFQUFFLEVBQUUsSUFDYjtJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUEzRkQsQ0FBZ0MsdUJBQVksR0EyRjNDO0FBM0ZZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEYXRhLCBEYXRhRm9ybWF0VHlwZSwgaXNJbmxpbmVEYXRhLCBpc05hbWVkRGF0YSwgaXNVcmxEYXRhfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7Y29udGFpbnMsIGhhc2h9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZXhwb3J0IGNsYXNzIFNvdXJjZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9kYXRhOiBQYXJ0aWFsPFZnRGF0YT47XG5cbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX2hhc2g6IHN0cmluZyB8IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBEYXRhKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGRhdGEgPSBkYXRhIHx8IHtuYW1lOiAnc291cmNlJ307XG5cbiAgICBpZiAoaXNJbmxpbmVEYXRhKGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0ge3ZhbHVlczogZGF0YS52YWx1ZXN9O1xuICAgIH0gZWxzZSBpZiAoaXNVcmxEYXRhKGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0ge3VybDogZGF0YS51cmx9O1xuXG4gICAgICBpZiAoIWRhdGEuZm9ybWF0KSB7XG4gICAgICAgIGRhdGEuZm9ybWF0ID0ge307XG4gICAgICB9XG5cbiAgICAgIGlmICghZGF0YS5mb3JtYXQgfHwgIWRhdGEuZm9ybWF0LnR5cGUpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBleHRlbnNpb24gZnJvbSBVUkwgdXNpbmcgc25pcHBldCBmcm9tXG4gICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjgwOTI5L2hvdy10by1leHRyYWN0LWV4dGVuc2lvbi1mcm9tLWZpbGVuYW1lLXN0cmluZy1pbi1qYXZhc2NyaXB0XG4gICAgICAgIGxldCBkZWZhdWx0RXh0ZW5zaW9uID0gLyg/OlxcLihbXi5dKykpPyQvLmV4ZWMoZGF0YS51cmwpWzFdO1xuICAgICAgICBpZiAoIWNvbnRhaW5zKFsnanNvbicsICdjc3YnLCAndHN2JywgJ3RvcG9qc29uJ10sIGRlZmF1bHRFeHRlbnNpb24pKSB7XG4gICAgICAgICAgZGVmYXVsdEV4dGVuc2lvbiA9ICdqc29uJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlZmF1bHRFeHRlbnNpb24gaGFzIHR5cGUgc3RyaW5nIGJ1dCB3ZSBlbnN1cmUgdGhhdCBpdCBpcyBEYXRhRm9ybWF0VHlwZSBhYm92ZVxuICAgICAgICBkYXRhLmZvcm1hdC50eXBlID0gZGVmYXVsdEV4dGVuc2lvbiBhcyBEYXRhRm9ybWF0VHlwZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTmFtZWREYXRhKGRhdGEpKSB7XG4gICAgICB0aGlzLl9uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGlmICghaXNOYW1lZERhdGEoZGF0YSkgJiYgZGF0YS5mb3JtYXQpIHtcbiAgICAgIGNvbnN0IHtwYXJzZSA9IG51bGwsIC4uLmZvcm1hdH0gPSBkYXRhLmZvcm1hdDtcbiAgICAgIHRoaXMuX2RhdGEuZm9ybWF0ID0gZm9ybWF0O1xuICAgIH1cbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgcHVibGljIGhhc05hbWUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGdldCBkYXRhTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIHNldCBkYXRhTmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgfVxuXG4gIHNldCBwYXJlbnQocGFyZW50OiBEYXRhRmxvd05vZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvdXJjZSBub2RlcyBoYXZlIHRvIGJlIHJvb3RzLicpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZSgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvdXJjZSBub2RlcyBhcmUgcm9vdHMgYW5kIGNhbm5vdCBiZSByZW1vdmVkLicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIGRhdGEgc291cmNlLlxuICAgKi9cbiAgcHVibGljIGhhc2goKSB7XG4gICAgaWYgKGlzSW5saW5lRGF0YSh0aGlzLl9kYXRhKSkge1xuICAgICAgaWYgKCF0aGlzLl9oYXNoKSB7XG4gICAgICAgIC8vIEhhc2hpbmcgY2FuIGJlIGV4cGVuc2l2ZSBmb3IgbGFyZ2UgaW5saW5lIGRhdGFzZXRzLlxuICAgICAgICB0aGlzLl9oYXNoID0gaGFzaCh0aGlzLl9kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xuICAgIH0gZWxzZSBpZiAoaXNVcmxEYXRhKHRoaXMuX2RhdGEpKSB7XG4gICAgICByZXR1cm4gaGFzaChbdGhpcy5fZGF0YS51cmwsIHRoaXMuX2RhdGEuZm9ybWF0XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0RhdGEge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiB0aGlzLl9uYW1lLFxuICAgICAgLi4udGhpcy5fZGF0YSxcbiAgICAgIHRyYW5zZm9ybTogW11cbiAgICB9O1xuICB9XG59XG4iXX0=