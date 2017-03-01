"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axis_1 = require("../axis");
var channel_1 = require("../channel");
var config_1 = require("../config");
var data_1 = require("../data");
var encoding_1 = require("../encoding");
var vlEncoding = require("../encoding"); // TODO: remove
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var scale_1 = require("../scale");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var common_1 = require("./common");
var data_2 = require("./data/data");
var parse_2 = require("./legend/parse");
var layout_1 = require("./layout");
var model_1 = require("./model");
var mark_2 = require("./mark/mark");
var init_1 = require("./scale/init");
var parse_3 = require("./scale/parse");
var stack_1 = require("../stack");
var selection_1 = require("./selection/selection");
var init_2 = require("./mark/init");
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
var UnitModel = (function (_super) {
    tslib_1.__extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        _this.selection = {};
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.children = [];
        // use top-level width / height or parent's top-level width / height
        // FIXME: once facet supports width/height, this is no longer correct!
        var providedWidth = spec.width !== undefined ? spec.width :
            parent ? parent['width'] : undefined; // only exists if parent is layer
        var providedHeight = spec.height !== undefined ? spec.height :
            parent ? parent['height'] : undefined; // only exists if parent is layer
        var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = _this.encoding = encoding_1.dropInvalidFieldDefs(mark, spec.encoding || {});
        // TODO?: ideally we should use config only inside this constructor
        var config = _this.config = _this.initConfig(spec.config, parent);
        // calculate stack properties
        _this.stack = stack_1.stack(mark, encoding, config.stack);
        _this.scales = _this.initScales(mark, encoding, config, providedWidth, providedHeight);
        _this.markDef = init_2.initMarkDef(spec.mark, encoding, _this.scales, config);
        _this.encoding = init_2.initEncoding(mark, encoding, _this.stack, config);
        _this.axes = _this.initAxes(encoding, config);
        _this.legends = _this.initLegend(encoding, config);
        // Selections will be initialized upon parse.
        _this.selection = spec.selection;
        // width / height
        var _a = _this.initSize(mark, _this.scales, providedWidth, providedHeight, config.cell, config.scale), _b = _a.width, width = _b === void 0 ? _this.width : _b, _c = _a.height, height = _c === void 0 ? _this.height : _c;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    /**
     * Init config by merging config from parent and, if applicable, from facet config
     */
    UnitModel.prototype.initConfig = function (specConfig, parent) {
        var config = util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), parent ? parent.config : {}, specConfig);
        var hasFacetParent = false;
        while (parent !== null) {
            if (parent.isFacet()) {
                hasFacetParent = true;
                break;
            }
            parent = parent.parent;
        }
        if (hasFacetParent) {
            config.cell = util_1.extend({}, config.cell, config.facet.cell);
        }
        return config;
    };
    UnitModel.prototype.initScales = function (mark, encoding, config, topLevelWidth, topLevelHeight) {
        var xyRangeSteps = [];
        return channel_1.UNIT_SCALE_CHANNELS.reduce(function (scales, channel) {
            if (vlEncoding.channelHasField(encoding, channel) ||
                (channel === channel_1.X && vlEncoding.channelHasField(encoding, channel_1.X2)) ||
                (channel === channel_1.Y && vlEncoding.channelHasField(encoding, channel_1.Y2))) {
                var scale = scales[channel] = init_1.default(channel, encoding[channel], config, mark, channel === channel_1.X ? topLevelWidth : channel === channel_1.Y ? topLevelHeight : undefined, xyRangeSteps // for determine point / bar size
                );
                if (channel === channel_1.X || channel === channel_1.Y) {
                    if (scale.rangeStep) {
                        xyRangeSteps.push(scale.rangeStep);
                    }
                }
            }
            return scales;
        }, {});
    };
    // TODO: consolidate this with scale?  Current scale range is in parseScale (later),
    // but not in initScale because scale range depends on size,
    // but size depends on scale type and rangeStep
    UnitModel.prototype.initSize = function (mark, scale, width, height, cellConfig, scaleConfig) {
        if (width === undefined) {
            if (scale[channel_1.X]) {
                if (!scale_1.hasDiscreteDomain(scale[channel_1.X].type) || !scale[channel_1.X].rangeStep) {
                    width = cellConfig.width;
                } // else: Do nothing, use dynamic width.
            }
            else {
                if (mark === mark_1.TEXT) {
                    // for text table without x/y scale we need wider rangeStep
                    width = scaleConfig.textXRangeStep;
                }
                else {
                    if (typeof scaleConfig.rangeStep === 'string') {
                        throw new Error('_initSize does not handle string rangeSteps');
                    }
                    width = scaleConfig.rangeStep;
                }
            }
        }
        if (height === undefined) {
            if (scale[channel_1.Y]) {
                if (!scale_1.hasDiscreteDomain(scale[channel_1.Y].type) || !scale[channel_1.Y].rangeStep) {
                    height = cellConfig.height;
                } // else: Do nothing, use dynamic height .
            }
            else {
                if (typeof scaleConfig.rangeStep === 'string') {
                    throw new Error('_initSize does not handle string rangeSteps');
                }
                height = scaleConfig.rangeStep;
            }
        }
        return { width: width, height: height };
    };
    UnitModel.prototype.initAxes = function (encoding, config) {
        return [channel_1.X, channel_1.Y].reduce(function (_axis, channel) {
            // Position Axis
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef) ||
                (channel === channel_1.X && fielddef_1.isFieldDef(encoding.x2)) ||
                (channel === channel_1.Y && fielddef_1.isFieldDef(encoding.y2))) {
                var axisSpec = fielddef_1.isFieldDef(channelDef) ? channelDef.axis : null;
                // We no longer support false in the schema, but we keep false here for backward compatability.
                if (axisSpec !== null && axisSpec !== false) {
                    var vlOnlyAxisProperties_1 = {};
                    axis_1.VL_ONLY_AXIS_PROPERTIES.forEach(function (property) {
                        if (config.axis[property] !== undefined) {
                            vlOnlyAxisProperties_1[property] = config.axis[property];
                        }
                    });
                    _axis[channel] = tslib_1.__assign({}, vlOnlyAxisProperties_1, axisSpec);
                }
            }
            return _axis;
        }, {});
    };
    UnitModel.prototype.initLegend = function (encoding, config) {
        return channel_1.NONSPATIAL_SCALE_CHANNELS.reduce(function (_legend, channel) {
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef)) {
                var legendSpec = channelDef.legend;
                if (legendSpec !== null && legendSpec !== false) {
                    _legend[channel] = tslib_1.__assign({}, legendSpec);
                }
            }
            return _legend;
        }, {});
    };
    UnitModel.prototype.parseData = function () {
        this.component.data = data_2.parseUnitData(this);
    };
    UnitModel.prototype.parseSelection = function () {
        this.component.selection = selection_1.parseUnitSelection(this, this.selection);
    };
    UnitModel.prototype.parseLayoutData = function () {
        this.component.layout = layout_1.parseUnitLayout(this);
    };
    UnitModel.prototype.parseScale = function () {
        this.component.scales = parse_3.default(this);
    };
    UnitModel.prototype.parseMark = function () {
        this.component.mark = mark_2.parseMark(this);
    };
    UnitModel.prototype.parseAxis = function () {
        this.component.axes = parse_1.parseAxisComponent(this, [channel_1.X, channel_1.Y]);
    };
    UnitModel.prototype.parseAxisGroup = function () {
        return null;
    };
    UnitModel.prototype.parseGridGroup = function () {
        return null;
    };
    UnitModel.prototype.parseLegend = function () {
        this.component.legends = parse_2.parseLegendComponent(this);
    };
    UnitModel.prototype.assembleSignals = function (signals) {
        return selection_1.assembleUnitSignals(this, signals);
    };
    UnitModel.prototype.assembleSelectionData = function (data) {
        return selection_1.assembleUnitData(this, data);
    };
    UnitModel.prototype.assembleData = function (data) {
        return data_2.assembleData(this, data);
    };
    UnitModel.prototype.assembleLayout = function (layoutData) {
        return layout_1.assembleLayout(this, layoutData);
    };
    UnitModel.prototype.assembleMarks = function () {
        return selection_1.assembleUnitMarks(this, this.component.mark);
    };
    UnitModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common_1.applyConfig({}, cellConfig, mark_1.FILL_STROKE_CONFIG.concat(['clip']));
    };
    UnitModel.prototype.channels = function () {
        return channel_1.UNIT_CHANNELS;
    };
    UnitModel.prototype.getMapping = function () {
        return this.encoding;
    };
    UnitModel.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this.encoding);
        var spec;
        spec = {
            mark: this.markDef,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = util_1.duplicate(this.config);
        }
        if (!excludeData) {
            spec.data = util_1.duplicate(this.data);
        }
        // remove defaults
        return spec;
    };
    UnitModel.prototype.mark = function () {
        return this.markDef.type;
    };
    UnitModel.prototype.channelHasField = function (channel) {
        return vlEncoding.channelHasField(this.encoding, channel);
    };
    UnitModel.prototype.fieldDef = function (channel) {
        // TODO: remove this || {}
        // Currently we have it to prevent null pointer exception.
        return this.encoding[channel] || {};
    };
    /** Get "field" reference for vega */
    UnitModel.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: scale_1.hasDiscreteDomain(this.scale(channel).type) ? 'range' : 'start'
            }, opt);
        }
        return fielddef_1.field(fieldDef, opt);
    };
    UnitModel.prototype.dataTable = function () {
        return this.dataName(vlEncoding.isAggregate(this.encoding) ? data_1.SUMMARY : data_1.SOURCE);
    };
    UnitModel.prototype.isUnit = function () {
        return true;
    };
    return UnitModel;
}(model_1.Model));
exports.UnitModel = UnitModel;
//# sourceMappingURL=unit.js.map