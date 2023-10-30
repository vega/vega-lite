import { array } from 'vega-util';
import * as log from '../log';
import { isLayerSpec, isUnitSpec } from '../spec';
import { keys } from '../util';
import { assembleAxisSignals } from './axis/assemble';
import { parseLayerAxes } from './axis/parse';
import { parseData } from './data/parse';
import { assembleLayoutSignals } from './layoutsize/assemble';
import { parseLayerLayoutSize } from './layoutsize/parse';
import { assembleLegends } from './legend/assemble';
import { Model } from './model';
import { assembleLayerSelectionMarks } from './selection/assemble';
import { UnitModel } from './unit';
export class LayerModel extends Model {
    constructor(spec, parent, parentGivenName, parentGivenSize, config) {
        super(spec, 'layer', parent, parentGivenName, config, spec.resolve, spec.view);
        const layoutSize = {
            ...parentGivenSize,
            ...(spec.width ? { width: spec.width } : {}),
            ...(spec.height ? { height: spec.height } : {})
        };
        this.children = spec.layer.map((layer, i) => {
            if (isLayerSpec(layer)) {
                return new LayerModel(layer, this, this.getName(`layer_${i}`), layoutSize, config);
            }
            else if (isUnitSpec(layer)) {
                return new UnitModel(layer, this, this.getName(`layer_${i}`), layoutSize, config);
            }
            throw new Error(log.message.invalidSpec(layer));
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
    parseSelections() {
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        for (const child of this.children) {
            child.parseSelections();
            for (const key of keys(child.component.selection)) {
                this.component.selection[key] = child.component.selection[key];
            }
        }
    }
    parseMarkGroup() {
        for (const child of this.children) {
            child.parseMarkGroup();
        }
    }
    parseAxesAndHeaders() {
        parseLayerAxes(this);
    }
    assembleSelectionTopLevelSignals(signals) {
        return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
    }
    // TODO: Support same named selections across children.
    assembleSignals() {
        return this.children.reduce((signals, child) => {
            return signals.concat(child.assembleSignals());
        }, assembleAxisSignals(this));
    }
    assembleLayoutSignals() {
        return this.children.reduce((signals, child) => {
            return signals.concat(child.assembleLayoutSignals());
        }, assembleLayoutSignals(this));
    }
    assembleSelectionData(data) {
        return this.children.reduce((db, child) => child.assembleSelectionData(db), data);
    }
    assembleGroupStyle() {
        const uniqueStyles = new Set();
        for (const child of this.children) {
            for (const style of array(child.assembleGroupStyle())) {
                uniqueStyles.add(style);
            }
        }
        const styles = Array.from(uniqueStyles);
        return styles.length > 1 ? styles : styles.length === 1 ? styles[0] : undefined;
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
        return assembleLayerSelectionMarks(this, this.children.flatMap(child => {
            return child.assembleMarks();
        }));
    }
    assembleLegends() {
        return this.children.reduce((legends, child) => {
            return legends.concat(child.assembleLegends());
        }, assembleLegends(this));
    }
}
//# sourceMappingURL=layer.js.map