"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var util_1 = require("../../util");
var aggregate_1 = require("./aggregate");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var filterinvalid_1 = require("./filterinvalid");
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
            util_1.flatten(node.children.map(clone)).forEach(function (n) { return n.parent = copy_1; });
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
            copy.forEach(function (c) { return c.parent = node.model.component.data.main; });
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
    // remove empty null filter nodes
    if (node instanceof filterinvalid_1.FilterInvalidNode && util_1.every(util_1.vals(node.filter), function (f) { return f === null; })) {
        node.remove();
    }
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
    util_1.keys(dataComponent.sources).forEach(function (s) {
        if (dataComponent.sources[s].numChildren() === 0) {
            delete dataComponent.sources[s];
        }
    });
}
exports.optimizeDataflow = optimizeDataflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL29wdGltaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFnQztBQUNoQyxtQ0FBc0Q7QUFDdEQseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsaURBQWtEO0FBRWxELCtEQUEyQztBQUUzQyxpQ0FBa0M7QUFFckIsUUFBQSxrQkFBa0IsR0FBRyxRQUFRLENBQUM7QUFFM0M7O0dBRUc7QUFDSCxzQkFBc0IsS0FBZ0I7SUFDcEMsZUFBZSxJQUFrQjtRQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksaUJBQVMsQ0FBQyxFQUFFO1lBQ2hDLElBQU0sTUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUUxQixJQUFJLE1BQUksWUFBWSxxQkFBVSxFQUFFO2dCQUM5QixJQUFNLE9BQU8sR0FBRywwQkFBa0IsR0FBRyxNQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3RELE1BQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRXhCLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBSSxDQUFDO2FBQ3hEO2lCQUFNLElBQUksTUFBSSxZQUFZLHlCQUFhLElBQUksTUFBSSxZQUFZLGlCQUFTLEVBQUU7Z0JBQ3JFLE1BQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2xDO1lBQ0QsY0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBZSxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFJLEVBQWYsQ0FBZSxDQUFDLENBQUM7WUFFaEYsT0FBTyxDQUFDLE1BQUks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SUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNoRCxPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFwQkQsNENBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7ZXZlcnksIGZsYXR0ZW4sIGtleXMsIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlckludmFsaWROb2RlfSBmcm9tICcuL2ZpbHRlcmludmFsaWQnO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuL2luZGV4JztcbmltcG9ydCAqIGFzIG9wdGltaXplcnMgZnJvbSAnLi9vcHRpbWl6ZXJzJztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHtTdGFja05vZGV9IGZyb20gJy4vc3RhY2snO1xuXG5leHBvcnQgY29uc3QgRkFDRVRfU0NBTEVfUFJFRklYID0gJ3NjYWxlXyc7XG5cbi8qKlxuICogQ2xvbmVzIHRoZSBzdWJ0cmVlIGFuZCBpZ25vcmVzIG91dHB1dCBub2RlcyBleGNlcHQgZm9yIHRoZSBsZWFmcywgd2hpY2ggYXJlIHJlbmFtZWQuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3VidHJlZShmYWNldDogRmFjZXROb2RlKSB7XG4gIGZ1bmN0aW9uIGNsb25lKG5vZGU6IERhdGFGbG93Tm9kZSk6IERhdGFGbG93Tm9kZVtdIHtcbiAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgRmFjZXROb2RlKSkge1xuICAgICAgY29uc3QgY29weSA9IG5vZGUuY2xvbmUoKTtcblxuICAgICAgaWYgKGNvcHkgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICAgIGNvbnN0IG5ld05hbWUgPSBGQUNFVF9TQ0FMRV9QUkVGSVggKyBjb3B5LmdldFNvdXJjZSgpO1xuICAgICAgICBjb3B5LnNldFNvdXJjZShuZXdOYW1lKTtcblxuICAgICAgICBmYWNldC5tb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2Rlc1tuZXdOYW1lXSA9IGNvcHk7XG4gICAgICB9IGVsc2UgaWYgKGNvcHkgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlIHx8IGNvcHkgaW5zdGFuY2VvZiBTdGFja05vZGUpIHtcbiAgICAgICAgY29weS5hZGREaW1lbnNpb25zKGZhY2V0LmZpZWxkcyk7XG4gICAgICB9XG4gICAgICBmbGF0dGVuKG5vZGUuY2hpbGRyZW4ubWFwKGNsb25lKSkuZm9yRWFjaCgobjogRGF0YUZsb3dOb2RlKSA9PiBuLnBhcmVudCA9IGNvcHkpO1xuXG4gICAgICByZXR1cm4gW2NvcHldO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKG5vZGUuY2hpbGRyZW4ubWFwKGNsb25lKSk7XG4gIH1cbiAgcmV0dXJuIGNsb25lO1xufVxuXG4vKipcbiAqIE1vdmUgZmFjZXQgbm9kZXMgZG93biB0byB0aGUgbmV4dCBmb3JrIG9yIG91dHB1dCBub2RlLiBBbHNvIHB1bGwgdGhlIG1haW4gb3V0cHV0IHdpdGggdGhlIGZhY2V0IG5vZGUuXG4gKiBBZnRlciBtb3ZpbmcgZG93biB0aGUgZmFjZXQgbm9kZSwgbWFrZSBhIGNvcHkgb2YgdGhlIHN1YnRyZWUgYW5kIG1ha2UgaXQgYSBjaGlsZCBvZiB0aGUgbWFpbiBvdXRwdXQuXG4gKi9cbmZ1bmN0aW9uIG1vdmVGYWNldERvd24obm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gIGlmIChub2RlIGluc3RhbmNlb2YgRmFjZXROb2RlKSB7XG4gICAgaWYgKG5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gMSAmJiAhKG5vZGUuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBPdXRwdXROb2RlKSkge1xuICAgICAgLy8gbW92ZSBkb3duIHVudGlsIHdlIGhpdCBhIGZvcmsgb3Igb3V0cHV0IG5vZGVcblxuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuXG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlIHx8IGNoaWxkIGluc3RhbmNlb2YgU3RhY2tOb2RlKSB7XG4gICAgICAgIGNoaWxkLmFkZERpbWVuc2lvbnMobm9kZS5maWVsZHMpO1xuICAgICAgfVxuXG4gICAgICBjaGlsZC5zd2FwV2l0aFBhcmVudCgpO1xuICAgICAgbW92ZUZhY2V0RG93bihub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbW92ZSBtYWluIHRvIGZhY2V0XG4gICAgICBtb3ZlTWFpbkRvd25Ub0ZhY2V0KG5vZGUubW9kZWwuY29tcG9uZW50LmRhdGEubWFpbik7XG5cbiAgICAgIC8vIHJlcGxpY2F0ZSB0aGUgc3VidHJlZSBhbmQgcGxhY2UgaXQgYmVmb3JlIHRoZSBmYWNldCdzIG1haW4gbm9kZVxuICAgICAgY29uc3QgY29weTogRGF0YUZsb3dOb2RlW10gPSBmbGF0dGVuKG5vZGUuY2hpbGRyZW4ubWFwKGNsb25lU3VidHJlZShub2RlKSkpO1xuICAgICAgY29weS5mb3JFYWNoKGMgPT4gYy5wYXJlbnQgPSBub2RlLm1vZGVsLmNvbXBvbmVudC5kYXRhLm1haW4pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2gobW92ZUZhY2V0RG93bik7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW92ZU1haW5Eb3duVG9GYWNldChub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlICYmIG5vZGUudHlwZSA9PT0gTUFJTikge1xuICAgIGlmIChub2RlLm51bUNoaWxkcmVuKCkgPT09IDEpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jaGlsZHJlblswXTtcblxuICAgICAgaWYgKCEoY2hpbGQgaW5zdGFuY2VvZiBGYWNldE5vZGUpKSB7XG4gICAgICAgIGNoaWxkLnN3YXBXaXRoUGFyZW50KCk7XG4gICAgICAgIG1vdmVNYWluRG93blRvRmFjZXQobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIG5vZGVzIHRoYXQgYXJlIG5vdCByZXF1aXJlZCBzdGFydGluZyBmcm9tIGEgcm9vdC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlVW5uZWNlc3NhcnlOb2Rlcyhub2RlOiBEYXRhRmxvd05vZGUpIHtcblxuICAvLyByZW1vdmUgZW1wdHkgbnVsbCBmaWx0ZXIgbm9kZXNcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGaWx0ZXJJbnZhbGlkTm9kZSAmJiBldmVyeSh2YWxzKG5vZGUuZmlsdGVyKSwgZiA9PiBmID09PSBudWxsKSkge1xuICAgIG5vZGUucmVtb3ZlKCk7XG4gIH1cblxuICAvLyByZW1vdmUgb3V0cHV0IG5vZGVzIHRoYXQgYXJlIG5vdCByZXF1aXJlZFxuICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgJiYgIW5vZGUuaXNSZXF1aXJlZCgpKSB7XG4gICAgbm9kZS5yZW1vdmUoKTtcbiAgfVxuXG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChyZW1vdmVVbm5lY2Vzc2FyeU5vZGVzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIGxlYWYgbm9kZXMuXG4gKi9cbmZ1bmN0aW9uIGdldExlYXZlcyhyb290czogRGF0YUZsb3dOb2RlW10pIHtcbiAgY29uc3QgbGVhdmVzOiBEYXRhRmxvd05vZGVbXSA9IFtdO1xuICBmdW5jdGlvbiBhcHBlbmQobm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gICAgaWYgKG5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gMCkge1xuICAgICAgbGVhdmVzLnB1c2gobm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChhcHBlbmQpO1xuICAgIH1cbiAgfVxuXG4gIHJvb3RzLmZvckVhY2goYXBwZW5kKTtcbiAgcmV0dXJuIGxlYXZlcztcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZXMgdGhlIGRhdGFmbG93IG9mIHRoZSBwYXNzZWQgaW4gZGF0YSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcHRpbWl6ZURhdGFmbG93KGRhdGFDb21wb25lbnQ6IERhdGFDb21wb25lbnQpIHtcbiAgbGV0IHJvb3RzOiBTb3VyY2VOb2RlW10gPSB2YWxzKGRhdGFDb21wb25lbnQuc291cmNlcyk7XG5cbiAgcm9vdHMuZm9yRWFjaChyZW1vdmVVbm5lY2Vzc2FyeU5vZGVzKTtcblxuICAvLyByZW1vdmUgc291cmNlIG5vZGVzIHRoYXQgZG9uJ3QgaGF2ZSBhbnkgY2hpbGRyZW4gYmVjYXVzZSB0aGV5IGFsc28gZG9uJ3QgaGF2ZSBvdXRwdXQgbm9kZXNcbiAgcm9vdHMgPSByb290cy5maWx0ZXIociA9PiByLm51bUNoaWxkcmVuKCkgPiAwKTtcbiAgZ2V0TGVhdmVzKHJvb3RzKS5mb3JFYWNoKG9wdGltaXplcnMuaXRlcmF0ZUZyb21MZWF2ZXMob3B0aW1pemVycy5yZW1vdmVVbnVzZWRTdWJ0cmVlcykpO1xuICByb290cyA9IHJvb3RzLmZpbHRlcihyID0+IHIubnVtQ2hpbGRyZW4oKSA+IDApO1xuXG4gIGdldExlYXZlcyhyb290cykuZm9yRWFjaChvcHRpbWl6ZXJzLml0ZXJhdGVGcm9tTGVhdmVzKG9wdGltaXplcnMubW92ZVBhcnNlVXApKTtcbiAgZ2V0TGVhdmVzKHJvb3RzKS5mb3JFYWNoKG9wdGltaXplcnMucmVtb3ZlRHVwbGljYXRlVGltZVVuaXRzKTtcblxuICByb290cy5mb3JFYWNoKG1vdmVGYWNldERvd24pO1xuXG4gIGtleXMoZGF0YUNvbXBvbmVudC5zb3VyY2VzKS5mb3JFYWNoKHMgPT4ge1xuICAgIGlmIChkYXRhQ29tcG9uZW50LnNvdXJjZXNbc10ubnVtQ2hpbGRyZW4oKSA9PT0gMCkge1xuICAgICAgZGVsZXRlIGRhdGFDb21wb25lbnQuc291cmNlc1tzXTtcbiAgICB9XG4gIH0pO1xufVxuIl19