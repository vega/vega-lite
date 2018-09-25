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
import {WindowTransformNode} from './window';

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
      } else if (copy instanceof AggregateNode || copy instanceof StackNode || copy instanceof WindowTransformNode) {
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

      if (child instanceof AggregateNode || child instanceof StackNode || child instanceof WindowTransformNode) {
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
    flag = node.children.map(moveFacetDown).some(isTrue) || flag;
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

  flag = node.children.map(removeUnnecessaryNodes).some(isTrue) || flag;
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
export function mergeParse(node: DataFlowNode): boolean {
  let flag = false;
  const parseChildren = node.children.filter((x): x is ParseNode => x instanceof ParseNode);
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
      const mergedParseNode = new ParseNode(node, commonParse);
      for (const parseNode of parseChildren) {
        for (const key of keys(commonParse)) {
          delete parseNode.parse[key];
        }
        node.removeChild(parseNode);
        parseNode.parent = mergedParseNode;
        if (keys(parseNode.parse).length === 0) {
          parseNode.remove();
        }
      }
    }
  }
  flag = node.children.map(mergeParse).some(isTrue) || flag;
  return flag;
}

export function isTrue(x: boolean) {
  return x;
}

function optimizationDataflowHelper(dataComponent: DataComponent) {
  let roots: SourceNode[] = vals(dataComponent.sources);
  let mutatedFlag = false;
  // mutatedFlag should always be on the right side otherwise short circuit logic might cause the mutating method to not execute
  mutatedFlag = roots.map(removeUnnecessaryNodes).some(isTrue) || mutatedFlag;
  // remove source nodes that don't have any children because they also don't have output nodes
  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.iterateFromLeaves(optimizers.removeUnusedSubtrees))
      .some(isTrue) || mutatedFlag;

  roots = roots.filter(r => r.numChildren() > 0);

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.iterateFromLeaves(optimizers.moveParseUp))
      .some(isTrue) || mutatedFlag;

  mutatedFlag =
    getLeaves(roots)
      .map(optimizers.removeDuplicateTimeUnits)
      .some(isTrue) || mutatedFlag;

  mutatedFlag = roots.map(moveFacetDown).some(isTrue) || mutatedFlag;

  mutatedFlag = roots.map(mergeParse).some(isTrue) || mutatedFlag;
  mutatedFlag = roots.map(optimizers.mergeIdenticalTransforms).some(isTrue) || mutatedFlag;
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
