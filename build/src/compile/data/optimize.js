"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var util_1 = require("../../util");
var aggregate_1 = require("./aggregate");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var formatparse_1 = require("./formatparse");
var optimizers = tslib_1.__importStar(require("./optimizers"));
var stack_1 = require("./stack");
exports.FACET_SCALE_PREFIX = 'scale_';
/**
 * Clones the subtree and ignores output nodes except for the leafs, which are renamed.
 */
function cloneSubtree(facet) {
    function clone(node) {
        if (!(node instanceof facet_1.FacetNode)) {
            var copy_1 = node.clone();
            if (copy_1 instanceof dataflow_1.OutputNode) {
                var newName = exports.FACET_SCALE_PREFIX + copy_1.getSource();
                copy_1.setSource(newName);
                facet.model.component.data.outputNodes[newName] = copy_1;
            }
            else if (copy_1 instanceof aggregate_1.AggregateNode || copy_1 instanceof stack_1.StackNode) {
                copy_1.addDimensions(facet.fields);
            }
            util_1.flatten(node.children.map(clone)).forEach(function (n) { return (n.parent = copy_1); });
            return [copy_1];
        }
        return util_1.flatten(node.children.map(clone));
    }
    return clone;
}
/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
function moveFacetDown(node) {
    if (node instanceof facet_1.FacetNode) {
        if (node.numChildren() === 1 && !(node.children[0] instanceof dataflow_1.OutputNode)) {
            // move down until we hit a fork or output node
            var child = node.children[0];
            if (child instanceof aggregate_1.AggregateNode || child instanceof stack_1.StackNode) {
                child.addDimensions(node.fields);
            }
            child.swapWithParent();
            moveFacetDown(node);
        }
        else {
            // move main to facet
            moveMainDownToFacet(node.model.component.data.main);
            // replicate the subtree and place it before the facet's main node
            var copy = util_1.flatten(node.children.map(cloneSubtree(node)));
            copy.forEach(function (c) { return (c.parent = node.model.component.data.main); });
        }
    }
    else {
        node.children.forEach(moveFacetDown);
    }
}
function moveMainDownToFacet(node) {
    if (node instanceof dataflow_1.OutputNode && node.type === data_1.MAIN) {
        if (node.numChildren() === 1) {
            var child = node.children[0];
            if (!(child instanceof facet_1.FacetNode)) {
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
    if (node instanceof dataflow_1.OutputNode && !node.isRequired()) {
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
function mergeParse(node) {
    var parseChildren = node.children.filter(function (x) { return x instanceof formatparse_1.ParseNode; });
    if (parseChildren.length > 1) {
        var commonParse = {};
        for (var _i = 0, parseChildren_1 = parseChildren; _i < parseChildren_1.length; _i++) {
            var parseNode = parseChildren_1[_i];
            var parse = parseNode.parse;
            for (var _a = 0, _b = util_1.keys(parse); _a < _b.length; _a++) {
                var k = _b[_a];
                if (commonParse[k] === undefined) {
                    commonParse[k] = parse[k];
                }
                else if (commonParse[k] !== parse[k]) {
                    delete commonParse[k];
                }
            }
        }
        if (util_1.keys(commonParse).length !== 0) {
            var mergedParseNode = new formatparse_1.ParseNode(node, commonParse);
            for (var _c = 0, parseChildren_2 = parseChildren; _c < parseChildren_2.length; _c++) {
                var parseNode = parseChildren_2[_c];
                for (var _d = 0, _e = util_1.keys(commonParse); _d < _e.length; _d++) {
                    var key = _e[_d];
                    delete parseNode.parse[key];
                }
                node.removeChild(parseNode);
                parseNode.parent = mergedParseNode;
                if (util_1.keys(parseNode.parse).length === 0) {
                    parseNode.remove();
                }
            }
        }
    }
    node.children.forEach(mergeParse);
}
exports.mergeParse = mergeParse;
/**
 * Optimizes the dataflow of the passed in data component.
 */
function optimizeDataflow(dataComponent) {
    var roots = util_1.vals(dataComponent.sources);
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
    util_1.keys(dataComponent.sources).forEach(function (s) {
        if (dataComponent.sources[s].numChildren() === 0) {
            delete dataComponent.sources[s];
        }
    });
}
exports.optimizeDataflow = optimizeDataflow;
//# sourceMappingURL=optimize.js.map