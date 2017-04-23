import {MAIN} from '../../data';
import {field} from '../../fielddef';
import {every, flatten, vals} from '../../util';
import {VgData} from '../../vega.schema';
import {Model} from '../model';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {NonPositiveFilterNode} from './nonpositivefilter';
import {NullFilterNode} from './nullfilter';
import {iterateFromLeaves} from './optimizers';
import * as optimizers from './optimizers';
import {OrderNode} from './pathorder';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {CalculateNode, FilterNode} from './transforms';


export const FACET_SCALE_PREFIX = 'scale_';

/**
 * Start optimization path from the root. Useful for removing nodes.
 */
function removeUnnecessaryNodes(node: DataFlowNode) {
  // remove empty non positive filter
  if (node instanceof NonPositiveFilterNode && every(vals(node.filter), b => b === false)) {
    node.remove();
  }

  // remove empty null filter nodes
  if (node instanceof NullFilterNode && every(vals(node.filteredFields), f => f === null)) {
    node.remove();
  }

  // remove output nodes that are not required
  if (node instanceof OutputNode && !node.required) {
    node.remove();
  }

  node.children.forEach(removeUnnecessaryNodes);
}

/**
 * Clones the subtree and ignores output nodes except for the leafs, which are renamed.
 */
function cloneSubtree(facet: FacetNode) {
  function clone(node: DataFlowNode): DataFlowNode[] {
    if (!(node instanceof OrderNode)) {  // we can ignore order ndoes beacuse they don't change the scale domain
      const copy = node.clone();

      if (copy instanceof OutputNode) {
        const newName = FACET_SCALE_PREFIX + facet.model.getName(copy.source);
        copy.source = newName;

        facet.model.component.data.outputNodes[newName] = copy;

        flatten(node.children.map(clone)).forEach((n: DataFlowNode) => n.parent = copy);
      } else if (copy instanceof AggregateNode || copy instanceof StackNode) {
        copy.addDimensions(facet.fields);

        flatten(node.children.map(clone)).forEach((n: DataFlowNode) => n.parent = copy);
      } else {
        flatten(node.children.map(clone)).forEach((n: DataFlowNode) => n.parent = copy);
      }

      return [copy];
    }

    return flatten(node.children.map(clone));
  }
  return clone;
}

/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
function moveFacetDown(node: DataFlowNode) {
  if (node instanceof FacetNode) {
    if (node.numChildren() === 1 && !(node.children[0] instanceof OutputNode)) {
      // move down until we hit a fork or output node

      const child = node.children[0];

      if (child instanceof AggregateNode || child instanceof StackNode) {
        child.addDimensions(node.fields);
      }

      child.swapWithParent();
      moveFacetDown(node);
    } else {
      // move main to facet
      moveMainDownToFacet(node.model.component.data.main);

      // replicate the subtree and place it before the facet's main node
      const copy: DataFlowNode[] = flatten(node.children.map(cloneSubtree(node)));
      copy.forEach(c => c.parent = node.model.component.data.main);
    }
  } else {
    node.children.forEach(moveFacetDown);
  }
}

function moveMainDownToFacet(node: DataFlowNode) {
  if (node instanceof OutputNode && node.type === MAIN) {
    if (node.numChildren() === 1) {
      const child = node.children[0];

      if (!(child instanceof FacetNode)) {
        child.swapWithParent();
        moveMainDownToFacet(node);
      }
    }
  }
}


/**
 * Return all leaf nodes.
 */
function getLeaves(roots: DataFlowNode[]) {
  const leaves: DataFlowNode[] = [];
  function append(node: DataFlowNode) {
    if (node.numChildren() === 0) {
      leaves.push(node);
    } else {
      node.children.forEach(append);
    }
  }

  roots.forEach(append);
  return leaves;
}

/**
 * Print debug information for dataflow tree.
 */
function debug(node: DataFlowNode) {
  console.log(`${(node.constructor as any).name}${node.debugName ? ` (${node.debugName})` : ''} -> ${
    (node.children.map(c => {
      return `${(c.constructor as any).name}${c.debugName ? ` (${c.debugName})` : ''}`;
    }))
  }`);
  console.log(node);
  node.children.forEach(debug);
}

function makeWalkTree(data: VgData[]) {
  // to name datasources
  let datasetIndex = 0;

  /**
   * Recursively walk down the tree.
   */
  function walkTree(node: DataFlowNode, dataSource: VgData) {
    if (node instanceof ParseNode) {
      if (node.parent instanceof SourceNode && !dataSource.source)  {
        // If node's parent is a root source and the data source does not refer to another data source, use normal format parse
        dataSource.format = {
          ...dataSource.format || {},
          parse: node.assembleFormatParse()
        };
      } else {
        // Otherwise use Vega expression to parse
        dataSource.transform = dataSource.transform.concat(node.assembleTransforms());
      }
    }

    if (node instanceof FacetNode) {
      if (!dataSource.name) {
        dataSource.name = `data_${datasetIndex++}`;
      }

      if (!dataSource.source || dataSource.transform.length > 0) {
        data.push(dataSource);
        node.data = dataSource.name;
      } else {
        node.data = dataSource.source;
      }

      node.assemble().forEach(d => data.push(d));

      // break here because the rest of the tree has to be taken care of by the facet.
      return;
    }

    if (node instanceof FilterNode ||
      node instanceof NullFilterNode ||
      node instanceof CalculateNode ||
      node instanceof AggregateNode ||
      node instanceof OrderNode) {
      dataSource.transform.push(node.assemble());
    }

    if (node instanceof NonPositiveFilterNode ||
      node instanceof BinNode ||
      node instanceof TimeUnitNode ||
      node instanceof StackNode) {
      dataSource.transform = dataSource.transform.concat(node.assemble());
    }

    if (node instanceof OutputNode) {
      if (dataSource.source && dataSource.transform.length === 0) {
        node.source = dataSource.source;
      } else if (node.parent instanceof OutputNode) {
        // Note that an output node may be required but we still do not assemble a
        // separate data source for it.
        node.source = dataSource.name;
      } else {
        if (!dataSource.name) {
          dataSource.name = `data_${datasetIndex++}`;
        }

        // Here we set the name of the datasource we generated. From now on
        // other assemblers can use it.
        node.source = dataSource.name;

        // if this node has more than one child, we will add a datasource automatically
        if (node.numChildren() === 1 && dataSource.transform.length > 0) {
          data.push(dataSource);
          const newData: VgData = {
            name: null,
            source: dataSource.name,
            transform: []
          };
          dataSource = newData;
        }
      }
    }

    switch (node.numChildren()) {
      case 0:
        // done
        if (node instanceof OutputNode && (!dataSource.source || dataSource.transform.length > 0)) {
          // do not push empty datasources that are simply references
          data.push(dataSource);
        }
        break;
      case 1:
        walkTree(node.children[0], dataSource);
        break;
      default:
        let source = dataSource.name;
        if (!dataSource.source || dataSource.transform.length > 0) {
          data.push(dataSource);
        } else {
          source = dataSource.source;
        }

        node.children.forEach(child => {
          const newData: VgData = {
            name: null,
            source: source,
            transform: []
          };
          walkTree(child, newData);
        });
        break;
    }
  }

  return walkTree;
}

/**
 * Assemble data sources that are derived from faceted data.
 */
export function assembleFacetData(root: FacetNode): VgData[] {
  const data: VgData[] = [];
  const walkTree = makeWalkTree(data);

  root.children.forEach(child => walkTree(child, {
    source: root.name,
    name: null,
    transform: []
  }));

  return data;
}

/**
 * Create Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export function assembleData(roots: SourceNode[]): VgData[] {
  const data: VgData[] = [];

  roots.forEach(removeUnnecessaryNodes);

  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);
  getLeaves(roots).forEach(iterateFromLeaves(optimizers.removeUnusedSubtrees));
  roots = roots.filter(r => r.numChildren() > 0);

  getLeaves(roots).forEach(iterateFromLeaves(optimizers.moveParseUp));

  roots.forEach(moveFacetDown);

  // roots.forEach(debug);

  const walkTree = makeWalkTree(data);

  let sourceIndex = 0;

  roots.forEach(root => {
    // assign a name if the source does not have a name yet
    if (!root.hasName()) {
      root.dataName = `source_${sourceIndex++}`;
    }

    const newData: VgData = root.assemble();

    walkTree(root, newData);
  });

  // remove empty transform arrays for cleaner output
  data.forEach(d => {
    if (d.transform.length === 0) {
      delete d.transform;
    }
  });

  return data;
}
