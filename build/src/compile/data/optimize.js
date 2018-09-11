import { MAIN } from '../../data';
import { flatten, keys, vals } from '../../util';
import { AggregateNode } from './aggregate';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { ParseNode } from './formatparse';
import * as optimizers from './optimizers';
import { StackNode } from './stack';
export var FACET_SCALE_PREFIX = 'scale_';
/**
 * Clones the subtree and ignores output nodes except for the leafs, which are renamed.
 */
function cloneSubtree(facet) {
    function clone(node) {
        if (!(node instanceof FacetNode)) {
            var copy_1 = node.clone();
            if (copy_1 instanceof OutputNode) {
                var newName = FACET_SCALE_PREFIX + copy_1.getSource();
                copy_1.setSource(newName);
                facet.model.component.data.outputNodes[newName] = copy_1;
            }
            else if (copy_1 instanceof AggregateNode || copy_1 instanceof StackNode) {
                copy_1.addDimensions(facet.fields);
            }
            flatten(node.children.map(clone)).forEach(function (n) { return (n.parent = copy_1); });
            return [copy_1];
        }
        return flatten(node.children.map(clone));
    }
    return clone;
}
/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
function moveFacetDown(node) {
    if (node instanceof FacetNode) {
        if (node.numChildren() === 1 && !(node.children[0] instanceof OutputNode)) {
            // move down until we hit a fork or output node
            var child = node.children[0];
            if (child instanceof AggregateNode || child instanceof StackNode) {
                child.addDimensions(node.fields);
            }
            child.swapWithParent();
            moveFacetDown(node);
        }
        else {
            // move main to facet
            moveMainDownToFacet(node.model.component.data.main);
            // replicate the subtree and place it before the facet's main node
            var copy = flatten(node.children.map(cloneSubtree(node)));
            copy.forEach(function (c) { return (c.parent = node.model.component.data.main); });
        }
    }
    else {
        node.children.forEach(moveFacetDown);
    }
}
function moveMainDownToFacet(node) {
    if (node instanceof OutputNode && node.type === MAIN) {
        if (node.numChildren() === 1) {
            var child = node.children[0];
            if (!(child instanceof FacetNode)) {
                child.swapWithParent();
                moveMainDownToFacet(node);
            }
        }
    }
}
/**
 * Remove nodes that are not required starting from a root.
 */
function removeUnnecessaryNodes(node) {
    // remove output nodes that are not required
    if (node instanceof OutputNode && !node.isRequired()) {
        node.remove();
    }
    node.children.forEach(removeUnnecessaryNodes);
}
/**
 * Return all leaf nodes.
 */
function getLeaves(roots) {
    var leaves = [];
    function append(node) {
        if (node.numChildren() === 0) {
            leaves.push(node);
        }
        else {
            node.children.forEach(append);
        }
    }
    roots.forEach(append);
    return leaves;
}
/**
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export function mergeParse(node) {
    var parseChildren = node.children.filter(function (x) { return x instanceof ParseNode; });
    if (parseChildren.length > 1) {
        var commonParse = {};
        for (var _i = 0, parseChildren_1 = parseChildren; _i < parseChildren_1.length; _i++) {
            var parseNode = parseChildren_1[_i];
            var parse = parseNode.parse;
            for (var _a = 0, _b = keys(parse); _a < _b.length; _a++) {
                var k = _b[_a];
                if (commonParse[k] === undefined) {
                    commonParse[k] = parse[k];
                }
                else if (commonParse[k] !== parse[k]) {
                    delete commonParse[k];
                }
            }
        }
        if (keys(commonParse).length !== 0) {
            var mergedParseNode = new ParseNode(node, commonParse);
            for (var _c = 0, parseChildren_2 = parseChildren; _c < parseChildren_2.length; _c++) {
                var parseNode = parseChildren_2[_c];
                for (var _d = 0, _e = keys(commonParse); _d < _e.length; _d++) {
                    var key = _e[_d];
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
    node.children.forEach(mergeParse);
}
/**
 * Optimizes the dataflow of the passed in data component.
 */
export function optimizeDataflow(dataComponent) {
    var roots = vals(dataComponent.sources);
    roots.forEach(removeUnnecessaryNodes);
    // remove source nodes that don't have any children because they also don't have output nodes
    roots = roots.filter(function (r) { return r.numChildren() > 0; });
    getLeaves(roots).forEach(optimizers.iterateFromLeaves(optimizers.removeUnusedSubtrees));
    roots = roots.filter(function (r) { return r.numChildren() > 0; });
    getLeaves(roots).forEach(optimizers.iterateFromLeaves(optimizers.moveParseUp));
    getLeaves(roots).forEach(optimizers.removeDuplicateTimeUnits);
    roots.forEach(moveFacetDown);
    roots.forEach(mergeParse);
    roots.forEach(optimizers.mergeIdenticalTransforms);
    keys(dataComponent.sources).forEach(function (s) {
        if (dataComponent.sources[s].numChildren() === 0) {
            delete dataComponent.sources[s];
        }
    });
}
//# sourceMappingURL=optimize.js.map