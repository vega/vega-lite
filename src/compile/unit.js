"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var log = require("../log");
var channel_1 = require("../channel");
var config_1 = require("../config");
var data_1 = require("../data");
var vlEncoding = require("../encoding"); // TODO: remove
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var scale_1 = require("../scale");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var common_1 = require("./common");
var config_2 = require("./config");
var data_2 = require("./data/data");
var parse_2 = require("./legend/parse");
var layout_1 = require("./layout");
var model_1 = require("./model");
var mark_2 = require("./mark/mark");
var init_1 = require("./scale/init");
var parse_3 = require("./scale/parse");
var stack_1 = require("../stack");
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
var UnitModel = (function (_super) {
    __extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        // use top-level width / height or parent's top-level width / height
        // FIXME: once facet supports width/height, this is no longer correct!
        var providedWidth = spec.width !== undefined ? spec.width :
            parent ? parent['width'] : undefined; // only exists if parent is layer
        var providedHeight = spec.height !== undefined ? spec.height :
            parent ? parent['height'] : undefined; // only exists if parent is layer
        var mark = _this._mark = spec.mark;
        var encoding = _this._encoding = _this._initEncoding(mark, spec.encoding || {});
        // TODO?: ideally we should use config only inside this constructor
        var config = _this._config = _this._initConfig(spec.config, parent);
        // FIXME move stacked out of config as it's not really a theme.
        // calculate stack properties
        _this._stack = stack_1.stack(mark, encoding, config.mark.stacked);
        _this._scale = _this._initScale(mark, encoding, config, providedWidth, providedHeight);
        // TODO?: refactor these to be a part of the model as they are not really just config
        config.mark = config_2.initMarkConfig(mark, encoding, _this._scale, _this._stack, config);
        if (mark === 'text') {
            config.text = config_2.initTextConfig(encoding, config);
        }
        _this._axis = _this._initAxis(encoding, config);
        _this._legend = _this._initLegend(encoding, config);
        // width / height
        _this._initSize(mark, _this._scale, providedWidth, providedHeight, config.cell, config.scale);
        return _this;
    }
    UnitModel.prototype._initEncoding = function (mark, encoding) {
        // clone to prevent side effect to the original spec
        encoding = util_1.duplicate(encoding);
        Object.keys(encoding).forEach(function (channel) {
            if (!channel_1.supportMark(channel, mark)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, mark));
                delete encoding[channel];
                return;
            }
            if (util_1.isArray(encoding[channel])) {
                // Array of fieldDefs for detail channel (or production rule)
                encoding[channel] = encoding[channel].reduce(function (channelDefs, channelDef) {
                    if (!fielddef_1.isFieldDef(channelDef) && !fielddef_1.isValueDef(channelDef)) {
                        log.warn(log.message.emptyFieldDef(channelDef, channel));
                    }
                    else {
                        channelDefs.push(fielddef_1.normalize(channelDef, channel));
                    }
                    return channelDefs;
                }, []);
            }
            else {
                var fieldDef = encoding[channel];
                if (fieldDef.field === undefined && fieldDef.value === undefined) {
                    log.warn(log.message.emptyFieldDef(fieldDef, channel));
                    delete encoding[channel];
                    return;
                }
                fielddef_1.normalize(fieldDef, channel);
            }
        });
        return encoding;
    };
    /**
     * Init config by merging config from parent and, if applicable, from facet config
     */
    UnitModel.prototype._initConfig = function (specConfig, parent) {
        var config = util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), parent ? parent.config() : {}, specConfig);
        var hasFacetParent = false;
        while (parent !== null) {
            if (parent.isFacet()) {
                hasFacetParent = true;
                break;
            }
            parent = parent.parent();
        }
        if (hasFacetParent) {
            config.cell = util_1.extend({}, config.cell, config.facet.cell);
        }
        return config;
    };
    UnitModel.prototype._initScale = function (mark, encoding, config, topLevelWidth, topLevelHeight) {
        var xyRangeSteps = [];
        return channel_1.UNIT_SCALE_CHANNELS.reduce(function (_scale, channel) {
            if (vlEncoding.channelHasField(encoding, channel) ||
                (channel === channel_1.X && vlEncoding.channelHasField(encoding, channel_1.X2)) ||
                (channel === channel_1.Y && vlEncoding.channelHasField(encoding, channel_1.Y2))) {
                var scale = _scale[channel] = init_1.default(channel, encoding[channel], config, mark, channel === channel_1.X ? topLevelWidth : channel === channel_1.Y ? topLevelHeight : undefined, xyRangeSteps // for determine point / bar size
                );
                if (channel === channel_1.X || channel === channel_1.Y) {
                    if (scale.rangeStep) {
                        xyRangeSteps.push(scale.rangeStep);
                    }
                }
            }
            return _scale;
        }, {});
    };
    // TODO: consolidate this with scale?  Current scale range is in parseScale (later),
    // but not in initScale because scale range depends on size,
    // but size depends on scale type and rangeStep
    UnitModel.prototype._initSize = function (mark, scale, width, height, cellConfig, scaleConfig) {
        if (width !== undefined) {
            this._width = width;
        }
        else if (scale[channel_1.X]) {
            if (!scale_1.hasDiscreteDomain(scale[channel_1.X].type) || !scale[channel_1.X].rangeStep) {
                this._width = cellConfig.width;
            } // else: Do nothing, use dynamic width.
        }
        else {
            if (mark === mark_1.TEXT) {
                // for text table without x/y scale we need wider rangeStep
                this._width = scaleConfig.textXRangeStep;
            }
            else {
                if (typeof scaleConfig.rangeStep === 'string') {
                    throw new Error('_initSize does not handle string rangeSteps');
                }
                this._width = scaleConfig.rangeStep;
            }
        }
        if (height !== undefined) {
            this._height = height;
        }
        else if (scale[channel_1.Y]) {
            if (!scale_1.hasDiscreteDomain(scale[channel_1.Y].type) || !scale[channel_1.Y].rangeStep) {
                this._height = cellConfig.height;
            } // else: Do nothing, use dynamic height .
        }
        else {
            if (typeof scaleConfig.rangeStep === 'string') {
                throw new Error('_initSize does not handle string rangeSteps');
            }
            this._height = scaleConfig.rangeStep;
        }
    };
    UnitModel.prototype._initAxis = function (encoding, config) {
        return [channel_1.X, channel_1.Y].reduce(function (_axis, channel) {
            // Position Axis
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef) ||
                (channel === channel_1.X && fielddef_1.isFieldDef(encoding.x2)) ||
                (channel === channel_1.Y && fielddef_1.isFieldDef(encoding.y2))) {
                var axisSpec = fielddef_1.isFieldDef(channelDef) ? channelDef.axis : null;
                // We no longer support false in the schema, but we keep false here for backward compatability.
                if (axisSpec !== null && axisSpec !== false) {
                    _axis[channel] = util_1.extend({}, config.axis, axisSpec === true ? {} : axisSpec || {});
                }
            }
            return _axis;
        }, {});
    };
    UnitModel.prototype._initLegend = function (encoding, config) {
        return channel_1.NONSPATIAL_SCALE_CHANNELS.reduce(function (_legend, channel) {
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef)) {
                var legendSpec = channelDef.legend;
                // We no longer support false in the schema, but we keep false here for backward compatability.
                if (legendSpec !== null && legendSpec !== false) {
                    _legend[channel] = util_1.extend({}, config.legend, legendSpec === true ? {} : legendSpec || {});
                }
            }
            return _legend;
        }, {});
    };
    UnitModel.prototype.children = function () {
        return [];
    };
    Object.defineProperty(UnitModel.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitModel.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    UnitModel.prototype.parseData = function () {
        this.component.data = data_2.parseUnitData(this);
    };
    UnitModel.prototype.parseSelectionData = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    UnitModel.prototype.parseLayoutData = function () {
        this.component.layout = layout_1.parseUnitLayout(this);
    };
    UnitModel.prototype.parseScale = function () {
        this.component.scale = parse_3.default(this);
    };
    UnitModel.prototype.parseMark = function () {
        this.component.mark = mark_2.parseMark(this);
    };
    UnitModel.prototype.parseAxis = function () {
        this.component.axis = parse_1.parseAxisComponent(this, [channel_1.X, channel_1.Y]);
    };
    UnitModel.prototype.parseAxisGroup = function () {
        return null;
    };
    UnitModel.prototype.parseGridGroup = function () {
        return null;
    };
    UnitModel.prototype.parseLegend = function () {
        this.component.legend = parse_2.parseLegendComponent(this);
    };
    UnitModel.prototype.assembleData = function (data) {
        return data_2.assembleData(this, data);
    };
    UnitModel.prototype.assembleLayout = function (layoutData) {
        return layout_1.assembleLayout(this, layoutData);
    };
    UnitModel.prototype.assembleMarks = function () {
        return this.component.mark;
    };
    UnitModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common_1.applyConfig({}, cellConfig, mark_1.FILL_STROKE_CONFIG.concat(['clip']));
    };
    UnitModel.prototype.channels = function () {
        return channel_1.UNIT_CHANNELS;
    };
    UnitModel.prototype.mapping = function () {
        return this.encoding();
    };
    UnitModel.prototype.stack = function () {
        return this._stack;
    };
    UnitModel.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this._encoding);
        var spec;
        spec = {
            mark: this._mark,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = util_1.duplicate(this._config);
        }
        if (!excludeData) {
            spec.data = util_1.duplicate(this._data);
        }
        // remove defaults
        return spec;
    };
    UnitModel.prototype.mark = function () {
        return this._mark;
    };
    UnitModel.prototype.channelHasField = function (channel) {
        return vlEncoding.channelHasField(this._encoding, channel);
    };
    UnitModel.prototype.encoding = function () {
        return this._encoding;
    };
    UnitModel.prototype.fieldDef = function (channel) {
        // TODO: remove this || {}
        // Currently we have it to prevent null pointer exception.
        return this._encoding[channel] || {};
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
        return this.dataName(vlEncoding.isAggregate(this._encoding) ? data_1.SUMMARY : data_1.SOURCE);
    };
    UnitModel.prototype.isUnit = function () {
        return true;
    };
    return UnitModel;
}(model_1.Model));
exports.UnitModel = UnitModel;
//# sourceMappingURL=unit.js.map