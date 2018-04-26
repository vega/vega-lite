"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var SourceNode = /** @class */ (function (_super) {
    tslib_1.__extends(SourceNode, _super);
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
        return tslib_1.__assign({ name: this._name }, this._data, { transform: [] });
    };
    return SourceNode;
}(dataflow_1.DataFlowNode));
exports.SourceNode = SourceNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXNGO0FBQ3RGLG1DQUEwQztBQUUxQyx1Q0FBd0M7QUFFeEM7SUFBZ0Msc0NBQVk7SUFPMUMsb0JBQVksSUFBVTtRQUF0QixZQUNFLGtCQUFNLElBQUksQ0FBQyxTQWlDWjtRQS9CQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBRWhDLElBQUksbUJBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztTQUNwQzthQUFNLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMxQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7YUFDbEI7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNyQyxnREFBZ0Q7Z0JBQ2hELHdHQUF3RztnQkFDeEcsSUFBSSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsZUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsRUFBRTtvQkFDbkUsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO2lCQUMzQjtnQkFFRCxpRkFBaUY7Z0JBQ2pGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLGdCQUFrQyxDQUFDO2FBQ3ZEO1NBQ0Y7YUFBTSxJQUFJLGtCQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQyxJQUFNLGdCQUF1QyxFQUF0QyxhQUFZLEVBQVosaUNBQVksRUFBRSxzQ0FBd0IsQ0FBQztZQUM5QyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDNUI7O0lBQ0gsQ0FBQztJQUVELHNCQUFJLDRCQUFJO2FBQVI7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFFTSw0QkFBTyxHQUFkO1FBQ0UsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsc0JBQUksZ0NBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO2FBRUQsVUFBYSxJQUFZO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksOEJBQU07YUFBVixVQUFXLE1BQW9CO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNwRCxDQUFDOzs7T0FBQTtJQUVNLDJCQUFNLEdBQWI7UUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOztPQUVHO0lBQ0kseUJBQUksR0FBWDtRQUNFLElBQUksbUJBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2Ysc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0I7WUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7YUFBTSxJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sV0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRU0sNkJBQVEsR0FBZjtRQUNFLDBCQUNFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxJQUNiLElBQUksQ0FBQyxLQUFLLElBQ2IsU0FBUyxFQUFFLEVBQUUsSUFDYjtJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUEzRkQsQ0FBZ0MsdUJBQVksR0EyRjNDO0FBM0ZZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEYXRhLCBEYXRhRm9ybWF0VHlwZSwgaXNJbmxpbmVEYXRhLCBpc05hbWVkRGF0YSwgaXNVcmxEYXRhfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7Y29udGFpbnMsIGhhc2h9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZXhwb3J0IGNsYXNzIFNvdXJjZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9kYXRhOiBQYXJ0aWFsPFZnRGF0YT47XG5cbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX2hhc2g6IHN0cmluZyB8IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBEYXRhKSB7XG4gICAgc3VwZXIobnVsbCk7ICAvLyBzb3VyY2UgY2Fubm90IGhhdmUgcGFyZW50XG5cbiAgICBkYXRhID0gZGF0YSB8fCB7bmFtZTogJ3NvdXJjZSd9O1xuXG4gICAgaWYgKGlzSW5saW5lRGF0YShkYXRhKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHt2YWx1ZXM6IGRhdGEudmFsdWVzfTtcbiAgICB9IGVsc2UgaWYgKGlzVXJsRGF0YShkYXRhKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHt1cmw6IGRhdGEudXJsfTtcblxuICAgICAgaWYgKCFkYXRhLmZvcm1hdCkge1xuICAgICAgICBkYXRhLmZvcm1hdCA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGEuZm9ybWF0IHx8ICFkYXRhLmZvcm1hdC50eXBlKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgZXh0ZW5zaW9uIGZyb20gVVJMIHVzaW5nIHNuaXBwZXQgZnJvbVxuICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4MDkyOS9ob3ctdG8tZXh0cmFjdC1leHRlbnNpb24tZnJvbS1maWxlbmFtZS1zdHJpbmctaW4tamF2YXNjcmlwdFxuICAgICAgICBsZXQgZGVmYXVsdEV4dGVuc2lvbiA9IC8oPzpcXC4oW14uXSspKT8kLy5leGVjKGRhdGEudXJsKVsxXTtcbiAgICAgICAgaWYgKCFjb250YWlucyhbJ2pzb24nLCAnY3N2JywgJ3RzdicsICd0b3BvanNvbiddLCBkZWZhdWx0RXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGRlZmF1bHRFeHRlbnNpb24gPSAnanNvbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWZhdWx0RXh0ZW5zaW9uIGhhcyB0eXBlIHN0cmluZyBidXQgd2UgZW5zdXJlIHRoYXQgaXQgaXMgRGF0YUZvcm1hdFR5cGUgYWJvdmVcbiAgICAgICAgZGF0YS5mb3JtYXQudHlwZSA9IGRlZmF1bHRFeHRlbnNpb24gYXMgRGF0YUZvcm1hdFR5cGU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc05hbWVkRGF0YShkYXRhKSkge1xuICAgICAgdGhpcy5fbmFtZSA9IGRhdGEubmFtZTtcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIWlzTmFtZWREYXRhKGRhdGEpICYmIGRhdGEuZm9ybWF0KSB7XG4gICAgICBjb25zdCB7cGFyc2UgPSBudWxsLCAuLi5mb3JtYXR9ID0gZGF0YS5mb3JtYXQ7XG4gICAgICB0aGlzLl9kYXRhLmZvcm1hdCA9IGZvcm1hdDtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNOYW1lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX25hbWU7XG4gIH1cblxuICBnZXQgZGF0YU5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBzZXQgZGF0YU5hbWUobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIH1cblxuICBzZXQgcGFyZW50KHBhcmVudDogRGF0YUZsb3dOb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb3VyY2Ugbm9kZXMgaGF2ZSB0byBiZSByb290cy4nKTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb3VyY2Ugbm9kZXMgYXJlIHJvb3RzIGFuZCBjYW5ub3QgYmUgcmVtb3ZlZC4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyBkYXRhIHNvdXJjZS5cbiAgICovXG4gIHB1YmxpYyBoYXNoKCkge1xuICAgIGlmIChpc0lubGluZURhdGEodGhpcy5fZGF0YSkpIHtcbiAgICAgIGlmICghdGhpcy5faGFzaCkge1xuICAgICAgICAvLyBIYXNoaW5nIGNhbiBiZSBleHBlbnNpdmUgZm9yIGxhcmdlIGlubGluZSBkYXRhc2V0cy5cbiAgICAgICAgdGhpcy5faGFzaCA9IGhhc2godGhpcy5fZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5faGFzaDtcbiAgICB9IGVsc2UgaWYgKGlzVXJsRGF0YSh0aGlzLl9kYXRhKSkge1xuICAgICAgcmV0dXJuIGhhc2goW3RoaXMuX2RhdGEudXJsLCB0aGlzLl9kYXRhLmZvcm1hdF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdEYXRhIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdGhpcy5fbmFtZSxcbiAgICAgIC4uLnRoaXMuX2RhdGEsXG4gICAgICB0cmFuc2Zvcm06IFtdXG4gICAgfTtcbiAgfVxufVxuIl19