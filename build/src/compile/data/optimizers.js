"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataflow_1 = require("./dataflow");
var formatparse_1 = require("./formatparse");
var source_1 = require("./source");
/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
function iterateFromLeaves(f) {
    function optimizeNextFromLeaves(node) {
        if (node instanceof source_1.SourceNode) {
            return;
        }
        var next = node.parent;
        if (f(node)) {
            optimizeNextFromLeaves(next);
        }
    }
    return optimizeNextFromLeaves;
}
exports.iterateFromLeaves = iterateFromLeaves;
/**
 * Move parse nodes up to forks.
 */
function moveParseUp(node) {
    var parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof formatparse_1.ParseNode) {
        if (parent instanceof source_1.SourceNode) {
            return false;
        }
        if (parent.numChildren() > 1) {
            return true;
        }
        if (parent instanceof formatparse_1.ParseNode) {
            parent.merge(node);
        }
        else {
            node.swapWithParent();
        }
    }
    return true;
}
exports.moveParseUp = moveParseUp;
/**
 * Repeatedly remove leaf nodes that are not output nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 */
function removeUnusedSubtrees(node) {
    var parent = node.parent;
    if (node instanceof dataflow_1.OutputNode || node.numChildren() > 0) {
        // no need to continue with parent because it is output node or will have children (there was a fork)
        return false;
    }
    else {
        node.remove();
    }
    return true;
}
exports.removeUnusedSubtrees = removeUnusedSubtrees;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHVDQUFvRDtBQUVwRCw2Q0FBd0M7QUFFeEMsbUNBQW9DO0FBS3BDOzs7O0dBSUc7QUFDSCwyQkFBa0MsQ0FBa0M7SUFDbEUsZ0NBQWdDLElBQWtCO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxtQkFBVSxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQUM7QUFDaEMsQ0FBQztBQWJELDhDQWFDO0FBRUQ7O0dBRUc7QUFDSCxxQkFBNEIsSUFBa0I7SUFDNUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUUzQix1Q0FBdUM7SUFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHVCQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxtQkFBVSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHVCQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFyQkQsa0NBcUJDO0FBRUQ7OztHQUdHO0FBQ0gsOEJBQXFDLElBQWtCO0lBQ3JELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHFCQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQscUdBQXFHO1FBQ3JHLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVkQsb0RBVUMifQ==