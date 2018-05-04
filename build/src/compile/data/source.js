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
                if (!contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBdUIsWUFBWSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QztJQUFnQyxzQ0FBWTtJQU8xQyxvQkFBWSxJQUFVO1FBQXRCLFlBQ0Usa0JBQU0sSUFBSSxDQUFDLFNBaUNaO1FBL0JDLElBQUksR0FBRyxJQUFJLElBQUksRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFFaEMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEIsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUM7U0FDcEM7YUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMxQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7YUFDbEI7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNyQyxnREFBZ0Q7Z0JBQ2hELHdHQUF3RztnQkFDeEcsSUFBSSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsRUFBRTtvQkFDbkUsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO2lCQUMzQjtnQkFFRCxpRkFBaUY7Z0JBQ2pGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLGdCQUFrQyxDQUFDO2FBQ3ZEO1NBQ0Y7YUFBTSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdkIsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDakI7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDckMsSUFBTSxnQkFBdUMsRUFBdEMsYUFBWSxFQUFaLGlDQUFZLEVBQUUsc0NBQXdCLENBQUM7WUFDOUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQzVCOztJQUNILENBQUM7SUFFRCxzQkFBSSw0QkFBSTthQUFSO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBRU0sNEJBQU8sR0FBZDtRQUNFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELHNCQUFJLGdDQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQUVELFVBQWEsSUFBWTtZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNwQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDhCQUFNO2FBQVYsVUFBVyxNQUFvQjtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDcEQsQ0FBQzs7O09BQUE7SUFFTSwyQkFBTSxHQUFiO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7T0FFRztJQUNJLHlCQUFJLEdBQVg7UUFDRSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2Ysc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0I7WUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7YUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFTSw2QkFBUSxHQUFmO1FBQ0UsMEJBQ0UsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLElBQ2IsSUFBSSxDQUFDLEtBQUssSUFDYixTQUFTLEVBQUUsRUFBRSxJQUNiO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQTNGRCxDQUFnQyxZQUFZLEdBMkYzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGF0YSwgRGF0YUZvcm1hdFR5cGUsIGlzSW5saW5lRGF0YSwgaXNOYW1lZERhdGEsIGlzVXJsRGF0YX0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge2NvbnRhaW5zLCBoYXNofSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2VOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfZGF0YTogUGFydGlhbDxWZ0RhdGE+O1xuXG4gIHByaXZhdGUgX25hbWU6IHN0cmluZztcblxuICBwcml2YXRlIF9oYXNoOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogRGF0YSkge1xuICAgIHN1cGVyKG51bGwpOyAgLy8gc291cmNlIGNhbm5vdCBoYXZlIHBhcmVudFxuXG4gICAgZGF0YSA9IGRhdGEgfHwge25hbWU6ICdzb3VyY2UnfTtcblxuICAgIGlmIChpc0lubGluZURhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7dmFsdWVzOiBkYXRhLnZhbHVlc307XG4gICAgfSBlbHNlIGlmIChpc1VybERhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7dXJsOiBkYXRhLnVybH07XG5cbiAgICAgIGlmICghZGF0YS5mb3JtYXQpIHtcbiAgICAgICAgZGF0YS5mb3JtYXQgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhLmZvcm1hdCB8fCAhZGF0YS5mb3JtYXQudHlwZSkge1xuICAgICAgICAvLyBFeHRyYWN0IGV4dGVuc2lvbiBmcm9tIFVSTCB1c2luZyBzbmlwcGV0IGZyb21cbiAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODA5MjkvaG93LXRvLWV4dHJhY3QtZXh0ZW5zaW9uLWZyb20tZmlsZW5hbWUtc3RyaW5nLWluLWphdmFzY3JpcHRcbiAgICAgICAgbGV0IGRlZmF1bHRFeHRlbnNpb24gPSAvKD86XFwuKFteLl0rKSk/JC8uZXhlYyhkYXRhLnVybClbMV07XG4gICAgICAgIGlmICghY29udGFpbnMoWydqc29uJywgJ2NzdicsICd0c3YnLCAndG9wb2pzb24nXSwgZGVmYXVsdEV4dGVuc2lvbikpIHtcbiAgICAgICAgICBkZWZhdWx0RXh0ZW5zaW9uID0gJ2pzb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdEV4dGVuc2lvbiBoYXMgdHlwZSBzdHJpbmcgYnV0IHdlIGVuc3VyZSB0aGF0IGl0IGlzIERhdGFGb3JtYXRUeXBlIGFib3ZlXG4gICAgICAgIGRhdGEuZm9ybWF0LnR5cGUgPSBkZWZhdWx0RXh0ZW5zaW9uIGFzIERhdGFGb3JtYXRUeXBlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNOYW1lZERhdGEoZGF0YSkpIHtcbiAgICAgIHRoaXMuX25hbWUgPSBkYXRhLm5hbWU7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFpc05hbWVkRGF0YShkYXRhKSAmJiBkYXRhLmZvcm1hdCkge1xuICAgICAgY29uc3Qge3BhcnNlID0gbnVsbCwgLi4uZm9ybWF0fSA9IGRhdGEuZm9ybWF0O1xuICAgICAgdGhpcy5fZGF0YS5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICBwdWJsaWMgaGFzTmFtZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9uYW1lO1xuICB9XG5cbiAgZ2V0IGRhdGFOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IGRhdGFOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQ6IERhdGFGbG93Tm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIG5vZGVzIGhhdmUgdG8gYmUgcm9vdHMuJyk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIG5vZGVzIGFyZSByb290cyBhbmQgY2Fubm90IGJlIHJlbW92ZWQuJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoaXMgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgaGFzaCgpIHtcbiAgICBpZiAoaXNJbmxpbmVEYXRhKHRoaXMuX2RhdGEpKSB7XG4gICAgICBpZiAoIXRoaXMuX2hhc2gpIHtcbiAgICAgICAgLy8gSGFzaGluZyBjYW4gYmUgZXhwZW5zaXZlIGZvciBsYXJnZSBpbmxpbmUgZGF0YXNldHMuXG4gICAgICAgIHRoaXMuX2hhc2ggPSBoYXNoKHRoaXMuX2RhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgfSBlbHNlIGlmIChpc1VybERhdGEodGhpcy5fZGF0YSkpIHtcbiAgICAgIHJldHVybiBoYXNoKFt0aGlzLl9kYXRhLnVybCwgdGhpcy5fZGF0YS5mb3JtYXRdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnRGF0YSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMuX25hbWUsXG4gICAgICAuLi50aGlzLl9kYXRhLFxuICAgICAgdHJhbnNmb3JtOiBbXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==