"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VORONOI = 'voronoi';
var nearest = {
    has: function (selCmpt) {
        return selCmpt.nearest !== undefined && selCmpt.nearest !== false;
    },
    marks: function (model, selCmpt, marks, selMarks) {
        var mark = marks[0];
        var index = selMarks.indexOf(mark);
        var isPathgroup = mark.name === model.getName('pathgroup');
        var exists = (function (m) { return m.name && m.name.indexOf(VORONOI) >= 0; });
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
                    x: 'datum.x',
                    y: 'datum.y',
                    size: [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')]
                }]
        };
        if (isPathgroup && !mark.marks.filter(exists).length) {
            mark.marks.push(cellDef);
            selMarks.splice(index, 1, mark);
        }
        else if (!isPathgroup && !selMarks.filter(exists).length) {
            selMarks.splice(index + 1, 0, cellDef);
        }
        return selMarks;
    }
};
exports.default = nearest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL25lYXJlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFMUIsSUFBTSxPQUFPLEdBQXFCO0lBQ2hDLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxLQUFLLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRO1FBQzdDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RCxJQUFNLE1BQU0sR0FBRyxDQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztRQUNwRSxJQUFNLE9BQU8sR0FBRztZQUNkLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUM1QixJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFDO1lBQ3BDLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLGFBQWEsRUFBQztvQkFDNUIsV0FBVyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQztvQkFDMUIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGFBQWEsRUFBQztvQkFDOUIsU0FBUyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQztpQkFDekI7YUFDRjtZQUNELFNBQVMsRUFBRSxDQUFDO29CQUNWLElBQUksRUFBRSxTQUFTO29CQUNmLENBQUMsRUFBRSxTQUFTO29CQUNaLENBQUMsRUFBRSxTQUFTO29CQUNaLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzFFLENBQUM7U0FDSCxDQUFDO1FBRUYsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzRCxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRixDQUFDO0FBRWlCLDBCQUFPIn0=