import * as log from '../log';
import { isLayerSpec, isUnitSpec } from '../spec';
import { flatten, keys } from '../util';
import { parseLayerAxis } from './axis/parse';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { parseLayerLayoutSize } from './layoutsize/parse';
import { assembleLegends } from './legend/assemble';
import { Model } from './model';
import { assembleLayerSelectionMarks } from './selection/selection';
import { UnitModel } from './unit';
export class LayerModel extends Model {
    constructor(spec, parent, parentGivenName, parentGivenSize, repeater, config, fit) {
        super(spec, parent, parentGivenName, config, repeater, spec.resolve);
        this.type = 'layer';
        const layoutSize = Object.assign({}, parentGivenSize, (spec.width ? { width: spec.width } : {}), (spec.height ? { height: spec.height } : {}));
        this.initSize(layoutSize);
        this.children = spec.layer.map((layer, i) => {
            if (isLayerSpec(layer)) {
                return new LayerModel(layer, this, this.getName('layer_' + i), layoutSize, repeater, config, fit);
            }
            if (isUnitSpec(layer)) {
                return new UnitModel(layer, this, this.getName('layer_' + i), layoutSize, repeater, config, fit);
            }
            throw new Error(log.message.INVALID_SPEC);
        });
    }
    parseData() {
        this.component.data = parseData(this);
        for (const child of this.children) {
            child.parseData();
        }
    }
    parseLayoutSize() {
        parseLayerLayoutSize(this);
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
        parseLayerAxis(this);
    }
    assembleSelectionTopLevelSignals(signals) {
        return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
    }
    // TODO: Support same named selections across children.
    assembleSelectionSignals() {
        return this.children.reduce((signals, child) => {
            return signals.concat(child.assembleSelectionSignals());
        }, []);
    }
    assembleLayoutSignals() {
        return this.children.reduce((signals, child) => {
            return signals.concat(child.assembleLayoutSignals());
        }, assembleLayoutSignals(this));
    }
    assembleSelectionData(data) {
        return this.children.reduce((db, child) => child.assembleSelectionData(db), data);
    }
    assembleTitle() {
        let title = super.assembleTitle();
        if (title) {
            return title;
        }
        // If title does not provide layer, look into children
        for (const child of this.children) {
            title = child.assembleTitle();
            if (title) {
                return title;
            }
        }
        return undefined;
    }
    assembleLayout() {
        return null;
    }
    assembleMarks() {
        return assembleLayerSelectionMarks(this, flatten(this.children.map(child => {
            return child.assembleMarks();
        })));
    }
    assembleLegends() {
        return this.children.reduce((legends, child) => {
            return legends.concat(child.assembleLegends());
        }, assembleLegends(this));
    }
}
//# sourceMappingURL=layer.js.map