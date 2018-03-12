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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRCQUE4QjtBQUM5QixnQ0FBdUY7QUFDdkYsZ0NBQXNDO0FBRXRDLHNDQUE0QztBQUM1QyxzQ0FBdUM7QUFDdkMsa0RBQTREO0FBQzVELDRDQUF3RDtBQUN4RCw4Q0FBa0Q7QUFDbEQsaUNBQThCO0FBRTlCLG1EQUFrRTtBQUNsRSwrQkFBaUM7QUFHakM7SUFBZ0MsOEJBQUs7SUFTbkMsb0JBQVksSUFBeUIsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDM0UsZUFBaUMsRUFBRSxRQUF1QixFQUFFLE1BQWMsRUFBRSxHQUFZO1FBRDFGLFlBR0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FxQjNEO1FBaENlLFVBQUksR0FBWSxPQUFPLENBQUM7UUFhdEMsSUFBTSxVQUFVLGdCQUNYLGVBQWUsRUFDZixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDOUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFMUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dC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QUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSztZQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxvQ0FBZSxHQUF0QjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO1lBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsRUFBRSwwQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQXpIRCxDQUFnQyxhQUFLLEdBeUhwQztBQXpIWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2lzTGF5ZXJTcGVjLCBpc1VuaXRTcGVjLCBMYXlvdXRTaXplTWl4aW5zLCBOb3JtYWxpemVkTGF5ZXJTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7ZmxhdHRlbiwga2V5c30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1ZnRGF0YSwgVmdMYXlvdXQsIFZnTGVnZW5kLCBWZ1NpZ25hbCwgVmdUaXRsZX0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZUxheWVyQXhpc30gZnJvbSAnLi9heGlzL3BhcnNlJztcbmltcG9ydCB7cGFyc2VEYXRhfSBmcm9tICcuL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHthc3NlbWJsZUxheW91dFNpZ25hbHN9IGZyb20gJy4vbGF5b3V0c2l6ZS9hc3NlbWJsZSc7XG5pbXBvcnQge3BhcnNlTGF5ZXJMYXlvdXRTaXplfSBmcm9tICcuL2xheW91dHNpemUvcGFyc2UnO1xuaW1wb3J0IHthc3NlbWJsZUxlZ2VuZHN9IGZyb20gJy4vbGVnZW5kL2Fzc2VtYmxlJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlfSBmcm9tICcuL3JlcGVhdGVyJztcbmltcG9ydCB7YXNzZW1ibGVMYXllclNlbGVjdGlvbk1hcmtzfSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vdW5pdCc7XG5cblxuZXhwb3J0IGNsYXNzIExheWVyTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiAnbGF5ZXInID0gJ2xheWVyJztcblxuICAvLyBIQUNLOiBUaGlzIHNob3VsZCBiZSAoTGF5ZXJNb2RlbCB8IFVuaXRNb2RlbClbXSwgYnV0IHNldHRpbmcgdGhlIGNvcnJlY3QgdHlwZSBsZWFkcyB0byB3ZWlyZCBlcnJvci5cbiAgLy8gU28gSSdtIGp1c3QgcHV0dGluZyBnZW5lcmljIE1vZGVsIGZvciBub3cuXG4gIHB1YmxpYyByZWFkb25seSBjaGlsZHJlbjogTW9kZWxbXTtcblxuXG5cbiAgY29uc3RydWN0b3Ioc3BlYzogTm9ybWFsaXplZExheWVyU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsXG4gICAgcGFyZW50R2l2ZW5TaXplOiBMYXlvdXRTaXplTWl4aW5zLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgY29uZmlnOiBDb25maWcsIGZpdDogYm9vbGVhbikge1xuXG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgc3BlYy5yZXNvbHZlKTtcblxuICAgIGNvbnN0IGxheW91dFNpemUgPSB7XG4gICAgICAuLi5wYXJlbnRHaXZlblNpemUsXG4gICAgICAuLi4oc3BlYy53aWR0aCA/IHt3aWR0aDogc3BlYy53aWR0aH0gOiB7fSksXG4gICAgICAuLi4oc3BlYy5oZWlnaHQgPyB7aGVpZ2h0OiBzcGVjLmhlaWdodH0gOiB7fSlcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0U2l6ZShsYXlvdXRTaXplKTtcblxuICAgIHRoaXMuY2hpbGRyZW4gPSBzcGVjLmxheWVyLm1hcCgobGF5ZXIsIGkpID0+IHtcbiAgICAgIGlmIChpc0xheWVyU3BlYyhsYXllcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBMYXllck1vZGVsKGxheWVyLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2xheWVyXycraSksIGxheW91dFNpemUsIHJlcGVhdGVyLCBjb25maWcsIGZpdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1VuaXRTcGVjKGxheWVyKSkge1xuICAgICAgICByZXR1cm4gbmV3IFVuaXRNb2RlbChsYXllciwgdGhpcywgdGhpcy5nZXROYW1lKCdsYXllcl8nK2kpLCBsYXlvdXRTaXplLCByZXBlYXRlciwgY29uZmlnLCBmaXQpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuSU5WQUxJRF9TUEVDKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZURhdGEoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuZGF0YSA9IHBhcnNlRGF0YSh0aGlzKTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcnNlRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUxheW91dFNpemUoKSB7XG4gICAgcGFyc2VMYXllckxheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgLy8gTWVyZ2Ugc2VsZWN0aW9ucyB1cCB0aGUgaGllcmFyY2h5IHNvIHRoYXQgdGhleSBtYXkgYmUgcmVmZXJlbmNlZFxuICAgIC8vIGFjcm9zcyB1bml0IHNwZWNzLiBQZXJzaXN0IHRoZWlyIGRlZmluaXRpb25zIHdpdGhpbiBlYWNoIGNoaWxkXG4gICAgLy8gdG8gYXNzZW1ibGUgc2lnbmFscyB3aGljaCByZW1haW4gd2l0aGluIG91dHB1dCBWZWdhIHVuaXQgZ3JvdXBzLlxuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHt9O1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VTZWxlY3Rpb24oKTtcbiAgICAgIGtleXMoY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbltrZXldID0gY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbltrZXldO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlTWFya0dyb3VwKCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VNYXJrR3JvdXAoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIHBhcnNlTGF5ZXJBeGlzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzZywgY2hpbGQpID0+IGNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNnKSwgc2lnbmFscyk7XG4gIH1cblxuICAvLyBUT0RPOiBTdXBwb3J0IHNhbWUgbmFtZWQgc2VsZWN0aW9ucyBhY3Jvc3MgY2hpbGRyZW4uXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzaWduYWxzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KGNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpKTtcbiAgICB9LCBbXSk7XG4gIH1cblxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzaWduYWxzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KGNoaWxkLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpKTtcbiAgICB9LCBhc3NlbWJsZUxheW91dFNpZ25hbHModGhpcykpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKGRiLCBjaGlsZCkgPT4gY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRiKSwgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVUaXRsZSgpOiBWZ1RpdGxlIHtcbiAgICBsZXQgdGl0bGUgPSBzdXBlci5hc3NlbWJsZVRpdGxlKCk7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICByZXR1cm4gdGl0bGU7XG4gICAgfVxuICAgIC8vIElmIHRpdGxlIGRvZXMgbm90IHByb3ZpZGUgbGF5ZXIsIGxvb2sgaW50byBjaGlsZHJlblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgdGl0bGUgPSBjaGlsZC5hc3NlbWJsZVRpdGxlKCk7XG4gICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZU1hcmtzKCk6IGFueVtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVMYXllclNlbGVjdGlvbk1hcmtzKHRoaXMsIGZsYXR0ZW4odGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGQuYXNzZW1ibGVNYXJrcygpO1xuICAgIH0pKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMZWdlbmRzKCk6IFZnTGVnZW5kW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgobGVnZW5kcywgY2hpbGQpID0+IHtcbiAgICAgIHJldHVybiBsZWdlbmRzLmNvbmNhdChjaGlsZC5hc3NlbWJsZUxlZ2VuZHMoKSk7XG4gICAgfSwgYXNzZW1ibGVMZWdlbmRzKHRoaXMpKTtcbiAgfVxufVxuIl19