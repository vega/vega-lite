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
        var _this = _super.call(this, null) || this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0Y7QUFDdEYsbUNBQTBDO0FBRTFDLHVDQUF3QztBQUV4QztJQUFnQyw4QkFBWTtJQU8xQyxvQkFBWSxJQUFVO1FBQXRCLFlBQ0Usa0JBQU0sSUFBSSxDQUFDLFNBaUNaO1FBL0JDLElBQUksR0FBRyxJQUFJLElBQUksRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUM7UUFDckMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztZQUU3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNuQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxnREFBZ0Q7Z0JBQ2hELHdHQUF3RztnQkFDeEcsSUFBSSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7Z0JBQzVCLENBQUM7Z0JBRUQsaUZBQWlGO2dCQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxnQkFBa0MsQ0FBQztZQUN4RCxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdkIsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFNLGdCQUF1QyxFQUF0QyxhQUFZLEVBQVosaUNBQVksRUFBRSw4QkFBd0IsQ0FBQztZQUM5QyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDN0IsQ0FBQzs7SUFDSCxDQUFDO0lBRUQsc0JBQUksNEJBQUk7YUFBUjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBRU0sNEJBQU8sR0FBZDtRQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsc0JBQUksZ0NBQVE7YUFBWjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFhLElBQVk7WUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDcEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSw4QkFBTTthQUFWLFVBQVcsTUFBb0I7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBRU0sMkJBQU0sR0FBYjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSx5QkFBSSxHQUFYO1FBQ0UsRUFBRSxDQUFDLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLHNEQUFzRDtnQkFDdEQsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsV0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7SUFDSCxDQUFDO0lBRU0sNkJBQVEsR0FBZjtRQUNFLE1BQU0sWUFDSixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFDYixJQUFJLENBQUMsS0FBSyxJQUNiLFNBQVMsRUFBRSxFQUFFLElBQ2I7SUFDSixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBM0ZELENBQWdDLHVCQUFZLEdBMkYzQztBQTNGWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGF0YSwgRGF0YUZvcm1hdFR5cGUsIGlzSW5saW5lRGF0YSwgaXNOYW1lZERhdGEsIGlzVXJsRGF0YX0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge2NvbnRhaW5zLCBoYXNofSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfZGF0YTogUGFydGlhbDxWZ0RhdGE+O1xuXG4gIHByaXZhdGUgX25hbWU6IHN0cmluZztcblxuICBwcml2YXRlIF9oYXNoOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogRGF0YSkge1xuICAgIHN1cGVyKG51bGwpOyAgLy8gc291cmNlIGNhbm5vdCBoYXZlIHBhcmVudFxuXG4gICAgZGF0YSA9IGRhdGEgfHwge25hbWU6ICdzb3VyY2UnfTtcblxuICAgIGlmIChpc0lubGluZURhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7dmFsdWVzOiBkYXRhLnZhbHVlc307XG4gICAgfSBlbHNlIGlmIChpc1VybERhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7dXJsOiBkYXRhLnVybH07XG5cbiAgICAgIGlmICghZGF0YS5mb3JtYXQpIHtcbiAgICAgICAgZGF0YS5mb3JtYXQgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhLmZvcm1hdCB8fCAhZGF0YS5mb3JtYXQudHlwZSkge1xuICAgICAgICAvLyBFeHRyYWN0IGV4dGVuc2lvbiBmcm9tIFVSTCB1c2luZyBzbmlwcGV0IGZyb21cbiAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODA5MjkvaG93LXRvLWV4dHJhY3QtZXh0ZW5zaW9uLWZyb20tZmlsZW5hbWUtc3RyaW5nLWluLWphdmFzY3JpcHRcbiAgICAgICAgbGV0IGRlZmF1bHRFeHRlbnNpb24gPSAvKD86XFwuKFteLl0rKSk/JC8uZXhlYyhkYXRhLnVybClbMV07XG4gICAgICAgIGlmICghY29udGFpbnMoWydqc29uJywgJ2NzdicsICd0c3YnLCAndG9wb2pzb24nXSwgZGVmYXVsdEV4dGVuc2lvbikpIHtcbiAgICAgICAgICBkZWZhdWx0RXh0ZW5zaW9uID0gJ2pzb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdEV4dGVuc2lvbiBoYXMgdHlwZSBzdHJpbmcgYnV0IHdlIGVuc3VyZSB0aGF0IGl0IGlzIERhdGFGb3JtYXRUeXBlIGFib3ZlXG4gICAgICAgIGRhdGEuZm9ybWF0LnR5cGUgPSBkZWZhdWx0RXh0ZW5zaW9uIGFzIERhdGFGb3JtYXRUeXBlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNOYW1lZERhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX25hbWUgPSBkYXRhLm5hbWU7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFpc05hbWVkRGF0YShkYXRhKSAmJiBkYXRhLmZvcm1hdCkge1xuICAgICAgY29uc3Qge3BhcnNlID0gbnVsbCwgLi4uZm9ybWF0fSA9IGRhdGEuZm9ybWF0O1xuICAgICAgdGhpcy5fZGF0YS5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICBwdWJsaWMgaGFzTmFtZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9uYW1lO1xuICB9XG5cbiAgZ2V0IGRhdGFOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IGRhdGFOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIG5vZGVzIGhhdmUgdG8gYmUgcm9vdHMuJyk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIG5vZGVzIGFyZSByb290cyBhbmQgY2Fubm90IGJlIHJlbW92ZWQuJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoaXMgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgaGFzaCgpIHtcbiAgICBpZiAoaXNJbmxpbmVEYXRhKHRoaXMuX2RhdGEpKSB7XG4gICAgICBpZiAoIXRoaXMuX2hhc2gpIHtcbiAgICAgICAgLy8gSGFzaGluZyBjYW4gYmUgZXhwZW5zaXZlIGZvciBsYXJnZSBpbmxpbmUgZGF0YXNldHMuXG4gICAgICAgIHRoaXMuX2hhc2ggPSBoYXNoKHRoaXMuX2RhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgfSBlbHNlIGlmIChpc1VybERhdGEodGhpcy5fZGF0YSkpIHtcbiAgICAgIHJldHVybiBoYXNoKFt0aGlzLl9kYXRhLnVybCwgdGhpcy5fZGF0YS5mb3JtYXRdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnRGF0YSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMuX25hbWUsXG4gICAgICAuLi50aGlzLl9kYXRhLFxuICAgICAgdHJhbnNmb3JtOiBbXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==