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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL25lYXJlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFMUIsSUFBTSxPQUFPLEdBQXFCO0lBQ2hDLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxLQUFLLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRO1FBQzdDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDakIsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQzlCLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQ3RELE1BQU0sR0FBRyxDQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQXRDLENBQXNDLENBQUMsRUFDN0QsT0FBTyxHQUFHO1lBQ1IsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQzVCLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUM7WUFDcEMsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFDO29CQUM1QixXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDO29CQUMxQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFDO29CQUM5QixTQUFTLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDO2lCQUN6QjthQUNGO1lBQ0QsU0FBUyxFQUFFLENBQUM7b0JBQ1YsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsQ0FBQyxFQUFFLFNBQVM7b0JBQ1osQ0FBQyxFQUFFLFNBQVM7b0JBQ1osSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDMUUsQ0FBQztTQUNILENBQUM7UUFFTixFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNELFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGLENBQUM7QUFFaUIsMEJBQU8ifQ==