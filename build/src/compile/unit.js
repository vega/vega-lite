import { GEOPOSITION_CHANNELS, NONPOSITION_SCALE_CHANNELS, SCALE_CHANNELS, supportLegend, X, Y } from '../channel';
import { getTypedFieldDef, hasConditionalFieldDef, isFieldDef } from '../channeldef';
import * as vlEncoding from '../encoding';
import { normalizeEncoding } from '../encoding';
import { GEOSHAPE, isMarkDef } from '../mark';
import { stack } from '../stack';
import { assembleAxisSignals } from './axis/assemble';
import { parseUnitAxes } from './axis/parse';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { parseUnitLayoutSize } from './layoutsize/parse';
import { normalizeMarkDef } from './mark/init';
import { parseMarkGroups } from './mark/mark';
import { isLayerModel, ModelWithField } from './model';
import { replaceRepeaterInEncoding } from './repeater';
import { assembleTopLevelSignals, assembleUnitSelectionData, assembleUnitSelectionMarks, assembleUnitSelectionSignals } from './selection/assemble';
import { parseUnitSelection } from './selection/parse';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends ModelWithField {
    constructor(spec, parent, parentGivenName, parentGivenSize = {}, repeater, config, fit) {
        super(spec, 'unit', parent, parentGivenName, config, repeater, undefined, spec.view);
        this.fit = fit;
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
                // Need to specify generic for hasConditionalFieldDef as the value type can vary across channels
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
                    : hasConditionalFieldDef(channelDef) // Need to specify generic for hasConditionalFieldDef as the value type can vary across channels
                        ? channelDef.condition['legend']
                        : null;
                if (legend !== null && legend !== false && supportLegend(channel)) {
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
    parseSelections() {
        this.component.selection = parseUnitSelection(this, this.selection);
    }
    parseMarkGroup() {
        this.component.mark = parseMarkGroups(this);
    }
    parseAxesAndHeaders() {
        this.component.axes = parseUnitAxes(this);
    }
    assembleSelectionTopLevelSignals(signals) {
        return assembleTopLevelSignals(this, signals);
    }
    assembleSignals() {
        return [...assembleAxisSignals(this), ...assembleUnitSelectionSignals(this, [])];
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
    getMapping() {
        return this.encoding;
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