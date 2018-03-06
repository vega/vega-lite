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
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var spec_1 = require("../spec");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var parse_2 = require("./data/parse");
var assemble_1 = require("./layoutsize/assemble");
var parse_3 = require("./layoutsize/parse");
var assemble_2 = require("./legend/assemble");
var model_1 = require("./model");
var selection_1 = require("./selection/selection");
var unit_1 = require("./unit");
var LayerModel = /** @class */ (function (_super) {
    __extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName, parentGivenSize, repeater, config, fit) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.type = 'layer';
        var layoutSize = __assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {}));
        _this.initSize(layoutSize);
        _this.children = spec.layer.map(function (layer, i) {
            if (spec_1.isLayerSpec(layer)) {
                return new LayerModel(layer, _this, _this.getName('layer_' + i), layoutSize, repeater, config, fit);
            }
            if (spec_1.isUnitSpec(layer)) {
                return new unit_1.UnitModel(layer, _this, _this.getName('layer_' + i), layoutSize, repeater, config, fit);
            }
            throw new Error(log.message.INVALID_SPEC);
        });
        return _this;
    }
    LayerModel.prototype.parseData = function () {
        this.component.data = parse_2.parseData(this);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseData();
        }
    };
    LayerModel.prototype.parseLayoutSize = function () {
        parse_3.parseLayerLayoutSize(this);
    };
    LayerModel.prototype.parseSelection = function () {
        var _this = this;
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        var _loop_1 = function (child) {
            child.parseSelection();
            util_1.keys(child.component.selection).forEach(function (key) {
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
        parse_1.parseLayerAxis(this);
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
        }, assemble_1.assembleLayoutSignals(this));
    };
    LayerModel.prototype.assembleSelectionData = function (data) {
        return this.children.reduce(function (db, child) { return child.assembleSelectionData(db); }, []);
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
        return selection_1.assembleLayerSelectionMarks(this, util_1.flatten(this.children.map(function (child) {
            return child.assembleMarks();
        })));
    };
    LayerModel.prototype.assembleLegends = function () {
        return this.children.reduce(function (legends, child) {
            return legends.concat(child.assembleLegends());
        }, assemble_2.assembleLegends(this));
    };
    return LayerModel;
}(model_1.Model));
exports.LayerModel = LayerModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRCQUE4QjtBQUM5QixnQ0FBNkU7QUFDN0UsZ0NBQXNDO0FBRXRDLHNDQUE0QztBQUM1QyxzQ0FBdUM7QUFDdkMsa0RBQTREO0FBQzVELDRDQUF3RDtBQUN4RCw4Q0FBa0Q7QUFDbEQsaUNBQThCO0FBRTlCLG1EQUFrRTtBQUNsRSwrQkFBaUM7QUFHakM7SUFBZ0MsOEJBQUs7SUFTbkMsb0JBQVksSUFBZSxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUNqRSxlQUFpQyxFQUFFLFFBQXVCLEVBQUUsTUFBYyxFQUFFLEdBQVk7UUFEMUYsWUFHRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQXFCM0Q7UUFoQ2UsVUFBSSxHQUFZLE9BQU8sQ0FBQztRQWF0QyxJQUFNLFVBQVUsZ0JBQ1gsZUFBZSxFQUNmLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDdkMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUM5QyxDQUFDO1FBRUYsS0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxQixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JB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QUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLO1lBQ3ZFLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLG9DQUFlLEdBQXRCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7WUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDakQsQ0FBQyxFQUFFLDBCQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBekhELENBQWdDLGFBQUssR0F5SHBDO0FBekhZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNMYXllclNwZWMsIGlzVW5pdFNwZWMsIExheWVyU3BlYywgTGF5b3V0U2l6ZU1peGluc30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2ZsYXR0ZW4sIGtleXN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGEsIFZnTGF5b3V0LCBWZ0xlZ2VuZCwgVmdTaWduYWwsIFZnVGl0bGV9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VMYXllckF4aXN9IGZyb20gJy4vYXhpcy9wYXJzZSc7XG5pbXBvcnQge3BhcnNlRGF0YX0gZnJvbSAnLi9kYXRhL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVMYXlvdXRTaWduYWxzfSBmcm9tICcuL2xheW91dHNpemUvYXNzZW1ibGUnO1xuaW1wb3J0IHtwYXJzZUxheWVyTGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVMZWdlbmRzfSBmcm9tICcuL2xlZ2VuZC9hc3NlbWJsZSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZX0gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge2Fzc2VtYmxlTGF5ZXJTZWxlY3Rpb25NYXJrc30gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuL3VuaXQnO1xuXG5cbmV4cG9ydCBjbGFzcyBMYXllck1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ2xheWVyJyA9ICdsYXllcic7XG5cbiAgLy8gSEFDSzogVGhpcyBzaG91bGQgYmUgKExheWVyTW9kZWwgfCBVbml0TW9kZWwpW10sIGJ1dCBzZXR0aW5nIHRoZSBjb3JyZWN0IHR5cGUgbGVhZHMgdG8gd2VpcmQgZXJyb3IuXG4gIC8vIFNvIEknbSBqdXN0IHB1dHRpbmcgZ2VuZXJpYyBNb2RlbCBmb3Igbm93LlxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cblxuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IExheWVyU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsXG4gICAgcGFyZW50R2l2ZW5TaXplOiBMYXlvdXRTaXplTWl4aW5zLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgY29uZmlnOiBDb25maWcsIGZpdDogYm9vbGVhbikge1xuXG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgc3BlYy5yZXNvbHZlKTtcblxuICAgIGNvbnN0IGxheW91dFNpemUgPSB7XG4gICAgICAuLi5wYXJlbnRHaXZlblNpemUsXG4gICAgICAuLi4oc3BlYy53aWR0aCA/IHt3aWR0aDogc3BlYy53aWR0aH0gOiB7fSksXG4gICAgICAuLi4oc3BlYy5oZWlnaHQgPyB7aGVpZ2h0OiBzcGVjLmhlaWdodH0gOiB7fSlcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0U2l6ZShsYXlvdXRTaXplKTtcblxuICAgIHRoaXMuY2hpbGRyZW4gPSBzcGVjLmxheWVyLm1hcCgobGF5ZXIsIGkpID0+IHtcbiAgICAgIGlmIChpc0xheWVyU3BlYyhsYXllcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBMYXllck1vZGVsKGxheWVyLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2xheWVyXycraSksIGxheW91dFNpemUsIHJlcGVhdGVyLCBjb25maWcsIGZpdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1VuaXRTcGVjKGxheWVyKSkge1xuICAgICAgICByZXR1cm4gbmV3IFVuaXRNb2RlbChsYXllciwgdGhpcywgdGhpcy5nZXROYW1lKCdsYXllcl8nK2kpLCBsYXlvdXRTaXplLCByZXBlYXRlciwgY29uZmlnLCBmaXQpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuSU5WQUxJRF9TUEVDKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZURhdGEoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuZGF0YSA9IHBhcnNlRGF0YSh0aGlzKTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcnNlRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUxheW91dFNpemUoKSB7XG4gICAgcGFyc2VMYXllckxheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgLy8gTWVyZ2Ugc2VsZWN0aW9ucyB1cCB0aGUgaGllcmFyY2h5IHNvIHRoYXQgdGhleSBtYXkgYmUgcmVmZXJlbmNlZFxuICAgIC8vIGFjcm9zcyB1bml0IHNwZWNzLiBQZXJzaXN0IHRoZWlyIGRlZmluaXRpb25zIHdpdGhpbiBlYWNoIGNoaWxkXG4gICAgLy8gdG8gYXNzZW1ibGUgc2lnbmFscyB3aGljaCByZW1haW4gd2l0aGluIG91dHB1dCBWZWdhIHVuaXQgZ3JvdXBzLlxuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHt9O1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VTZWxlY3Rpb24oKTtcbiAgICAgIGtleXMoY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbltrZXldID0gY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbltrZXldO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlTWFya0dyb3VwKCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VNYXJrR3JvdXAoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIHBhcnNlTGF5ZXJBeGlzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzZywgY2hpbGQpID0+IGNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNnKSwgc2lnbmFscyk7XG4gIH1cblxuICAvLyBUT0RPOiBTdXBwb3J0IHNhbWUgbmFtZWQgc2VsZWN0aW9ucyBhY3Jvc3MgY2hpbGRyZW4uXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzaWduYWxzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KGNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpKTtcbiAgICB9LCBbXSk7XG4gIH1cblxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzaWduYWxzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KGNoaWxkLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpKTtcbiAgICB9LCBhc3NlbWJsZUxheW91dFNpZ25hbHModGhpcykpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKGRiLCBjaGlsZCkgPT4gY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRiKSwgW10pO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlVGl0bGUoKTogVmdUaXRsZSB7XG4gICAgbGV0IHRpdGxlID0gc3VwZXIuYXNzZW1ibGVUaXRsZSgpO1xuICAgIGlmICh0aXRsZSkge1xuICAgICAgcmV0dXJuIHRpdGxlO1xuICAgIH1cbiAgICAvLyBJZiB0aXRsZSBkb2VzIG5vdCBwcm92aWRlIGxheWVyLCBsb29rIGludG8gY2hpbGRyZW5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIHRpdGxlID0gY2hpbGQuYXNzZW1ibGVUaXRsZSgpO1xuICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIHJldHVybiB0aXRsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVNYXJrcygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlTGF5ZXJTZWxlY3Rpb25NYXJrcyh0aGlzLCBmbGF0dGVuKHRoaXMuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkLmFzc2VtYmxlTWFya3MoKTtcbiAgICB9KSkpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGVnZW5kcygpOiBWZ0xlZ2VuZFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKGxlZ2VuZHMsIGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gbGVnZW5kcy5jb25jYXQoY2hpbGQuYXNzZW1ibGVMZWdlbmRzKCkpO1xuICAgIH0sIGFzc2VtYmxlTGVnZW5kcyh0aGlzKSk7XG4gIH1cbn1cbiJdfQ==