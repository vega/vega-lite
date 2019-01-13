import { keys } from '../util';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { Model } from './model';
export class BaseConcatModel extends Model {
    constructor(spec, parent, parentGivenName, config, repeater, resolve) {
        super(spec, parent, parentGivenName, config, repeater, resolve);
    }
    parseData() {
        this.component.data = parseData(this);
        this.children.forEach(child => {
            child.parseData();
        });
    }
    parseSelection() {
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        for (const child of this.children) {
            child.parseSelection();
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
    parseAxisAndHeader() {
        for (const child of this.children) {
            child.parseAxisAndHeader();
        }
        // TODO(#2415): support shared axes
    }
    assembleSelectionTopLevelSignals(signals) {
        return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
    }
    assembleSelectionSignals() {
        this.children.forEach(child => child.assembleSelectionSignals());
        return [];
    }
    assembleLayoutSignals() {
        return this.children.reduce((signals, child) => {
            return signals.concat(child.assembleLayoutSignals());
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
            const layoutSizeEncodeEntry = child.assembleLayoutSize();
            return Object.assign({ type: 'group', name: child.getName('group') }, (title ? { title } : {}), (style ? { style } : {}), (layoutSizeEncodeEntry
                ? {
                    encode: {
                        update: layoutSizeEncodeEntry
                    }
                }
                : {}), child.assembleGroup());
        });
    }
}
//# sourceMappingURL=baseconcat.js.map