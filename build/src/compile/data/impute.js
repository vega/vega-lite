import { isFieldDef } from '../../fielddef';
import { isImputeSequence } from '../../transform';
import { duplicate, hash } from '../../util';
import { pathGroupingFields } from '../mark/mark';
import { DataFlowNode } from './dataflow';
export class ImputeNode extends DataFlowNode {
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    clone() {
        return new ImputeNode(null, duplicate(this.transform));
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
            return new ImputeNode(parent, Object.assign({ impute: imputedChannel.field, key: keyChannel.field }, (method ? { method } : {}), (value !== undefined ? { value } : {}), (frame ? { frame } : {}), (keyvals !== undefined ? { keyvals } : {}), (groupbyFields.length ? { groupby: groupbyFields } : {})));
        }
        return null;
    }
    hash() {
        return `Impute ${hash(this.transform)}`;
    }
    assemble() {
        const { impute, key, keyvals, method, groupby, value, frame = [null, null] } = this.transform;
        const initialImpute = Object.assign({ type: 'impute', field: impute, key }, (keyvals ? { keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals } : {}), { method: 'value' }, (groupby ? { groupby } : {}), { value: null });
        let setImputedField;
        if (method && method !== 'value') {
            const deriveNewField = Object.assign({ type: 'window', as: [`imputed_${impute}_value`], ops: [method], fields: [impute], frame, ignorePeers: false }, (groupby ? { groupby } : {}));
            const replaceOriginal = {
                type: 'formula',
                expr: `datum.${impute} === null ? datum.imputed_${impute}_value : datum.${impute}`,
                as: impute
            };
            setImputedField = [deriveNewField, replaceOriginal];
        }
        else {
            const replaceWithValue = {
                type: 'formula',
                expr: `datum.${impute} === null ? ${value} : datum.${impute}`,
                as: impute
            };
            setImputedField = [replaceWithValue];
        }
        return [initialImpute, ...setImputedField];
    }
}
//# sourceMappingURL=impute.js.map