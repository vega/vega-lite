import {MAIN} from '../../data';
import {flatten, keys, vals} from '../../util';
import {AggregateNode} from './aggregate';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {DataComponent} from './index';
import * as optimizers from './optimizers';
import {SourceNode} from './source';
import {StackNode} from './stack';

export const FACET_SCALE_PREFIX = 'scale_';

/**
 * Clones the subtree and ignores output nodes except for the leafs, which are renamed.
 */
function cloneSubtree(facet: FacetNode) {
  function clone(node: DataFlowNode): DataFlowNode[] {
    if (!(node instanceof FacetNode)) {
      const copy = node.clone();

      if (copy instanceof OutputNode) {
        const newName = FACET_SCALE_PREFIX + copy.getSource();
        copy.setSource(newName);

        facet.model.component.data.outputNodes[newName] = copy;
      } else if (copy instanceof AggregateNode || copy instanceof StackNode) {
        copy.addDimensions(facet.fields);
      }
      flatten(node.children.map(clone)).forEach((n: DataFlowNode) => (n.parent = copy));

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
function moveFacetDown(node: DataFlowNode): boolean {
  let flag = false;
  if (node instanceof FacetNode) {
    if (node.numChildren() === 1 && !(node.children[0] instanceof OutputNode)) {
      // move down until we hit a fork or output node
      flag = true;
      const child = node.children[0];

      if (child instanceof AggregateNode || child instanceof StackNode) {
        child.addDimensions(node.fields);
      }

      child.swapWithParent();
      moveFacetDown(node);
    } else {
      // move main to facet

      flag = moveMainDownToFacet(node.model.component.data.main) || flag;

      // replicate the subtree and place it before the facet's main node
      const copy: DataFlowNode[] = flatten(node.children.map(cloneSubtree(node)));
      copy.forEach(c => (c.parent = node.model.component.data.main));
    }
  } else {
    flag = node.children.map(moveFacetDown).some(x => x === true) || flag;
  }
  return flag;
}

function moveMainDownToFacet(node: DataFlowNode): boolean {
  let flag = false;
  if (node instanceof OutputNode && node.type === MAIN) {
    if (node.numChildren() === 1) {
      const child = node.children[0];
      if (!(child instanceof FacetNode)) {
        flag = true;
        child.swapWithParent();
        moveMainDownToFacet(node);
      }
    }
  }
  return flag;
}

/**
 * Remove nodes that are not required starting from a root.
 */
function removeUnnecessaryNodes(node: DataFlowNode): boolean {
  // remove output nodes that are not required
  let flag = false;
  if (node instanceof OutputNode && !node.isRequired()) {
    flag = true;
    node.remove();
  }

  flag = node.children.map(removeUnnecessaryNodes).some(x => x === true) || flag;
  return flag;
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
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export function mergeParse(node: DataFlowNode): optimizers.OptimizerFlags {
  let flag = false;
  const parent = node.parent;
  if (parent === undefined) {
    return {continueFlag: false, mutatedFlag: false};
  }
  const parseChildren = parent.children.filter((x): x is ParseNode => x instanceof ParseNode);
  if (parseChildren.length > 1) {
    const commonParse = {};
    for (const parseNode of parseChildren) {
      const parse = parseNode.parse;
      for (const k of keys(parse)) {
        if (commonParse[k] === undefined) {
          commonParse[k] = parse[k];
        } else if (commonParse[k] !== parse[k]) {
          delete commonParse[k];
        }
      }
    }
    if (keys(commonParse).length !== 0) {
      flag = true;
      const mergedParseNode = new ParseNode(parent, commonParse);
      for (const parseNode of parseChildren) {
        for (const key of keys(commonParse)) {
          delete parseNode.parse[key];
        }
        parent.removeChild(parseNode);
        parseNode.parent = mergedParseNode;
        if (keys(parseNode.parse).length === 0) {
          parseNode.remove();
        }
      }
    }
  }
  return {continueFlag: true, mutatedFlag: flag};
}

export function moveParse(node: DataFlowNode): optimizers.OptimizerFlags {
  let continueFlag = false;
  let mutatedFlag = false;
  let temp = optimizers.moveParseUp(node);
  continueFlag = temp.continueFlag || continueFlag;
  mutatedFlag = temp.mutatedFlag || mutatedFlag;
  temp = mergeParse(node);
  continueFlag = temp.continueFlag || continueFlag;
  mutatedFlag = temp.mutatedFlag || mutatedFlag;

  return {continueFlag, mutatedFlag};
}

function optimizationDataflowHelper(dataComponent: DataComponent) {
  let roots: SourceNode[] = vals(dataComponent.sources);
  let mutatedFlag = false;
  // mutatedFlag should always be on the right side otherwise short circuit logic might cause the mutating method to not execute
  mutatedFlag = roots.map(removeUnnecessaryNodes).some(x => x === true) || mutatedFlag;
  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.iterateFromLeaves(optimizers.removeUnusedSubtrees))
      .some(x => x === true) || mutatedFlag;

  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.iterateFromLeaves(moveParse))
      .some(x => x === true) || mutatedFlag;

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.removeDuplicateTimeUnits)
      .some(x => x === true) || mutatedFlag;

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.removeEmptyParse)
      .some(x => x === true) || mutatedFlag;

  mutatedFlag = roots.map(moveFacetDown).some(x => x === true) || mutatedFlag;
  mutatedFlag = roots.map(optimizers.mergeIdenticalTransforms).some(x => x === true) || mutatedFlag;

  keys(dataComponent.sources).forEach(s => {
    if (dataComponent.sources[s].numChildren() === 0) {
      delete dataComponent.sources[s];
    }
  });
  return mutatedFlag;
}

/**
 * Optimizes the dataflow of the passed in data component.
 */
export function optimizeDataflow(data: DataComponent) {
  for (let i = 0; i < 5; i++) {
    if (!optimizationDataflowHelper(data)) {
      break;
    }
  }
}
