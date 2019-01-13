import { GEOPOSITION_CHANNELS, NONPOSITION_SCALE_CHANNELS, SCALE_CHANNELS, X, Y } from '../channel';
import { normalizeEncoding } from '../encoding';
import * as vlEncoding from '../encoding';
import { getTypedFieldDef, hasConditionalFieldDef, isFieldDef } from '../fielddef';
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
export class UnitModel extends ModelWithField {
    constructor(spec, parent, parentGivenName, parentGivenSize = {}, repeater, config, fit) {
        super(spec, parent, parentGivenName, config, repeater, undefined);
        this.fit = fit;
        this.type = 'unit';
        this.specifiedScales = {};
        this.specifiedAxes = {};
        this.specifiedLegends = {};
        this.specifiedProjection = {};
        this.selection = {};
        this.children = [];
        this.initSize(Object.assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {})));
        const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        const encoding = (this.encoding = normalizeEncoding(replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark));
        this.markDef = normalizeMarkDef(spec.mark, encoding, config);
        // calculate stack properties
        this.stack = stack(mark, encoding, this.config.stack);
        this.specifiedScales = this.initScales(mark, encoding);
        this.specifiedAxes = this.initAxes(encoding);
        this.specifiedLegends = this.initLegend(encoding);
        this.specifiedProjection = spec.projection;
        // Selections will be initialized upon parse.
        this.selection = spec.selection;
    }
    get hasProjection() {
        const { encoding } = this;
        const isGeoShapeMark = this.mark === GEOSHAPE;
        const hasGeoPosition = encoding && GEOPOSITION_CHANNELS.some(channel => isFieldDef(encoding[channel]));
        return isGeoShapeMark || hasGeoPosition;
    }
    /**
     * Return specified Vega-lite scale domain for a particular channel
     * @param channel
     */
    scaleDomain(channel) {
        const scale = this.specifiedScales[channel];
        return scale ? scale.domain : undefined;
    }
    axis(channel) {
        return this.specifiedAxes[channel];
    }
    legend(channel) {
        return this.specifiedLegends[channel];
    }
    initScales(mark, encoding) {
        return SCALE_CHANNELS.reduce((scales, channel) => {
            let fieldDef;
            let specifiedScale;
            const channelDef = encoding[channel];
            if (isFieldDef(channelDef)) {
                fieldDef = channelDef;
                specifiedScale = channelDef.scale;
            }
            else if (hasConditionalFieldDef(channelDef)) {
                fieldDef = channelDef.condition;
                specifiedScale = channelDef.condition['scale'];
            }
            if (fieldDef) {
                scales[channel] = specifiedScale || {};
            }
            return scales;
        }, {});
    }
    initAxes(encoding) {
        return [X, Y].reduce((_axis, channel) => {
            // Position Axis
            // TODO: handle ConditionFieldDef
            const channelDef = encoding[channel];
            if (isFieldDef(channelDef) ||
                (channel === X && isFieldDef(encoding.x2)) ||
                (channel === Y && isFieldDef(encoding.y2))) {
                const axisSpec = isFieldDef(channelDef) ? channelDef.axis : null;
                if (axisSpec !== null) {
                    _axis[channel] = Object.assign({}, axisSpec);
                }
            }
            return _axis;
        }, {});
    }
    initLegend(encoding) {
        return NONPOSITION_SCALE_CHANNELS.reduce((_legend, channel) => {
            const channelDef = encoding[channel];
            if (channelDef) {
                const legend = isFieldDef(channelDef)
                    ? channelDef.legend
                    : hasConditionalFieldDef(channelDef)
                        ? channelDef.condition['legend']
                        : null;
                if (legend !== null && legend !== false) {
                    _legend[channel] = Object.assign({}, legend);
                }
            }
            return _legend;
        }, {});
    }
    parseData() {
        this.component.data = parseData(this);
    }
    parseLayoutSize() {
        parseUnitLayoutSize(this);
    }
    parseSelection() {
        this.component.selection = parseUnitSelection(this, this.selection);
    }
    parseMarkGroup() {
        this.component.mark = parseMarkGroup(this);
    }
    parseAxisAndHeader() {
        this.component.axes = parseUnitAxis(this);
    }
    assembleSelectionTopLevelSignals(signals) {
        return assembleTopLevelSignals(this, signals);
    }
    assembleSelectionSignals() {
        return assembleUnitSelectionSignals(this, []);
    }
    assembleSelectionData(data) {
        return assembleUnitSelectionData(this, data);
    }
    assembleLayout() {
        return null;
    }
    assembleLayoutSignals() {
        return assembleLayoutSignals(this);
    }
    assembleMarks() {
        let marks = this.component.mark || [];
        // If this unit is part of a layer, selections should augment
        // all in concert rather than each unit individually. This
        // ensures correct interleaving of clipping and brushed marks.
        if (!this.parent || !isLayerModel(this.parent)) {
            marks = assembleUnitSelectionMarks(this, marks);
        }
        return marks.map(this.correctDataNames);
    }
    assembleLayoutSize() {
        return {
            width: this.getSizeSignalRef('width'),
            height: this.getSizeSignalRef('height')
        };
    }
    getMapping() {
        return this.encoding;
    }
    toSpec(excludeConfig, excludeData) {
        const encoding = duplicate(this.encoding);
        let spec;
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
    }
    get mark() {
        return this.markDef.type;
    }
    channelHasField(channel) {
        return vlEncoding.channelHasField(this.encoding, channel);
    }
    fieldDef(channel) {
        const channelDef = this.encoding[channel];
        return getTypedFieldDef(channelDef);
    }
}
//# sourceMappingURL=unit.js.map