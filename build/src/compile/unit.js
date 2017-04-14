"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var vlEncoding = require("../encoding"); // TODO: remove
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var scale_1 = require("../scale");
var stack_1 = require("../stack");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_2 = require("./data/parse");
var layout_1 = require("./layout");
var parse_3 = require("./legend/parse");
var init_1 = require("./mark/init");
var mark_2 = require("./mark/mark");
var model_1 = require("./model");
var init_2 = require("./scale/init");
var parse_4 = require("./scale/parse");
var selection_1 = require("./selection/selection");
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
var UnitModel = (function (_super) {
    tslib_1.__extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName, cfg) {
        var _this = _super.call(this, spec, parent, parentGivenName, cfg) || this;
        _this.selection = {};
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.children = [];
        // FIXME(#2041): copy config.facet.cell to config.cell -- this seems incorrect and should be rewritten
        _this.initFacetCellConfig();
        // use top-level width / height or parent's top-level width / height
        // FIXME: once facet supports width/height, this is no longer correct!
        var providedWidth = spec.width !== undefined ? spec.width :
            parent ? parent['width'] : undefined; // only exists if parent is layer
        var providedHeight = spec.height !== undefined ? spec.height :
            parent ? parent['height'] : undefined; // only exists if parent is layer
        var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = _this.encoding = encoding_1.normalizeEncoding(spec.encoding || {}, mark);
        // calculate stack properties
        _this.stack = stack_1.stack(mark, encoding, _this.config.stack);
        _this.scales = _this.initScales(mark, encoding, providedWidth, providedHeight);
        _this.markDef = init_1.initMarkDef(spec.mark, encoding, _this.scales, _this.config);
        _this.encoding = init_1.initEncoding(mark, encoding, _this.stack, _this.config);
        _this.axes = _this.initAxes(encoding);
        _this.legends = _this.initLegend(encoding);
        // Selections will be initialized upon parse.
        _this.selection = spec.selection;
        // width / height
        var _a = _this.initSize(mark, _this.scales, providedWidth, providedHeight), _b = _a.width, width = _b === void 0 ? _this.width : _b, _c = _a.height, height = _c === void 0 ? _this.height : _c;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    UnitModel.prototype.initFacetCellConfig = function () {
        var config = this.config;
        var ancestor = this.parent;
        var hasFacetAncestor = false;
        while (ancestor !== null) {
            if (ancestor.isFacet()) {
                hasFacetAncestor = true;
                break;
            }
            ancestor = ancestor.parent;
        }
        if (hasFacetAncestor) {
            config.cell = util_1.extend({}, config.cell, config.facet.cell);
        }
    };
    UnitModel.prototype.initScales = function (mark, encoding, topLevelWidth, topLevelHeight) {
        var _this = this;
        var xyRangeSteps = [];
        return channel_1.UNIT_SCALE_CHANNELS.reduce(function (scales, channel) {
            if (vlEncoding.channelHasField(encoding, channel) ||
                (channel === channel_1.X && vlEncoding.channelHasField(encoding, channel_1.X2)) ||
                (channel === channel_1.Y && vlEncoding.channelHasField(encoding, channel_1.Y2))) {
                var scale = scales[channel] = init_2.default(channel, encoding[channel], _this.config, mark, channel === channel_1.X ? topLevelWidth : channel === channel_1.Y ? topLevelHeight : undefined, xyRangeSteps // for determine point / bar size
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
    UnitModel.prototype.initSize = function (mark, scale, width, height) {
        var cellConfig = this.config.cell;
        var scaleConfig = this.config.scale;
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
    UnitModel.prototype.initAxes = function (encoding) {
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
    UnitModel.prototype.initLegend = function (encoding) {
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
        this.component.data = parse_2.parseData(this);
    };
    UnitModel.prototype.parseSelection = function () {
        this.component.selection = selection_1.parseUnitSelection(this, this.selection);
    };
    UnitModel.prototype.parseLayoutData = function () {
        this.component.layout = layout_1.parseUnitLayout(this);
    };
    UnitModel.prototype.parseScale = function () {
        this.component.scales = parse_4.default(this);
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
        this.component.legends = parse_3.parseLegendComponent(this);
    };
    UnitModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    UnitModel.prototype.assembleSignals = function (signals) {
        return selection_1.assembleUnitSignals(this, signals);
    };
    UnitModel.prototype.assembleSelectionData = function (data) {
        return selection_1.assembleUnitData(this, data);
    };
    UnitModel.prototype.assembleLayout = function (layoutData) {
        return layout_1.assembleLayout(this, layoutData);
    };
    UnitModel.prototype.assembleMarks = function () {
        var marks = this.component.mark || [];
        marks = selection_1.assembleUnitMarks(this, marks);
        return marks.map(this.correctDataNames);
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
    UnitModel.prototype.isUnit = function () {
        return true;
    };
    return UnitModel;
}(model_1.Model));
exports.UnitModel = UnitModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQWlIO0FBRWpILHdDQUF3RDtBQUN4RCx3Q0FBMEMsQ0FBQyxlQUFlO0FBQzFELHdDQUF3RTtBQUV4RSxnQ0FBd0Y7QUFDeEYsa0NBQWtEO0FBR2xELGtDQUFnRDtBQUNoRCxnQ0FBc0Q7QUFHdEQsc0NBQWdEO0FBQ2hELG1DQUFxQztBQUNyQyw0Q0FBNkM7QUFDN0Msc0NBQXVDO0FBQ3ZDLG1DQUF5RDtBQUN6RCx3Q0FBb0Q7QUFDcEQsb0NBQXNEO0FBQ3RELG9DQUFzQztBQUN0QyxpQ0FBOEI7QUFDOUIscUNBQXFDO0FBQ3JDLHVDQUFnRDtBQUNoRCxtREFBc0s7QUFFdEs7O0dBRUc7QUFDSDtJQUErQixxQ0FBSztJQXlCbEMsbUJBQVksSUFBYyxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLEdBQVc7UUFBL0UsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLENBQUMsU0FvQzFDO1FBN0NrQixlQUFTLEdBQXVCLEVBQUUsQ0FBQztRQUNuQyxZQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUN6QixVQUFJLEdBQWUsRUFBRSxDQUFDO1FBQ3RCLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBR3ZDLGNBQVEsR0FBWSxFQUFFLENBQUM7UUFLNUIsc0dBQXNHO1FBQ3RHLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTNCLG9FQUFvRTtRQUVwRSxzRUFBc0U7UUFDdEUsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFDekQsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxpQ0FBaUM7UUFDekUsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FB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