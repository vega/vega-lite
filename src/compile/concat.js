import * as log from '../log/index.js';
import {isHConcatSpec, isVConcatSpec} from '../spec/index.js';
import {keys, vals} from '../util.js';
import {buildModel} from './buildmodel.js';
import {parseData} from './data/parse.js';
import {assembleLayoutSignals} from './layoutsize/assemble.js';
import {parseConcatLayoutSize} from './layoutsize/parse.js';
import {Model} from './model.js';
import {MULTI_VIEW_ANIMATION_UNSUPPORTED} from '../log/message.js';
import {isTimerSelection} from './selection/index.js';
export class ConcatModel extends Model {
  children;
  constructor(spec, parent, parentGivenName, config) {
    super(spec, 'concat', parent, parentGivenName, config, spec.resolve);
    if (spec.resolve?.axis?.x === 'shared' || spec.resolve?.axis?.y === 'shared') {
      log.warn(log.message.CONCAT_CANNOT_SHARE_AXIS);
    }
    this.children = this.getChildren(spec).map((child, i) => {
      return buildModel(child, this, this.getName(`concat_${i}`), undefined, config);
    });
  }
  parseData() {
    this.component.data = parseData(this);
    for (const child of this.children) {
      child.parseData();
    }
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
    if (vals(this.component.selection).some((selCmpt) => isTimerSelection(selCmpt))) {
      log.error(MULTI_VIEW_ANIMATION_UNSUPPORTED);
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
  getChildren(spec) {
    if (isVConcatSpec(spec)) {
      return spec.vconcat;
    } else if (isHConcatSpec(spec)) {
      return spec.hconcat;
    }
    return spec.concat;
  }
  parseLayoutSize() {
    parseConcatLayoutSize(this);
  }
  parseAxisGroup() {
    return null;
  }
  assembleSelectionTopLevelSignals(signals) {
    return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
  }
  assembleSignals() {
    this.children.forEach((child) => child.assembleSignals());
    return [];
  }
  assembleLayoutSignals() {
    const layoutSignals = assembleLayoutSignals(this);
    for (const child of this.children) {
      layoutSignals.push(...child.assembleLayoutSignals());
    }
    return layoutSignals;
  }
  assembleSelectionData(data) {
    return this.children.reduce((db, child) => child.assembleSelectionData(db), data);
  }
  assembleMarks() {
    // only children have marks
    return this.children.map((child) => {
      const title = child.assembleTitle();
      const style = child.assembleGroupStyle();
      const encodeEntry = child.assembleGroupEncodeEntry(false);
      return {
        type: 'group',
        name: child.getName('group'),
        ...(title ? {title} : {}),
        ...(style ? {style} : {}),
        ...(encodeEntry ? {encode: {update: encodeEntry}} : {}),
        ...child.assembleGroup(),
      };
    });
  }
  assembleGroupStyle() {
    return undefined;
  }
  assembleDefaultLayout() {
    const columns = this.layout.columns;
    return {
      ...(columns != null ? {columns} : {}),
      bounds: 'full',
      // Use align each so it can work with multiple plots with different size
      align: 'each',
    };
  }
}
//# sourceMappingURL=concat.js.map
