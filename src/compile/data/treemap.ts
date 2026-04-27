import {Transforms as VgTransform} from 'vega';
import {isFieldDef} from '../../channeldef.js';
import {HierarchyDef, isHierarchyStratifyDef} from '../../encoding.js';
import * as log from '../../log/index.js';
import {TREEMAP, TreemapLayoutMixins, TreemapNodes} from '../../mark.js';
import {hash} from '../../util.js';
import {UnitModel} from '../unit.js';
import {DataFlowNode} from './dataflow.js';

export interface TreemapComponent extends TreemapLayoutMixins {
  hierarchy: HierarchyDef<string>;

  /** Field used to size the treemap rectangles. If undefined, defaults to node count. */
  sizeField: string | undefined;

  nodes: TreemapNodes;
}

export class TreemapNode extends DataFlowNode {
  private _treemap: TreemapComponent;

  public clone() {
    return new TreemapNode(null, {...this._treemap});
  }

  constructor(parent: DataFlowNode, treemap: TreemapComponent) {
    super(parent);
    this._treemap = treemap;
  }

  public static makeFromEncoding(parent: DataFlowNode, model: UnitModel): TreemapNode | null {
    if (model.mark !== TREEMAP) {
      return null;
    }

    const hierarchyDef = model.encoding.hierarchy;
    if (!hierarchyDef) {
      log.warn('Treemap mark requires a hierarchy encoding channel.');
      return null;
    }

    const sizeEncoding = model.encoding.size;
    const sizeField = isFieldDef(sizeEncoding) ? sizeEncoding.field : undefined;

    const markDef = model.markDef;

    return new TreemapNode(parent, {
      hierarchy: hierarchyDef,
      sizeField,
      method: markDef.method,
      nodes: markDef.nodes ?? 'leaves',
      padding: markDef.padding,
      paddingInner: markDef.paddingInner,
      paddingOuter: markDef.paddingOuter,
      paddingTop: markDef.paddingTop,
      paddingRight: markDef.paddingRight,
      paddingBottom: markDef.paddingBottom,
      paddingLeft: markDef.paddingLeft,
      ratio: markDef.ratio,
      round: markDef.round,
    });
  }

  public dependentFields() {
    const out = new Set<string>();
    const {hierarchy, sizeField} = this._treemap;

    if (isHierarchyStratifyDef(hierarchy)) {
      out.add(hierarchy.key.field);
      out.add(hierarchy.parentKey.field);
    } else {
      for (const fieldDef of hierarchy.nest) {
        out.add(fieldDef.field);
      }
    }

    if (sizeField) {
      out.add(sizeField);
    }

    return out;
  }

  public producedFields() {
    return new Set(['x0', 'y0', 'x1', 'y1', 'depth', 'children']);
  }

  public hash() {
    return `Treemap ${hash(this._treemap)}`;
  }

  public assemble(): VgTransform[] {
    const transforms: VgTransform[] = [];
    const {
      hierarchy,
      sizeField,
      method,
      nodes,
      padding,
      paddingInner,
      paddingOuter,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      ratio,
      round,
    } = this._treemap;

    if (isHierarchyStratifyDef(hierarchy)) {
      transforms.push({
        type: 'stratify',
        key: hierarchy.key.field,
        parentKey: hierarchy.parentKey.field,
      });
    } else {
      transforms.push({
        type: 'nest',
        keys: hierarchy.nest.map((f) => f.field),
      });
    }

    transforms.push({
      type: 'treemap',
      method,
      field: sizeField,
      size: [{signal: 'width'}, {signal: 'height'}],
      padding,
      paddingInner,
      paddingOuter,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      ratio,
      round,
    });

    if (nodes === 'leaves') {
      transforms.push({type: 'filter', expr: '!datum.children'});
    } else if (nodes === 'internal') {
      transforms.push({type: 'filter', expr: 'datum.children'});
    }

    return transforms;
  }
}
