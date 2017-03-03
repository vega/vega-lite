"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config_1 = require("../config");
var mark_1 = require("../mark");
var util_1 = require("../util");
var data_1 = require("../data");
var data_2 = require("./data/data");
var common_1 = require("./common");
var layout_1 = require("./layout");
var model_1 = require("./model");
var domain_1 = require("./scale/domain");
var LayerModel = (function (_super) {
    __extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        _this._width = spec.width;
        _this._height = spec.height;
        _this._config = _this._initConfig(spec.config, parent);
        _this._children = spec.layer.map(function (layer, i) {
            // we know that the model has to be a unit model because we pass in a unit spec
            return common_1.buildModel(layer, _this, _this.name('layer_' + i));
        });
        return _this;
    }
    LayerModel.prototype._initConfig = function (specConfig, parent) {
        return util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), specConfig, parent ? parent.config() : {});
    };
    Object.defineProperty(LayerModel.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerModel.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    LayerModel.prototype.channelHasField = function (_) {
        // layer does not have any channels
        return false;
    };
    LayerModel.prototype.children = function () {
        return this._children;
    };
    LayerModel.prototype.hasDiscreteScale = function (channel) {
        // since we assume shared scales we can just ask the first child
        return this._children[0].hasDiscreteScale(channel);
    };
    LayerModel.prototype.dataTable = function () {
        // FIXME: don't just use the first child
        return this._children[0].dataTable();
    };
    LayerModel.prototype.fieldDef = function (_) {
        return null; // layer does not have field defs
    };
    LayerModel.prototype.stack = function () {
        return null; // this is only a property for UnitModel
    };
    LayerModel.prototype.parseData = function () {
        this._children.forEach(function (child) {
            child.parseData();
        });
        this.component.data = data_2.parseLayerData(this);
    };
    LayerModel.prototype.parseSelectionData = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    LayerModel.prototype.parseLayoutData = function () {
        // TODO: correctly union ordinal scales rather than just using the layout of the first child
        this._children.forEach(function (child) {
            child.parseLayoutData();
        });
        this.component.layout = layout_1.parseLayerLayout(this);
    };
    LayerModel.prototype.parseScale = function () {
        var model = this;
        var scaleComponent = this.component.scale = {};
        this._children.forEach(function (child) {
            child.parseScale();
            // FIXME(#1602): correctly implement independent scale
            // Also need to check whether the scales are actually compatible, e.g. use the same sort or throw error
            if (true) {
                util_1.keys(child.component.scale).forEach(function (channel) {
                    var childScales = child.component.scale[channel];
                    if (!childScales) {
                        // the child does not have any scales so we have nothing to merge
                        return;
                    }
                    var modelScales = scaleComponent[channel];
                    if (modelScales && modelScales.main) {
                        // Scales are unioned by combining the domain of the main scale.
                        // Other scales that are used for ordinal legends are appended.
                        modelScales.main.domain = domain_1.unionDomains(modelScales.main.domain, childScales.main.domain);
                        modelScales.binLegend = modelScales.binLegend ? modelScales.binLegend : childScales.binLegend;
                        modelScales.binLegendLabel = modelScales.binLegendLabel ? modelScales.binLegendLabel : childScales.binLegendLabel;
                    }
                    else {
                        scaleComponent[channel] = childScales;
                    }
                    // rename child scales to parent scales
                    util_1.vals(childScales).forEach(function (scale) {
                        var scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
                        var newName = model.scaleName(scaleNameWithoutPrefix, true);
                        child.renameScale(scale.name, newName);
                        scale.name = newName;
                    });
                    delete childScales[channel];
                });
            }
        });
    };
    LayerModel.prototype.parseMark = function () {
        this._children.forEach(function (child) {
            child.parseMark();
        });
    };
    LayerModel.prototype.parseAxis = function () {
        var axisComponent = this.component.axis = {};
        this._children.forEach(function (child) {
            child.parseAxis();
            // TODO: correctly implement independent axes
            if (true) {
                util_1.keys(child.component.axis).forEach(function (channel) {
                    // TODO: support multiple axes for shared scale
                    // just use the first axis definition for each channel
                    if (!axisComponent[channel]) {
                        axisComponent[channel] = child.component.axis[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.parseAxisGroup = function () {
        return null;
    };
    LayerModel.prototype.parseGridGroup = function () {
        return null;
    };
    LayerModel.prototype.parseLegend = function () {
        var legendComponent = this.component.legend = {};
        this._children.forEach(function (child) {
            child.parseLegend();
            // TODO: correctly implement independent axes
            if (true) {
                util_1.keys(child.component.legend).forEach(function (channel) {
                    // just use the first legend definition for each channel
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legend[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common_1.applyConfig({}, cellConfig, mark_1.FILL_STROKE_CONFIG.concat(['clip']));
    };
    LayerModel.prototype.assembleData = function (data) {
        // Prefix traversal – parent data might be referred to by children data
        data_2.assembleData(this, data);
        this._children.forEach(function (child) {
            child.assembleData(data);
        });
        return data;
    };
    LayerModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this._children.forEach(function (child) {
            child.assembleLayout(layoutData);
        });
        return layout_1.assembleLayout(this, layoutData);
    };
    LayerModel.prototype.assembleMarks = function () {
        // only children have marks
        return util_1.flatten(this._children.map(function (child) {
            return child.assembleMarks();
        }));
    };
    LayerModel.prototype.channels = function () {
        return [];
    };
    LayerModel.prototype.mapping = function () {
        return null;
    };
    LayerModel.prototype.isLayer = function () {
        return true;
    };
    /**
     * Returns true if the child either has no source defined or uses the same url.
     * This is useful if you want to know whether it is possible to move a filter up.
     *
     * This function can only be called once th child has been parsed.
     */
    LayerModel.prototype.compatibleSource = function (child) {
        var data = this.data();
        var childData = child.component.data;
        var compatible = !childData.source || (data && data_1.isUrlData(data) && data.url === childData.source.url);
        return compatible;
    };
    return LayerModel;
}(model_1.Model));
exports.LayerModel = LayerModel;
//# sourceMappingURL=layer.js.map