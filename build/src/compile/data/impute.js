import { isFieldDef } from '../../channeldef';
import { pathGroupingFields } from '../../encoding';
import { isImputeSequence } from '../../transform';
import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
export class ImputeNode extends DataFlowNode {
    clone() {
        return new ImputeNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    dependentFields() {
        return new Set([this.transform.impute, this.transform.key, ...(this.transform.groupby ?? [])]);
    }
    producedFields() {
        return new Set([this.transform.impute]);
    }
    processSequence(keyvals) {
        const { start = 0, stop, step } = keyvals;
        const result = [start, stop, ...(step ? [step] : [])].join(',');
        return { signal: `sequence(${result})` };
    }
    static makeFromTransform(parent, imputeTransform) {
        return new ImputeNode(parent, imputeTransform);
    }
    static makeFromEncoding(parent, model) {
        const encoding = model.encoding;
        const xDef = encoding.x;
        const yDef = encoding.y;
        if (isFieldDef(xDef) && isFieldDef(yDef)) {
            const imputedChannel = xDef.impute ? xDef : yDef.impute ? yDef : undefined;
            if (imputedChannel === undefined) {
                return undefined;
            }
            const keyChannel = xDef.impute ? yDef : yDef.impute ? xDef : undefined;
            const { method, value, frame, keyvals } = imputedChannel.impute;
            const groupbyFields = pathGroupingFields(model.mark, encoding);
            return new ImputeNode(parent, {
                impute: imputedChannel.field,
                key: keyChannel.field,
                ...(method ? { method } : {}),
                ...(value !== undefined ? { value } : {}),
                ...(frame ? { frame } : {}),
                ...(keyvals !== undefined ? { keyvals } : {}),
                ...(groupbyFields.length ? { groupby: groupbyFields } : {})
            });
        }
        return null;
    }
    hash() {
        return `Impute ${hash(this.transform)}`;
    }
    assemble() {
        const { impute, key, keyvals, method, groupby, value, frame = [null, null] } = this.transform;
        const imputeTransform = {
            type: 'impute',
            field: impute,
            key,
            ...(keyvals ? { keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals } : {}),
            method: 'value',
            ...(groupby ? { groupby } : {}),
            value: !method || method === 'value' ? value : null
        };
        if (method && method !== 'value') {
            const deriveNewField = {
                type: 'window',
                as: [`imputed_${impute}_value`],
                ops: [method],
                fields: [impute],
                frame,
                ignorePeers: false,
                ...(groupby ? { groupby } : {})
            };
            const replaceOriginal = {
                type: 'formula',
                expr: `datum.${impute} === null ? datum.imputed_${impute}_value : datum.${impute}`,
                as: impute
            };
            return [imputeTransform, deriveNewField, replaceOriginal];
        }
        else {
            return [imputeTransform];
        }
    }
}
//# sourceMappingURL=impute.js.map