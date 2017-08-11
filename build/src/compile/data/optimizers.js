"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var formatparse_1 = require("./formatparse");
var source_1 = require("./source");
var timeunit_1 = require("./timeunit");
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
            // don't move parse further up but continue with parent.
            return true;
        }
        if (parent instanceof formatparse_1.ParseNode) {
            parent.merge(node);
        }
        else {
            // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
            if (util_1.hasIntersection(parent.producedFields(), node.dependentFields())) {
                return true;
            }
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
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
function removeDuplicateTimeUnits(leaf) {
    var fields = {};
    return iterateFromLeaves(function (node) {
        if (node instanceof timeunit_1.TimeUnitNode) {
            var pfields = node.producedFields();
            var dupe = util_1.keys(pfields).every(function (k) { return !!fields[k]; });
            if (dupe) {
                node.remove();
            }
            else {
                fields = tslib_1.__assign({}, fields, pfields);
            }
        }
        return true;
    })(leaf);
}
exports.removeDuplicateTimeUnits = removeDuplicateTimeUnits;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUQ7QUFHakQsdUNBQW9EO0FBRXBELDZDQUF3QztBQUV4QyxtQ0FBb0M7QUFFcEMsdUNBQXdDO0FBSXhDOzs7O0dBSUc7QUFDSCwyQkFBa0MsQ0FBa0M7SUFDbEUsZ0NBQWdDLElBQWtCO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxtQkFBVSxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQUM7QUFDaEMsQ0FBQztBQWJELDhDQWFDO0FBRUQ7O0dBRUc7QUFDSCxxQkFBNEIsSUFBa0I7SUFDNUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUUzQix1Q0FBdUM7SUFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHVCQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxtQkFBVSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLHdEQUF3RDtZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSx1QkFBUyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDRGQUE0RjtZQUM1RixFQUFFLENBQUMsQ0FBQyxzQkFBZSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUEzQkQsa0NBMkJDO0FBRUQ7OztHQUdHO0FBQ0gsOEJBQXFDLElBQWtCO0lBQ3JELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHFCQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQscUdBQXFHO1FBQ3JHLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVkQsb0RBVUM7QUFFRDs7OztHQUlHO0FBQ0gsa0NBQXlDLElBQWtCO0lBQ3pELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBQyxJQUFrQjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksdUJBQVksQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RDLElBQU0sSUFBSSxHQUFHLFdBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVcsQ0FBQyxDQUFDO1lBRXJELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLHdCQUFPLE1BQU0sRUFBSyxPQUFPLENBQUMsQ0FBQztZQUNuQyxDQUFDO1FBQ0gsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNYLENBQUM7QUFoQkQsNERBZ0JDIn0=