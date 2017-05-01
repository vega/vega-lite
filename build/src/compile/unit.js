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
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var index_1 = require("./layout/index");
var parse_3 = require("./legend/parse");
var init_1 = require("./mark/init");
var mark_2 = require("./mark/mark");
var model_1 = require("./model");
var repeat_1 = require("./repeat");
var init_2 = require("./scale/init");
var parse_4 = require("./scale/parse");
var selection_1 = require("./selection/selection");
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
var UnitModel = (function (_super) {
    tslib_1.__extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName, parentUnitSize, repeater, config) {
        if (parentUnitSize === void 0) { parentUnitSize = {}; }
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.selection = {};
        _this.children = [];
        // FIXME(#2041): copy config.facet.cell to config.cell -- this seems incorrect and should be rewritten
        _this.initFacetCellConfig();
        // use top-level width / height or ancestor's width / height
        var providedWidth = spec.width || parentUnitSize.width;
        var providedHeight = spec.height || parentUnitSize.height;
        var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = _this.encoding = encoding_1.normalizeEncoding(repeat_1.replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark);
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
    UnitModel.prototype.scale = function (channel) {
        return this.scales[channel];
    };
    UnitModel.prototype.hasDiscreteDomain = function (channel) {
        var scale = this.scale(channel);
        return scale && scale_1.hasDiscreteDomain(scale.type);
    };
    UnitModel.prototype.sort = function (channel) {
        return (this.getMapping()[channel] || {}).sort;
    };
    UnitModel.prototype.axis = function (channel) {
        return this.axes[channel];
    };
    UnitModel.prototype.legend = function (channel) {
        return this.legends[channel];
    };
    UnitModel.prototype.initFacetCellConfig = function () {
        var config = this.config;
        var ancestor = this.parent;
        var hasFacetAncestor = false;
        while (ancestor !== null) {
            if (ancestor instanceof facet_1.FacetModel) {
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
    UnitModel.prototype.parseScale = function () {
        this.component.scales = parse_4.default(this);
    };
    UnitModel.prototype.parseMark = function () {
        this.component.mark = mark_2.parseMark(this);
    };
    UnitModel.prototype.parseAxisAndHeader = function () {
        this.component.axes = parse_1.parseAxisComponent(this, [channel_1.X, channel_1.Y]);
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
    UnitModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return selection_1.assembleTopLevelSignals(this, signals);
    };
    UnitModel.prototype.assembleSelectionSignals = function () {
        return selection_1.assembleUnitSelectionSignals(this, []);
    };
    UnitModel.prototype.assembleSelectionData = function (data) {
        return selection_1.assembleUnitSelectionData(this, data);
    };
    UnitModel.prototype.assembleLayout = function () {
        return null;
    };
    UnitModel.prototype.assembleLayoutSignals = function () {
        return index_1.assembleLayoutUnitSignals(this);
    };
    UnitModel.prototype.assembleMarks = function () {
        var marks = this.component.mark || [];
        // If this unit is part of a layer, selections should augment
        // all in concert rather than each unit individually. This
        // ensures correct interleaving of clipping and brushed marks.
        if (!this.parent || !(this.parent instanceof layer_1.LayerModel)) {
            marks = selection_1.assembleUnitSelectionMarks(this, marks);
        }
        return marks.map(this.correctDataNames);
    };
    UnitModel.prototype.assembleParentGroupProperties = function () {
        return tslib_1.__assign({ width: this.getSizeSignalRef('width'), height: this.getSizeSignalRef('height') }, common_1.applyConfig({}, this.config.cell, mark_1.FILL_STROKE_CONFIG.concat(['clip'])));
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
    return UnitModel;
}(model_1.ModelWithField));
exports.UnitModel = UnitModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQWdIO0FBRWhILHdDQUF3RDtBQUN4RCx3Q0FBMEMsQ0FBQyxlQUFlO0FBQzFELHdDQUF3RTtBQUV4RSxnQ0FBd0Y7QUFDeEYsa0NBQWtEO0FBSWxELGtDQUFnRDtBQUNoRCxnQ0FBc0Q7QUFFdEQsc0NBQWdEO0FBQ2hELG1DQUFxQztBQUNyQyw0Q0FBNkM7QUFDN0Msc0NBQXVDO0FBQ3ZDLGlDQUFtQztBQUNuQyxpQ0FBbUM7QUFDbkMsd0NBQXlEO0FBQ3pELHdDQUFvRDtBQUNwRCxvQ0FBc0Q7QUFDdEQsb0NBQXNDO0FBQ3RDLGlDQUE4QztBQUM5QyxtQ0FBa0U7QUFDbEUscUNBQXFDO0FBQ3JDLHVDQUFnRDtBQUNoRCxtREFBdUs7QUFFdks7O0dBRUc7QUFDSDtJQUErQixxQ0FBYztJQTZCM0MsbUJBQVksSUFBYyxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUNoRSxjQUE2QixFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUF0RSwrQkFBQSxFQUFBLG1CQUE2QjtRQUQvQixZQUVFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxTQWdDN0M7UUE3Q1MsWUFBTSxHQUFnQixFQUFFLENBQUM7UUFJekIsVUFBSSxHQUFlLEVBQUUsQ0FBQztRQUV0QixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQUVyQixlQUFTLEdBQXVCLEVBQUUsQ0FBQztRQUM1QyxjQUFRLEdBQVksRUFBRSxDQUFDO1FBTTVCLHNHQUFzRztRQUN0RyxLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUUzQiw0REFBNEQ7UUFDNUQsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3pELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFN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