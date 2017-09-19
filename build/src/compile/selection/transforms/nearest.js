"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../../log");
var selection_1 = require("../selection");
var VORONOI = 'voronoi';
var nearest = {
    has: function (selCmpt) {
        return selCmpt.type !== 'interval' && selCmpt.nearest;
    },
    marks: function (model, selCmpt, marks) {
        var _a = selection_1.positionalProjections(selCmpt), x = _a.x, y = _a.y;
        var markType = model.mark();
        if (markType === 'line' || markType === 'area') {
            log.warn(log.message.nearestNotSupportForContinuous(markType));
            return marks;
        }
        var cellDef = {
            name: model.getName(VORONOI),
            type: 'path',
            from: { data: model.getName('marks') },
            encode: {
                enter: {
                    fill: { value: 'transparent' },
                    strokeWidth: { value: 0.35 },
                    stroke: { value: 'transparent' },
                    isVoronoi: { value: true }
                }
            },
            transform: [{
                    type: 'voronoi',
                    x: (x || (!x && !y)) ? 'datum.x' : { expr: '0' },
                    y: (y || (!x && !y)) ? 'datum.y' : { expr: '0' },
                    size: [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')]
                }]
        };
        var index = 0;
        var exists = false;
        marks.forEach(function (mark, i) {
            var name = mark.name || '';
            if (name === model.component.mark[0].name) {
                index = i;
            }
            else if (name.indexOf(VORONOI) >= 0) {
                exists = true;
            }
        });
        if (!exists) {
            marks.splice(index + 1, 0, cellDef);
        }
        return marks;
    }
};
exports.default = nearest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL25lYXJlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQ0FBb0M7QUFDcEMsMENBQW1EO0FBR25ELElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUUxQixJQUFNLE9BQU8sR0FBcUI7SUFDaEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUN4RCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLO1FBQzdCLElBQUEsK0NBQXVDLEVBQXRDLFFBQUMsRUFBRSxRQUFDLENBQW1DO1FBQzlDLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssTUFBTSxJQUFJLFFBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBTSxPQUFPLEdBQUc7WUFDZCxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDNUIsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQztZQUNwQyxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUM7b0JBQzVCLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQzFCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUM7b0JBQzlCLFNBQVMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUM7aUJBQ3pCO2FBQ0Y7WUFDRCxTQUFTLEVBQUUsQ0FBQztvQkFDVixJQUFJLEVBQUUsU0FBUztvQkFDZixDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQztvQkFDOUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUM7b0JBQzlDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzFFLENBQUM7U0FDSCxDQUFDO1FBRUYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNaLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0YsQ0FBQztBQUVpQiwwQkFBTyJ9