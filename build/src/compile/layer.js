"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var mark_1 = require("../mark");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var data_1 = require("../data");
var data_2 = require("./data/data");
var common_1 = require("./common");
var layout_1 = require("./layout");
var model_1 = require("./model");
var domain_1 = require("./scale/domain");
var LayerModel = (function (_super) {
    tslib_1.__extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.stack = null;
        _this.width = spec.width;
        _this.height = spec.height;
        _this.config = _this.initConfig(spec.config, parent);
        _this.children = spec.layer.map(function (layer, i) {
            // we know that the model has to be a unit model because we pass in a unit spec
            return common_1.buildModel(layer, _this, _this.getName('layer_' + i));
        });
        return _this;
    }
    LayerModel.prototype.initConfig = function (specConfig, parent) {
        return util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), specConfig, parent ? parent.config : {});
    };
    LayerModel.prototype.channelHasField = function (channel) {
        // layer does not have any channels
        return false;
    };
    LayerModel.prototype.hasDiscreteScale = function (channel) {
        // since we assume shared scales we can just ask the first child
        return this.children[0].hasDiscreteScale(channel);
    };
    LayerModel.prototype.dataTable = function () {
        // FIXME: don't just use the first child
        return this.children[0].dataTable();
    };
    LayerModel.prototype.fieldDef = function (channel) {
        return null; // layer does not have field defs
    };
    LayerModel.prototype.parseData = function () {
        this.children.forEach(function (child) {
            child.parseData();
        });
        this.component.data = data_2.parseLayerData(this);
    };
    LayerModel.prototype.parseSelection = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    LayerModel.prototype.parseLayoutData = function () {
        // TODO: correctly union ordinal scales rather than just using the layout of the first child
        this.children.forEach(function (child) {
            child.parseLayoutData();
        });
        this.component.layout = layout_1.parseLayerLayout(this);
    };
    LayerModel.prototype.parseScale = function () {
        var model = this;
        var scaleComponent = this.component.scales = {};
        this.children.forEach(function (child) {
            child.parseScale();
            // FIXME(#1602): correctly implement independent scale
            // Also need to check whether the scales are actually compatible, e.g. use the same sort or throw error
            if (true) {
                util_1.keys(child.component.scales).forEach(function (channel) {
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
                    // remove merged scales from children
                    delete child.component.scales[channel];
                });
            }
        });
    };
    LayerModel.prototype.parseMark = function () {
        this.children.forEach(function (child) {
            child.parseMark();
        });
    };
    LayerModel.prototype.parseAxis = function () {
        var axisComponent = this.component.axes = {};
        this.children.forEach(function (child) {
            child.parseAxis();
            // TODO: correctly implement independent axes
            if (true) {
                util_1.keys(child.component.axes).forEach(function (channel) {
                    // TODO: support multiple axes for shared scale
                    // just use the first axis definition for each channel
                    if (!axisComponent[channel]) {
                        axisComponent[channel] = child.component.axes[channel];
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
        var legendComponent = this.component.legends = {};
        this.children.forEach(function (child) {
            child.parseLegend();
            // TODO: correctly implement independent axes
            if (true) {
                util_1.keys(child.component.legends).forEach(function (channel) {
                    // just use the first legend definition for each channel
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legends[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common_1.applyConfig({}, cellConfig, mark_1.FILL_STROKE_CONFIG.concat(['clip']));
    };
    LayerModel.prototype.assembleSignals = function (signals) {
        return [];
    };
    LayerModel.prototype.assembleSelectionData = function (data) {
        return [];
    };
    LayerModel.prototype.assembleScales = function () {
        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _super.prototype.assembleScales.call(this));
    };
    LayerModel.prototype.assembleData = function (data) {
        // Prefix traversal – parent data might be referred to by children data
        data_2.assembleData(this, data);
        this.children.forEach(function (child) {
            child.assembleData(data);
        });
        return data;
    };
    LayerModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this.children.forEach(function (child) {
            child.assembleLayout(layoutData);
        });
        return layout_1.assembleLayout(this, layoutData);
    };
    LayerModel.prototype.assembleMarks = function () {
        // only children have marks
        return util_1.flatten(this.children.map(function (child) {
            return child.assembleMarks();
        }));
    };
    LayerModel.prototype.channels = function () {
        return [];
    };
    LayerModel.prototype.getMapping = function () {
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
        var data = this.data;
        var childData = child.component.data;
        var compatible = !childData.source || (data && data_1.isUrlData(data) && data.url === childData.source.url);
        return compatible;
    };
    return LayerModel;
}(model_1.Model));
exports.LayerModel = LayerModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxvQ0FBNEQ7QUFPNUQsZ0NBQTJDO0FBQzNDLGdDQUFrRTtBQUNsRSw4Q0FBaUY7QUFDakYsZ0NBQWtDO0FBRWxDLG9DQUF5RDtBQUN6RCxtQ0FBaUQ7QUFDakQsbUNBQTBEO0FBQzFELGlDQUE4QjtBQUc5Qix5Q0FBNEM7QUFHNUM7SUFBZ0Msc0NBQUs7SUEyQm5DLG9CQUFZLElBQWUsRUFBRSxNQUFhLEVBQUUsZUFBdUI7UUFBbkUsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxTQVVyQztRQW5Da0IsWUFBTSxHQUFnQixFQUFFLENBQUM7UUFFekIsVUFBSSxHQUFlLEVBQUUsQ0FBQztRQUV0QixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQUk5QixXQUFLLEdBQW9CLElBQUksQ0FBQztRQW1CNUMsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUUxQixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRCxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEMsK0VBQStFO1lBQy9FLE1BQU0sQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQWMsQ0FBQztRQUMxRSxDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRU8sK0JBQVUsR0FBbEIsVUFBbUIsVUFBa0IsRUFBRSxNQUFhO1FBQ2xE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