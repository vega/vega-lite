"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatparse_1 = require("./formatparse");
var source_1 = require("./source");
/**
 * Start optimization path at the leaves. Useful for merging up things.
 */
function optimizeFromLeaves(f) {
    function optimizeNextFromLeaves(node) {
        if (node.parent instanceof source_1.SourceNode) {
            return;
        }
        else if (!node || !node.parent) {
            throw new Error('A source node cannot have parents and roots haev to be source nodes.');
        }
        var next = node.parent;
        f(node);
        optimizeNextFromLeaves(next);
    }
    return optimizeNextFromLeaves;
}
exports.optimizeFromLeaves = optimizeFromLeaves;
function parse(node) {
    var parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof formatparse_1.ParseNode) {
        if (parent instanceof formatparse_1.ParseNode) {
            parent.merge(node);
        }
        else {
            node.swapWithParent();
        }
    }
}
exports.parse = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLDZDQUF3QztBQUV4QyxtQ0FBb0M7QUFLcEM7O0dBRUc7QUFDSCw0QkFBbUMsQ0FBK0I7SUFDaEUsZ0NBQWdDLElBQWtCO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLFlBQVksbUJBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDUixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsTUFBTSxDQUFDLHNCQUFzQixDQUFDO0FBQ2hDLENBQUM7QUFkRCxnREFjQztBQUdELGVBQXNCLElBQWtCO0lBQ3RDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsdUNBQXVDO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSx1QkFBUyxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksdUJBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBWEQsc0JBV0MifQ==