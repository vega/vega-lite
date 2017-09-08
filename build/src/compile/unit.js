"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var vlEncoding = require("../encoding");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var stack_1 = require("../stack");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var parse_2 = require("./data/parse");
var assemble_1 = require("./layoutsize/assemble");
var parse_3 = require("./layoutsize/parse");
var init_1 = require("./mark/init");
var mark_2 = require("./mark/mark");
var model_1 = require("./model");
var repeater_1 = require("./repeater");
var selection_1 = require("./selection/selection");
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
var UnitModel = /** @class */ (function (_super) {
    tslib_1.__extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName, parentGivenSize, repeater, config) {
        if (parentGivenSize === void 0) { parentGivenSize = {}; }
        var _this = _super.call(this, spec, parent, parentGivenName, config, undefined) || this;
        _this.type = 'unit';
        _this.specifiedScales = {};
        _this.specifiedAxes = {};
        _this.specifiedLegends = {};
        _this.selection = {};
        _this.children = [];
        _this.initSize(tslib_1.__assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {})));
        _this.markDef = mark_1.isMarkDef(spec.mark) ? tslib_1.__assign({}, spec.mark) : { type: spec.mark };
        var mark = _this.markDef.type;
        var encoding = _this.encoding = encoding_1.normalizeEncoding(repeater_1.replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark);
        // calculate stack properties
        _this.stack = stack_1.stack(mark, encoding, _this.config.stack);
        _this.specifiedScales = _this.initScales(mark, encoding);
        // FIXME: this one seems out of place!
        _this.encoding = init_1.initEncoding(_this.markDef, encoding, _this.stack, _this.config);
        _this.specifiedAxes = _this.initAxes(encoding);
        _this.specifiedLegends = _this.initLegend(encoding);
        // Selections will be initialized upon parse.
        _this.selection = spec.selection;
        return _this;
    }
    /**
     * Return specified Vega-lite scale domain for a particular channel
     * @param channel
     */
    UnitModel.prototype.scaleDomain = function (channel) {
        var scale = this.specifiedScales[channel];
        return scale ? scale.domain : undefined;
    };
    UnitModel.prototype.sort = function (channel) {
        return (this.getMapping()[channel] || {}).sort;
    };
    UnitModel.prototype.axis = function (channel) {
        return this.specifiedAxes[channel];
    };
    UnitModel.prototype.legend = function (channel) {
        return this.specifiedLegends[channel];
    };
    UnitModel.prototype.initScales = function (mark, encoding) {
        return channel_1.SCALE_CHANNELS.reduce(function (scales, channel) {
            var fieldDef;
            var specifiedScale;
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef)) {
                fieldDef = channelDef;
                specifiedScale = channelDef.scale;
            }
            else if (fielddef_1.isConditionalDef(channelDef) && fielddef_1.isFieldDef(channelDef.condition)) {
                fieldDef = channelDef.condition;
                specifiedScale = channelDef.condition.scale;
            }
            else if (channel === 'x') {
                fieldDef = fielddef_1.getFieldDef(encoding.x2);
            }
            else if (channel === 'y') {
                fieldDef = fielddef_1.getFieldDef(encoding.y2);
            }
            if (fieldDef) {
                scales[channel] = specifiedScale || {};
            }
            return scales;
        }, {});
    };
    UnitModel.prototype.initAxes = function (encoding) {
        return [channel_1.X, channel_1.Y].reduce(function (_axis, channel) {
            // Position Axis
            // TODO: handle ConditionFieldDef
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
            if (channelDef) {
                var legend = fielddef_1.isFieldDef(channelDef) ? channelDef.legend :
                    (channelDef.condition && fielddef_1.isFieldDef(channelDef.condition)) ? channelDef.condition.legend : null;
                if (legend !== null && legend !== false) {
                    _legend[channel] = tslib_1.__assign({}, legend);
                }
            }
            return _legend;
        }, {});
    };
    UnitModel.prototype.parseData = function () {
        this.component.data = parse_2.parseData(this);
    };
    UnitModel.prototype.parseLayoutSize = function () {
        parse_3.parseUnitLayoutSize(this);
    };
    UnitModel.prototype.parseSelection = function () {
        this.component.selection = selection_1.parseUnitSelection(this, this.selection);
    };
    UnitModel.prototype.parseMarkGroup = function () {
        this.component.mark = mark_2.parseMarkGroup(this);
    };
    UnitModel.prototype.parseAxisAndHeader = function () {
        this.component.axes = parse_1.parseUnitAxis(this);
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
        return assemble_1.assembleLayoutSignals(this);
    };
    UnitModel.prototype.assembleMarks = function () {
        var marks = this.component.mark || [];
        // If this unit is part of a layer, selections should augment
        // all in concert rather than each unit individually. This
        // ensures correct interleaving of clipping and brushed marks.
        if (!this.parent || !model_1.isLayerModel(this.parent)) {
            marks = selection_1.assembleUnitSelectionMarks(this, marks);
        }
        return marks.map(this.correctDataNames);
    };
    UnitModel.prototype.assembleLayoutSize = function () {
        return {
            width: this.getSizeSignalRef('width'),
            height: this.getSizeSignalRef('height')
        };
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
        var channelDef = this.encoding[channel];
        return fielddef_1.getFieldDef(channelDef);
    };
    return UnitModel;
}(model_1.ModelWithField));
exports.UnitModel = UnitModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQW9IO0FBRXBILHdDQUEwQztBQUMxQyx3Q0FBd0Q7QUFDeEQsd0NBQTRGO0FBRTVGLGdDQUFpRDtBQUtqRCxrQ0FBZ0Q7QUFDaEQsZ0NBQXdDO0FBR3hDLHNDQUEyQztBQUMzQyxzQ0FBdUM7QUFDdkMsa0RBQTREO0FBQzVELDRDQUF1RDtBQUV2RCxvQ0FBeUM7QUFDekMsb0NBQTJDO0FBQzNDLGlDQUE0RDtBQUM1RCx1Q0FBb0U7QUFFcEUsbURBTStCO0FBRy9COztHQUVHO0FBQ0g7SUFBK0IscUNBQWM7SUFnQjNDLG1CQUFZLElBQWMsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDaEUsZUFBc0MsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBL0UsZ0NBQUEsRUFBQSxvQkFBc0M7UUFEeEMsWUFHRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFNBdUJ4RDtRQXpDZSxVQUFJLEdBQVcsTUFBTSxDQUFDO1FBSXRCLHFCQUFlLEdBQWUsRUFBRSxDQUFDO1FBSXZDLG1CQUFhLEdBQWMsRUFBRSxDQUFDO1FBRTlCLHNCQUFnQixHQUFnQixFQUFFLENBQUM7UUFFN0IsZUFBUyxHQUF1QixFQUFFLENBQUM7UUFDNUMsY0FBUSxHQUFZLEVBQUUsQ0FBQztRQU01QixLQUFJLENBQUMsUUFBUSxzQkFDUixlQUFlLEVBQ2YsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFDdkMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFDN0MsQ0FBQztRQUVILEtBQUksQ0FB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