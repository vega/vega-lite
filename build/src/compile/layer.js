"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    tslib_1.__extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName, parentGivenSize, repeater, config, fit) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.type = 'layer';
        var layoutSize = tslib_1.__assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0QkFBOEI7QUFDOUIsZ0NBQTZFO0FBQzdFLGdDQUFzQztBQUV0QyxzQ0FBNEM7QUFDNUMsc0NBQXVDO0FBQ3ZDLGtEQUE0RDtBQUM1RCw0Q0FBd0Q7QUFDeEQsOENBQWtEO0FBQ2xELGlDQUE4QjtBQUU5QixtREFBa0U7QUFDbEUsK0JBQWlDO0FBR2pDO0lBQWdDLHNDQUFLO0lBU25DLG9CQUFZLElBQWUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDakUsZUFBaUMsRUFBRSxRQUF1QixFQUFFLE1BQWMsRUFBRSxHQUFZO1FBRDFGLFlBR0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FxQjNEO1FBaENlLFVBQUksR0FBWSxPQUFPLENBQUM7UUFhdEMsSUFBTSxVQUFVLHdCQUNYLGVBQWUsRUFDZixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDOUMsQ0FBQztRQUVGLEtBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFMUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLENBQUMsSUFB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