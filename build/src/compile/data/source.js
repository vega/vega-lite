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
            _this._name = data.name;
            _this._data = {};
        }
        if (!isNamedData(data) && data.format) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBdUIsWUFBWSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QztJQUFnQyxzQ0FBWTtJQU8xQyxvQkFBWSxJQUFVO1FBQXRCLFlBQ0Usa0JBQU0sSUFBSSxDQUFDLFNBaUNaO1FBL0JDLElBQUksR0FBRyxJQUFJLElBQUksRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFFaEMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEIsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUM7U0FDcEM7YUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMxQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7YUFDbEI7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNyQyxnREFBZ0Q7Z0JBQ2hELHdHQUF3RztnQkFDeEcsSUFBSSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLEVBQUU7b0JBQzFFLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztpQkFDM0I7Z0JBRUQsaUZBQWlGO2dCQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxnQkFBa0MsQ0FBQzthQUN2RDtTQUNGO2FBQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQU0sZ0JBQXVDLEVBQXRDLGFBQVksRUFBWixpQ0FBWSxFQUFFLHNDQUF3QixDQUFDO1lBQzlDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUM1Qjs7SUFDSCxDQUFDO0lBRUQsc0JBQUksNEJBQUk7YUFBUjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQUVNLDRCQUFPLEdBQWQ7UUFDRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxzQkFBSSxnQ0FBUTthQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFhLElBQVk7WUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDcEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSw4QkFBTTthQUFWLFVBQVcsTUFBb0I7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBRU0sMkJBQU0sR0FBYjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSx5QkFBSSxHQUFYO1FBQ0UsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNmLHNEQUFzRDtnQkFDdEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ25CO2FBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRU0sNkJBQVEsR0FBZjtRQUNFLDBCQUNFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxJQUNiLElBQUksQ0FBQyxLQUFLLElBQ2IsU0FBUyxFQUFFLEVBQUUsSUFDYjtJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUEzRkQsQ0FBZ0MsWUFBWSxHQTJGM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RhdGEsIERhdGFGb3JtYXRUeXBlLCBpc0lubGluZURhdGEsIGlzTmFtZWREYXRhLCBpc1VybERhdGF9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtjb250YWlucywgaGFzaH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRGF0YX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgU291cmNlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX2RhdGE6IFBhcnRpYWw8VmdEYXRhPjtcblxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfaGFzaDogc3RyaW5nIHwgbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IERhdGEpIHtcbiAgICBzdXBlcihudWxsKTsgIC8vIHNvdXJjZSBjYW5ub3QgaGF2ZSBwYXJlbnRcblxuICAgIGRhdGEgPSBkYXRhIHx8IHtuYW1lOiAnc291cmNlJ307XG5cbiAgICBpZiAoaXNJbmxpbmVEYXRhKGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0ge3ZhbHVlczogZGF0YS52YWx1ZXN9O1xuICAgIH0gZWxzZSBpZiAoaXNVcmxEYXRhKGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0ge3VybDogZGF0YS51cmx9O1xuXG4gICAgICBpZiAoIWRhdGEuZm9ybWF0KSB7XG4gICAgICAgIGRhdGEuZm9ybWF0ID0ge307XG4gICAgICB9XG5cbiAgICAgIGlmICghZGF0YS5mb3JtYXQgfHwgIWRhdGEuZm9ybWF0LnR5cGUpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBleHRlbnNpb24gZnJvbSBVUkwgdXNpbmcgc25pcHBldCBmcm9tXG4gICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjgwOTI5L2hvdy10by1leHRyYWN0LWV4dGVuc2lvbi1mcm9tLWZpbGVuYW1lLXN0cmluZy1pbi1qYXZhc2NyaXB0XG4gICAgICAgIGxldCBkZWZhdWx0RXh0ZW5zaW9uID0gLyg/OlxcLihbXi5dKykpPyQvLmV4ZWMoZGF0YS51cmwpWzFdO1xuICAgICAgICBpZiAoIWNvbnRhaW5zKFsnanNvbicsICdjc3YnLCAndHN2JywgJ2RzdicsICd0b3BvanNvbiddLCBkZWZhdWx0RXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGRlZmF1bHRFeHRlbnNpb24gPSAnanNvbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWZhdWx0RXh0ZW5zaW9uIGhhcyB0eXBlIHN0cmluZyBidXQgd2UgZW5zdXJlIHRoYXQgaXQgaXMgRGF0YUZvcm1hdFR5cGUgYWJvdmVcbiAgICAgICAgZGF0YS5mb3JtYXQudHlwZSA9IGRlZmF1bHRFeHRlbnNpb24gYXMgRGF0YUZvcm1hdFR5cGU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc05hbWVkRGF0YShkYXRhKSkge1xuICAgICAgdGhpcy5fbmFtZSA9IGRhdGEubmFtZTtcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIWlzTmFtZWREYXRhKGRhdGEpICYmIGRhdGEuZm9ybWF0KSB7XG4gICAgICBjb25zdCB7cGFyc2UgPSBudWxsLCAuLi5mb3JtYXR9ID0gZGF0YS5mb3JtYXQ7XG4gICAgICB0aGlzLl9kYXRhLmZvcm1hdCA9IGZvcm1hdDtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNOYW1lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX25hbWU7XG4gIH1cblxuICBnZXQgZGF0YU5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBzZXQgZGF0YU5hbWUobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIH1cblxuICBzZXQgcGFyZW50KHBhcmVudDogRGF0YUZsb3dOb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb3VyY2Ugbm9kZXMgaGF2ZSB0byBiZSByb290cy4nKTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmUoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb3VyY2Ugbm9kZXMgYXJlIHJvb3RzIGFuZCBjYW5ub3QgYmUgcmVtb3ZlZC4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyBkYXRhIHNvdXJjZS5cbiAgICovXG4gIHB1YmxpYyBoYXNoKCkge1xuICAgIGlmIChpc0lubGluZURhdGEodGhpcy5fZGF0YSkpIHtcbiAgICAgIGlmICghdGhpcy5faGFzaCkge1xuICAgICAgICAvLyBIYXNoaW5nIGNhbiBiZSBleHBlbnNpdmUgZm9yIGxhcmdlIGlubGluZSBkYXRhc2V0cy5cbiAgICAgICAgdGhpcy5faGFzaCA9IGhhc2godGhpcy5fZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5faGFzaDtcbiAgICB9IGVsc2UgaWYgKGlzVXJsRGF0YSh0aGlzLl9kYXRhKSkge1xuICAgICAgcmV0dXJuIGhhc2goW3RoaXMuX2RhdGEudXJsLCB0aGlzLl9kYXRhLmZvcm1hdF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdEYXRhIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdGhpcy5fbmFtZSxcbiAgICAgIC4uLnRoaXMuX2RhdGEsXG4gICAgICB0cmFuc2Zvcm06IFtdXG4gICAgfTtcbiAgfVxufVxuIl19