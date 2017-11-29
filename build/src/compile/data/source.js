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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBa0c7QUFDbEcsbUNBQTJEO0FBRTNELHVDQUF3QztBQUV4QztJQUFnQyw4QkFBWTtJQU8xQyxvQkFBWSxJQUFVO1FBQXRCLFlBQ0UsaUJBQU8sU0FpQ1I7UUEvQkMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUVoQyxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ25CLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGdEQUFnRDtnQkFDaEQsd0dBQXdHO2dCQUN4RyxJQUFJLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELEVBQUUsQ0FBQyxDQUFD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VHlwZSwgaXNJbmxpbmVEYXRhLCBpc05hbWVkRGF0YSwgaXNVcmxEYXRhfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7Y29udGFpbnMsIGR1cGxpY2F0ZSwgaGFzaCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRGF0YX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgU291cmNlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX2RhdGE6IFBhcnRpYWw8VmdEYXRhPjtcblxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfaGFzaDogc3RyaW5nIHwgbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IERhdGEpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgZGF0YSA9IGRhdGEgfHwge25hbWU6ICdzb3VyY2UnfTtcblxuICAgIGlmIChpc0lubGluZURhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7dmFsdWVzOiBkYXRhLnZhbHVlc307XG4gICAgfSBlbHNlIGlmIChpc1VybERhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7dXJsOiBkYXRhLnVybH07XG5cbiAgICAgIGlmICghZGF0YS5mb3JtYXQpIHtcbiAgICAgICAgZGF0YS5mb3JtYXQgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhLmZvcm1hdCB8fCAhZGF0YS5mb3JtYXQudHlwZSkge1xuICAgICAgICAvLyBFeHRyYWN0IGV4dGVuc2lvbiBmcm9tIFVSTCB1c2luZyBzbmlwcGV0IGZyb21cbiAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODA5MjkvaG93LXRvLWV4dHJhY3QtZXh0ZW5zaW9uLWZyb20tZmlsZW5hbWUtc3RyaW5nLWluLWphdmFzY3JpcHRcbiAgICAgICAgbGV0IGRlZmF1bHRFeHRlbnNpb24gPSAvKD86XFwuKFteLl0rKSk/JC8uZXhlYyhkYXRhLnVybClbMV07XG4gICAgICAgIGlmICghY29udGFpbnMoWydqc29uJywgJ2NzdicsICd0c3YnLCAndG9wb2pzb24nXSwgZGVmYXVsdEV4dGVuc2lvbikpIHtcbiAgICAgICAgICBkZWZhdWx0RXh0ZW5zaW9uID0gJ2pzb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdEV4dGVuc2lvbiBoYXMgdHlwZSBzdHJpbmcgYnV0IHdlIGVuc3VyZSB0aGF0IGl0IGlzIERhdGFGb3JtYXRUeXBlIGFib3ZlXG4gICAgICAgIGRhdGEuZm9ybWF0LnR5cGUgPSBkZWZhdWx0RXh0ZW5zaW9uIGFzIERhdGFGb3JtYXRUeXBlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNOYW1lZERhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX25hbWUgPSBkYXRhLm5hbWU7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFpc05hbWVkRGF0YShkYXRhKSAmJiBkYXRhLmZvcm1hdCkge1xuICAgICAgY29uc3Qge3BhcnNlID0gbnVsbCwgLi4uZm9ybWF0fSA9IGRhdGEuZm9ybWF0O1xuICAgICAgdGhpcy5fZGF0YS5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICBwdWJsaWMgaGFzTmFtZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9uYW1lO1xuICB9XG5cbiAgZ2V0IGRhdGFOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IGRhdGFOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIG5vZGVzIGhhdmUgdG8gYmUgcm9vdHMuJyk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIG5vZGVzIGFyZSByb290cyBhbmQgY2Fubm90IGJlIHJlbW92ZWQuJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoaXMgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgaGFzaCgpIHtcbiAgICBpZiAoaXNJbmxpbmVEYXRhKHRoaXMuX2RhdGEpKSB7XG4gICAgICBpZiAoIXRoaXMuX2hhc2gpIHtcbiAgICAgICAgLy8gSGFzaGluZyBjYW4gYmUgZXhwZW5zaXZlIGZvciBsYXJnZSBpbmxpbmUgZGF0YXNldHMuXG4gICAgICAgIHRoaXMuX2hhc2ggPSBoYXNoKHRoaXMuX2RhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgfSBlbHNlIGlmIChpc1VybERhdGEodGhpcy5fZGF0YSkpIHtcbiAgICAgIHJldHVybiBoYXNoKFt0aGlzLl9kYXRhLnVybCwgdGhpcy5fZGF0YS5mb3JtYXRdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnRGF0YSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMuX25hbWUsXG4gICAgICAuLi50aGlzLl9kYXRhLFxuICAgICAgdHJhbnNmb3JtOiBbXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==