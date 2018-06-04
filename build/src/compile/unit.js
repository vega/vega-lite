"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var vlEncoding = tslib_1.__importStar(require("../encoding"));
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
    Object.defineProperty(UnitModel.prototype, "hasProjection", {
        get: function () {
            var encoding = this.encoding;
            var isGeoShapeMark = this.mark === mark_1.GEOSHAPE;
            var hasGeoPosition = encoding && channel_1.GEOPOSITION_CHANNELS.some(function (channel) { return fielddef_1.isFieldDef(encoding[channel]); });
            return isGeoShapeMark || hasGeoPosition;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return specified Vega-lite scale domain for a particular channel
     * @param channel
     */
    UnitModel.prototype.scaleDomain = function (channel) {
        var scale = this.specifiedScales[channel];
        return scale ? scale.domain : undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQTJJO0FBRTNJLDhEQUEwQztBQUMxQyx3Q0FBd0Q7QUFDeEQsd0NBQWtHO0FBRWxHLGdDQUEyRDtBQUszRCxrQ0FBZ0Q7QUFDaEQsZ0NBQXdDO0FBR3hDLHNDQUEyQztBQUMzQyxzQ0FBdUM7QUFDdkMsa0RBQTREO0FBQzVELDRDQUF1RDtBQUV2RCxvQ0FBNkM7QUFDN0Msb0NBQTJDO0FBQzNDLGlDQUE0RDtBQUM1RCx1Q0FBb0U7QUFFcEUsbURBQXVLO0FBR3ZLOztHQUVHO0FBQ0g7SUFBK0IscUNBQWM7SUFrQjNDLG1CQUFZLElBQXdCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQzFFLGVBQXNDLEVBQUUsUUFBdUIsRUFBRSxNQUFjLEVBQVMsR0FBWTtRQUFwRyxnQ0FBQSxFQUFBLG9CQUFzQztRQUR4QyxZQUdFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFNBc0JsRTtRQXhCeUYsU0FBRyxHQUFILEdBQUcsQ0FBUztRQWxCdEYsVUFBSSxHQUFXLE1BQU0sQ0FBQztRQUl0QixxQkFBZSxHQUFlLEVBQUUsQ0FBQztRQUl2QyxtQkFBYSxHQUFjLEVBQUUsQ0FBQztRQUU5QixzQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXRDLHlCQUFtQixHQUFlLEVBQUUsQ0FBQztRQUU1QixlQUFTLEdBQXVCLEVBQUUsQ0FBQztRQUM1QyxjQUFRLEdBQVksRUFBRSxDQUFDO1FBTTVCLEtBQUksQ0FBQyxRQUFRLHNCQUNSLGVBQWUsRUFDZixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3ZDLENB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QUMsVUFBVSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXpPRCxDQUErQixzQkFBYyxHQXlPNUM7QUF6T1ksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXN9IGZyb20gJy4uL2F4aXMnO1xuaW1wb3J0IHtDaGFubmVsLCBHRU9QT1NJVElPTl9DSEFOTkVMUywgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMsIFNDQUxFX0NIQU5ORUxTLCBTY2FsZUNoYW5uZWwsIFNpbmdsZURlZkNoYW5uZWwsIFgsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7RW5jb2RpbmcsIG5vcm1hbGl6ZUVuY29kaW5nfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0NoYW5uZWxEZWYsIEZpZWxkRGVmLCBnZXRGaWVsZERlZiwgaGFzQ29uZGl0aW9uYWxGaWVsZERlZiwgaXNGaWVsZERlZn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4uL2xlZ2VuZCc7XG5pbXBvcnQge0dFT1NIQVBFLCBpc01hcmtEZWYsIE1hcmssIE1hcmtEZWZ9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtQcm9qZWN0aW9ufSBmcm9tICcuLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7RG9tYWluLCBTY2FsZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtTZWxlY3Rpb25EZWZ9IGZyb20gJy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge0xheW91dFNpemVNaXhpbnMsIE5vcm1hbGl6ZWRVbml0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge3N0YWNrLCBTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7VmdEYXRhLCBWZ0VuY29kZUVudHJ5LCBWZ0xheW91dCwgVmdTaWduYWx9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7QXhpc0luZGV4fSBmcm9tICcuL2F4aXMvY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VVbml0QXhpc30gZnJvbSAnLi9heGlzL3BhcnNlJztcbmltcG9ydCB7cGFyc2VEYXRhfSBmcm9tICcuL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHthc3NlbWJsZUxheW91dFNpZ25hbHN9IGZyb20gJy4vbGF5b3V0c2l6ZS9hc3NlbWJsZSc7XG5pbXBvcnQge3BhcnNlVW5pdExheW91dFNpemV9IGZyb20gJy4vbGF5b3V0c2l6ZS9wYXJzZSc7XG5pbXBvcnQge0xlZ2VuZEluZGV4fSBmcm9tICcuL2xlZ2VuZC9jb21wb25lbnQnO1xuaW1wb3J0IHtub3JtYWxpemVNYXJrRGVmfSBmcm9tICcuL21hcmsvaW5pdCc7XG5pbXBvcnQge3BhcnNlTWFya0dyb3VwfSBmcm9tICcuL21hcmsvbWFyayc7XG5pbXBvcnQge2lzTGF5ZXJNb2RlbCwgTW9kZWwsIE1vZGVsV2l0aEZpZWxkfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZSwgcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZ30gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge1NjYWxlSW5kZXh9IGZyb20gJy4vc2NhbGUvY29tcG9uZW50JztcbmltcG9ydCB7YXNzZW1ibGVUb3BMZXZlbFNpZ25hbHMsIGFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEsIGFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzLCBhc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzLCBwYXJzZVVuaXRTZWxlY3Rpb259IGZyb20gJy4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBtb2RlbCBvZiBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbiBmb3IgdGhlIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgVW5pdE1vZGVsIGV4dGVuZHMgTW9kZWxXaXRoRmllbGQge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ3VuaXQnID0gJ3VuaXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgbWFya0RlZjogTWFya0RlZjtcbiAgcHVibGljIHJlYWRvbmx5IGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+O1xuXG4gIHB1YmxpYyByZWFkb25seSBzcGVjaWZpZWRTY2FsZXM6IFNjYWxlSW5kZXggPSB7fTtcblxuICBwdWJsaWMgcmVhZG9ubHkgc3RhY2s6IFN0YWNrUHJvcGVydGllcztcblxuICBwcm90ZWN0ZWQgc3BlY2lmaWVkQXhlczogQXhpc0luZGV4ID0ge307XG5cbiAgcHJvdGVjdGVkIHNwZWNpZmllZExlZ2VuZHM6IExlZ2VuZEluZGV4ID0ge307XG5cbiAgcHVibGljIHNwZWNpZmllZFByb2plY3Rpb246IFByb2plY3Rpb24gPSB7fTtcblxuICBwdWJsaWMgcmVhZG9ubHkgc2VsZWN0aW9uOiBEaWN0PFNlbGVjdGlvbkRlZj4gPSB7fTtcbiAgcHVibGljIGNoaWxkcmVuOiBNb2RlbFtdID0gW107XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZyxcbiAgICBwYXJlbnRHaXZlblNpemU6IExheW91dFNpemVNaXhpbnMgPSB7fSwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnLCBwdWJsaWMgZml0OiBib29sZWFuKSB7XG5cbiAgICBzdXBlcihzcGVjLCBwYXJlbnQsIHBhcmVudEdpdmVuTmFtZSwgY29uZmlnLCByZXBlYXRlciwgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmluaXRTaXplKHtcbiAgICAgIC4uLnBhcmVudEdpdmVuU2l6ZSxcbiAgICAgIC4uLihzcGVjLndpZHRoID8ge3dpZHRoOiBzcGVjLndpZHRofSA6IHt9KSxcbiAgICAgIC4uLihzcGVjLmhlaWdodCA/IHtoZWlnaHQ6IHNwZWMuaGVpZ2h0fSA6IHt9KVxuICAgIH0pO1xuICAgIGNvbnN0IG1hcmsgPSBpc01hcmtEZWYoc3BlYy5tYXJrKSA/IHNwZWMubWFyay50eXBlIDogc3BlYy5tYXJrO1xuXG4gICAgY29uc3QgZW5jb2RpbmcgPSB0aGlzLmVuY29kaW5nID0gbm9ybWFsaXplRW5jb2RpbmcocmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyhzcGVjLmVuY29kaW5nIHx8IHt9LCByZXBlYXRlciksIG1hcmspO1xuXG4gICAgdGhpcy5tYXJrRGVmID0gbm9ybWFsaXplTWFya0RlZihzcGVjLm1hcmssIGVuY29kaW5nLCBjb25maWcpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0YWNrIHByb3BlcnRpZXNcbiAgICB0aGlzLnN0YWNrID0gc3RhY2sobWFyaywgZW5jb2RpbmcsIHRoaXMuY29uZmlnLnN0YWNrKTtcbiAgICB0aGlzLnNwZWNpZmllZFNjYWxlcyA9IHRoaXMuaW5pdFNjYWxlcyhtYXJrLCBlbmNvZGluZyk7XG5cbiAgICB0aGlzLnNwZWNpZmllZEF4ZXMgPSB0aGlzLmluaXRBeGVzKGVuY29kaW5nKTtcbiAgICB0aGlzLnNwZWNpZmllZExlZ2VuZHMgPSB0aGlzLmluaXRMZWdlbmQoZW5jb2RpbmcpO1xuICAgIHRoaXMuc3BlY2lmaWVkUHJvamVjdGlvbiA9IHNwZWMucHJvamVjdGlvbjtcblxuICAgIC8vIFNlbGVjdGlvbnMgd2lsbCBiZSBpbml0aWFsaXplZCB1cG9uIHBhcnNlLlxuICAgIHRoaXMuc2VsZWN0aW9uID0gc3BlYy5zZWxlY3Rpb247XG4gIH1cblxuICBwdWJsaWMgZ2V0IGhhc1Byb2plY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgY29uc3Qge2VuY29kaW5nfSA9IHRoaXM7XG4gICAgY29uc3QgaXNHZW9TaGFwZU1hcmsgPSB0aGlzLm1hcmsgPT09IEdFT1NIQVBFO1xuICAgIGNvbnN0IGhhc0dlb1Bvc2l0aW9uID0gZW5jb2RpbmcgJiYgR0VPUE9TSVRJT05fQ0hBTk5FTFMuc29tZShcbiAgICAgIGNoYW5uZWwgPT4gaXNGaWVsZERlZihlbmNvZGluZ1tjaGFubmVsXSlcbiAgICApO1xuICAgIHJldHVybiBpc0dlb1NoYXBlTWFyayB8fCBoYXNHZW9Qb3NpdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc3BlY2lmaWVkIFZlZ2EtbGl0ZSBzY2FsZSBkb21haW4gZm9yIGEgcGFydGljdWxhciBjaGFubmVsXG4gICAqIEBwYXJhbSBjaGFubmVsXG4gICAqL1xuICBwdWJsaWMgc2NhbGVEb21haW4oY2hhbm5lbDogU2NhbGVDaGFubmVsKTogRG9tYWluIHtcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdO1xuICAgIHJldHVybiBzY2FsZSA/IHNjYWxlLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBheGlzKGNoYW5uZWw6IENoYW5uZWwpOiBBeGlzIHtcbiAgICByZXR1cm4gdGhpcy5zcGVjaWZpZWRBeGVzW2NoYW5uZWxdO1xuICB9XG5cbiAgcHVibGljIGxlZ2VuZChjaGFubmVsOiBDaGFubmVsKTogTGVnZW5kIHtcbiAgICByZXR1cm4gdGhpcy5zcGVjaWZpZWRMZWdlbmRzW2NoYW5uZWxdO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0U2NhbGVzKG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogU2NhbGVJbmRleCB7XG4gICAgcmV0dXJuIFNDQUxFX0NIQU5ORUxTLnJlZHVjZSgoc2NhbGVzLCBjaGFubmVsKSA9PiB7XG4gICAgICBsZXQgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG4gICAgICBsZXQgc3BlY2lmaWVkU2NhbGU6IFNjYWxlO1xuXG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZjtcbiAgICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLnNjYWxlO1xuICAgICAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZi5jb25kaXRpb247XG4gICAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5jb25kaXRpb25bJ3NjYWxlJ107XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd4Jykge1xuICAgICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLngyKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3knKSB7XG4gICAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueTIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGREZWYpIHtcbiAgICAgICAgc2NhbGVzW2NoYW5uZWxdID0gc3BlY2lmaWVkU2NhbGUgfHwge307XG4gICAgICB9XG4gICAgICByZXR1cm4gc2NhbGVzO1xuICAgIH0sIHt9IGFzIFNjYWxlSW5kZXgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0QXhlcyhlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IEF4aXNJbmRleCB7XG4gICAgcmV0dXJuIFtYLCBZXS5yZWR1Y2UoZnVuY3Rpb24oX2F4aXMsIGNoYW5uZWwpIHtcbiAgICAgIC8vIFBvc2l0aW9uIEF4aXNcblxuICAgICAgLy8gVE9ETzogaGFuZGxlIENvbmRpdGlvbkZpZWxkRGVmXG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSB8fFxuICAgICAgICAgIChjaGFubmVsID09PSBYICYmIGlzRmllbGREZWYoZW5jb2RpbmcueDIpKSB8fFxuICAgICAgICAgIChjaGFubmVsID09PSBZICYmIGlzRmllbGREZWYoZW5jb2RpbmcueTIpKSkge1xuXG4gICAgICAgIGNvbnN0IGF4aXNTcGVjID0gaXNGaWVsZERlZihjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYuYXhpcyA6IG51bGw7XG5cbiAgICAgICAgLy8gV2Ugbm8gbG9uZ2VyIHN1cHBvcnQgZmFsc2UgaW4gdGhlIHNjaGVtYSwgYnV0IHdlIGtlZXAgZmFsc2UgaGVyZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGF4aXNTcGVjICE9PSBudWxsICYmIGF4aXNTcGVjICE9PSBmYWxzZSkge1xuICAgICAgICAgIF9heGlzW2NoYW5uZWxdID0ge1xuICAgICAgICAgICAgLi4uYXhpc1NwZWNcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX2F4aXM7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TGVnZW5kKGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogTGVnZW5kSW5kZXgge1xuICAgIHJldHVybiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoZnVuY3Rpb24oX2xlZ2VuZCwgY2hhbm5lbCkge1xuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoYW5uZWxEZWYpIHtcbiAgICAgICAgY29uc3QgbGVnZW5kID0gaXNGaWVsZERlZihjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYubGVnZW5kIDpcbiAgICAgICAgICAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkgPyBjaGFubmVsRGVmLmNvbmRpdGlvblsnbGVnZW5kJ10gOiBudWxsO1xuXG4gICAgICAgIGlmIChsZWdlbmQgIT09IG51bGwgJiYgbGVnZW5kICE9PSBmYWxzZSkge1xuICAgICAgICAgIF9sZWdlbmRbY2hhbm5lbF0gPSB7Li4ubGVnZW5kfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2xlZ2VuZDtcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VEYXRhKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmRhdGEgPSBwYXJzZURhdGEodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlVW5pdExheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5jb21wb25lbnQuc2VsZWN0aW9uID0gcGFyc2VVbml0U2VsZWN0aW9uKHRoaXMsIHRoaXMuc2VsZWN0aW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZU1hcmtHcm91cCgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5tYXJrID0gcGFyc2VNYXJrR3JvdXAodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmF4ZXMgPSBwYXJzZVVuaXRBeGlzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVG9wTGV2ZWxTaWduYWxzKHRoaXMsIHNpZ25hbHMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyh0aGlzLCBbXSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVVuaXRTZWxlY3Rpb25EYXRhKHRoaXMsIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlTGF5b3V0U2lnbmFscyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZU1hcmtzKCkge1xuICAgIGxldCBtYXJrcyA9IHRoaXMuY29tcG9uZW50Lm1hcmsgfHwgW107XG5cbiAgICAvLyBJZiB0aGlzIHVuaXQgaXMgcGFydCBvZiBhIGxheWVyLCBzZWxlY3Rpb25zIHNob3VsZCBhdWdtZW50XG4gICAgLy8gYWxsIGluIGNvbmNlcnQgcmF0aGVyIHRoYW4gZWFjaCB1bml0IGluZGl2aWR1YWxseS4gVGhpc1xuICAgIC8vIGVuc3VyZXMgY29ycmVjdCBpbnRlcmxlYXZpbmcgb2YgY2xpcHBpbmcgYW5kIGJydXNoZWQgbWFya3MuXG4gICAgaWYgKCF0aGlzLnBhcmVudCB8fCAhaXNMYXllck1vZGVsKHRoaXMucGFyZW50KSkge1xuICAgICAgbWFya3MgPSBhc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyh0aGlzLCBtYXJrcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcmtzLm1hcCh0aGlzLmNvcnJlY3REYXRhTmFtZXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2l6ZSgpOiBWZ0VuY29kZUVudHJ5IHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKSxcbiAgICAgIGhlaWdodDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCdoZWlnaHQnKVxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TWFwcGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbmNvZGluZztcbiAgfVxuXG4gIHB1YmxpYyB0b1NwZWMoZXhjbHVkZUNvbmZpZz86IGFueSwgZXhjbHVkZURhdGE/OiBhbnkpIHtcbiAgICBjb25zdCBlbmNvZGluZyA9IGR1cGxpY2F0ZSh0aGlzLmVuY29kaW5nKTtcbiAgICBsZXQgc3BlYzogYW55O1xuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcms6IHRoaXMubWFya0RlZixcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY29uZmlnID0gZHVwbGljYXRlKHRoaXMuY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVEYXRhKSB7XG4gICAgICBzcGVjLmRhdGEgPSBkdXBsaWNhdGUodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICByZXR1cm4gc3BlYztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbWFyaygpOiBNYXJrIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrRGVmLnR5cGU7XG4gIH1cblxuICBwdWJsaWMgY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5jaGFubmVsSGFzRmllbGQodGhpcy5lbmNvZGluZywgY2hhbm5lbCk7XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIGNvbnN0IGNoYW5uZWxEZWYgPSB0aGlzLmVuY29kaW5nW2NoYW5uZWxdIGFzIENoYW5uZWxEZWY8c3RyaW5nPjtcbiAgICByZXR1cm4gZ2V0RmllbGREZWYoY2hhbm5lbERlZik7XG4gIH1cbn1cbiJdfQ==