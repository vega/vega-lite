import * as tslib_1 from "tslib";
import * as log from '../log';
import { isLayerSpec, isUnitSpec } from '../spec';
import { flatten, keys } from '../util';
import { parseLayerAxis } from './axis/parse';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { parseLayerLayoutSize } from './layoutsize/parse';
import { assembleLegends } from './legend/assemble';
import { Model } from './model';
import { assembleLayerSelectionMarks } from './selection/selection';
import { UnitModel } from './unit';
var LayerModel = /** @class */ (function (_super) {
    tslib_1.__extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName, parentGivenSize, repeater, config, fit) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, spec.resolve) || this;
        _this.type = 'layer';
        var layoutSize = tslib_1.__assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {}));
        _this.initSize(layoutSize);
        _this.children = spec.layer.map(function (layer, i) {
            if (isLayerSpec(layer)) {
                return new LayerModel(layer, _this, _this.getName('layer_' + i), layoutSize, repeater, config, fit);
            }
            if (isUnitSpec(layer)) {
                return new UnitModel(layer, _this, _this.getName('layer_' + i), layoutSize, repeater, config, fit);
            }
            throw new Error(log.message.INVALID_SPEC);
        });
        return _this;
    }
    LayerModel.prototype.parseData = function () {
        this.component.data = parseData(this);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseData();
        }
    };
    LayerModel.prototype.parseLayoutSize = function () {
        parseLayerLayoutSize(this);
    };
    LayerModel.prototype.parseSelection = function () {
        var _this = this;
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        var _loop_1 = function (child) {
            child.parseSelection();
            keys(child.component.selection).forEach(function (key) {
                _this.component.selection[key] = child.component.selection[key];
            });
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_1(child);
        }
    };
    LayerModel.prototype.parseMarkGroup = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMarkGroup();
        }
    };
    LayerModel.prototype.parseAxisAndHeader = function () {
        parseLayerAxis(this);
    };
    LayerModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return this.children.reduce(function (sg, child) { return child.assembleSelectionTopLevelSignals(sg); }, signals);
    };
    // TODO: Support same named selections across children.
    LayerModel.prototype.assembleSelectionSignals = function () {
        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleSelectionSignals());
        }, []);
    };
    LayerModel.prototype.assembleLayoutSignals = function () {
        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, assembleLayoutSignals(this));
    };
    LayerModel.prototype.assembleSelectionData = function (data) {
        return this.children.reduce(function (db, child) { return child.assembleSelectionData(db); }, data);
    };
    LayerModel.prototype.assembleTitle = function () {
        var title = _super.prototype.assembleTitle.call(this);
        if (title) {
            return title;
        }
        // If title does not provide layer, look into children
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            title = child.assembleTitle();
            if (title) {
                return title;
            }
        }
        return undefined;
    };
    LayerModel.prototype.assembleLayout = function () {
        return null;
    };
    LayerModel.prototype.assembleMarks = function () {
        return assembleLayerSelectionMarks(this, flatten(this.children.map(function (child) {
            return child.assembleMarks();
        })));
    };
    LayerModel.prototype.assembleLegends = function () {
        return this.children.reduce(function (legends, child) {
            return legends.concat(child.assembleLegends());
        }, assembleLegends(this));
    };
    return LayerModel;
}(Model));
export { LayerModel };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxLQUFLLEdBQUcsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQXdDLE1BQU0sU0FBUyxDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRXRDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUU5QixPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR2pDO0lBQWdDLHNDQUFLO0lBU25DLG9CQUFZLElBQXlCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQzNFLGVBQWlDLEVBQUUsUUFBdUIsRUFBRSxNQUFjLEVBQUUsR0FBWTtRQUQxRixZQUdFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQXFCckU7UUFoQ2UsVUFBSSxHQUFZLE9BQU8sQ0FBQztRQWF0QyxJQUFNLFVBQVUsd0JBQ1gsZUFBZSxFQUNmLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFB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LENBQUM7SUFDbkIsQ0FBQztJQUVNLG1DQUFjLEdBQXJCO1FBQ0UsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sa0NBQWEsR0FBcEI7UUFDRSxPQUFPLDJCQUEyQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLO1lBQ3ZFLE9BQU8sS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxvQ0FBZSxHQUF0QjtRQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSztZQUN6QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDakQsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUF6SEQsQ0FBZ0MsS0FBSyxHQXlIcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtpc0xheWVyU3BlYywgaXNVbml0U3BlYywgTGF5b3V0U2l6ZU1peGlucywgTm9ybWFsaXplZExheWVyU3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2ZsYXR0ZW4sIGtleXN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGEsIFZnTGF5b3V0LCBWZ0xlZ2VuZCwgVmdTaWduYWwsIFZnVGl0bGV9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VMYXllckF4aXN9IGZyb20gJy4vYXhpcy9wYXJzZSc7XG5pbXBvcnQge3BhcnNlRGF0YX0gZnJvbSAnLi9kYXRhL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVMYXlvdXRTaWduYWxzfSBmcm9tICcuL2xheW91dHNpemUvYXNzZW1ibGUnO1xuaW1wb3J0IHtwYXJzZUxheWVyTGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVMZWdlbmRzfSBmcm9tICcuL2xlZ2VuZC9hc3NlbWJsZSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZX0gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge2Fzc2VtYmxlTGF5ZXJTZWxlY3Rpb25NYXJrc30gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuL3VuaXQnO1xuXG5cbmV4cG9ydCBjbGFzcyBMYXllck1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ2xheWVyJyA9ICdsYXllcic7XG5cbiAgLy8gSEFDSzogVGhpcyBzaG91bGQgYmUgKExheWVyTW9kZWwgfCBVbml0TW9kZWwpW10sIGJ1dCBzZXR0aW5nIHRoZSBjb3JyZWN0IHR5cGUgbGVhZHMgdG8gd2VpcmQgZXJyb3IuXG4gIC8vIFNvIEknbSBqdXN0IHB1dHRpbmcgZ2VuZXJpYyBNb2RlbCBmb3Igbm93LlxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cblxuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IE5vcm1hbGl6ZWRMYXllclNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLFxuICAgIHBhcmVudEdpdmVuU2l6ZTogTGF5b3V0U2l6ZU1peGlucywgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnLCBmaXQ6IGJvb2xlYW4pIHtcblxuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHJlcGVhdGVyLCBzcGVjLnJlc29sdmUpO1xuXG4gICAgY29uc3QgbGF5b3V0U2l6ZSA9IHtcbiAgICAgIC4uLnBhcmVudEdpdmVuU2l6ZSxcbiAgICAgIC4uLihzcGVjLndpZHRoID8ge3dpZHRoOiBzcGVjLndpZHRofSA6IHt9KSxcbiAgICAgIC4uLihzcGVjLmhlaWdodCA/IHtoZWlnaHQ6IHNwZWMuaGVpZ2h0fSA6IHt9KVxuICAgIH07XG5cbiAgICB0aGlzLmluaXRTaXplKGxheW91dFNpemUpO1xuXG4gICAgdGhpcy5jaGlsZHJlbiA9IHNwZWMubGF5ZXIubWFwKChsYXllciwgaSkgPT4ge1xuICAgICAgaWYgKGlzTGF5ZXJTcGVjKGxheWVyKSkge1xuICAgICAgICByZXR1cm4gbmV3IExheWVyTW9kZWwobGF5ZXIsIHRoaXMsIHRoaXMuZ2V0TmFtZSgnbGF5ZXJfJytpKSwgbGF5b3V0U2l6ZSwgcmVwZWF0ZXIsIGNvbmZpZywgZml0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVW5pdFNwZWMobGF5ZXIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVW5pdE1vZGVsKGxheWVyLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2xheWVyXycraSksIGxheW91dFNpemUsIHJlcGVhdGVyLCBjb25maWcsIGZpdCk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5JTlZBTElEX1NQRUMpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZUxheWVyTGF5b3V0U2l6ZSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVNlbGVjdGlvbigpIHtcbiAgICAvLyBNZXJnZSBzZWxlY3Rpb25zIHVwIHRoZSBoaWVyYXJjaHkgc28gdGhhdCB0aGV5IG1heSBiZSByZWZlcmVuY2VkXG4gICAgLy8gYWNyb3NzIHVuaXQgc3BlY3MuIFBlcnNpc3QgdGhlaXIgZGVmaW5pdGlvbnMgd2l0aGluIGVhY2ggY2hpbGRcbiAgICAvLyB0byBhc3NlbWJsZSBzaWduYWxzIHdoaWNoIHJlbWFpbiB3aXRoaW4gb3V0cHV0IFZlZ2EgdW5pdCBncm91cHMuXG4gICAgdGhpcy5jb21wb25lbnQuc2VsZWN0aW9uID0ge307XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5wYXJzZVNlbGVjdGlvbigpO1xuICAgICAga2V5cyhjaGlsZC5jb21wb25lbnQuc2VsZWN0aW9uKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgdGhpcy5jb21wb25lbnQuc2VsZWN0aW9uW2tleV0gPSBjaGlsZC5jb21wb25lbnQuc2VsZWN0aW9uW2tleV07XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5wYXJzZU1hcmtHcm91cCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUF4aXNBbmRIZWFkZXIoKSB7XG4gICAgcGFyc2VMYXllckF4aXModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKHNnLCBjaGlsZCkgPT4gY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2cpLCBzaWduYWxzKTtcbiAgfVxuXG4gIC8vIFRPRE86IFN1cHBvcnQgc2FtZSBuYW1lZCBzZWxlY3Rpb25zIGFjcm9zcyBjaGlsZHJlbi5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKHNpZ25hbHMsIGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gc2lnbmFscy5jb25jYXQoY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCkpO1xuICAgIH0sIFtdKTtcbiAgfVxuXG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKHNpZ25hbHMsIGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gc2lnbmFscy5jb25jYXQoY2hpbGQuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCkpO1xuICAgIH0sIGFzc2VtYmxlTGF5b3V0U2lnbmFscyh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgoZGIsIGNoaWxkKSA9PiBjaGlsZC5hc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGIpLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVRpdGxlKCk6IFZnVGl0bGUge1xuICAgIGxldCB0aXRsZSA9IHN1cGVyLmFzc2VtYmxlVGl0bGUoKTtcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIHJldHVybiB0aXRsZTtcbiAgICB9XG4gICAgLy8gSWYgdGl0bGUgZG9lcyBub3QgcHJvdmlkZSBsYXllciwgbG9vayBpbnRvIGNoaWxkcmVuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICB0aXRsZSA9IGNoaWxkLmFzc2VtYmxlVGl0bGUoKTtcbiAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICByZXR1cm4gdGl0bGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTWFya3MoKTogYW55W10ge1xuICAgIHJldHVybiBhc3NlbWJsZUxheWVyU2VsZWN0aW9uTWFya3ModGhpcywgZmxhdHRlbih0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5hc3NlbWJsZU1hcmtzKCk7XG4gICAgfSkpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxlZ2VuZHMoKTogVmdMZWdlbmRbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChsZWdlbmRzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIGxlZ2VuZHMuY29uY2F0KGNoaWxkLmFzc2VtYmxlTGVnZW5kcygpKTtcbiAgICB9LCBhc3NlbWJsZUxlZ2VuZHModGhpcykpO1xuICB9XG59XG4iXX0=