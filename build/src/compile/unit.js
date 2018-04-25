import * as tslib_1 from "tslib";
import { NONPOSITION_SCALE_CHANNELS, SCALE_CHANNELS, X, Y } from '../channel';
import * as vlEncoding from '../encoding';
import { normalizeEncoding } from '../encoding';
import { getFieldDef, hasConditionalFieldDef, isFieldDef } from '../fielddef';
import { isMarkDef } from '../mark';
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
import { assembleTopLevelSignals, assembleUnitSelectionData, assembleUnitSelectionMarks, assembleUnitSelectionSignals, parseUnitSelection, } from './selection/selection';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBVSwwQkFBMEIsRUFBRSxjQUFjLEVBQWtDLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFckgsT0FBTyxLQUFLLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFXLGlCQUFpQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hELE9BQU8sRUFBdUIsV0FBVyxFQUFFLHNCQUFzQixFQUFFLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsRyxPQUFPLEVBQUMsU0FBUyxFQUFnQixNQUFNLFNBQVMsQ0FBQztBQU1qRCxPQUFPLEVBQUMsS0FBSyxFQUFrQixNQUFNLFVBQVUsQ0FBQztBQUNoRCxPQUFPLEVBQU8sU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBR3hDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUV2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDN0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUMsWUFBWSxFQUFTLGNBQWMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM1RCxPQUFPLEVBQWdCLHlCQUF5QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXBFLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIseUJBQXlCLEVBQ3pCLDBCQUEwQixFQUMxQiw0QkFBNEIsRUFDNUIsa0JBQWtCLEdBQ25CLE1BQU0sdUJBQXVCLENB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VyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztRQUVELGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxzQkFBVywyQkFBSTthQUFmO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQUVNLG1DQUFlLEdBQXRCLFVBQXVCLE9BQWdCO1FBQ3JDLE9BQU8sVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSw0QkFBUSxHQUFmLFVBQWdCLE9BQXlCO1FBQ3ZDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUF1QixDQUFDO1FBQ2hFLE9BQU8sV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFwT0QsQ0FBK0IsY0FBYyxHQW9PNUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXN9IGZyb20gJy4uL2F4aXMnO1xuaW1wb3J0IHtDaGFubmVsLCBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUywgU0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbCwgU2luZ2xlRGVmQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtFbmNvZGluZywgbm9ybWFsaXplRW5jb2Rpbmd9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgRmllbGREZWYsIGdldEZpZWxkRGVmLCBoYXNDb25kaXRpb25hbEZpZWxkRGVmLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi4vbGVnZW5kJztcbmltcG9ydCB7aXNNYXJrRGVmLCBNYXJrLCBNYXJrRGVmfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7UHJvamVjdGlvbn0gZnJvbSAnLi4vcHJvamVjdGlvbic7XG5pbXBvcnQge0RvbWFpbiwgU2NhbGV9IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7U2VsZWN0aW9uRGVmfSBmcm9tICcuLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi4vc29ydCc7XG5pbXBvcnQge0xheW91dFNpemVNaXhpbnMsIE5vcm1hbGl6ZWRVbml0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge3N0YWNrLCBTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7VmdEYXRhLCBWZ0VuY29kZUVudHJ5LCBWZ0xheW91dCwgVmdTaWduYWx9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7QXhpc0luZGV4fSBmcm9tICcuL2F4aXMvY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VVbml0QXhpc30gZnJvbSAnLi9heGlzL3BhcnNlJztcbmltcG9ydCB7cGFyc2VEYXRhfSBmcm9tICcuL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHthc3NlbWJsZUxheW91dFNpZ25hbHN9IGZyb20gJy4vbGF5b3V0c2l6ZS9hc3NlbWJsZSc7XG5pbXBvcnQge3BhcnNlVW5pdExheW91dFNpemV9IGZyb20gJy4vbGF5b3V0c2l6ZS9wYXJzZSc7XG5pbXBvcnQge0xlZ2VuZEluZGV4fSBmcm9tICcuL2xlZ2VuZC9jb21wb25lbnQnO1xuaW1wb3J0IHtub3JtYWxpemVNYXJrRGVmfSBmcm9tICcuL21hcmsvaW5pdCc7XG5pbXBvcnQge3BhcnNlTWFya0dyb3VwfSBmcm9tICcuL21hcmsvbWFyayc7XG5pbXBvcnQge2lzTGF5ZXJNb2RlbCwgTW9kZWwsIE1vZGVsV2l0aEZpZWxkfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZSwgcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZ30gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge1NjYWxlSW5kZXh9IGZyb20gJy4vc2NhbGUvY29tcG9uZW50JztcbmltcG9ydCB7XG4gIGFzc2VtYmxlVG9wTGV2ZWxTaWduYWxzLFxuICBhc3NlbWJsZVVuaXRTZWxlY3Rpb25EYXRhLFxuICBhc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyxcbiAgYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyxcbiAgcGFyc2VVbml0U2VsZWN0aW9uLFxufSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgbW9kZWwgb2YgVmVnYS1MaXRlIHNwZWNpZmljYXRpb24gZm9yIHRoZSBjb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXRNb2RlbCBleHRlbmRzIE1vZGVsV2l0aEZpZWxkIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6ICd1bml0JyA9ICd1bml0JztcbiAgcHVibGljIHJlYWRvbmx5IG1hcmtEZWY6IE1hcmtEZWY7XG4gIHB1YmxpYyByZWFkb25seSBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPjtcblxuICBwdWJsaWMgcmVhZG9ubHkgc3BlY2lmaWVkU2NhbGVzOiBTY2FsZUluZGV4ID0ge307XG5cbiAgcHVibGljIHJlYWRvbmx5IHN0YWNrOiBTdGFja1Byb3BlcnRpZXM7XG5cbiAgcHJvdGVjdGVkIHNwZWNpZmllZEF4ZXM6IEF4aXNJbmRleCA9IHt9O1xuXG4gIHByb3RlY3RlZCBzcGVjaWZpZWRMZWdlbmRzOiBMZWdlbmRJbmRleCA9IHt9O1xuXG4gIHB1YmxpYyBzcGVjaWZpZWRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uID0ge307XG5cbiAgcHVibGljIHJlYWRvbmx5IHNlbGVjdGlvbjogRGljdDxTZWxlY3Rpb25EZWY+ID0ge307XG4gIHB1YmxpYyBjaGlsZHJlbjogTW9kZWxbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsXG4gICAgcGFyZW50R2l2ZW5TaXplOiBMYXlvdXRTaXplTWl4aW5zID0ge30sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZywgcHVibGljIGZpdDogYm9vbGVhbikge1xuXG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgcmVwZWF0ZXIsIHVuZGVmaW5lZCk7XG4gICAgdGhpcy5pbml0U2l6ZSh7XG4gICAgICAuLi5wYXJlbnRHaXZlblNpemUsXG4gICAgICAuLi4oc3BlYy53aWR0aCA/IHt3aWR0aDogc3BlYy53aWR0aH0gOiB7fSksXG4gICAgICAuLi4oc3BlYy5oZWlnaHQgPyB7aGVpZ2h0OiBzcGVjLmhlaWdodH0gOiB7fSlcbiAgICB9KTtcbiAgICBjb25zdCBtYXJrID0gaXNNYXJrRGVmKHNwZWMubWFyaykgPyBzcGVjLm1hcmsudHlwZSA6IHNwZWMubWFyaztcblxuICAgIGNvbnN0IGVuY29kaW5nID0gdGhpcy5lbmNvZGluZyA9IG5vcm1hbGl6ZUVuY29kaW5nKHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmcoc3BlYy5lbmNvZGluZyB8fCB7fSwgcmVwZWF0ZXIpLCBtYXJrKTtcblxuICAgIHRoaXMubWFya0RlZiA9IG5vcm1hbGl6ZU1hcmtEZWYoc3BlYy5tYXJrLCBlbmNvZGluZywgY29uZmlnKTtcblxuICAgIC8vIGNhbGN1bGF0ZSBzdGFjayBwcm9wZXJ0aWVzXG4gICAgdGhpcy5zdGFjayA9IHN0YWNrKG1hcmssIGVuY29kaW5nLCB0aGlzLmNvbmZpZy5zdGFjayk7XG4gICAgdGhpcy5zcGVjaWZpZWRTY2FsZXMgPSB0aGlzLmluaXRTY2FsZXMobWFyaywgZW5jb2RpbmcpO1xuXG4gICAgdGhpcy5zcGVjaWZpZWRBeGVzID0gdGhpcy5pbml0QXhlcyhlbmNvZGluZyk7XG4gICAgdGhpcy5zcGVjaWZpZWRMZWdlbmRzID0gdGhpcy5pbml0TGVnZW5kKGVuY29kaW5nKTtcbiAgICB0aGlzLnNwZWNpZmllZFByb2plY3Rpb24gPSBzcGVjLnByb2plY3Rpb247XG5cbiAgICAvLyBTZWxlY3Rpb25zIHdpbGwgYmUgaW5pdGlhbGl6ZWQgdXBvbiBwYXJzZS5cbiAgICB0aGlzLnNlbGVjdGlvbiA9IHNwZWMuc2VsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzcGVjaWZpZWQgVmVnYS1saXRlIHNjYWxlIGRvbWFpbiBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWxcbiAgICogQHBhcmFtIGNoYW5uZWxcbiAgICovXG4gIHB1YmxpYyBzY2FsZURvbWFpbihjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBEb21haW4ge1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF07XG4gICAgcmV0dXJuIHNjYWxlID8gc2NhbGUuZG9tYWluIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHNvcnQoY2hhbm5lbDogQ2hhbm5lbCk6IHN0cmluZ1tdIHwgU29ydEZpZWxkPHN0cmluZz4gfCBTb3J0T3JkZXIge1xuICAgIHJldHVybiAodGhpcy5nZXRNYXBwaW5nKClbY2hhbm5lbF0gfHwge30pLnNvcnQ7XG4gIH1cblxuICBwdWJsaWMgYXhpcyhjaGFubmVsOiBDaGFubmVsKTogQXhpcyB7XG4gICAgcmV0dXJuIHRoaXMuc3BlY2lmaWVkQXhlc1tjaGFubmVsXTtcbiAgfVxuXG4gIHB1YmxpYyBsZWdlbmQoY2hhbm5lbDogQ2hhbm5lbCk6IExlZ2VuZCB7XG4gICAgcmV0dXJuIHRoaXMuc3BlY2lmaWVkTGVnZW5kc1tjaGFubmVsXTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFNjYWxlcyhtYXJrOiBNYXJrLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IFNjYWxlSW5kZXgge1xuICAgIHJldHVybiBTQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoKHNjYWxlcywgY2hhbm5lbCkgPT4ge1xuICAgICAgbGV0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgICAgbGV0IHNwZWNpZmllZFNjYWxlOiBTY2FsZTtcblxuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWY7XG4gICAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5zY2FsZTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICAgICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuY29uZGl0aW9uWydzY2FsZSddO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneCcpIHtcbiAgICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy54Mik7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5Jykge1xuICAgICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLnkyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIHNjYWxlc1tjaGFubmVsXSA9IHNwZWNpZmllZFNjYWxlIHx8IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNjYWxlcztcbiAgICB9LCB7fSBhcyBTY2FsZUluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdEF4ZXMoZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBBeGlzSW5kZXgge1xuICAgIHJldHVybiBbWCwgWV0ucmVkdWNlKGZ1bmN0aW9uKF9heGlzLCBjaGFubmVsKSB7XG4gICAgICAvLyBQb3NpdGlvbiBBeGlzXG5cbiAgICAgIC8vIFRPRE86IGhhbmRsZSBDb25kaXRpb25GaWVsZERlZlxuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikgfHxcbiAgICAgICAgICAoY2hhbm5lbCA9PT0gWCAmJiBpc0ZpZWxkRGVmKGVuY29kaW5nLngyKSkgfHxcbiAgICAgICAgICAoY2hhbm5lbCA9PT0gWSAmJiBpc0ZpZWxkRGVmKGVuY29kaW5nLnkyKSkpIHtcblxuICAgICAgICBjb25zdCBheGlzU3BlYyA9IGlzRmllbGREZWYoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmLmF4aXMgOiBudWxsO1xuXG4gICAgICAgIC8vIFdlIG5vIGxvbmdlciBzdXBwb3J0IGZhbHNlIGluIHRoZSBzY2hlbWEsIGJ1dCB3ZSBrZWVwIGZhbHNlIGhlcmUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChheGlzU3BlYyAhPT0gbnVsbCAmJiBheGlzU3BlYyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBfYXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgICAgIC4uLmF4aXNTcGVjXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9heGlzO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdExlZ2VuZChlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPik6IExlZ2VuZEluZGV4IHtcbiAgICByZXR1cm4gTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKF9sZWdlbmQsIGNoYW5uZWwpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGFubmVsRGVmKSB7XG4gICAgICAgIGNvbnN0IGxlZ2VuZCA9IGlzRmllbGREZWYoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmLmxlZ2VuZCA6XG4gICAgICAgICAgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpID8gY2hhbm5lbERlZi5jb25kaXRpb25bJ2xlZ2VuZCddIDogbnVsbDtcblxuICAgICAgICBpZiAobGVnZW5kICE9PSBudWxsICYmIGxlZ2VuZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBfbGVnZW5kW2NoYW5uZWxdID0gey4uLmxlZ2VuZH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9sZWdlbmQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZVVuaXRMYXlvdXRTaXplKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHBhcnNlVW5pdFNlbGVjdGlvbih0aGlzLCB0aGlzLnNlbGVjdGlvbik7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgdGhpcy5jb21wb25lbnQubWFyayA9IHBhcnNlTWFya0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5heGVzID0gcGFyc2VVbml0QXhpcyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzOiBhbnlbXSk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZVRvcExldmVsU2lnbmFscyh0aGlzLCBzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHModGhpcywgW10pO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YSh0aGlzLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiBhc3NlbWJsZUxheW91dFNpZ25hbHModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVNYXJrcygpIHtcbiAgICBsZXQgbWFya3MgPSB0aGlzLmNvbXBvbmVudC5tYXJrIHx8IFtdO1xuXG4gICAgLy8gSWYgdGhpcyB1bml0IGlzIHBhcnQgb2YgYSBsYXllciwgc2VsZWN0aW9ucyBzaG91bGQgYXVnbWVudFxuICAgIC8vIGFsbCBpbiBjb25jZXJ0IHJhdGhlciB0aGFuIGVhY2ggdW5pdCBpbmRpdmlkdWFsbHkuIFRoaXNcbiAgICAvLyBlbnN1cmVzIGNvcnJlY3QgaW50ZXJsZWF2aW5nIG9mIGNsaXBwaW5nIGFuZCBicnVzaGVkIG1hcmtzLlxuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIWlzTGF5ZXJNb2RlbCh0aGlzLnBhcmVudCkpIHtcbiAgICAgIG1hcmtzID0gYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3ModGhpcywgbWFya3MpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrcy5tYXAodGhpcy5jb3JyZWN0RGF0YU5hbWVzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpemUoKTogVmdFbmNvZGVFbnRyeSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiB0aGlzLmdldFNpemVTaWduYWxSZWYoJ3dpZHRoJyksXG4gICAgICBoZWlnaHQ6IHRoaXMuZ2V0U2l6ZVNpZ25hbFJlZignaGVpZ2h0JylcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1hcHBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2Rpbmc7XG4gIH1cblxuICBwdWJsaWMgdG9TcGVjKGV4Y2x1ZGVDb25maWc/OiBhbnksIGV4Y2x1ZGVEYXRhPzogYW55KSB7XG4gICAgY29uc3QgZW5jb2RpbmcgPSBkdXBsaWNhdGUodGhpcy5lbmNvZGluZyk7XG4gICAgbGV0IHNwZWM6IGFueTtcblxuICAgIHNwZWMgPSB7XG4gICAgICBtYXJrOiB0aGlzLm1hcmtEZWYsXG4gICAgICBlbmNvZGluZzogZW5jb2RpbmdcbiAgICB9O1xuXG4gICAgaWYgKCFleGNsdWRlQ29uZmlnKSB7XG4gICAgICBzcGVjLmNvbmZpZyA9IGR1cGxpY2F0ZSh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWYgKCFleGNsdWRlRGF0YSkge1xuICAgICAgc3BlYy5kYXRhID0gZHVwbGljYXRlKHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGRlZmF1bHRzXG4gICAgcmV0dXJuIHNwZWM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IG1hcmsoKTogTWFyayB7XG4gICAgcmV0dXJuIHRoaXMubWFya0RlZi50eXBlO1xuICB9XG5cbiAgcHVibGljIGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcuY2hhbm5lbEhhc0ZpZWxkKHRoaXMuZW5jb2RpbmcsIGNoYW5uZWwpO1xuICB9XG5cbiAgcHVibGljIGZpZWxkRGVmKGNoYW5uZWw6IFNpbmdsZURlZkNoYW5uZWwpOiBGaWVsZERlZjxzdHJpbmc+IHtcbiAgICBjb25zdCBjaGFubmVsRGVmID0gdGhpcy5lbmNvZGluZ1tjaGFubmVsXSBhcyBDaGFubmVsRGVmPHN0cmluZz47XG4gICAgcmV0dXJuIGdldEZpZWxkRGVmKGNoYW5uZWxEZWYpO1xuICB9XG59XG4iXX0=