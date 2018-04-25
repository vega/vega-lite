import * as tslib_1 from "tslib";
import { hasIntersection, keys } from '../../util';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { ParseNode } from './formatparse';
import { SourceNode } from './source';
import { TimeUnitNode } from './timeunit';
/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
export function iterateFromLeaves(f) {
    function optimizeNextFromLeaves(node) {
        if (node instanceof SourceNode) {
            return;
        }
        var next = node.parent;
        if (f(node)) {
            optimizeNextFromLeaves(next);
        }
    }
    return optimizeNextFromLeaves;
}
/**
 * Move parse nodes up to forks.
 */
export function moveParseUp(node) {
    var parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof ParseNode) {
        if (parent instanceof SourceNode) {
            return false;
        }
        if (parent.numChildren() > 1) {
            // don't move parse further up but continue with parent.
            return true;
        }
        if (parent instanceof ParseNode) {
            parent.merge(node);
        }
        else {
            // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
            if (hasIntersection(parent.producedFields(), node.dependentFields())) {
                return true;
            }
            node.swapWithParent();
        }
    }
    return true;
}
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export function removeUnusedSubtrees(node) {
    if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
        // no need to continue with parent because it is output node or will have children (there was a fork)
        return false;
    }
    else {
        node.remove();
    }
    return true;
}
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export function removeDuplicateTimeUnits(leaf) {
    var fields = {};
    return iterateFromLeaves(function (node) {
        if (node instanceof TimeUnitNode) {
            var pfields = node.producedFields();
            var dupe = keys(pfields).every(function (k) { return !!fields[k]; });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDakQsT0FBTyxFQUFlLFVBQVUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNwQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR3hDOzs7O0dBSUc7QUFDSCxNQUFNLDRCQUE0QixDQUFrQztJQUNsRSxnQ0FBZ0MsSUFBa0I7UUFDaEQsSUFBSSxJQUFJLFlBQVksVUFBVSxFQUFFO1lBQzlCLE9BQU87U0FDUjtRQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDWCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sc0JBQXNCLElBQWtCO0lBQzVDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsdUNBQXVDO0lBQ3ZDLElBQUksSUFBSSxZQUFZLFNBQVMsRUFBRTtRQUM3QixJQUFJLE1BQU0sWUFBWSxVQUFVLEVBQUU7WUFDaEMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUM1Qix3REFBd0Q7WUFDeEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksTUFBTSxZQUFZLFNBQVMsRUFBRTtZQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BCO2FBQU07WUFDTCw0RkFBNEY7WUFDNUYsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFO2dCQUNwRSxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3ZCO0tBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSwrQkFBK0IsSUFBa0I7SUFDckQsSUFBSSxJQUFJLFlBQVksVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxZQUFZLFNBQVMsRUFBRTtRQUNyRixxR0FBcUc7UUFDckcsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNO1FBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxtQ0FBbUMsSUFBa0I7SUFDekQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLE9BQU8saUJBQWlCLENBQUMsVUFBQyxJQUFrQjtRQUMxQyxJQUFJLElBQUksWUFBWSxZQUFZLEVBQUU7WUFDaEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVcsQ0FBQyxDQUFDO1lBRXJELElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNmO2lCQUFNO2dCQUNMLE1BQU0sd0JBQU8sTUFBTSxFQUFLLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGFzSW50ZXJzZWN0aW9uLCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlLCBPdXRwdXROb2RlfSBmcm9tICcuL2RhdGFmbG93JztcbmltcG9ydCB7RmFjZXROb2RlfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4vdGltZXVuaXQnO1xuXG5cbi8qKlxuICogU3RhcnQgb3B0aW1pemF0aW9uIHBhdGggYXQgdGhlIGxlYXZlcy4gVXNlZnVsIGZvciBtZXJnaW5nIHVwIG9yIHJlbW92aW5nIHRoaW5ncy5cbiAqXG4gKiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVlLCB0aGUgcmVjdXJzaW9uIGNvbnRpbnVlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVGcm9tTGVhdmVzKGY6IChub2RlOiBEYXRhRmxvd05vZGUpID0+IGJvb2xlYW4pIHtcbiAgZnVuY3Rpb24gb3B0aW1pemVOZXh0RnJvbUxlYXZlcyhub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0ID0gbm9kZS5wYXJlbnQ7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgIG9wdGltaXplTmV4dEZyb21MZWF2ZXMobmV4dCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplTmV4dEZyb21MZWF2ZXM7XG59XG5cbi8qKlxuICogTW92ZSBwYXJzZSBub2RlcyB1cCB0byBmb3Jrcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdmVQYXJzZVVwKG5vZGU6IERhdGFGbG93Tm9kZSkge1xuICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudDtcblxuICAvLyBtb3ZlIHBhcnNlIHVwIGJ5IG1lcmdpbmcgb3Igc3dhcHBpbmdcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBQYXJzZU5vZGUpIHtcbiAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgU291cmNlTm9kZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQubnVtQ2hpbGRyZW4oKSA+IDEpIHtcbiAgICAgIC8vIGRvbid0IG1vdmUgcGFyc2UgZnVydGhlciB1cCBidXQgY29udGludWUgd2l0aCBwYXJlbnQuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgICBwYXJlbnQubWVyZ2Uobm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRvbid0IHN3YXAgd2l0aCBub2RlcyB0aGF0IHByb2R1Y2Ugc29tZXRoaW5nIHRoYXQgdGhlIHBhcnNlIG5vZGUgZGVwZW5kcyBvbiAoZS5nLiBsb29rdXApXG4gICAgICBpZiAoaGFzSW50ZXJzZWN0aW9uKHBhcmVudC5wcm9kdWNlZEZpZWxkcygpLCBub2RlLmRlcGVuZGVudEZpZWxkcygpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5zd2FwV2l0aFBhcmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIFJlcGVhdGVkbHkgcmVtb3ZlIGxlYWYgbm9kZXMgdGhhdCBhcmUgbm90IG91dHB1dCBvciBmYWNldCBub2Rlcy5cbiAqIFRoZSByZWFzb24gaXMgdGhhdCB3ZSBkb24ndCBuZWVkIHN1YnRyZWVzIHRoYXQgZG9uJ3QgaGF2ZSBhbnkgb3V0cHV0IG5vZGVzLlxuICogRmFjZXQgbm9kZXMgYXJlIG5lZWRlZCBmb3IgdGhlIHJvdyBvciBjb2x1bW4gZG9tYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVVudXNlZFN1YnRyZWVzKG5vZGU6IERhdGFGbG93Tm9kZSkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgfHwgbm9kZS5udW1DaGlsZHJlbigpID4gMCB8fCBub2RlIGluc3RhbmNlb2YgRmFjZXROb2RlKSB7XG4gICAgLy8gbm8gbmVlZCB0byBjb250aW51ZSB3aXRoIHBhcmVudCBiZWNhdXNlIGl0IGlzIG91dHB1dCBub2RlIG9yIHdpbGwgaGF2ZSBjaGlsZHJlbiAodGhlcmUgd2FzIGEgZm9yaylcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS5yZW1vdmUoKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGR1cGxpY2F0ZSB0aW1lIHVuaXQgbm9kZXMgKGFzIGRldGVybWluZWQgYnkgdGhlIG5hbWUgb2YgdGhlXG4gKiBvdXRwdXQgZmllbGQpIHRoYXQgbWF5IGJlIGdlbmVyYXRlZCBkdWUgdG8gc2VsZWN0aW9ucyBwcm9qZWN0ZWQgb3ZlclxuICogdGltZSB1bml0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZVRpbWVVbml0cyhsZWFmOiBEYXRhRmxvd05vZGUpIHtcbiAgbGV0IGZpZWxkcyA9IHt9O1xuICByZXR1cm4gaXRlcmF0ZUZyb21MZWF2ZXMoKG5vZGU6IERhdGFGbG93Tm9kZSkgPT4ge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgVGltZVVuaXROb2RlKSB7XG4gICAgICBjb25zdCBwZmllbGRzID0gbm9kZS5wcm9kdWNlZEZpZWxkcygpO1xuICAgICAgY29uc3QgZHVwZSA9IGtleXMocGZpZWxkcykuZXZlcnkoKGspID0+ICEhZmllbGRzW2tdKTtcblxuICAgICAgaWYgKGR1cGUpIHtcbiAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpZWxkcyA9IHsuLi5maWVsZHMsIC4uLnBmaWVsZHN9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KShsZWFmKTtcbn1cbiJdfQ==