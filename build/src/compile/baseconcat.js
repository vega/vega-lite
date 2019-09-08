import { keys } from '../util';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { Model } from './model';
export class BaseConcatModel extends Model {
    constructor(spec, specType, parent, parentGivenName, config, repeater, resolve) {
        super(spec, specType, parent, parentGivenName, config, repeater, resolve);
    }
    parseData() {
        this.component.data = parseData(this);
        this.children.forEach(child => {
            child.parseData();
        });
    }
    parseSelections() {
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        for (const child of this.children) {
            child.parseSelections();
            keys(child.component.selection).forEach(key => {
                this.component.selection[key] = child.component.selection[key];
            });
        }
    }
    parseMarkGroup() {
        for (const child of this.children) {
            child.parseMarkGroup();
        }
    }
    parseAxesAndHeaders() {
        for (const child of this.children) {
            child.parseAxesAndHeaders();
        }
        // TODO(#2415): support shared axes
    }
    assembleSelectionTopLevelSignals(signals) {
        return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
    }
    assembleSignals() {
        this.children.forEach(child => child.assembleSignals());
        return [];
    }
    assembleLayoutSignals() {
        return this.children.reduce((signals, child) => {
            return [...signals, ...child.assembleLayoutSignals()];
        }, assembleLayoutSignals(this));
    }
    assembleSelectionData(data) {
        return this.children.reduce((db, child) => child.assembleSelectionData(db), data);
    }
    assembleMarks() {
        // only children have marks
        return this.children.map(child => {
            const title = child.assembleTitle();
            const style = child.assembleGroupStyle();
            const encodeEntry = child.assembleGroupEncodeEntry(false);
            return Object.assign(Object.assign(Object.assign(Object.assign({ type: 'group', name: child.getName('group') }, (title ? { title } : {})), (style ? { style } : {})), (encodeEntry ? { encode: { update: encodeEntry } } : {})), child.assembleGroup());
        });
    }
}
//# sourceMappingURL=baseconcat.js.map