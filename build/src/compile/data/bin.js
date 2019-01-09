import { isString } from 'vega-util';
import { binToString, isBinning } from '../../bin';
import { binRequiresRange, isTypedFieldDef, normalizeBin, vgField } from '../../fielddef';
import { duplicate, flatten, hash, keys, vals } from '../../util';
import { binFormatExpression } from '../common';
import { isUnitModel } from '../model';
import { DataFlowNode } from './dataflow';
function rangeFormula(model, fieldDef, channel, config) {
    if (binRequiresRange(fieldDef, channel)) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        const guide = isUnitModel(model) ? model.axis(channel) || model.legend(channel) || {} : {};
        const startField = vgField(fieldDef, { expr: 'datum' });
        const endField = vgField(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: vgField(fieldDef, { binSuffix: 'range', forAs: true }),
            formula: binFormatExpression(startField, endField, guide.format, config)
        };
    }
    return {};
}
function binKey(bin, field) {
    return `${binToString(bin)}_${field}`;
}
function getSignalsFromModel(model, key) {
    return {
        signal: model.getName(`${key}_bins`),
        extentSignal: model.getName(`${key}_extent`)
    };
}
function isBinTransform(t) {
    return 'as' in t;
}
function createBinComponent(t, bin, model) {
    let as;
    if (isBinTransform(t)) {
        as = isString(t.as) ? [t.as, `${t.as}_end`] : [t.as[0], t.as[1]];
    }
    else {
        as = [vgField(t, { forAs: true }), vgField(t, { binSuffix: 'end', forAs: true })];
    }
    const normalizedBin = normalizeBin(bin, undefined) || {};
    const key = binKey(normalizedBin, t.field);
    const { signal, extentSignal } = getSignalsFromModel(model, key);
    const binComponent = Object.assign({ bin: normalizedBin, field: t.field, as: as }, (signal ? { signal } : {}), (extentSignal ? { extentSignal } : {}));
    return { key, binComponent };
}
export class BinNode extends DataFlowNode {
    constructor(parent, bins) {
        super(parent);
        this.bins = bins;
    }
    clone() {
        return new BinNode(null, duplicate(this.bins));
    }
    static makeFromEncoding(parent, model) {
        const bins = model.reduceFieldDef((binComponentIndex, fieldDef, channel) => {
            if (isTypedFieldDef(fieldDef) && isBinning(fieldDef.bin)) {
                const { key, binComponent } = createBinComponent(fieldDef, fieldDef.bin, model);
                binComponentIndex[key] = Object.assign({}, binComponent, binComponentIndex[key], rangeFormula(model, fieldDef, channel, model.config));
            }
            return binComponentIndex;
        }, {});
        if (keys(bins).length === 0) {
            return null;
        }
        return new BinNode(parent, bins);
    }
    /**
     * Creates a bin node from BinTransform.
     * The optional parameter should provide
     */
    static makeFromTransform(parent, t, model) {
        const { key, binComponent } = createBinComponent(t, t.bin, model);
        return new BinNode(parent, {
            [key]: binComponent
        });
    }
    merge(other) {
        this.bins = Object.assign({}, this.bins, other.bins);
        other.remove();
    }
    producedFields() {
        return new Set(flatten(vals(this.bins).map(c => c.as)));
    }
    dependentFields() {
        return new Set(vals(this.bins).map(c => c.field));
    }
    hash() {
        return `Bin ${hash(this.bins)}`;
    }
    assemble() {
        return flatten(vals(this.bins).map(bin => {
            const transform = [];
            const binTrans = Object.assign({ type: 'bin', field: bin.field, as: bin.as, signal: bin.signal }, bin.bin);
            if (!bin.bin.extent && bin.extentSignal) {
                transform.push({
                    type: 'extent',
                    field: bin.field,
                    signal: bin.extentSignal
                });
                binTrans.extent = { signal: bin.extentSignal };
            }
            transform.push(binTrans);
            if (bin.formula) {
                transform.push({
                    type: 'formula',
                    expr: bin.formula,
                    as: bin.formulaAs
                });
            }
            return transform;
        }));
    }
}
//# sourceMappingURL=bin.js.map