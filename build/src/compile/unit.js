"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    __extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName, parentGivenSize, repeater, config, fit) {
        if (parentGivenSize === void 0) { parentGivenSize = {}; }
        var _this = _super.call(this, spec, parent, parentGivenName, config, undefined) || this;
        _this.fit = fit;
        _this.type = 'unit';
        _this.specifiedScales = {};
        _this.specifiedAxes = {};
        _this.specifiedLegends = {};
        _this.specifiedProjection = {};
        _this.selection = {};
        _this.children = [];
        _this.initSize(__assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {})));
        var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = _this.encoding = encoding_1.normalizeEncoding(repeater_1.replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark);
        _this.markDef = init_1.normalizeMarkDef(spec.mark, encoding, config);
        // calculate stack properties
        _this.stack = stack_1.stack(mark, encoding, _this.config.stack);
        _this.specifiedScales = _this.initScales(mark, encoding);
        _this.specifiedAxes = _this.initAxes(encoding);
        _this.specifiedLegends = _this.initLegend(encoding);
        _this.specifiedProjection = spec.projection;
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
            else if (fielddef_1.hasConditionalFieldDef(channelDef)) {
                fieldDef = channelDef.condition;
                specifiedScale = channelDef.condition['scale'];
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
                // We no longer support false in the schema, but we keep false here for backward compatibility.
                if (axisSpec !== null && axisSpec !== false) {
                    _axis[channel] = __assign({}, axisSpec);
                }
            }
            return _axis;
        }, {});
    };
    UnitModel.prototype.initLegend = function (encoding) {
        return channel_1.NONPOSITION_SCALE_CHANNELS.reduce(function (_legend, channel) {
            var channelDef = encoding[channel];
            if (channelDef) {
                var legend = fielddef_1.isFieldDef(channelDef) ? channelDef.legend :
                    (fielddef_1.hasConditionalFieldDef(channelDef)) ? channelDef.condition['legend'] : null;
                if (legend !== null && legend !== false) {
                    _legend[channel] = __assign({}, legend);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzQ0FBcUg7QUFFckgsd0NBQTBDO0FBQzFDLHdDQUF3RDtBQUN4RCx3Q0FBa0c7QUFFbEcsZ0NBQWlEO0FBTWpELGtDQUFnRDtBQUNoRCxnQ0FBd0M7QUFHeEMsc0NBQTJDO0FBQzNDLHNDQUF1QztBQUN2QyxrREFBNEQ7QUFDNUQsNENBQXVEO0FBRXZELG9DQUE2QztBQUM3QyxvQ0FBMkM7QUFDM0MsaUNBQTREO0FBQzVELHVDQUFvRTtBQUVwRSxtREFNK0I7QUFHL0I7O0dBRUc7QUFDSDtJQUErQiw2QkFBYztJQWtCM0MsbUJBQVksSUFBd0IsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDMUUsZUFBc0MsRUFBRSxRQUF1QixFQUFFLE1BQWMsRUFBUyxHQUFZO1FBQXBHLGdDQUFBLEVBQUEsb0JBQXNDO1FBRHhDLFlBR0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxTQXNCeEQ7UUF4QnlGLFNBQUcsR0FBSCxHQUFHLENBQVM7UUFsQnRGLFVBQUksR0FBVyxNQUFNLENBQUM7UUFJdEIscUJBQWUsR0FBZSxFQUFFLENBQUM7UUFJdkMsbUJBQWEsR0FBYyxFQUFFLENBQUM7UUFFOUIsc0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV0Qyx5QkFBbUIsR0FBZSxFQUFFLENBQUM7UUFFNUIsZUFBUyxHQUF1QixFQUFFLENBQUM7UUFDNUMsY0FBUSxHQUFZLEVBQUUsQ0FBQztRQU01QixLQUFJLENBQUMsUUFBUSxjQUNSLGVBQWUsRUFDZixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVB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RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLE9BQWdCO1FBQ3JDLE1BQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLDRCQUFRLEdBQWYsVUFBZ0IsT0FBeUI7UUFDdkMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQXVCLENBQUM7UUFDaEUsTUFBTSxDQUFDLHNCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXBPRCxDQUErQixzQkFBYyxHQW9PNUM7QUFwT1ksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXN9IGZyb20gJy4uL2F4aXMnO1xuaW1wb3J0IHtDaGFubmVsLCBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUywgU0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbCwgU2luZ2xlRGVmQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtFbmNvZGluZywgbm9ybWFsaXplRW5jb2Rpbmd9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgRmllbGREZWYsIGdldEZpZWxkRGVmLCBoYXNDb25kaXRpb25hbEZpZWxkRGVmLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi4vbGVnZW5kJztcbmltcG9ydCB7aXNNYXJrRGVmLCBNYXJrLCBNYXJrRGVmfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7UHJvamVjdGlvbn0gZnJvbSAnLi4vcHJvamVjdGlvbic7XG5pbXBvcnQge0RvbWFpbiwgU2NhbGV9IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7U2VsZWN0aW9uRGVmfSBmcm9tICcuLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi4vc29ydCc7XG5pbXBvcnQge0xheW91dFNpemVNaXhpbnMsIE5vcm1hbGl6ZWRVbml0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge3N0YWNrLCBTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7VmdEYXRhLCBWZ0VuY29kZUVudHJ5LCBWZ0xheW91dCwgVmdTaWduYWx9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7QXhpc0luZGV4fSBmcm9tICcuL2F4aXMvY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VVbml0QXhpc30gZnJvbSAnLi9heGlzL3BhcnNlJztcbmltcG9ydCB7cGFyc2VEYXRhfSBmcm9tICcuL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHthc3NlbWJsZUxheW91dFNpZ25hbHN9IGZyb20gJy4vbGF5b3V0c2l6ZS9hc3NlbWJsZSc7XG5pbXBvcnQge3BhcnNlVW5pdExheW91dFNpemV9IGZyb20gJy4vbGF5b3V0c2l6ZS9wYXJzZSc7XG5pbXBvcnQge0xlZ2VuZEluZGV4fSBmcm9tICcuL2xlZ2VuZC9jb21wb25lbnQnO1xuaW1wb3J0IHtub3JtYWxpemVNYXJrRGVmfSBmcm9tICcuL21hcmsvaW5pdCc7XG5pbXBvcnQge3BhcnNlTWFya0dyb3VwfSBmcm9tICcuL21hcmsvbWFyayc7XG5pbXBvcnQge2lzTGF5ZXJNb2RlbCwgTW9kZWwsIE1vZGVsV2l0aEZpZWxkfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZSwgcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZ30gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge1NjYWxlSW5kZXh9IGZyb20gJy4vc2NhbGUvY29tcG9uZW50JztcbmltcG9ydCB7XG4gIGFzc2VtYmxlVG9wTGV2ZWxTaWduYWxzLFxuICBhc3NlbWJsZVVuaXRTZWxlY3Rpb25EYXRhLFxuICBhc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyxcbiAgYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyxcbiAgcGFyc2VVbml0U2VsZWN0aW9uLFxufSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgbW9kZWwgb2YgVmVnYS1MaXRlIHNwZWNpZmljYXRpb24gZm9yIHRoZSBjb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXRNb2RlbCBleHRlbmRzIE1vZGVsV2l0aEZpZWxkIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6ICd1bml0JyA9ICd1bml0JztcbiAgcHVibGljIHJlYWRvbmx5IG1hcmtEZWY6IE1hcmtEZWY7XG4gIHB1YmxpYyByZWFkb25seSBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPjtcblxuICBwdWJsaWMgcmVhZG9ubHkgc3BlY2lmaWVkU2NhbGVzOiBTY2FsZUluZGV4ID0ge307XG5cbiAgcHVibGljIHJlYWRvbmx5IHN0YWNrOiBTdGFja1Byb3BlcnRpZXM7XG5cbiAgcHJvdGVjdGVkIHNwZWNpZmllZEF4ZXM6IEF4aXNJbmRleCA9IHt9O1xuXG4gIHByb3RlY3RlZCBzcGVjaWZpZWRMZWdlbmRzOiBMZWdlbmRJbmRleCA9IHt9O1xuXG4gIHB1YmxpYyBzcGVjaWZpZWRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uID0ge307XG5cbiAgcHVibGljIHJlYWRvbmx5IHNlbGVjdGlvbjogRGljdDxTZWxlY3Rpb25EZWY+ID0ge307XG4gIHB1YmxpYyBjaGlsZHJlbjogTW9kZWxbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsXG4gICAgcGFyZW50R2l2ZW5TaXplOiBMYXlvdXRTaXplTWl4aW5zID0ge30sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZywgcHVibGljIGZpdDogYm9vbGVhbikge1xuXG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmluaXRTaXplKHtcbiAgICAgIC4uLnBhcmVudEdpdmVuU2l6ZSxcbiAgICAgIC4uLihzcGVjLndpZHRoID8ge3dpZHRoOiBzcGVjLndpZHRofSA6IHt9KSxcbiAgICAgIC4uLihzcGVjLmhlaWdodCA/IHtoZWlnaHQ6IHNwZWMuaGVpZ2h0fSA6IHt9KVxuICAgIH0pO1xuICAgIGNvbnN0IG1hcmsgPSBpc01hcmtEZWYoc3BlYy5tYXJrKSA/IHNwZWMubWFyay50eXBlIDogc3BlYy5tYXJrO1xuXG4gICAgY29uc3QgZW5jb2RpbmcgPSB0aGlzLmVuY29kaW5nID0gbm9ybWFsaXplRW5jb2RpbmcocmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyhzcGVjLmVuY29kaW5nIHx8IHt9LCByZXBlYXRlciksIG1hcmspO1xuXG4gICAgdGhpcy5tYXJrRGVmID0gbm9ybWFsaXplTWFya0RlZihzcGVjLm1hcmssIGVuY29kaW5nLCBjb25maWcpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0YWNrIHByb3BlcnRpZXNcbiAgICB0aGlzLnN0YWNrID0gc3RhY2sobWFyaywgZW5jb2RpbmcsIHRoaXMuY29uZmlnLnN0YWNrKTtcbiAgICB0aGlzLnNwZWNpZmllZFNjYWxlcyA9IHRoaXMuaW5pdFNjYWxlcyhtYXJrLCBlbmNvZGluZyk7XG5cbiAgICB0aGlzLnNwZWNpZmllZEF4ZXMgPSB0aGlzLmluaXRBeGVzKGVuY29kaW5nKTtcbiAgICB0aGlzLnNwZWNpZmllZExlZ2VuZHMgPSB0aGlzLmluaXRMZWdlbmQoZW5jb2RpbmcpO1xuICAgIHRoaXMuc3BlY2lmaWVkUHJvamVjdGlvbiA9IHNwZWMucHJvamVjdGlvbjtcblxuICAgIC8vIFNlbGVjdGlvbnMgd2lsbCBiZSBpbml0aWFsaXplZCB1cG9uIHBhcnNlLlxuICAgIHRoaXMuc2VsZWN0aW9uID0gc3BlYy5zZWxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNwZWNpZmllZCBWZWdhLWxpdGUgc2NhbGUgZG9tYWluIGZvciBhIHBhcnRpY3VsYXIgY2hhbm5lbFxuICAgKiBAcGFyYW0gY2hhbm5lbFxuICAgKi9cbiAgcHVibGljIHNjYWxlRG9tYWluKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IERvbWFpbiB7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXTtcbiAgICByZXR1cm4gc2NhbGUgPyBzY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc29ydChjaGFubmVsOiBDaGFubmVsKTogU29ydEZpZWxkPHN0cmluZz4gfCBTb3J0T3JkZXIge1xuICAgIHJldHVybiAodGhpcy5nZXRNYXBwaW5nKClbY2hhbm5lbF0gfHwge30pLnNvcnQ7XG4gIH1cblxuICBwdWJsaWMgYXhpcyhjaGFubmVsOiBDaGFubmVsKTogQXhpcyB7XG4gICAgcmV0dXJuIHRoaXMuc3BlY2lmaWVkQXhlc1tjaGFubmVsXTtcbiAgfVxuXG4gIHB1YmxpYyBsZWdlbmQoY2hhbm5lbDogQ2hhbm5lbCk6IExlZ2VuZCB7XG4gICAgcmV0dXJuIHRoaXMuc3BlY2lmaWVkTGVnZW5kc1tjaGFubmVsXTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFNjYWxlcyhtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IFNjYWxlSW5kZXgge1xuICAgIHJldHVybiBTQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoKHNjYWxlcywgY2hhbm5lbCkgPT4ge1xuICAgICAgbGV0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgICAgbGV0IHNwZWNpZmllZFNjYWxlOiBTY2FsZTtcblxuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWY7XG4gICAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5zY2FsZTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICAgICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuY29uZGl0aW9uWydzY2FsZSddO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneCcpIHtcbiAgICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy54Mik7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5Jykge1xuICAgICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLnkyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIHNjYWxlc1tjaGFubmVsXSA9IHNwZWNpZmllZFNjYWxlIHx8IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNjYWxlcztcbiAgICB9LCB7fSBhcyBTY2FsZUluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdEF4ZXMoZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBBeGlzSW5kZXgge1xuICAgIHJldHVybiBbWCwgWV0ucmVkdWNlKGZ1bmN0aW9uKF9heGlzLCBjaGFubmVsKSB7XG4gICAgICAvLyBQb3NpdGlvbiBBeGlzXG5cbiAgICAgIC8vIFRPRE86IGhhbmRsZSBDb25kaXRpb25GaWVsZERlZlxuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikgfHxcbiAgICAgICAgICAoY2hhbm5lbCA9PT0gWCAmJiBpc0ZpZWxkRGVmKGVuY29kaW5nLngyKSkgfHxcbiAgICAgICAgICAoY2hhbm5lbCA9PT0gWSAmJiBpc0ZpZWxkRGVmKGVuY29kaW5nLnkyKSkpIHtcblxuICAgICAgICBjb25zdCBheGlzU3BlYyA9IGlzRmllbGREZWYoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmLmF4aXMgOiBudWxsO1xuXG4gICAgICAgIC8vIFdlIG5vIGxvbmdlciBzdXBwb3J0IGZhbHNlIGluIHRoZSBzY2hlbWEsIGJ1dCB3ZSBrZWVwIGZhbHNlIGhlcmUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChheGlzU3BlYyAhPT0gbnVsbCAmJiBheGlzU3BlYyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBfYXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgICAgIC4uLmF4aXNTcGVjXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9heGlzO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdExlZ2VuZChlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IExlZ2VuZEluZGV4IHtcbiAgICByZXR1cm4gTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKF9sZWdlbmQsIGNoYW5uZWwpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGFubmVsRGVmKSB7XG4gICAgICAgIGNvbnN0IGxlZ2VuZCA9IGlzRmllbGREZWYoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmLmxlZ2VuZCA6XG4gICAgICAgICAgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpID8gY2hhbm5lbERlZi5jb25kaXRpb25bJ2xlZ2VuZCddIDogbnVsbDtcblxuICAgICAgICBpZiAobGVnZW5kICE9PSBudWxsICYmIGxlZ2VuZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBfbGVnZW5kW2NoYW5uZWxdID0gey4uLmxlZ2VuZH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9sZWdlbmQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZVVuaXRMYXlvdXRTaXplKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHBhcnNlVW5pdFNlbGVjdGlvbih0aGlzLCB0aGlzLnNlbGVjdGlvbik7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgdGhpcy5jb21wb25lbnQubWFyayA9IHBhcnNlTWFya0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5heGVzID0gcGFyc2VVbml0QXhpcyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzOiBhbnlbXSk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVRvcExldmVsU2lnbmFscyh0aGlzLCBzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHModGhpcywgW10pO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YSh0aGlzLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZUxheW91dFNpZ25hbHModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVNYXJrcygpIHtcbiAgICBsZXQgbWFya3MgPSB0aGlzLmNvbXBvbmVudC5tYXJrIHx8IFtdO1xuXG4gICAgLy8gSWYgdGhpcyB1bml0IGlzIHBhcnQgb2YgYSBsYXllciwgc2VsZWN0aW9ucyBzaG91bGQgYXVnbWVudFxuICAgIC8vIGFsbCBpbiBjb25jZXJ0IHJhdGhlciB0aGFuIGVhY2ggdW5pdCBpbmRpdmlkdWFsbHkuIFRoaXNcbiAgICAvLyBlbnN1cmVzIGNvcnJlY3QgaW50ZXJsZWF2aW5nIG9mIGNsaXBwaW5nIGFuZCBicnVzaGVkIG1hcmtzLlxuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIWlzTGF5ZXJNb2RlbCh0aGlzLnBhcmVudCkpIHtcbiAgICAgIG1hcmtzID0gYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3ModGhpcywgbWFya3MpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrcy5tYXAodGhpcy5jb3JyZWN0RGF0YU5hbWVzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpemUoKTogVmdFbmNvZGVFbnRyeSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksXG4gICAgICBoZWlnaHQ6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JylcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1hcHBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2Rpbmc7XG4gIH1cblxuICBwdWJsaWMgdG9TcGVjKGV4Y2x1ZGVDb25maWc/OiBhbnksIGV4Y2x1ZGVEYXRhPzogYW55KSB7XG4gICAgY29uc3QgZW5jb2RpbmcgPSBkdXBsaWNhdGUodGhpcy5lbmNvZGluZyk7XG4gICAgbGV0IHNwZWM6IGFueTtcblxuICAgIHNwZWMgPSB7XG4gICAgICBtYXJrOiB0aGlzLm1hcmtEZWYsXG4gICAgICBlbmNvZGluZzogZW5jb2RpbmdcbiAgICB9O1xuXG4gICAgaWYgKCFleGNsdWRlQ29uZmlnKSB7XG4gICAgICBzcGVjLmNvbmZpZyA9IGR1cGxpY2F0ZSh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWYgKCFleGNsdWRlRGF0YSkge1xuICAgICAgc3BlYy5kYXRhID0gZHVwbGljYXRlKHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGRlZmF1bHRzXG4gICAgcmV0dXJuIHNwZWM7XG4gIH1cblxuICBwdWJsaWMgbWFyaygpOiBNYXJrIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrRGVmLnR5cGU7XG4gIH1cblxuICBwdWJsaWMgY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5jaGFubmVsSGFzRmllbGQodGhpcy5lbmNvZGluZywgY2hhbm5lbCk7XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIGNvbnN0IGNoYW5uZWxEZWYgPSB0aGlzLmVuY29kaW5nW2NoYW5uZWxdIGFzIENoYW5uZWxEZWY8c3RyaW5nPjtcbiAgICByZXR1cm4gZ2V0RmllbGREZWYoY2hhbm5lbERlZik7XG4gIH1cbn1cbiJdfQ==