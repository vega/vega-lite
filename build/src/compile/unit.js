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
                // We no longer support false in the schema, but we keep false here for backward compatability.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzQ0FBcUg7QUFFckgsd0NBQTBDO0FBQzFDLHdDQUF3RDtBQUN4RCx3Q0FBa0c7QUFFbEcsZ0NBQWlEO0FBS2pELGtDQUFnRDtBQUNoRCxnQ0FBd0M7QUFHeEMsc0NBQTJDO0FBQzNDLHNDQUF1QztBQUN2QyxrREFBNEQ7QUFDNUQsNENBQXVEO0FBRXZELG9DQUE2QztBQUM3QyxvQ0FBMkM7QUFDM0MsaUNBQTREO0FBQzVELHVDQUFvRTtBQUVwRSxtREFNK0I7QUFHL0I7O0dBRUc7QUFDSDtJQUErQiw2QkFBYztJQWdCM0MsbUJBQVksSUFBYyxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUNoRSxlQUFzQyxFQUFFLFFBQXVCLEVBQUUsTUFBYyxFQUFTLEdBQVk7UUFBcEcsZ0NBQUEsRUFBQSxvQkFBc0M7UUFEeEMsWUFHRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFNBcUJ4RDtRQXZCeUYsU0FBRyxHQUFILEdBQUcsQ0FBUztRQWhCdEYsVUFBSSxHQUFXLE1BQU0sQ0FBQztRQUl0QixxQkFBZSxHQUFlLEVBQUUsQ0FBQztRQUl2QyxtQkFBYSxHQUFjLEVBQUUsQ0FBQztRQUU5QixzQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRTdCLGVBQVMsR0FBdUIsRUFBRSxDQUFDO1FBQzVDLGNBQVEsR0FBWSxFQUFFLENBQUM7UUFNNUIsS0FBSSxDQUFDLFFBQVEsY0FDUixlQUFlLEVBQ2YsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMs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QUFnQjtRQUNyQyxNQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSw0QkFBUSxHQUFmLFVBQWdCLE9BQXlCO1FBQ3ZDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUF1QixDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxzQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFqT0QsQ0FBK0Isc0JBQWMsR0FpTzVDO0FBak9ZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBeGlzfSBmcm9tICcuLi9heGlzJztcbmltcG9ydCB7Q2hhbm5lbCwgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMsIFNDQUxFX0NIQU5ORUxTLCBTY2FsZUNoYW5uZWwsIFNpbmdsZURlZkNoYW5uZWwsIFgsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7RW5jb2RpbmcsIG5vcm1hbGl6ZUVuY29kaW5nfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0NoYW5uZWxEZWYsIEZpZWxkRGVmLCBnZXRGaWVsZERlZiwgaGFzQ29uZGl0aW9uYWxGaWVsZERlZiwgaXNGaWVsZERlZn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4uL2xlZ2VuZCc7XG5pbXBvcnQge2lzTWFya0RlZiwgTWFyaywgTWFya0RlZn0gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge0RvbWFpbiwgU2NhbGV9IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7U2VsZWN0aW9uRGVmfSBmcm9tICcuLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi4vc29ydCc7XG5pbXBvcnQge0xheW91dFNpemVNaXhpbnMsIFVuaXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7c3RhY2ssIFN0YWNrUHJvcGVydGllc30gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGEsIFZnRW5jb2RlRW50cnksIFZnTGF5b3V0LCBWZ1NpZ25hbH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzSW5kZXh9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVVuaXRBeGlzfSBmcm9tICcuL2F4aXMvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZURhdGF9IGZyb20gJy4vZGF0YS9wYXJzZSc7XG5pbXBvcnQge2Fzc2VtYmxlTGF5b3V0U2lnbmFsc30gZnJvbSAnLi9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCB7cGFyc2VVbml0TGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7TGVnZW5kSW5kZXh9IGZyb20gJy4vbGVnZW5kL2NvbXBvbmVudCc7XG5pbXBvcnQge25vcm1hbGl6ZU1hcmtEZWZ9IGZyb20gJy4vbWFyay9pbml0JztcbmltcG9ydCB7cGFyc2VNYXJrR3JvdXB9IGZyb20gJy4vbWFyay9tYXJrJztcbmltcG9ydCB7aXNMYXllck1vZGVsLCBNb2RlbCwgTW9kZWxXaXRoRmllbGR9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlLCByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nfSBmcm9tICcuL3JlcGVhdGVyJztcbmltcG9ydCB7U2NhbGVJbmRleH0gZnJvbSAnLi9zY2FsZS9jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHMsXG4gIGFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEsXG4gIGFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzLFxuICBhc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzLFxuICBwYXJzZVVuaXRTZWxlY3Rpb24sXG59IGZyb20gJy4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBtb2RlbCBvZiBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbiBmb3IgdGhlIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgVW5pdE1vZGVsIGV4dGVuZHMgTW9kZWxXaXRoRmllbGQge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ3VuaXQnID0gJ3VuaXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgbWFya0RlZjogTWFya0RlZjtcbiAgcHVibGljIHJlYWRvbmx5IGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+O1xuXG4gIHB1YmxpYyByZWFkb25seSBzcGVjaWZpZWRTY2FsZXM6IFNjYWxlSW5kZXggPSB7fTtcblxuICBwdWJsaWMgcmVhZG9ubHkgc3RhY2s6IFN0YWNrUHJvcGVydGllcztcblxuICBwcm90ZWN0ZWQgc3BlY2lmaWVkQXhlczogQXhpc0luZGV4ID0ge307XG5cbiAgcHJvdGVjdGVkIHNwZWNpZmllZExlZ2VuZHM6IExlZ2VuZEluZGV4ID0ge307XG5cbiAgcHVibGljIHJlYWRvbmx5IHNlbGVjdGlvbjogRGljdDxTZWxlY3Rpb25EZWY+ID0ge307XG4gIHB1YmxpYyBjaGlsZHJlbjogTW9kZWxbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IFVuaXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZyxcbiAgICBwYXJlbnRHaXZlblNpemU6IExheW91dFNpemVNaXhpbnMgPSB7fSwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnLCBwdWJsaWMgZml0OiBib29sZWFuKSB7XG5cbiAgICBzdXBlcihzcGVjLCBwYXJlbnQsIHBhcmVudEdpdmVuTmFtZSwgY29uZmlnLCB1bmRlZmluZWQpO1xuICAgIHRoaXMuaW5pdFNpemUoe1xuICAgICAgLi4ucGFyZW50R2l2ZW5TaXplLFxuICAgICAgLi4uKHNwZWMud2lkdGggPyB7d2lkdGg6IHNwZWMud2lkdGh9IDoge30pLFxuICAgICAgLi4uKHNwZWMuaGVpZ2h0ID8ge2hlaWdodDogc3BlYy5oZWlnaHR9IDoge30pXG4gICAgfSk7XG4gICAgY29uc3QgbWFyayA9IGlzTWFya0RlZihzcGVjLm1hcmspID8gc3BlYy5tYXJrLnR5cGUgOiBzcGVjLm1hcms7XG5cbiAgICBjb25zdCBlbmNvZGluZyA9IHRoaXMuZW5jb2RpbmcgPSBub3JtYWxpemVFbmNvZGluZyhyZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHNwZWMuZW5jb2RpbmcgfHwge30sIHJlcGVhdGVyKSwgbWFyayk7XG5cbiAgICB0aGlzLm1hcmtEZWYgPSBub3JtYWxpemVNYXJrRGVmKHNwZWMubWFyaywgZW5jb2RpbmcsIGNvbmZpZyk7XG5cbiAgICAvLyBjYWxjdWxhdGUgc3RhY2sgcHJvcGVydGllc1xuICAgIHRoaXMuc3RhY2sgPSBzdGFjayhtYXJrLCBlbmNvZGluZywgdGhpcy5jb25maWcuc3RhY2spO1xuICAgIHRoaXMuc3BlY2lmaWVkU2NhbGVzID0gdGhpcy5pbml0U2NhbGVzKG1hcmssIGVuY29kaW5nKTtcblxuICAgIHRoaXMuc3BlY2lmaWVkQXhlcyA9IHRoaXMuaW5pdEF4ZXMoZW5jb2RpbmcpO1xuICAgIHRoaXMuc3BlY2lmaWVkTGVnZW5kcyA9IHRoaXMuaW5pdExlZ2VuZChlbmNvZGluZyk7XG5cbiAgICAvLyBTZWxlY3Rpb25zIHdpbGwgYmUgaW5pdGlhbGl6ZWQgdXBvbiBwYXJzZS5cbiAgICB0aGlzLnNlbGVjdGlvbiA9IHNwZWMuc2VsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzcGVjaWZpZWQgVmVnYS1saXRlIHNjYWxlIGRvbWFpbiBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWxcbiAgICogQHBhcmFtIGNoYW5uZWxcbiAgICovXG4gIHB1YmxpYyBzY2FsZURvbWFpbihjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBEb21haW4ge1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF07XG4gICAgcmV0dXJuIHNjYWxlID8gc2NhbGUuZG9tYWluIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHNvcnQoY2hhbm5lbDogQ2hhbm5lbCk6IFNvcnRGaWVsZDxzdHJpbmc+IHwgU29ydE9yZGVyIHtcbiAgICByZXR1cm4gKHRoaXMuZ2V0TWFwcGluZygpW2NoYW5uZWxdIHx8IHt9KS5zb3J0O1xuICB9XG5cbiAgcHVibGljIGF4aXMoY2hhbm5lbDogQ2hhbm5lbCk6IEF4aXMge1xuICAgIHJldHVybiB0aGlzLnNwZWNpZmllZEF4ZXNbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgbGVnZW5kKGNoYW5uZWw6IENoYW5uZWwpOiBMZWdlbmQge1xuICAgIHJldHVybiB0aGlzLnNwZWNpZmllZExlZ2VuZHNbY2hhbm5lbF07XG4gIH1cblxuICBwcml2YXRlIGluaXRTY2FsZXMobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBTY2FsZUluZGV4IHtcbiAgICByZXR1cm4gU0NBTEVfQ0hBTk5FTFMucmVkdWNlKChzY2FsZXMsIGNoYW5uZWwpID0+IHtcbiAgICAgIGxldCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcbiAgICAgIGxldCBzcGVjaWZpZWRTY2FsZTogU2NhbGU7XG5cbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcblxuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmO1xuICAgICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuc2NhbGU7XG4gICAgICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLmNvbmRpdGlvblsnc2NhbGUnXTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3gnKSB7XG4gICAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueDIpO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneScpIHtcbiAgICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy55Mik7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZERlZikge1xuICAgICAgICBzY2FsZXNbY2hhbm5lbF0gPSBzcGVjaWZpZWRTY2FsZSB8fCB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzY2FsZXM7XG4gICAgfSwge30gYXMgU2NhbGVJbmRleCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRBeGVzKGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogQXhpc0luZGV4IHtcbiAgICByZXR1cm4gW1gsIFldLnJlZHVjZShmdW5jdGlvbihfYXhpcywgY2hhbm5lbCkge1xuICAgICAgLy8gUG9zaXRpb24gQXhpc1xuXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgQ29uZGl0aW9uRmllbGREZWZcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpIHx8XG4gICAgICAgICAgKGNoYW5uZWwgPT09IFggJiYgaXNGaWVsZERlZihlbmNvZGluZy54MikpIHx8XG4gICAgICAgICAgKGNoYW5uZWwgPT09IFkgJiYgaXNGaWVsZERlZihlbmNvZGluZy55MikpKSB7XG5cbiAgICAgICAgY29uc3QgYXhpc1NwZWMgPSBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZi5heGlzIDogbnVsbDtcblxuICAgICAgICAvLyBXZSBubyBsb25nZXIgc3VwcG9ydCBmYWxzZSBpbiB0aGUgc2NoZW1hLCBidXQgd2Uga2VlcCBmYWxzZSBoZXJlIGZvciBiYWNrd2FyZCBjb21wYXRhYmlsaXR5LlxuICAgICAgICBpZiAoYXhpc1NwZWMgIT09IG51bGwgJiYgYXhpc1NwZWMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgX2F4aXNbY2hhbm5lbF0gPSB7XG4gICAgICAgICAgICAuLi5heGlzU3BlY1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfYXhpcztcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRMZWdlbmQoZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBMZWdlbmRJbmRleCB7XG4gICAgcmV0dXJuIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLnJlZHVjZShmdW5jdGlvbihfbGVnZW5kLCBjaGFubmVsKSB7XG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICBjb25zdCBsZWdlbmQgPSBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZi5sZWdlbmQgOlxuICAgICAgICAgIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSA/IGNoYW5uZWxEZWYuY29uZGl0aW9uWydsZWdlbmQnXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKGxlZ2VuZCAhPT0gbnVsbCAmJiBsZWdlbmQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgX2xlZ2VuZFtjaGFubmVsXSA9IHsuLi5sZWdlbmR9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfbGVnZW5kO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZURhdGEoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuZGF0YSA9IHBhcnNlRGF0YSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUxheW91dFNpemUoKSB7XG4gICAgcGFyc2VVbml0TGF5b3V0U2l6ZSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBwYXJzZVVuaXRTZWxlY3Rpb24odGhpcywgdGhpcy5zZWxlY3Rpb24pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTWFya0dyb3VwKCkge1xuICAgIHRoaXMuY29tcG9uZW50Lm1hcmsgPSBwYXJzZU1hcmtHcm91cCh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUF4aXNBbmRIZWFkZXIoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuYXhlcyA9IHBhcnNlVW5pdEF4aXModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHModGhpcywgc2lnbmFscyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKHRoaXMsIFtdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGF0YTogVmdEYXRhW10pOiBWZ0RhdGFbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEodGhpcywgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVMYXlvdXRTaWduYWxzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTWFya3MoKSB7XG4gICAgbGV0IG1hcmtzID0gdGhpcy5jb21wb25lbnQubWFyayB8fCBbXTtcblxuICAgIC8vIElmIHRoaXMgdW5pdCBpcyBwYXJ0IG9mIGEgbGF5ZXIsIHNlbGVjdGlvbnMgc2hvdWxkIGF1Z21lbnRcbiAgICAvLyBhbGwgaW4gY29uY2VydCByYXRoZXIgdGhhbiBlYWNoIHVuaXQgaW5kaXZpZHVhbGx5LiBUaGlzXG4gICAgLy8gZW5zdXJlcyBjb3JyZWN0IGludGVybGVhdmluZyBvZiBjbGlwcGluZyBhbmQgYnJ1c2hlZCBtYXJrcy5cbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICFpc0xheWVyTW9kZWwodGhpcy5wYXJlbnQpKSB7XG4gICAgICBtYXJrcyA9IGFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzKHRoaXMsIG1hcmtzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFya3MubWFwKHRoaXMuY29ycmVjdERhdGFOYW1lcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaXplKCk6IFZnRW5jb2RlRW50cnkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLFxuICAgICAgaGVpZ2h0OiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNYXBwaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmVuY29kaW5nO1xuICB9XG5cbiAgcHVibGljIHRvU3BlYyhleGNsdWRlQ29uZmlnPzogYW55LCBleGNsdWRlRGF0YT86IGFueSkge1xuICAgIGNvbnN0IGVuY29kaW5nID0gZHVwbGljYXRlKHRoaXMuZW5jb2RpbmcpO1xuICAgIGxldCBzcGVjOiBhbnk7XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFyazogdGhpcy5tYXJrRGVmLFxuICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSBkdXBsaWNhdGUodGhpcy5jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IGR1cGxpY2F0ZSh0aGlzLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHJldHVybiBzcGVjO1xuICB9XG5cbiAgcHVibGljIG1hcmsoKTogTWFyayB7XG4gICAgcmV0dXJuIHRoaXMubWFya0RlZi50eXBlO1xuICB9XG5cbiAgcHVibGljIGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcuY2hhbm5lbEhhc0ZpZWxkKHRoaXMuZW5jb2RpbmcsIGNoYW5uZWwpO1xuICB9XG5cbiAgcHVibGljIGZpZWxkRGVmKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwpOiBGaWVsZERlZjxzdHJpbmc+IHtcbiAgICBjb25zdCBjaGFubmVsRGVmID0gdGhpcy5lbmNvZGluZ1tjaGFubmVsXSBhcyBDaGFubmVsRGVmPHN0cmluZz47XG4gICAgcmV0dXJuIGdldEZpZWxkRGVmKGNoYW5uZWxEZWYpO1xuICB9XG59XG4iXX0=