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
    function UnitModel(spec, parent, parentGivenName, parentGivenSize, repeater, config, fit) {
        if (parentGivenSize === void 0) { parentGivenSize = {}; }
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, undefined) || this;
        _this.fit = fit;
        _this.type = 'unit';
        _this.specifiedScales = {};
        _this.specifiedAxes = {};
        _this.specifiedLegends = {};
        _this.specifiedProjection = {};
        _this.selection = {};
        _this.children = [];
        _this.initSize(tslib_1.__assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {})));
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
                    _axis[channel] = tslib_1.__assign({}, axisSpec);
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
    Object.defineProperty(UnitModel.prototype, "mark", {
        get: function () {
            return this.markDef.type;
        },
        enumerable: true,
        configurable: true
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQXFIO0FBRXJILHdDQUEwQztBQUMxQyx3Q0FBd0Q7QUFDeEQsd0NBQWtHO0FBRWxHLGdDQUFpRDtBQU1qRCxrQ0FBZ0Q7QUFDaEQsZ0NBQXdDO0FBR3hDLHNDQUEyQztBQUMzQyxzQ0FBdUM7QUFDdkMsa0RBQTREO0FBQzVELDRDQUF1RDtBQUV2RCxvQ0FBNkM7QUFDN0Msb0NBQTJDO0FBQzNDLGlDQUE0RDtBQUM1RCx1Q0FBb0U7QUFFcEUsbURBTStCO0FBRy9COztHQUVHO0FBQ0g7SUFBK0IscUNBQWM7SUFrQjNDLG1CQUFZLElBQXdCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQzFFLGVBQXNDLEVBQUUsUUFBdUIsRUFBRSxNQUFjLEVBQVMsR0FBWTtRQUFwRyxnQ0FBQSxFQUFBLG9CQUFzQztRQUR4QyxZQUdFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFNBc0JsRTtRQXhCeUYsU0FBRyxHQUFILEdBQUcsQ0FBUztRQWxCdEYsVUFBSSxHQUFXLE1BQU0sQ0FBQztRQUl0QixxQkFBZSxHQUFlLEVBQUUsQ0FBQztRQUl2QyxtQkFBYSxHQUFjLEVBQUUsQ0FBQztRQUU5QixzQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXRDLHlCQUFtQixHQUFlLEVBQUUsQ0FBQztRQUU1QixlQUFTLEdBQXVCLEVBQUUsQ0FBQztRQUM1QyxjQUFRLEdBQVksRUFBRSxDQUFDO1FBTTVCLEtBQUksQ0FBQyxRQUFRLHNCQUNSLGVBQWUsRUFDZixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3ZDLENB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TlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBTQ0FMRV9DSEFOTkVMUywgU2NhbGVDaGFubmVsLCBTaW5nbGVEZWZDaGFubmVsLCBYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgdmxFbmNvZGluZyBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0VuY29kaW5nLCBub3JtYWxpemVFbmNvZGluZ30gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBGaWVsZERlZiwgZ2V0RmllbGREZWYsIGhhc0NvbmRpdGlvbmFsRmllbGREZWYsIGlzRmllbGREZWZ9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuLi9sZWdlbmQnO1xuaW1wb3J0IHtpc01hcmtEZWYsIE1hcmssIE1hcmtEZWZ9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtQcm9qZWN0aW9ufSBmcm9tICcuLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7RG9tYWluLCBTY2FsZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtTZWxlY3Rpb25EZWZ9IGZyb20gJy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuLi9zb3J0JztcbmltcG9ydCB7TGF5b3V0U2l6ZU1peGlucywgTm9ybWFsaXplZFVuaXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7c3RhY2ssIFN0YWNrUHJvcGVydGllc30gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGEsIFZnRW5jb2RlRW50cnksIFZnTGF5b3V0LCBWZ1NpZ25hbH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzSW5kZXh9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVVuaXRBeGlzfSBmcm9tICcuL2F4aXMvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZURhdGF9IGZyb20gJy4vZGF0YS9wYXJzZSc7XG5pbXBvcnQge2Fzc2VtYmxlTGF5b3V0U2lnbmFsc30gZnJvbSAnLi9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCB7cGFyc2VVbml0TGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7TGVnZW5kSW5kZXh9IGZyb20gJy4vbGVnZW5kL2NvbXBvbmVudCc7XG5pbXBvcnQge25vcm1hbGl6ZU1hcmtEZWZ9IGZyb20gJy4vbWFyay9pbml0JztcbmltcG9ydCB7cGFyc2VNYXJrR3JvdXB9IGZyb20gJy4vbWFyay9tYXJrJztcbmltcG9ydCB7aXNMYXllck1vZGVsLCBNb2RlbCwgTW9kZWxXaXRoRmllbGR9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlLCByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nfSBmcm9tICcuL3JlcGVhdGVyJztcbmltcG9ydCB7U2NhbGVJbmRleH0gZnJvbSAnLi9zY2FsZS9jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHMsXG4gIGFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEsXG4gIGFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzLFxuICBhc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzLFxuICBwYXJzZVVuaXRTZWxlY3Rpb24sXG59IGZyb20gJy4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBtb2RlbCBvZiBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbiBmb3IgdGhlIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgVW5pdE1vZGVsIGV4dGVuZHMgTW9kZWxXaXRoRmllbGQge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ3VuaXQnID0gJ3VuaXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgbWFya0RlZjogTWFya0RlZjtcbiAgcHVibGljIHJlYWRvbmx5IGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+O1xuXG4gIHB1YmxpYyByZWFkb25seSBzcGVjaWZpZWRTY2FsZXM6IFNjYWxlSW5kZXggPSB7fTtcblxuICBwdWJsaWMgcmVhZG9ubHkgc3RhY2s6IFN0YWNrUHJvcGVydGllcztcblxuICBwcm90ZWN0ZWQgc3BlY2lmaWVkQXhlczogQXhpc0luZGV4ID0ge307XG5cbiAgcHJvdGVjdGVkIHNwZWNpZmllZExlZ2VuZHM6IExlZ2VuZEluZGV4ID0ge307XG5cbiAgcHVibGljIHNwZWNpZmllZFByb2plY3Rpb246IFByb2plY3Rpb24gPSB7fTtcblxuICBwdWJsaWMgcmVhZG9ubHkgc2VsZWN0aW9uOiBEaWN0PFNlbGVjdGlvbkRlZj4gPSB7fTtcbiAgcHVibGljIGNoaWxkcmVuOiBNb2RlbFtdID0gW107XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZyxcbiAgICBwYXJlbnRHaXZlblNpemU6IExheW91dFNpemVNaXhpbnMgPSB7fSwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnLCBwdWJsaWMgZml0OiBib29sZWFuKSB7XG5cbiAgICBzdXBlcihzcGVjLCBwYXJlbnQsIHBhcmVudEdpdmVuTmFtZSwgY29uZmlnLCByZXBlYXRlciwgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmluaXRTaXplKHtcbiAgICAgIC4uLnBhcmVudEdpdmVuU2l6ZSxcbiAgICAgIC4uLihzcGVjLndpZHRoID8ge3dpZHRoOiBzcGVjLndpZHRofSA6IHt9KSxcbiAgICAgIC4uLihzcGVjLmhlaWdodCA/IHtoZWlnaHQ6IHNwZWMuaGVpZ2h0fSA6IHt9KVxuICAgIH0pO1xuICAgIGNvbnN0IG1hcmsgPSBpc01hcmtEZWYoc3BlYy5tYXJrKSA/IHNwZWMubWFyay50eXBlIDogc3BlYy5tYXJrO1xuXG4gICAgY29uc3QgZW5jb2RpbmcgPSB0aGlzLmVuY29kaW5nID0gbm9ybWFsaXplRW5jb2RpbmcocmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyhzcGVjLmVuY29kaW5nIHx8IHt9LCByZXBlYXRlciksIG1hcmspO1xuXG4gICAgdGhpcy5tYXJrRGVmID0gbm9ybWFsaXplTWFya0RlZihzcGVjLm1hcmssIGVuY29kaW5nLCBjb25maWcpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0YWNrIHByb3BlcnRpZXNcbiAgICB0aGlzLnN0YWNrID0gc3RhY2sobWFyaywgZW5jb2RpbmcsIHRoaXMuY29uZmlnLnN0YWNrKTtcbiAgICB0aGlzLnNwZWNpZmllZFNjYWxlcyA9IHRoaXMuaW5pdFNjYWxlcyhtYXJrLCBlbmNvZGluZyk7XG5cbiAgICB0aGlzLnNwZWNpZmllZEF4ZXMgPSB0aGlzLmluaXRBeGVzKGVuY29kaW5nKTtcbiAgICB0aGlzLnNwZWNpZmllZExlZ2VuZHMgPSB0aGlzLmluaXRMZWdlbmQoZW5jb2RpbmcpO1xuICAgIHRoaXMuc3BlY2lmaWVkUHJvamVjdGlvbiA9IHNwZWMucHJvamVjdGlvbjtcblxuICAgIC8vIFNlbGVjdGlvbnMgd2lsbCBiZSBpbml0aWFsaXplZCB1cG9uIHBhcnNlLlxuICAgIHRoaXMuc2VsZWN0aW9uID0gc3BlYy5zZWxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNwZWNpZmllZCBWZWdhLWxpdGUgc2NhbGUgZG9tYWluIGZvciBhIHBhcnRpY3VsYXIgY2hhbm5lbFxuICAgKiBAcGFyYW0gY2hhbm5lbFxuICAgKi9cbiAgcHVibGljIHNjYWxlRG9tYWluKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IERvbWFpbiB7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXTtcbiAgICByZXR1cm4gc2NhbGUgPyBzY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc29ydChjaGFubmVsOiBDaGFubmVsKTogc3RyaW5nW10gfCBTb3J0RmllbGQ8c3RyaW5nPiB8IFNvcnRPcmRlciB7XG4gICAgcmV0dXJuICh0aGlzLmdldE1hcHBpbmcoKVtjaGFubmVsXSB8fCB7fSkuc29ydDtcbiAgfVxuXG4gIHB1YmxpYyBheGlzKGNoYW5uZWw6IENoYW5uZWwpOiBBeGlzIHtcbiAgICByZXR1cm4gdGhpcy5zcGVjaWZpZWRBeGVzW2NoYW5uZWxdO1xuICB9XG5cbiAgcHVibGljIGxlZ2VuZChjaGFubmVsOiBDaGFubmVsKTogTGVnZW5kIHtcbiAgICByZXR1cm4gdGhpcy5zcGVjaWZpZWRMZWdlbmRzW2NoYW5uZWxdO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0U2NhbGVzKG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogU2NhbGVJbmRleCB7XG4gICAgcmV0dXJuIFNDQUxFX0NIQU5ORUxTLnJlZHVjZSgoc2NhbGVzLCBjaGFubmVsKSA9PiB7XG4gICAgICBsZXQgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG4gICAgICBsZXQgc3BlY2lmaWVkU2NhbGU6IFNjYWxlO1xuXG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZjtcbiAgICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLnNjYWxlO1xuICAgICAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZi5jb25kaXRpb247XG4gICAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5jb25kaXRpb25bJ3NjYWxlJ107XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd4Jykge1xuICAgICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLngyKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3knKSB7XG4gICAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueTIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgc2NhbGVzW2NoYW5uZWxdID0gc3BlY2lmaWVkU2NhbGUgfHwge307XG4gICAgICB9XG4gICAgICByZXR1cm4gc2NhbGVzO1xuICAgIH0sIHt9IGFzIFNjYWxlSW5kZXgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0QXhlcyhlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IEF4aXNJbmRleCB7XG4gICAgcmV0dXJuIFtYLCBZXS5yZWR1Y2UoZnVuY3Rpb24oX2F4aXMsIGNoYW5uZWwpIHtcbiAgICAgIC8vIFBvc2l0aW9uIEF4aXNcblxuICAgICAgLy8gVE9ETzogaGFuZGxlIENvbmRpdGlvbkZpZWxkRGVmXG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSB8fFxuICAgICAgICAgIChjaGFubmVsID09PSBYICYmIGlzRmllbGREZWYoZW5jb2RpbmcueDIpKSB8fFxuICAgICAgICAgIChjaGFubmVsID09PSBZICYmIGlzRmllbGREZWYoZW5jb2RpbmcueTIpKSkge1xuXG4gICAgICAgIGNvbnN0IGF4aXNTcGVjID0gaXNGaWVsZERlZihjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYuYXhpcyA6IG51bGw7XG5cbiAgICAgICAgLy8gV2Ugbm8gbG9uZ2VyIHN1cHBvcnQgZmFsc2UgaW4gdGhlIHNjaGVtYSwgYnV0IHdlIGtlZXAgZmFsc2UgaGVyZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGF4aXNTcGVjICE9PSBudWxsICYmIGF4aXNTcGVjICE9PSBmYWxzZSkge1xuICAgICAgICAgIF9heGlzW2NoYW5uZWxdID0ge1xuICAgICAgICAgICAgLi4uYXhpc1NwZWNcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX2F4aXM7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TGVnZW5kKGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogTGVnZW5kSW5kZXgge1xuICAgIHJldHVybiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoZnVuY3Rpb24oX2xlZ2VuZCwgY2hhbm5lbCkge1xuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoYW5uZWxEZWYpIHtcbiAgICAgICAgY29uc3QgbGVnZW5kID0gaXNGaWVsZERlZihjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYubGVnZW5kIDpcbiAgICAgICAgICAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkgPyBjaGFubmVsRGVmLmNvbmRpdGlvblsnbGVnZW5kJ10gOiBudWxsO1xuXG4gICAgICAgIGlmIChsZWdlbmQgIT09IG51bGwgJiYgbGVnZW5kICE9PSBmYWxzZSkge1xuICAgICAgICAgIF9sZWdlbmRbY2hhbm5lbF0gPSB7Li4ubGVnZW5kfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2xlZ2VuZDtcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VEYXRhKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmRhdGEgPSBwYXJzZURhdGEodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlVW5pdExheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5jb21wb25lbnQuc2VsZWN0aW9uID0gcGFyc2VVbml0U2VsZWN0aW9uKHRoaXMsIHRoaXMuc2VsZWN0aW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZU1hcmtHcm91cCgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5tYXJrID0gcGFyc2VNYXJrR3JvdXAodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmF4ZXMgPSBwYXJzZVVuaXRBeGlzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVG9wTGV2ZWxTaWduYWxzKHRoaXMsIHNpZ25hbHMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyh0aGlzLCBbXSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVVuaXRTZWxlY3Rpb25EYXRhKHRoaXMsIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlTGF5b3V0U2lnbmFscyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZU1hcmtzKCkge1xuICAgIGxldCBtYXJrcyA9IHRoaXMuY29tcG9uZW50Lm1hcmsgfHwgW107XG5cbiAgICAvLyBJZiB0aGlzIHVuaXQgaXMgcGFydCBvZiBhIGxheWVyLCBzZWxlY3Rpb25zIHNob3VsZCBhdWdtZW50XG4gICAgLy8gYWxsIGluIGNvbmNlcnQgcmF0aGVyIHRoYW4gZWFjaCB1bml0IGluZGl2aWR1YWxseS4gVGhpc1xuICAgIC8vIGVuc3VyZXMgY29ycmVjdCBpbnRlcmxlYXZpbmcgb2YgY2xpcHBpbmcgYW5kIGJydXNoZWQgbWFya3MuXG4gICAgaWYgKCF0aGlzLnBhcmVudCB8fCAhaXNMYXllck1vZGVsKHRoaXMucGFyZW50KSkge1xuICAgICAgbWFya3MgPSBhc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyh0aGlzLCBtYXJrcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcmtzLm1hcCh0aGlzLmNvcnJlY3REYXRhTmFtZXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2l6ZSgpOiBWZ0VuY29kZUVudHJ5IHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKSxcbiAgICAgIGhlaWdodDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKVxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TWFwcGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbmNvZGluZztcbiAgfVxuXG4gIHB1YmxpYyB0b1NwZWMoZXhjbHVkZUNvbmZpZz86IGFueSwgZXhjbHVkZURhdGE/OiBhbnkpIHtcbiAgICBjb25zdCBlbmNvZGluZyA9IGR1cGxpY2F0ZSh0aGlzLmVuY29kaW5nKTtcbiAgICBsZXQgc3BlYzogYW55O1xuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcms6IHRoaXMubWFya0RlZixcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY29uZmlnID0gZHVwbGljYXRlKHRoaXMuY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVEYXRhKSB7XG4gICAgICBzcGVjLmRhdGEgPSBkdXBsaWNhdGUodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICByZXR1cm4gc3BlYztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbWFyaygpOiBNYXJrIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrRGVmLnR5cGU7XG4gIH1cblxuICBwdWJsaWMgY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5jaGFubmVsSGFzRmllbGQodGhpcy5lbmNvZGluZywgY2hhbm5lbCk7XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIGNvbnN0IGNoYW5uZWxEZWYgPSB0aGlzLmVuY29kaW5nW2NoYW5uZWxdIGFzIENoYW5uZWxEZWY8c3RyaW5nPjtcbiAgICByZXR1cm4gZ2V0RmllbGREZWYoY2hhbm5lbERlZik7XG4gIH1cbn1cbiJdfQ==