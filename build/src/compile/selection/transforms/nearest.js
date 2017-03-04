"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VORONOI = 'voronoi';
var nearest = {
    has: function (selCmpt) {
        return selCmpt.nearest !== undefined && selCmpt.nearest !== false;
    },
    marks: function (model, selCmpt, marks, selMarks) {
        var mark = marks[0], index = selMarks.indexOf(mark), isPathgroup = mark.name === model.getName('pathgroup'), exists = (function (m) { return m.name && m.name.indexOf(VORONOI) >= 0; }), cellDef = {
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
                    size: [{ signal: 'width' }, { signal: 'height' }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL25lYXJlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFMUIsSUFBTSxPQUFPLEdBQXFCO0lBQ2hDLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxLQUFLLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRO1FBQzdDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDZixLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFDOUIsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDdEQsTUFBTSxHQUFHLENBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQyxFQUM3RCxPQUFPLEdBQUc7WUFDUixJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDNUIsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQztZQUNwQyxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUM7b0JBQzVCLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQzFCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUM7b0JBQzlCLFNBQVMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUM7aUJBQ3pCO2FBQ0Y7WUFDRCxTQUFTLEVBQUUsQ0FBQztvQkFDVixJQUFJLEVBQUUsU0FBUztvQkFDZixDQUFDLEVBQUUsU0FBUztvQkFDWixDQUFDLEVBQUUsU0FBUztvQkFDWixJQUFJLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQztpQkFDOUMsQ0FBQztTQUNILENBQUM7UUFFTixFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNELFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGLENBQUM7QUFFaUIsMEJBQU8ifQ==