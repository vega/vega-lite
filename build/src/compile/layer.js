"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mark_1 = require("../mark");
var resolve_1 = require("../resolve");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var index_1 = require("./layout/index");
var model_1 = require("./model");
var domain_1 = require("./scale/domain");
var selection_1 = require("./selection/selection");
var LayerModel = (function (_super) {
    tslib_1.__extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName, parentUnitSize, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.resolve = resolve_1.initLayerResolve(spec.resolve || {});
        var unitSize = tslib_1.__assign({}, parentUnitSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {}));
        _this.children = spec.layer.map(function (layer, i) {
            // FIXME: this is not always the case
            // we know that the model has to be a unit model because we pass in a unit spec
            return common_1.buildModel(layer, _this, _this.getName('layer_' + i), unitSize, repeater, config);
        });
        return _this;
    }
    LayerModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseData();
        }
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
    LayerModel.prototype.parseScale = function () {
        var _this = this;
        var model = this;
        var scaleComponent = this.component.scales = {};
        var _loop_2 = function (child) {
            child.parseScale();
            // Check whether the scales are actually compatible, e.g. use the same sort or throw error
            util_1.keys(child.component.scales).forEach(function (channel) {
                if (_this.resolve[channel].scale === 'shared') {
                    var childScale = child.component.scales[channel];
                    var modelScale = scaleComponent[channel];
                    if (!childScale || vega_schema_1.isSignalRefDomain(childScale.domain) || (modelScale && vega_schema_1.isSignalRefDomain(modelScale.domain))) {
                        // TODO: merge signal ref domains
                        return;
                    }
                    if (modelScale) {
                        modelScale.domain = domain_1.unionDomains(modelScale.domain, childScale.domain);
                    }
                    else {
                        scaleComponent[channel] = childScale;
                    }
                    // rename child scale to parent scales
                    var scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
                    var newName = model.scaleName(scaleNameWithoutPrefix, true);
                    child.renameScale(childScale.name, newName);
                    childScale.name = newName;
                    // remove merged scales from children
                    delete child.component.scales[channel];
                }
            });
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_2(child);
        }
    };
    LayerModel.prototype.parseMark = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMark();
        }
    };
    LayerModel.prototype.parseAxisAndHeader = function () {
        var _this = this;
        var axisComponent = this.component.axes = {};
        var _loop_3 = function (child) {
            child.parseAxisAndHeader();
            util_1.keys(child.component.axes).forEach(function (channel) {
                if (_this.resolve[channel].axis === 'shared') {
                    // If shared/union axis
                    // Just use the first axes definition for each channel
                    // TODO: what if the axes from different children are not compatible
                    if (!axisComponent[channel]) {
                        axisComponent[channel] = child.component.axes[channel];
                    }
                }
                else {
                    // If axes are independent
                    // TODO(#2251): correctly merge axis
                    if (!axisComponent[channel]) {
                        // copy the first axis
                        axisComponent[channel] = child.component.axes[channel];
                    }
                    else {
                        // put every odd numbered axis on the right/top
                        axisComponent[channel].axes.push(tslib_1.__assign({}, child.component.axes[channel].axes[0], (axisComponent[channel].axes.length % 2 === 1 ? { orient: channel === 'y' ? 'right' : 'top' } : {})));
                        if (child.component.axes[channel].gridAxes.length > 0) {
                            axisComponent[channel].gridAxes.push(tslib_1.__assign({}, child.component.axes[channel].gridAxes[0]));
                        }
                    }
                }
                // delete child.component.axes[channel];
            });
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_3(child);
        }
    };
    LayerModel.prototype.parseLegend = function () {
        var _this = this;
        var legendComponent = this.component.legends = {};
        var _loop_4 = function (child) {
            child.parseLegend();
            // TODO: correctly implement independent axes
            util_1.keys(child.component.legends).forEach(function (channel) {
                if (_this.resolve[channel].legend === 'shared') {
                    // just use the first legend definition for each channel
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legends[channel];
                    }
                }
                else {
                    // TODO: support independent legends
                }
            });
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_4(child);
        }
    };
    LayerModel.prototype.assembleParentGroupProperties = function () {
        return tslib_1.__assign({ width: this.getSizeSignalRef('width'), height: this.getSizeSignalRef('height') }, common_1.applyConfig({}, this.config.cell, mark_1.FILL_STROKE_CONFIG.concat(['clip'])));
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
        }, index_1.assembleLayoutLayerSignals(this));
    };
    LayerModel.prototype.assembleSelectionData = function (data) {
        return this.children.reduce(function (db, child) { return child.assembleSelectionData(db); }, []);
    };
    LayerModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    LayerModel.prototype.assembleScales = function () {
        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _super.prototype.assembleScales.call(this));
    };
    LayerModel.prototype.assembleLayout = function () {
        return null;
    };
    LayerModel.prototype.assembleMarks = function () {
        return selection_1.assembleLayerSelectionMarks(this, util_1.flatten(this.children.map(function (child) {
            return child.assembleMarks();
        })));
    };
    return LayerModel;
}(model_1.Model));
exports.LayerModel = LayerModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxnQ0FBMkM7QUFDM0Msc0NBQStGO0FBRS9GLGdDQUFrRDtBQUNsRCw4Q0FBcUc7QUFFckcsbUNBQWlEO0FBQ2pELDRDQUE2QztBQUM3QyxzQ0FBdUM7QUFDdkMsd0NBQTBEO0FBQzFELGlDQUE4QjtBQUU5Qix5Q0FBNEM7QUFDNUMsbURBQWtFO0FBSWxFO0lBQWdDLHNDQUFLO0lBS25DLG9CQUFZLElBQWUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDakUsY0FBd0IsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFEbkUsWUFHRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsU0FlN0M7UUFiQyxLQUFJLENBQUMsT0FBTyxHQUFHLDBCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFFcEQsSUFBTSxRQUFRLHdCQUNULGNBQWMsRUFDZCxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUM5QyxDQUFDO1FBRUYsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RDLHFDQUFxQztZQUNyQywrRUFBK0U7WUFDL0UsTUFBTSxDQUFDLG1CQUFVLENBQUMsS0FBSyxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0s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