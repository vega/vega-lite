import * as tslib_1 from "tslib";
import { vgField } from '../../fielddef';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the window transform nodes
 */
var WindowTransformNode = /** @class */ (function (_super) {
    tslib_1.__extends(WindowTransformNode, _super);
    function WindowTransformNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        return _this;
    }
    WindowTransformNode.prototype.clone = function () {
        return new WindowTransformNode(this.parent, duplicate(this.transform));
    };
    WindowTransformNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        this.transform.window.forEach(function (windowFieldDef) {
            out[_this.getDefaultName(windowFieldDef)] = true;
        });
        return out;
    };
    WindowTransformNode.prototype.getDefaultName = function (windowFieldDef) {
        return windowFieldDef.as || vgField(windowFieldDef);
    };
    WindowTransformNode.prototype.assemble = function () {
        var fields = [];
        var ops = [];
        var as = [];
        var params = [];
        for (var _i = 0, _a = this.transform.window; _i < _a.length; _i++) {
            var window_1 = _a[_i];
            ops.push(window_1.op);
            as.push(this.getDefaultName(window_1));
            params.push(window_1.param === undefined ? null : window_1.param);
            fields.push(window_1.field === undefined ? null : window_1.field);
        }
        var frame = this.transform.frame;
        var groupby = this.transform.groupby;
        var sortFields = [];
        var sortOrder = [];
        if (this.transform.sort !== undefined) {
            for (var _b = 0, _c = this.transform.sort; _b < _c.length; _b++) {
                var sortField = _c[_b];
                sortFields.push(sortField.field);
                sortOrder.push(sortField.order === undefined ? null : sortField.order);
            }
        }
        var sort = {
            field: sortFields,
            order: sortOrder,
        };
        var ignorePeers = this.transform.ignorePeers;
        var result = {
            type: 'window',
            params: params,
            as: as,
            ops: ops,
            fields: fields,
            sort: sort,
        };
        if (ignorePeers !== undefined) {
            result.ignorePeers = ignorePeers;
        }
        if (groupby !== undefined) {
            result.groupby = groupby;
        }
        if (frame !== undefined) {
            result.frame = frame;
        }
        return result;
    };
    return WindowTransformNode;
}(DataFlowNode));
export { WindowTransformNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFeEM7O0dBRUc7QUFDSDtJQUF5QywrQ0FBWTtJQUtuRCw2QkFBWSxNQUFvQixFQUFVLFNBQTBCO1FBQXBFLFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBQ2Q7UUFGeUMsZUFBUyxHQUFULFNBQVMsQ0FBaUI7O0lBRXBFLENBQUM7SUFOTSxtQ0FBSyxHQUFaO1FBQ0ksT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFNTSw0Q0FBYyxHQUFyQjtRQUFBLGlCQU9DO1FBTkMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsY0FBYztZQUMxQyxHQUFHLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVPLDRDQUFjLEdBQXRCLFVBQXVCLGNBQThCO1FBQ25ELE9BQU8sY0FBYyxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLHNDQUFRLEdBQWY7UUFDRSxJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsSUFBTSxHQUFHLEdBQW1DLEVBQUUsQ0FBQztRQUMvQyxJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsS0FBcUIsVUFBcUIsRUFBckIsS0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBckIsY0FBcUIsRUFBckIsSUFBcUI7WUFBckMsSUFBTSxRQUFNLFNBQUE7WUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvRDtRQUVELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLElBQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztRQUNoQyxJQUFNLFNBQVMsR0FBd0IsRUFBRSxDQUFDO1FBQzFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3JDLEtBQXdCLFVBQW1CLEVBQW5CLEtBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQW5CLGNBQW1CLEVBQW5CLElBQW1CO2dCQUF0QyxJQUFNLFNBQVMsU0FBQTtnQkFDbEIsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQTBCLENBQUMsQ0FBQzthQUM3RjtTQUNGO1FBQ0QsSUFBTSxJQUFJLEdBQWlCO1lBQ3pCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUM7UUFDRixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUUvQyxJQUFNLE1BQU0sR0FBc0I7WUFDaEMsSUFBSSxFQUFFLFFBQVE7WUFDZCxNQUFNLFFBQUE7WUFDTixFQUFFLElBQUE7WUFDRixHQUFHLEtBQUE7WUFDSCxNQUFNLFFBQUE7WUFDTixJQUFJLE1BQUE7U0FDTCxDQUFDO1FBRUYsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQzFCO1FBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQXpFRCxDQUF5QyxZQUFZLEdBeUVwRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuaW1wb3J0IHt2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge1dpbmRvd0ZpZWxkRGVmLCBXaW5kb3dPbmx5T3AsIFdpbmRvd1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdDb21wYXJhdG9yLCBWZ0NvbXBhcmF0b3JPcmRlciwgVmdXaW5kb3dUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuLyoqXG4gKiBBIGNsYXNzIGZvciB0aGUgd2luZG93IHRyYW5zZm9ybSBub2Rlc1xuICovXG5leHBvcnQgY2xhc3MgV2luZG93VHJhbnNmb3JtTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICAgIHJldHVybiBuZXcgV2luZG93VHJhbnNmb3JtTm9kZSh0aGlzLnBhcmVudCwgZHVwbGljYXRlKHRoaXMudHJhbnNmb3JtKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSB0cmFuc2Zvcm06IFdpbmRvd1RyYW5zZm9ybSkge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgdGhpcy50cmFuc2Zvcm0ud2luZG93LmZvckVhY2god2luZG93RmllbGREZWYgPT4ge1xuICAgICAgb3V0W3RoaXMuZ2V0RGVmYXVsdE5hbWUod2luZG93RmllbGREZWYpXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZWZhdWx0TmFtZSh3aW5kb3dGaWVsZERlZjogV2luZG93RmllbGREZWYpOiBzdHJpbmcge1xuICAgIHJldHVybiB3aW5kb3dGaWVsZERlZi5hcyB8fCB2Z0ZpZWxkKHdpbmRvd0ZpZWxkRGVmKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ1dpbmRvd1RyYW5zZm9ybSB7XG4gICAgY29uc3QgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IG9wczogKEFnZ3JlZ2F0ZU9wIHwgV2luZG93T25seU9wKVtdID0gW107XG4gICAgY29uc3QgYXMgPSBbXTtcbiAgICBjb25zdCBwYXJhbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHdpbmRvdyBvZiB0aGlzLnRyYW5zZm9ybS53aW5kb3cpIHtcbiAgICAgIG9wcy5wdXNoKHdpbmRvdy5vcCk7XG4gICAgICBhcy5wdXNoKHRoaXMuZ2V0RGVmYXVsdE5hbWUod2luZG93KSk7XG4gICAgICBwYXJhbXMucHVzaCh3aW5kb3cucGFyYW0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiB3aW5kb3cucGFyYW0pO1xuICAgICAgZmllbGRzLnB1c2god2luZG93LmZpZWxkID09PSB1bmRlZmluZWQgPyBudWxsIDogd2luZG93LmZpZWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFtZSA9IHRoaXMudHJhbnNmb3JtLmZyYW1lO1xuICAgIGNvbnN0IGdyb3VwYnkgPSB0aGlzLnRyYW5zZm9ybS5ncm91cGJ5O1xuICAgIGNvbnN0IHNvcnRGaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3Qgc29ydE9yZGVyOiBWZ0NvbXBhcmF0b3JPcmRlcltdID0gW107XG4gICAgaWYgKHRoaXMudHJhbnNmb3JtLnNvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChjb25zdCBzb3J0RmllbGQgb2YgdGhpcy50cmFuc2Zvcm0uc29ydCkge1xuICAgICAgICBzb3J0RmllbGRzLnB1c2goc29ydEZpZWxkLmZpZWxkKTtcbiAgICAgICAgc29ydE9yZGVyLnB1c2goc29ydEZpZWxkLm9yZGVyID09PSB1bmRlZmluZWQgPyBudWxsIDogc29ydEZpZWxkLm9yZGVyIGFzIFZnQ29tcGFyYXRvck9yZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc29ydDogVmdDb21wYXJhdG9yID0ge1xuICAgICAgZmllbGQ6IHNvcnRGaWVsZHMsXG4gICAgICBvcmRlcjogc29ydE9yZGVyLFxuICAgIH07XG4gICAgY29uc3QgaWdub3JlUGVlcnMgPSB0aGlzLnRyYW5zZm9ybS5pZ25vcmVQZWVycztcblxuICAgIGNvbnN0IHJlc3VsdDogVmdXaW5kb3dUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnd2luZG93JyxcbiAgICAgIHBhcmFtcyxcbiAgICAgIGFzLFxuICAgICAgb3BzLFxuICAgICAgZmllbGRzLFxuICAgICAgc29ydCxcbiAgICB9O1xuXG4gICAgaWYgKGlnbm9yZVBlZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5pZ25vcmVQZWVycyA9IGlnbm9yZVBlZXJzO1xuICAgIH1cblxuICAgIGlmIChncm91cGJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5ncm91cGJ5ID0gZ3JvdXBieTtcbiAgICB9XG5cbiAgICBpZiAoZnJhbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0LmZyYW1lID0gZnJhbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19