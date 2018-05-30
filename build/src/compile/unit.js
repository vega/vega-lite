import * as tslib_1 from "tslib";
import { GEOPOSITION_CHANNELS, NONPOSITION_SCALE_CHANNELS, SCALE_CHANNELS, X, Y } from '../channel';
import * as vlEncoding from '../encoding';
import { normalizeEncoding } from '../encoding';
import { getFieldDef, hasConditionalFieldDef, isFieldDef } from '../fielddef';
import { GEOSHAPE, isMarkDef } from '../mark';
import { stack } from '../stack';
import { duplicate } from '../util';
import { parseUnitAxis } from './axis/parse';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { parseUnitLayoutSize } from './layoutsize/parse';
import { normalizeMarkDef } from './mark/init';
import { parseMarkGroup } from './mark/mark';
import { isLayerModel, ModelWithField } from './model';
import { replaceRepeaterInEncoding } from './repeater';
import { assembleTopLevelSignals, assembleUnitSelectionData, assembleUnitSelectionMarks, assembleUnitSelectionSignals, parseUnitSelection } from './selection/selection';
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
        var mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = _this.encoding = normalizeEncoding(replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark);
        _this.markDef = normalizeMarkDef(spec.mark, encoding, config);
        // calculate stack properties
        _this.stack = stack(mark, encoding, _this.config.stack);
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
            var isGeoShapeMark = this.mark === GEOSHAPE;
            var hasGeoPosition = encoding && GEOPOSITION_CHANNELS.some(function (channel) { return isFieldDef(encoding[channel]); });
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
        return SCALE_CHANNELS.reduce(function (scales, channel) {
            var fieldDef;
            var specifiedScale;
            var channelDef = encoding[channel];
            if (isFieldDef(channelDef)) {
                fieldDef = channelDef;
                specifiedScale = channelDef.scale;
            }
            else if (hasConditionalFieldDef(channelDef)) {
                fieldDef = channelDef.condition;
                specifiedScale = channelDef.condition['scale'];
            }
            else if (channel === 'x') {
                fieldDef = getFieldDef(encoding.x2);
            }
            else if (channel === 'y') {
                fieldDef = getFieldDef(encoding.y2);
            }
            if (fieldDef) {
                scales[channel] = specifiedScale || {};
            }
            return scales;
        }, {});
    };
    UnitModel.prototype.initAxes = function (encoding) {
        return [X, Y].reduce(function (_axis, channel) {
            // Position Axis
            // TODO: handle ConditionFieldDef
            var channelDef = encoding[channel];
            if (isFieldDef(channelDef) ||
                (channel === X && isFieldDef(encoding.x2)) ||
                (channel === Y && isFieldDef(encoding.y2))) {
                var axisSpec = isFieldDef(channelDef) ? channelDef.axis : null;
                // We no longer support false in the schema, but we keep false here for backward compatibility.
                if (axisSpec !== null && axisSpec !== false) {
                    _axis[channel] = tslib_1.__assign({}, axisSpec);
                }
            }
            return _axis;
        }, {});
    };
    UnitModel.prototype.initLegend = function (encoding) {
        return NONPOSITION_SCALE_CHANNELS.reduce(function (_legend, channel) {
            var channelDef = encoding[channel];
            if (channelDef) {
                var legend = isFieldDef(channelDef) ? channelDef.legend :
                    (hasConditionalFieldDef(channelDef)) ? channelDef.condition['legend'] : null;
                if (legend !== null && legend !== false) {
                    _legend[channel] = tslib_1.__assign({}, legend);
                }
            }
            return _legend;
        }, {});
    };
    UnitModel.prototype.parseData = function () {
        this.component.data = parseData(this);
    };
    UnitModel.prototype.parseLayoutSize = function () {
        parseUnitLayoutSize(this);
    };
    UnitModel.prototype.parseSelection = function () {
        this.component.selection = parseUnitSelection(this, this.selection);
    };
    UnitModel.prototype.parseMarkGroup = function () {
        this.component.mark = parseMarkGroup(this);
    };
    UnitModel.prototype.parseAxisAndHeader = function () {
        this.component.axes = parseUnitAxis(this);
    };
    UnitModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return assembleTopLevelSignals(this, signals);
    };
    UnitModel.prototype.assembleSelectionSignals = function () {
        return assembleUnitSelectionSignals(this, []);
    };
    UnitModel.prototype.assembleSelectionData = function (data) {
        return assembleUnitSelectionData(this, data);
    };
    UnitModel.prototype.assembleLayout = function () {
        return null;
    };
    UnitModel.prototype.assembleLayoutSignals = function () {
        return assembleLayoutSignals(this);
    };
    UnitModel.prototype.assembleMarks = function () {
        var marks = this.component.mark || [];
        // If this unit is part of a layer, selections should augment
        // all in concert rather than each unit individually. This
        // ensures correct interleaving of clipping and brushed marks.
        if (!this.parent || !isLayerModel(this.parent)) {
            marks = assembleUnitSelectionMarks(this, marks);
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
        var encoding = duplicate(this.encoding);
        var spec;
        spec = {
            mark: this.markDef,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = duplicate(this.config);
        }
        if (!excludeData) {
            spec.data = duplicate(this.data);
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
        return getFieldDef(channelDef);
    };
    return UnitModel;
}(ModelWithField));
export { UnitModel };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBVSxvQkFBb0IsRUFBRSwwQkFBMEIsRUFBRSxjQUFjLEVBQWtDLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFM0ksT0FBTyxLQUFLLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFXLGlCQUFpQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hELE9BQU8sRUFBdUIsV0FBVyxFQUFFLHNCQUFzQixFQUFFLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsRyxPQUFPLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxTQUFTLENBQUM7QUFLM0QsT0FBTyxFQUFDLEtBQUssRUFBa0IsTUFBTSxVQUFVLENBQUM7QUFDaEQsT0FBTyxFQUFPLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUd4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDM0MsT0FBTyxFQUFDLFlBQVksRUFBUyxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDNUQsT0FBTyxFQUFnQix5QkFBeUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVwRSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUseUJBQXlCLEVBQUUsMEJBQTBCLEVBQUUsNEJBQTRCLEVBQUUsa0JBQWtCLEVB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O1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ2xCLFFBQVEsRUFBRSxRQUFRO1NBQ25CLENBQUM7UUFFRixJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0QztRQUVELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsa0JBQWtCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHNCQUFXLDJCQUFJO2FBQWY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsT0FBZ0I7UUFDckMsT0FBTyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLDRCQUFRLEdBQWYsVUFBZ0IsT0FBeUI7UUFDdkMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQXVCLENBQUM7UUFDaEUsT0FBTyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXpPRCxDQUErQixjQUFjLEdBeU81QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXhpc30gZnJvbSAnLi4vYXhpcyc7XG5pbXBvcnQge0NoYW5uZWwsIEdFT1BPU0lUSU9OX0NIQU5ORUxTLCBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUywgU0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbCwgU2luZ2xlRGVmQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtFbmNvZGluZywgbm9ybWFsaXplRW5jb2Rpbmd9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgRmllbGREZWYsIGdldEZpZWxkRGVmLCBoYXNDb25kaXRpb25hbEZpZWxkRGVmLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi4vbGVnZW5kJztcbmltcG9ydCB7R0VPU0hBUEUsIGlzTWFya0RlZiwgTWFyaywgTWFya0RlZn0gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge1Byb2plY3Rpb259IGZyb20gJy4uL3Byb2plY3Rpb24nO1xuaW1wb3J0IHtEb21haW4sIFNjYWxlfSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge1NlbGVjdGlvbkRlZn0gZnJvbSAnLi4vc2VsZWN0aW9uJztcbmltcG9ydCB7TGF5b3V0U2l6ZU1peGlucywgTm9ybWFsaXplZFVuaXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7c3RhY2ssIFN0YWNrUHJvcGVydGllc30gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGEsIFZnRW5jb2RlRW50cnksIFZnTGF5b3V0LCBWZ1NpZ25hbH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzSW5kZXh9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVVuaXRBeGlzfSBmcm9tICcuL2F4aXMvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZURhdGF9IGZyb20gJy4vZGF0YS9wYXJzZSc7XG5pbXBvcnQge2Fzc2VtYmxlTGF5b3V0U2lnbmFsc30gZnJvbSAnLi9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCB7cGFyc2VVbml0TGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7TGVnZW5kSW5kZXh9IGZyb20gJy4vbGVnZW5kL2NvbXBvbmVudCc7XG5pbXBvcnQge25vcm1hbGl6ZU1hcmtEZWZ9IGZyb20gJy4vbWFyay9pbml0JztcbmltcG9ydCB7cGFyc2VNYXJrR3JvdXB9IGZyb20gJy4vbWFyay9tYXJrJztcbmltcG9ydCB7aXNMYXllck1vZGVsLCBNb2RlbCwgTW9kZWxXaXRoRmllbGR9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlLCByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nfSBmcm9tICcuL3JlcGVhdGVyJztcbmltcG9ydCB7U2NhbGVJbmRleH0gZnJvbSAnLi9zY2FsZS9jb21wb25lbnQnO1xuaW1wb3J0IHthc3NlbWJsZVRvcExldmVsU2lnbmFscywgYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YSwgYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3MsIGFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMsIHBhcnNlVW5pdFNlbGVjdGlvbn0gZnJvbSAnLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcblxuXG4vKipcbiAqIEludGVybmFsIG1vZGVsIG9mIFZlZ2EtTGl0ZSBzcGVjaWZpY2F0aW9uIGZvciB0aGUgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBVbml0TW9kZWwgZXh0ZW5kcyBNb2RlbFdpdGhGaWVsZCB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiAndW5pdCcgPSAndW5pdCc7XG4gIHB1YmxpYyByZWFkb25seSBtYXJrRGVmOiBNYXJrRGVmO1xuICBwdWJsaWMgcmVhZG9ubHkgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz47XG5cbiAgcHVibGljIHJlYWRvbmx5IHNwZWNpZmllZFNjYWxlczogU2NhbGVJbmRleCA9IHt9O1xuXG4gIHB1YmxpYyByZWFkb25seSBzdGFjazogU3RhY2tQcm9wZXJ0aWVzO1xuXG4gIHByb3RlY3RlZCBzcGVjaWZpZWRBeGVzOiBBeGlzSW5kZXggPSB7fTtcblxuICBwcm90ZWN0ZWQgc3BlY2lmaWVkTGVnZW5kczogTGVnZW5kSW5kZXggPSB7fTtcblxuICBwdWJsaWMgc3BlY2lmaWVkUHJvamVjdGlvbjogUHJvamVjdGlvbiA9IHt9O1xuXG4gIHB1YmxpYyByZWFkb25seSBzZWxlY3Rpb246IERpY3Q8U2VsZWN0aW9uRGVmPiA9IHt9O1xuICBwdWJsaWMgY2hpbGRyZW46IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLFxuICAgIHBhcmVudEdpdmVuU2l6ZTogTGF5b3V0U2l6ZU1peGlucyA9IHt9LCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgY29uZmlnOiBDb25maWcsIHB1YmxpYyBmaXQ6IGJvb2xlYW4pIHtcblxuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHJlcGVhdGVyLCB1bmRlZmluZWQpO1xuICAgIHRoaXMuaW5pdFNpemUoe1xuICAgICAgLi4ucGFyZW50R2l2ZW5TaXplLFxuICAgICAgLi4uKHNwZWMud2lkdGggPyB7d2lkdGg6IHNwZWMud2lkdGh9IDoge30pLFxuICAgICAgLi4uKHNwZWMuaGVpZ2h0ID8ge2hlaWdodDogc3BlYy5oZWlnaHR9IDoge30pXG4gICAgfSk7XG4gICAgY29uc3QgbWFyayA9IGlzTWFya0RlZihzcGVjLm1hcmspID8gc3BlYy5tYXJrLnR5cGUgOiBzcGVjLm1hcms7XG5cbiAgICBjb25zdCBlbmNvZGluZyA9IHRoaXMuZW5jb2RpbmcgPSBub3JtYWxpemVFbmNvZGluZyhyZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHNwZWMuZW5jb2RpbmcgfHwge30sIHJlcGVhdGVyKSwgbWFyayk7XG5cbiAgICB0aGlzLm1hcmtEZWYgPSBub3JtYWxpemVNYXJrRGVmKHNwZWMubWFyaywgZW5jb2RpbmcsIGNvbmZpZyk7XG5cbiAgICAvLyBjYWxjdWxhdGUgc3RhY2sgcHJvcGVydGllc1xuICAgIHRoaXMuc3RhY2sgPSBzdGFjayhtYXJrLCBlbmNvZGluZywgdGhpcy5jb25maWcuc3RhY2spO1xuICAgIHRoaXMuc3BlY2lmaWVkU2NhbGVzID0gdGhpcy5pbml0U2NhbGVzKG1hcmssIGVuY29kaW5nKTtcblxuICAgIHRoaXMuc3BlY2lmaWVkQXhlcyA9IHRoaXMuaW5pdEF4ZXMoZW5jb2RpbmcpO1xuICAgIHRoaXMuc3BlY2lmaWVkTGVnZW5kcyA9IHRoaXMuaW5pdExlZ2VuZChlbmNvZGluZyk7XG4gICAgdGhpcy5zcGVjaWZpZWRQcm9qZWN0aW9uID0gc3BlYy5wcm9qZWN0aW9uO1xuXG4gICAgLy8gU2VsZWN0aW9ucyB3aWxsIGJlIGluaXRpYWxpemVkIHVwb24gcGFyc2UuXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzcGVjLnNlbGVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaGFzUHJvamVjdGlvbigpOiBib29sZWFuIHtcbiAgICBjb25zdCB7ZW5jb2Rpbmd9ID0gdGhpcztcbiAgICBjb25zdCBpc0dlb1NoYXBlTWFyayA9IHRoaXMubWFyayA9PT0gR0VPU0hBUEU7XG4gICAgY29uc3QgaGFzR2VvUG9zaXRpb24gPSBlbmNvZGluZyAmJiBHRU9QT1NJVElPTl9DSEFOTkVMUy5zb21lKFxuICAgICAgY2hhbm5lbCA9PiBpc0ZpZWxkRGVmKGVuY29kaW5nW2NoYW5uZWxdKVxuICAgICk7XG4gICAgcmV0dXJuIGlzR2VvU2hhcGVNYXJrIHx8IGhhc0dlb1Bvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzcGVjaWZpZWQgVmVnYS1saXRlIHNjYWxlIGRvbWFpbiBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWxcbiAgICogQHBhcmFtIGNoYW5uZWxcbiAgICovXG4gIHB1YmxpYyBzY2FsZURvbWFpbihjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBEb21haW4ge1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF07XG4gICAgcmV0dXJuIHNjYWxlID8gc2NhbGUuZG9tYWluIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGF4aXMoY2hhbm5lbDogQ2hhbm5lbCk6IEF4aXMge1xuICAgIHJldHVybiB0aGlzLnNwZWNpZmllZEF4ZXNbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgbGVnZW5kKGNoYW5uZWw6IENoYW5uZWwpOiBMZWdlbmQge1xuICAgIHJldHVybiB0aGlzLnNwZWNpZmllZExlZ2VuZHNbY2hhbm5lbF07XG4gIH1cblxuICBwcml2YXRlIGluaXRTY2FsZXMobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBTY2FsZUluZGV4IHtcbiAgICByZXR1cm4gU0NBTEVfQ0hBTk5FTFMucmVkdWNlKChzY2FsZXMsIGNoYW5uZWwpID0+IHtcbiAgICAgIGxldCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcbiAgICAgIGxldCBzcGVjaWZpZWRTY2FsZTogU2NhbGU7XG5cbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcblxuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmO1xuICAgICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuc2NhbGU7XG4gICAgICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLmNvbmRpdGlvblsnc2NhbGUnXTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3gnKSB7XG4gICAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueDIpO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneScpIHtcbiAgICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy55Mik7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZERlZikge1xuICAgICAgICBzY2FsZXNbY2hhbm5lbF0gPSBzcGVjaWZpZWRTY2FsZSB8fCB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzY2FsZXM7XG4gICAgfSwge30gYXMgU2NhbGVJbmRleCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRBeGVzKGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogQXhpc0luZGV4IHtcbiAgICByZXR1cm4gW1gsIFldLnJlZHVjZShmdW5jdGlvbihfYXhpcywgY2hhbm5lbCkge1xuICAgICAgLy8gUG9zaXRpb24gQXhpc1xuXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgQ29uZGl0aW9uRmllbGREZWZcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpIHx8XG4gICAgICAgICAgKGNoYW5uZWwgPT09IFggJiYgaXNGaWVsZERlZihlbmNvZGluZy54MikpIHx8XG4gICAgICAgICAgKGNoYW5uZWwgPT09IFkgJiYgaXNGaWVsZERlZihlbmNvZGluZy55MikpKSB7XG5cbiAgICAgICAgY29uc3QgYXhpc1NwZWMgPSBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZi5heGlzIDogbnVsbDtcblxuICAgICAgICAvLyBXZSBubyBsb25nZXIgc3VwcG9ydCBmYWxzZSBpbiB0aGUgc2NoZW1hLCBidXQgd2Uga2VlcCBmYWxzZSBoZXJlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoYXhpc1NwZWMgIT09IG51bGwgJiYgYXhpc1NwZWMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgX2F4aXNbY2hhbm5lbF0gPSB7XG4gICAgICAgICAgICAuLi5heGlzU3BlY1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfYXhpcztcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRMZWdlbmQoZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBMZWdlbmRJbmRleCB7XG4gICAgcmV0dXJuIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLnJlZHVjZShmdW5jdGlvbihfbGVnZW5kLCBjaGFubmVsKSB7XG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICBjb25zdCBsZWdlbmQgPSBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZi5sZWdlbmQgOlxuICAgICAgICAgIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSA/IGNoYW5uZWxEZWYuY29uZGl0aW9uWydsZWdlbmQnXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKGxlZ2VuZCAhPT0gbnVsbCAmJiBsZWdlbmQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgX2xlZ2VuZFtjaGFubmVsXSA9IHsuLi5sZWdlbmR9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfbGVnZW5kO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZURhdGEoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuZGF0YSA9IHBhcnNlRGF0YSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUxheW91dFNpemUoKSB7XG4gICAgcGFyc2VVbml0TGF5b3V0U2l6ZSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBwYXJzZVVuaXRTZWxlY3Rpb24odGhpcywgdGhpcy5zZWxlY3Rpb24pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTWFya0dyb3VwKCkge1xuICAgIHRoaXMuY29tcG9uZW50Lm1hcmsgPSBwYXJzZU1hcmtHcm91cCh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUF4aXNBbmRIZWFkZXIoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuYXhlcyA9IHBhcnNlVW5pdEF4aXModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHModGhpcywgc2lnbmFscyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKHRoaXMsIFtdKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGF0YTogVmdEYXRhW10pOiBWZ0RhdGFbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEodGhpcywgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVMYXlvdXRTaWduYWxzKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTWFya3MoKSB7XG4gICAgbGV0IG1hcmtzID0gdGhpcy5jb21wb25lbnQubWFyayB8fCBbXTtcblxuICAgIC8vIElmIHRoaXMgdW5pdCBpcyBwYXJ0IG9mIGEgbGF5ZXIsIHNlbGVjdGlvbnMgc2hvdWxkIGF1Z21lbnRcbiAgICAvLyBhbGwgaW4gY29uY2VydCByYXRoZXIgdGhhbiBlYWNoIHVuaXQgaW5kaXZpZHVhbGx5LiBUaGlzXG4gICAgLy8gZW5zdXJlcyBjb3JyZWN0IGludGVybGVhdmluZyBvZiBjbGlwcGluZyBhbmQgYnJ1c2hlZCBtYXJrcy5cbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICFpc0xheWVyTW9kZWwodGhpcy5wYXJlbnQpKSB7XG4gICAgICBtYXJrcyA9IGFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzKHRoaXMsIG1hcmtzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFya3MubWFwKHRoaXMuY29ycmVjdERhdGFOYW1lcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaXplKCk6IFZnRW5jb2RlRW50cnkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogdGhpcy5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLFxuICAgICAgaGVpZ2h0OiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ2hlaWdodCcpXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNYXBwaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmVuY29kaW5nO1xuICB9XG5cbiAgcHVibGljIHRvU3BlYyhleGNsdWRlQ29uZmlnPzogYW55LCBleGNsdWRlRGF0YT86IGFueSkge1xuICAgIGNvbnN0IGVuY29kaW5nID0gZHVwbGljYXRlKHRoaXMuZW5jb2RpbmcpO1xuICAgIGxldCBzcGVjOiBhbnk7XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFyazogdGhpcy5tYXJrRGVmLFxuICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSBkdXBsaWNhdGUodGhpcy5jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IGR1cGxpY2F0ZSh0aGlzLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHJldHVybiBzcGVjO1xuICB9XG5cbiAgcHVibGljIGdldCBtYXJrKCk6IE1hcmsge1xuICAgIHJldHVybiB0aGlzLm1hcmtEZWYudHlwZTtcbiAgfVxuXG4gIHB1YmxpYyBjaGFubmVsSGFzRmllbGQoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmNoYW5uZWxIYXNGaWVsZCh0aGlzLmVuY29kaW5nLCBjaGFubmVsKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZERlZihjaGFubmVsOiBTaW5nbGVEZWZDaGFubmVsKTogRmllbGREZWY8c3RyaW5nPiB7XG4gICAgY29uc3QgY2hhbm5lbERlZiA9IHRoaXMuZW5jb2RpbmdbY2hhbm5lbF0gYXMgQ2hhbm5lbERlZjxzdHJpbmc+O1xuICAgIHJldHVybiBnZXRGaWVsZERlZihjaGFubmVsRGVmKTtcbiAgfVxufVxuIl19