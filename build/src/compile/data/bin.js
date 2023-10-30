import { isString } from 'vega-util';
import { binToString, isBinning, isParameterExtent } from '../../bin';
import { binRequiresRange, isTypedFieldDef, normalizeBin, vgField } from '../../channeldef';
import { duplicate, hash, isEmpty, keys, replacePathInField, unique, vals } from '../../util';
import { binFormatExpression } from '../format';
import { isUnitModel } from '../model';
import { parseSelectionExtent } from '../selection/parse';
import { DataFlowNode } from './dataflow';
function rangeFormula(model, fieldDef, channel, config) {
    if (binRequiresRange(fieldDef, channel)) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        const guide = isUnitModel(model)
            ? model.axis(channel) ?? model.legend(channel) ?? {}
            : {};
        const startField = vgField(fieldDef, { expr: 'datum' });
        const endField = vgField(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: vgField(fieldDef, { binSuffix: 'range', forAs: true }),
            formula: binFormatExpression(startField, endField, guide.format, guide.formatType, config)
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
export function getBinSignalName(model, field, bin) {
    const normalizedBin = normalizeBin(bin, undefined) ?? {};
    const key = binKey(normalizedBin, field);
    return model.getName(`${key}_bins`);
}
function isBinTransform(t) {
    return 'as' in t;
}
function createBinComponent(t, bin, model) {
    let as;
    let span;
    if (isBinTransform(t)) {
        as = isString(t.as) ? [t.as, `${t.as}_end`] : [t.as[0], t.as[1]];
    }
    else {
        as = [vgField(t, { forAs: true }), vgField(t, { binSuffix: 'end', forAs: true })];
    }
    const normalizedBin = { ...normalizeBin(bin, undefined) };
    const key = binKey(normalizedBin, t.field);
    const { signal, extentSignal } = getSignalsFromModel(model, key);
    if (isParameterExtent(normalizedBin.extent)) {
        const ext = normalizedBin.extent;
        span = parseSelectionExtent(model, ext.param, ext);
        delete normalizedBin.extent; // Vega-Lite selection extent map to Vega's span property.
    }
    const binComponent = {
        bin: normalizedBin,
        field: t.field,
        as: [as],
        ...(signal ? { signal } : {}),
        ...(extentSignal ? { extentSignal } : {}),
        ...(span ? { span } : {})
    };
    return { key, binComponent };
}
export class BinNode extends DataFlowNode {
    clone() {
        return new BinNode(null, duplicate(this.bins));
    }
    constructor(parent, bins) {
        super(parent);
        this.bins = bins;
    }
    static makeFromEncoding(parent, model) {
        const bins = model.reduceFieldDef((binComponentIndex, fieldDef, channel) => {
            if (isTypedFieldDef(fieldDef) && isBinning(fieldDef.bin)) {
                const { key, binComponent } = createBinComponent(fieldDef, fieldDef.bin, model);
                binComponentIndex[key] = {
                    ...binComponent,
                    ...binComponentIndex[key],
                    ...rangeFormula(model, fieldDef, channel, model.config)
                };
            }
            return binComponentIndex;
        }, {});
        if (isEmpty(bins)) {
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
    /**
     * Merge bin nodes. This method either integrates the bin config from the other node
     * or if this node already has a bin config, renames the corresponding signal in the model.
     */
    merge(other, renameSignal) {
        for (const key of keys(other.bins)) {
            if (key in this.bins) {
                renameSignal(other.bins[key].signal, this.bins[key].signal);
                // Ensure that we don't have duplicate names for signal pairs
                this.bins[key].as = unique([...this.bins[key].as, ...other.bins[key].as], hash);
            }
            else {
                this.bins[key] = other.bins[key];
            }
        }
        for (const child of other.children) {
            other.removeChild(child);
            child.parent = this;
        }
        other.remove();
    }
    producedFields() {
        return new Set(vals(this.bins)
            .map(c => c.as)
            .flat(2));
    }
    dependentFields() {
        return new Set(vals(this.bins).map(c => c.field));
    }
    hash() {
        return `Bin ${hash(this.bins)}`;
    }
    assemble() {
        return vals(this.bins).flatMap(bin => {
            const transform = [];
            const [binAs, ...remainingAs] = bin.as;
            const { extent, ...params } = bin.bin;
            const binTrans = {
                type: 'bin',
                field: replacePathInField(bin.field),
                as: binAs,
                signal: bin.signal,
                ...(!isParameterExtent(extent) ? { extent } : { extent: null }),
                ...(bin.span ? { span: { signal: `span(${bin.span})` } } : {}),
                ...params
            };
            if (!extent && bin.extentSignal) {
                transform.push({
                    type: 'extent',
                    field: replacePathInField(bin.field),
                    signal: bin.extentSignal
                });
                binTrans.extent = { signal: bin.extentSignal };
            }
            transform.push(binTrans);
            for (const as of remainingAs) {
                for (let i = 0; i < 2; i++) {
                    transform.push({
                        type: 'formula',
                        expr: vgField({ field: binAs[i] }, { expr: 'datum' }),
                        as: as[i]
                    });
                }
            }
            if (bin.formula) {
                transform.push({
                    type: 'formula',
                    expr: bin.formula,
                    as: bin.formulaAs
                });
            }
            return transform;
        });
    }
}
//# sourceMappingURL=bin.js.map