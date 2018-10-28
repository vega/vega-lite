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
        var encoding = (_this.encoding = normalizeEncoding(replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark));
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
                if (axisSpec !== null) {
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
                var legend = isFieldDef(channelDef)
                    ? channelDef.legend
                    : hasConditionalFieldDef(channelDef)
                        ? channelDef.condition['legend']
                        : null;
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
//# sourceMappingURL=unit.js.map