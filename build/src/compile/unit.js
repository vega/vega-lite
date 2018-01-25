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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzQ0FBcUg7QUFFckgsd0NBQTBDO0FBQzFDLHdDQUF3RDtBQUN4RCx3Q0FBa0c7QUFFbEcsZ0NBQWlEO0FBTWpELGtDQUFnRDtBQUNoRCxnQ0FBd0M7QUFHeEMsc0NBQTJDO0FBQzNDLHNDQUF1QztBQUN2QyxrREFBNEQ7QUFDNUQsNENBQXVEO0FBRXZELG9DQUE2QztBQUM3QyxvQ0FBMkM7QUFDM0MsaUNBQTREO0FBQzVELHVDQUFvRTtBQUVwRSxtREFNK0I7QUFHL0I7O0dBRUc7QUFDSDtJQUErQiw2QkFBYztJQWtCM0MsbUJBQVksSUFBYyxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUNoRSxlQUFzQyxFQUFFLFFBQXVCLEVBQUUsTUFBYyxFQUFTLEdBQVk7UUFBcEcsZ0NBQUEsRUFBQSxvQkFBc0M7UUFEeEMsWUFHRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLFNBc0J4RDtRQXhCeUYsU0FBRyxHQUFILEdBQUcsQ0FBUztRQWxCdEYsVUFBSSxHQUFXLE1BQU0sQ0FBQztRQUl0QixxQkFBZSxHQUFlLEVBQUUsQ0FBQztRQUl2QyxtQkFBYSxHQUFjLEVBQUUsQ0FBQztRQUU5QixzQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXRDLHlCQUFtQixHQUFlLEVBQUUsQ0FBQztRQUU1QixlQUFTLEdBQXVCLEVBQUUsQ0FBQztRQUM1QyxjQUFRLEdBQVksRUFBRSxDQUFDO1FBTTVCLEtBQUksQ0FBQyxRQUFRLGNBQ1IsZUFBZSxFQUNmLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFD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LE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsT0FBZ0I7UUFDckMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sNEJBQVEsR0FBZixVQUFnQixPQUF5QjtRQUN2QyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBdUIsQ0FBQztRQUNoRSxNQUFNLENBQUMsc0JBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBcE9ELENBQStCLHNCQUFjLEdBb081QztBQXBPWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXhpc30gZnJvbSAnLi4vYXhpcyc7XG5pbXBvcnQge0NoYW5uZWwsIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBTQ0FMRV9DSEFOTkVMUywgU2NhbGVDaGFubmVsLCBTaW5nbGVEZWZDaGFubmVsLCBYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgdmxFbmNvZGluZyBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0VuY29kaW5nLCBub3JtYWxpemVFbmNvZGluZ30gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBGaWVsZERlZiwgZ2V0RmllbGREZWYsIGhhc0NvbmRpdGlvbmFsRmllbGREZWYsIGlzRmllbGREZWZ9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuLi9sZWdlbmQnO1xuaW1wb3J0IHtpc01hcmtEZWYsIE1hcmssIE1hcmtEZWZ9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtQcm9qZWN0aW9ufSBmcm9tICcuLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7RG9tYWluLCBTY2FsZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtTZWxlY3Rpb25EZWZ9IGZyb20gJy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuLi9zb3J0JztcbmltcG9ydCB7TGF5b3V0U2l6ZU1peGlucywgVW5pdFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtzdGFjaywgU3RhY2tQcm9wZXJ0aWVzfSBmcm9tICcuLi9zdGFjayc7XG5pbXBvcnQge0RpY3QsIGR1cGxpY2F0ZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1ZnRGF0YSwgVmdFbmNvZGVFbnRyeSwgVmdMYXlvdXQsIFZnU2lnbmFsfSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0F4aXNJbmRleH0gZnJvbSAnLi9heGlzL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlVW5pdEF4aXN9IGZyb20gJy4vYXhpcy9wYXJzZSc7XG5pbXBvcnQge3BhcnNlRGF0YX0gZnJvbSAnLi9kYXRhL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVMYXlvdXRTaWduYWxzfSBmcm9tICcuL2xheW91dHNpemUvYXNzZW1ibGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRMYXlvdXRTaXplfSBmcm9tICcuL2xheW91dHNpemUvcGFyc2UnO1xuaW1wb3J0IHtMZWdlbmRJbmRleH0gZnJvbSAnLi9sZWdlbmQvY29tcG9uZW50JztcbmltcG9ydCB7bm9ybWFsaXplTWFya0RlZn0gZnJvbSAnLi9tYXJrL2luaXQnO1xuaW1wb3J0IHtwYXJzZU1hcmtHcm91cH0gZnJvbSAnLi9tYXJrL21hcmsnO1xuaW1wb3J0IHtpc0xheWVyTW9kZWwsIE1vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWUsIHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmd9IGZyb20gJy4vcmVwZWF0ZXInO1xuaW1wb3J0IHtTY2FsZUluZGV4fSBmcm9tICcuL3NjYWxlL2NvbXBvbmVudCc7XG5pbXBvcnQge1xuICBhc3NlbWJsZVRvcExldmVsU2lnbmFscyxcbiAgYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YSxcbiAgYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3MsXG4gIGFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMsXG4gIHBhcnNlVW5pdFNlbGVjdGlvbixcbn0gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcblxuXG4vKipcbiAqIEludGVybmFsIG1vZGVsIG9mIFZlZ2EtTGl0ZSBzcGVjaWZpY2F0aW9uIGZvciB0aGUgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBVbml0TW9kZWwgZXh0ZW5kcyBNb2RlbFdpdGhGaWVsZCB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiAndW5pdCcgPSAndW5pdCc7XG4gIHB1YmxpYyByZWFkb25seSBtYXJrRGVmOiBNYXJrRGVmO1xuICBwdWJsaWMgcmVhZG9ubHkgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz47XG5cbiAgcHVibGljIHJlYWRvbmx5IHNwZWNpZmllZFNjYWxlczogU2NhbGVJbmRleCA9IHt9O1xuXG4gIHB1YmxpYyByZWFkb25seSBzdGFjazogU3RhY2tQcm9wZXJ0aWVzO1xuXG4gIHByb3RlY3RlZCBzcGVjaWZpZWRBeGVzOiBBeGlzSW5kZXggPSB7fTtcblxuICBwcm90ZWN0ZWQgc3BlY2lmaWVkTGVnZW5kczogTGVnZW5kSW5kZXggPSB7fTtcblxuICBwdWJsaWMgc3BlY2lmaWVkUHJvamVjdGlvbjogUHJvamVjdGlvbiA9IHt9O1xuXG4gIHB1YmxpYyByZWFkb25seSBzZWxlY3Rpb246IERpY3Q8U2VsZWN0aW9uRGVmPiA9IHt9O1xuICBwdWJsaWMgY2hpbGRyZW46IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBVbml0U3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsXG4gICAgcGFyZW50R2l2ZW5TaXplOiBMYXlvdXRTaXplTWl4aW5zID0ge30sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZywgcHVibGljIGZpdDogYm9vbGVhbikge1xuXG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmluaXRTaXplKHtcbiAgICAgIC4uLnBhcmVudEdpdmVuU2l6ZSxcbiAgICAgIC4uLihzcGVjLndpZHRoID8ge3dpZHRoOiBzcGVjLndpZHRofSA6IHt9KSxcbiAgICAgIC4uLihzcGVjLmhlaWdodCA/IHtoZWlnaHQ6IHNwZWMuaGVpZ2h0fSA6IHt9KVxuICAgIH0pO1xuICAgIGNvbnN0IG1hcmsgPSBpc01hcmtEZWYoc3BlYy5tYXJrKSA/IHNwZWMubWFyay50eXBlIDogc3BlYy5tYXJrO1xuXG4gICAgY29uc3QgZW5jb2RpbmcgPSB0aGlzLmVuY29kaW5nID0gbm9ybWFsaXplRW5jb2RpbmcocmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyhzcGVjLmVuY29kaW5nIHx8IHt9LCByZXBlYXRlciksIG1hcmspO1xuXG4gICAgdGhpcy5tYXJrRGVmID0gbm9ybWFsaXplTWFya0RlZihzcGVjLm1hcmssIGVuY29kaW5nLCBjb25maWcpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0YWNrIHByb3BlcnRpZXNcbiAgICB0aGlzLnN0YWNrID0gc3RhY2sobWFyaywgZW5jb2RpbmcsIHRoaXMuY29uZmlnLnN0YWNrKTtcbiAgICB0aGlzLnNwZWNpZmllZFNjYWxlcyA9IHRoaXMuaW5pdFNjYWxlcyhtYXJrLCBlbmNvZGluZyk7XG5cbiAgICB0aGlzLnNwZWNpZmllZEF4ZXMgPSB0aGlzLmluaXRBeGVzKGVuY29kaW5nKTtcbiAgICB0aGlzLnNwZWNpZmllZExlZ2VuZHMgPSB0aGlzLmluaXRMZWdlbmQoZW5jb2RpbmcpO1xuICAgIHRoaXMuc3BlY2lmaWVkUHJvamVjdGlvbiA9IHNwZWMucHJvamVjdGlvbjtcblxuICAgIC8vIFNlbGVjdGlvbnMgd2lsbCBiZSBpbml0aWFsaXplZCB1cG9uIHBhcnNlLlxuICAgIHRoaXMuc2VsZWN0aW9uID0gc3BlYy5zZWxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNwZWNpZmllZCBWZWdhLWxpdGUgc2NhbGUgZG9tYWluIGZvciBhIHBhcnRpY3VsYXIgY2hhbm5lbFxuICAgKiBAcGFyYW0gY2hhbm5lbFxuICAgKi9cbiAgcHVibGljIHNjYWxlRG9tYWluKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IERvbWFpbiB7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXTtcbiAgICByZXR1cm4gc2NhbGUgPyBzY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc29ydChjaGFubmVsOiBDaGFubmVsKTogU29ydEZpZWxkPHN0cmluZz4gfCBTb3J0T3JkZXIge1xuICAgIHJldHVybiAodGhpcy5nZXRNYXBwaW5nKClbY2hhbm5lbF0gfHwge30pLnNvcnQ7XG4gIH1cblxuICBwdWJsaWMgYXhpcyhjaGFubmVsOiBDaGFubmVsKTogQXhpcyB7XG4gICAgcmV0dXJuIHRoaXMuc3BlY2lmaWVkQXhlc1tjaGFubmVsXTtcbiAgfVxuXG4gIHB1YmxpYyBsZWdlbmQoY2hhbm5lbDogQ2hhbm5lbCk6IExlZ2VuZCB7XG4gICAgcmV0dXJuIHRoaXMuc3BlY2lmaWVkTGVnZW5kc1tjaGFubmVsXTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFNjYWxlcyhtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IFNjYWxlSW5kZXgge1xuICAgIHJldHVybiBTQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoKHNjYWxlcywgY2hhbm5lbCkgPT4ge1xuICAgICAgbGV0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgICAgbGV0IHNwZWNpZmllZFNjYWxlOiBTY2FsZTtcblxuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWY7XG4gICAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5zY2FsZTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICAgICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuY29uZGl0aW9uWydzY2FsZSddO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneCcpIHtcbiAgICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy54Mik7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5Jykge1xuICAgICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLnkyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIHNjYWxlc1tjaGFubmVsXSA9IHNwZWNpZmllZFNjYWxlIHx8IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNjYWxlcztcbiAgICB9LCB7fSBhcyBTY2FsZUluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdEF4ZXMoZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBBeGlzSW5kZXgge1xuICAgIHJldHVybiBbWCwgWV0ucmVkdWNlKGZ1bmN0aW9uKF9heGlzLCBjaGFubmVsKSB7XG4gICAgICAvLyBQb3NpdGlvbiBBeGlzXG5cbiAgICAgIC8vIFRPRE86IGhhbmRsZSBDb25kaXRpb25GaWVsZERlZlxuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikgfHxcbiAgICAgICAgICAoY2hhbm5lbCA9PT0gWCAmJiBpc0ZpZWxkRGVmKGVuY29kaW5nLngyKSkgfHxcbiAgICAgICAgICAoY2hhbm5lbCA9PT0gWSAmJiBpc0ZpZWxkRGVmKGVuY29kaW5nLnkyKSkpIHtcblxuICAgICAgICBjb25zdCBheGlzU3BlYyA9IGlzRmllbGREZWYoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmLmF4aXMgOiBudWxsO1xuXG4gICAgICAgIC8vIFdlIG5vIGxvbmdlciBzdXBwb3J0IGZhbHNlIGluIHRoZSBzY2hlbWEsIGJ1dCB3ZSBrZWVwIGZhbHNlIGhlcmUgZm9yIGJhY2t3YXJkIGNvbXBhdGFiaWxpdHkuXG4gICAgICAgIGlmIChheGlzU3BlYyAhPT0gbnVsbCAmJiBheGlzU3BlYyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBfYXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgICAgIC4uLmF4aXNTcGVjXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9heGlzO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdExlZ2VuZChlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IExlZ2VuZEluZGV4IHtcbiAgICByZXR1cm4gTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKF9sZWdlbmQsIGNoYW5uZWwpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGFubmVsRGVmKSB7XG4gICAgICAgIGNvbnN0IGxlZ2VuZCA9IGlzRmllbGREZWYoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmLmxlZ2VuZCA6XG4gICAgICAgICAgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpID8gY2hhbm5lbERlZi5jb25kaXRpb25bJ2xlZ2VuZCddIDogbnVsbDtcblxuICAgICAgICBpZiAobGVnZW5kICE9PSBudWxsICYmIGxlZ2VuZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBfbGVnZW5kW2NoYW5uZWxdID0gey4uLmxlZ2VuZH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9sZWdlbmQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZVVuaXRMYXlvdXRTaXplKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHBhcnNlVW5pdFNlbGVjdGlvbih0aGlzLCB0aGlzLnNlbGVjdGlvbik7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgdGhpcy5jb21wb25lbnQubWFyayA9IHBhcnNlTWFya0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5heGVzID0gcGFyc2VVbml0QXhpcyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzOiBhbnlbXSk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVRvcExldmVsU2lnbmFscyh0aGlzLCBzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHModGhpcywgW10pO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YSh0aGlzLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZUxheW91dFNpZ25hbHModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVNYXJrcygpIHtcbiAgICBsZXQgbWFya3MgPSB0aGlzLmNvbXBvbmVudC5tYXJrIHx8IFtdO1xuXG4gICAgLy8gSWYgdGhpcyB1bml0IGlzIHBhcnQgb2YgYSBsYXllciwgc2VsZWN0aW9ucyBzaG91bGQgYXVnbWVudFxuICAgIC8vIGFsbCBpbiBjb25jZXJ0IHJhdGhlciB0aGFuIGVhY2ggdW5pdCBpbmRpdmlkdWFsbHkuIFRoaXNcbiAgICAvLyBlbnN1cmVzIGNvcnJlY3QgaW50ZXJsZWF2aW5nIG9mIGNsaXBwaW5nIGFuZCBicnVzaGVkIG1hcmtzLlxuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIWlzTGF5ZXJNb2RlbCh0aGlzLnBhcmVudCkpIHtcbiAgICAgIG1hcmtzID0gYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3ModGhpcywgbWFya3MpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrcy5tYXAodGhpcy5jb3JyZWN0RGF0YU5hbWVzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpemUoKTogVmdFbmNvZGVFbnRyeSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksXG4gICAgICBoZWlnaHQ6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JylcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1hcHBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2Rpbmc7XG4gIH1cblxuICBwdWJsaWMgdG9TcGVjKGV4Y2x1ZGVDb25maWc/OiBhbnksIGV4Y2x1ZGVEYXRhPzogYW55KSB7XG4gICAgY29uc3QgZW5jb2RpbmcgPSBkdXBsaWNhdGUodGhpcy5lbmNvZGluZyk7XG4gICAgbGV0IHNwZWM6IGFueTtcblxuICAgIHNwZWMgPSB7XG4gICAgICBtYXJrOiB0aGlzLm1hcmtEZWYsXG4gICAgICBlbmNvZGluZzogZW5jb2RpbmdcbiAgICB9O1xuXG4gICAgaWYgKCFleGNsdWRlQ29uZmlnKSB7XG4gICAgICBzcGVjLmNvbmZpZyA9IGR1cGxpY2F0ZSh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWYgKCFleGNsdWRlRGF0YSkge1xuICAgICAgc3BlYy5kYXRhID0gZHVwbGljYXRlKHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGRlZmF1bHRzXG4gICAgcmV0dXJuIHNwZWM7XG4gIH1cblxuICBwdWJsaWMgbWFyaygpOiBNYXJrIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrRGVmLnR5cGU7XG4gIH1cblxuICBwdWJsaWMgY2hhbm5lbEhhc0ZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5jaGFubmVsSGFzRmllbGQodGhpcy5lbmNvZGluZywgY2hhbm5lbCk7XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIGNvbnN0IGNoYW5uZWxEZWYgPSB0aGlzLmVuY29kaW5nW2NoYW5uZWxdIGFzIENoYW5uZWxEZWY8c3RyaW5nPjtcbiAgICByZXR1cm4gZ2V0RmllbGREZWYoY2hhbm5lbERlZik7XG4gIH1cbn1cbiJdfQ==