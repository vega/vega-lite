import { isArray } from 'vega-util';
import { isConditionalAxisValue } from '../axis';
import { GEOPOSITION_CHANNELS, NONPOSITION_SCALE_CHANNELS, POSITION_SCALE_CHANNELS, SCALE_CHANNELS, supportLegend, X, Y } from '../channel';
import { getFieldDef, getFieldOrDatumDef, isFieldOrDatumDef, isTypedFieldDef } from '../channeldef';
import { isGraticuleGenerator } from '../data';
import * as vlEncoding from '../encoding';
import { initEncoding } from '../encoding';
import { replaceExprRef } from '../expr';
import { GEOSHAPE, isMarkDef } from '../mark';
import { isSelectionParameter } from '../selection';
import { isFrameMixins } from '../spec/base';
import { stack } from '../stack';
import { keys } from '../util';
import { assembleAxisSignals } from './axis/assemble';
import { parseUnitAxes } from './axis/parse';
import { signalOrValueRefWithCondition, signalRefOrValue } from './common';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { initLayoutSize } from './layoutsize/init';
import { parseUnitLayoutSize } from './layoutsize/parse';
import { defaultFilled, initMarkdef } from './mark/init';
import { parseMarkGroups } from './mark/mark';
import { isLayerModel, ModelWithField } from './model';
import { assembleTopLevelSignals, assembleUnitSelectionData, assembleUnitSelectionMarks, assembleUnitSelectionSignals } from './selection/assemble';
import { parseUnitSelection } from './selection/parse';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends ModelWithField {
    constructor(spec, parent, parentGivenName, parentGivenSize = {}, config) {
        super(spec, 'unit', parent, parentGivenName, config, undefined, isFrameMixins(spec) ? spec.view : undefined);
        this.specifiedScales = {};
        this.specifiedAxes = {};
        this.specifiedLegends = {};
        this.specifiedProjection = {};
        this.selection = [];
        this.children = [];
        const markDef = isMarkDef(spec.mark) ? { ...spec.mark } : { type: spec.mark };
        const mark = markDef.type;
        // Need to init filled before other mark properties because encoding depends on filled but other mark properties depend on types inside encoding
        if (markDef.filled === undefined) {
            markDef.filled = defaultFilled(markDef, config, {
                graticule: spec.data && isGraticuleGenerator(spec.data)
            });
        }
        const encoding = (this.encoding = initEncoding(spec.encoding || {}, mark, markDef.filled, config));
        this.markDef = initMarkdef(markDef, encoding, config);
        this.size = initLayoutSize({
            encoding,
            size: isFrameMixins(spec)
                ? {
                    ...parentGivenSize,
                    ...(spec.width ? { width: spec.width } : {}),
                    ...(spec.height ? { height: spec.height } : {})
                }
                : parentGivenSize
        });
        // calculate stack properties
        this.stack = stack(this.markDef, encoding);
        this.specifiedScales = this.initScales(mark, encoding);
        this.specifiedAxes = this.initAxes(encoding);
        this.specifiedLegends = this.initLegends(encoding);
        this.specifiedProjection = spec.projection;
        // Selections will be initialized upon parse.
        this.selection = (spec.params ?? []).filter(p => isSelectionParameter(p));
    }
    get hasProjection() {
        const { encoding } = this;
        const isGeoShapeMark = this.mark === GEOSHAPE;
        const hasGeoPosition = encoding && GEOPOSITION_CHANNELS.some(channel => isFieldOrDatumDef(encoding[channel]));
        return isGeoShapeMark || hasGeoPosition;
    }
    /**
     * Return specified Vega-Lite scale domain for a particular channel
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
            const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]);
            if (fieldOrDatumDef) {
                scales[channel] = this.initScale(fieldOrDatumDef.scale ?? {});
            }
            return scales;
        }, {});
    }
    initScale(scale) {
        const { domain, range } = scale;
        // TODO: we could simplify this function if we had a recursive replace function
        const scaleInternal = replaceExprRef(scale);
        if (isArray(domain)) {
            scaleInternal.domain = domain.map(signalRefOrValue);
        }
        if (isArray(range)) {
            scaleInternal.range = range.map(signalRefOrValue);
        }
        return scaleInternal;
    }
    initAxes(encoding) {
        return POSITION_SCALE_CHANNELS.reduce((_axis, channel) => {
            // Position Axis
            // TODO: handle ConditionFieldDef
            const channelDef = encoding[channel];
            if (isFieldOrDatumDef(channelDef) ||
                (channel === X && isFieldOrDatumDef(encoding.x2)) ||
                (channel === Y && isFieldOrDatumDef(encoding.y2))) {
                const axisSpec = isFieldOrDatumDef(channelDef) ? channelDef.axis : undefined;
                _axis[channel] = axisSpec
                    ? this.initAxis({ ...axisSpec }) // convert truthy value to object
                    : axisSpec;
            }
            return _axis;
        }, {});
    }
    initAxis(axis) {
        const props = keys(axis);
        const axisInternal = {};
        for (const prop of props) {
            const val = axis[prop];
            axisInternal[prop] = isConditionalAxisValue(val)
                ? signalOrValueRefWithCondition(val)
                : signalRefOrValue(val);
        }
        return axisInternal;
    }
    initLegends(encoding) {
        return NONPOSITION_SCALE_CHANNELS.reduce((_legend, channel) => {
            const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]);
            if (fieldOrDatumDef && supportLegend(channel)) {
                const legend = fieldOrDatumDef.legend;
                _legend[channel] = legend
                    ? replaceExprRef(legend) // convert truthy value to object
                    : legend;
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
        let marks = this.component.mark ?? [];
        // If this unit is part of a layer, selections should augment
        // all in concert rather than each unit individually. This
        // ensures correct interleaving of clipping and brushed marks.
        if (!this.parent || !isLayerModel(this.parent)) {
            marks = assembleUnitSelectionMarks(this, marks);
        }
        return marks.map(this.correctDataNames);
    }
    assembleGroupStyle() {
        const { style } = this.view || {};
        if (style !== undefined) {
            return style;
        }
        if (this.encoding.x || this.encoding.y) {
            return 'cell';
        }
        else {
            return 'view';
        }
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
        return getFieldDef(channelDef);
    }
    typedFieldDef(channel) {
        const fieldDef = this.fieldDef(channel);
        if (isTypedFieldDef(fieldDef)) {
            return fieldDef;
        }
        return null;
    }
}
//# sourceMappingURL=unit.js.map