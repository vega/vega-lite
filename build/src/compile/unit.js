"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var config_1 = require("../config");
var data_1 = require("../data");
var encoding_1 = require("../encoding");
var vlEncoding = require("../encoding"); // TODO: remove
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var scale_1 = require("../scale");
var util_1 = require("../util");
var stack_1 = require("../stack");
var parse_1 = require("./axis/parse");
var common_1 = require("./common");
var data_2 = require("./data/data");
var layout_1 = require("./layout");
var parse_2 = require("./legend/parse");
var init_1 = require("./mark/init");
var mark_2 = require("./mark/mark");
var model_1 = require("./model");
var init_2 = require("./scale/init");
var parse_3 = require("./scale/parse");
var selection_1 = require("./selection/selection");
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
        _this.markDef = init_1.initMarkDef(spec.mark, encoding, _this.scales, config);
        _this.encoding = init_1.initEncoding(mark, encoding, _this.stack, config);
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
                var scale = scales[channel] = init_2.default(channel, encoding[channel], config, mark, channel === channel_1.X ? topLevelWidth : channel === channel_1.Y ? topLevelHeight : undefined, xyRangeSteps // for determine point / bar size
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
                    _axis[channel] = tslib_1.__assign({}, axisSpec);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQWlIO0FBQ2pILG9DQUE0RDtBQUM1RCxnQ0FBd0M7QUFDeEMsd0NBQTJEO0FBQzNELHdDQUEwQyxDQUFDLGVBQWU7QUFDMUQsd0NBQXdFO0FBRXhFLGdDQUF3RjtBQUN4RixrQ0FBK0Q7QUFFL0QsZ0NBQTJEO0FBSTNELGtDQUFnRDtBQUNoRCxzQ0FBZ0Q7QUFDaEQsbUNBQXFDO0FBQ3JDLG9DQUF3RDtBQUN4RCxtQ0FBeUQ7QUFDekQsd0NBQW9EO0FBQ3BELG9DQUFzRDtBQUN0RCxvQ0FBc0M7QUFDdEMsaUNBQThCO0FBQzlCLHFDQUFxQztBQUNyQyx1Q0FBZ0Q7QUFDaEQsbURBQXNLO0FBRXRLOztHQUVHO0FBQ0g7SUFBK0IscUNBQUs7SUEwQmxDLG1CQUFZLElBQWMsRUFBRSxNQUFhLEVBQUUsZUFBdUI7UUFBbEUsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxTQXFDckM7UUE5Q2tCLGVBQVMsR0FBdUIsRUFBRSxDQUFDO1FBQ25DLFlBQU0sR0FBZ0IsRUFBRSxDQUFDO1FBQ3pCLFVBQUksR0FBZSxFQUFFLENBQUM7UUFDdEIsYUFBTyxHQUFpQixFQUFFLENBQUM7UUFHdkMsY0FBUSxHQUFZLEVBQUUsQ0FBQztRQUs1QixvRUFBb0U7UUFFcEUsc0VBQXNFO1FBQ3RFLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLO1lBQ3pELE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsaUNBQWlDO1FBQ3pFLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNO1lBQzVELE1BQU0sR0FBRyxNQUFNLENBQUMs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