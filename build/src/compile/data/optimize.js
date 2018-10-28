import * as tslib_1 from "tslib";
import { MAIN } from '../../data';
import * as log from '../../log';
import { flatten, keys } from '../../util';
import { AggregateNode } from './aggregate';
import { OutputNode } from './dataflow';
import { checkLinks } from './debug';
import { FacetNode } from './facet';
import { ParseNode } from './formatparse';
import { BottomUpOptimizer, TopDownOptimizer } from './optimizer';
import * as optimizers from './optimizers';
import { MergeIdenticalNodes } from './optimizers';
import { StackNode } from './stack';
import { WindowTransformNode } from './window';
export var FACET_SCALE_PREFIX = 'scale_';
export var MAX_OPTIMIZATION_RUNS = 5;
/**
 * Clones the subtree and ignores output nodes except for the leaves, which are renamed.
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
            else if (copy_1 instanceof AggregateNode || copy_1 instanceof StackNode || copy_1 instanceof WindowTransformNode) {
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
            if (child instanceof AggregateNode || child instanceof StackNode || child instanceof WindowTransformNode) {
                child.addDimensions(node.fields);
            }
            child.swapWithParent();
            moveFacetDown(node);
        }
        else {
            // move main to facet
            var facetMain = node.model.component.data.main;
            moveMainDownToFacet(facetMain);
            // replicate the subtree and place it before the facet's main node
            var cloner = cloneSubtree(node);
            var copy = flatten(node.children.map(cloner));
            for (var _i = 0, copy_2 = copy; _i < copy_2.length; _i++) {
                var c = copy_2[_i];
                c.parent = facetMain;
            }
        }
    }
    else {
        node.children.map(moveFacetDown);
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
var RemoveUnnecessaryNodes = /** @class */ (function (_super) {
    tslib_1.__extends(RemoveUnnecessaryNodes, _super);
    function RemoveUnnecessaryNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoveUnnecessaryNodes.prototype.run = function (node) {
        // remove output nodes that are not required
        if (node instanceof OutputNode && !node.isRequired()) {
            this.setMutated();
            node.remove();
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.run(child);
        }
        return this.mutatedFlag;
    };
    return RemoveUnnecessaryNodes;
}(TopDownOptimizer));
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
var MergeParse = /** @class */ (function (_super) {
    tslib_1.__extends(MergeParse, _super);
    function MergeParse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MergeParse.prototype.run = function (node) {
        var parent = node.parent;
        var parseChildren = parent.children.filter(function (x) { return x instanceof ParseNode; });
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
                this.setMutated();
                var mergedParseNode = new ParseNode(parent, commonParse);
                for (var _c = 0, parseChildren_2 = parseChildren; _c < parseChildren_2.length; _c++) {
                    var parseNode = parseChildren_2[_c];
                    for (var _d = 0, _e = keys(commonParse); _d < _e.length; _d++) {
                        var key = _e[_d];
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
        this.setContinue();
        return this.flags;
    };
    return MergeParse;
}(BottomUpOptimizer));
export { MergeParse };
export function isTrue(x) {
    return x;
}
/**
 * Run the specified optimizer on the provided nodes.
 *
 * @param optimizer The optimizer to run.
 * @param nodes A set of nodes to optimize.
 * @param flag Flag that will be or'ed with return valued from optimization calls to the nodes.
 */
function runOptimizer(optimizer, nodes, flag) {
    var flags = nodes.map(function (node) {
        var optimizerInstance = new optimizer();
        if (optimizerInstance instanceof BottomUpOptimizer) {
            return optimizerInstance.optimizeNextFromLeaves(node);
        }
        else {
            return optimizerInstance.run(node);
        }
    });
    return flags.some(isTrue) || flag;
}
function optimizationDataflowHelper(dataComponent) {
    var roots = dataComponent.sources;
    var mutatedFlag = false;
    // mutatedFlag should always be on the right side otherwise short circuit logic might cause the mutating method to not execute
    mutatedFlag = runOptimizer(RemoveUnnecessaryNodes, roots, mutatedFlag);
    // remove source nodes that don't have any children because they also don't have output nodes
    roots = roots.filter(function (r) { return r.numChildren() > 0; });
    mutatedFlag = runOptimizer(optimizers.RemoveUnusedSubtrees, getLeaves(roots), mutatedFlag);
    roots = roots.filter(function (r) { return r.numChildren() > 0; });
    mutatedFlag = runOptimizer(optimizers.MoveParseUp, getLeaves(roots), mutatedFlag);
    mutatedFlag = runOptimizer(optimizers.RemoveDuplicateTimeUnits, getLeaves(roots), mutatedFlag);
    mutatedFlag = runOptimizer(MergeParse, getLeaves(roots), mutatedFlag);
    mutatedFlag = runOptimizer(MergeIdenticalNodes, roots, mutatedFlag);
    dataComponent.sources = roots;
    return mutatedFlag;
}
/**
 * Optimizes the dataflow of the passed in data component.
 */
export function optimizeDataflow(data) {
    // check before optimizations
    checkLinks(data.sources);
    var firstPassCounter = 0;
    var secondPassCounter = 0;
    for (var i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
        if (!optimizationDataflowHelper(data)) {
            break;
        }
        firstPassCounter++;
    }
    // move facets down and make a copy of the subtree so that we can have scales at the top level
    data.sources.map(moveFacetDown);
    for (var i = 0; i < MAX_OPTIMIZATION_RUNS; i++) {
        if (!optimizationDataflowHelper(data)) {
            break;
        }
        secondPassCounter++;
    }
    // check after optimizations
    checkLinks(data.sources);
    if (Math.max(firstPassCounter, secondPassCounter) === MAX_OPTIMIZATION_RUNS) {
        log.warn("Maximum optimization runs(" + MAX_OPTIMIZATION_RUNS + ") reached.");
    }
}
//# sourceMappingURL=optimize.js.map