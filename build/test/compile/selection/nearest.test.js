/* tslint:disable quotemark */
import * as selection from '../../../src/compile/selection/selection';
import nearest from '../../../src/compile/selection/transforms/nearest';
import * as log from '../../../src/log';
import { duplicate } from '../../../src/util';
import { parseUnitModel } from '../../util';
function getModel(markType) {
    const model = parseUnitModel({
        mark: markType,
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative' },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    model.parseMarkGroup();
    model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'single', nearest: true },
        two: { type: 'multi', nearest: true },
        three: { type: 'interval' },
        four: { type: 'single', nearest: false },
        five: { type: 'multi' },
        six: { type: 'multi', nearest: null },
        seven: { type: 'single', nearest: true, encodings: ['x'] },
        eight: { type: 'single', nearest: true, encodings: ['y'] },
        nine: { type: 'single', nearest: true, encodings: ['color'] }
    });
    return model;
}
function voronoiMark(x, y) {
    return [
        { hello: 'world' },
        {
            name: 'voronoi',
            type: 'path',
            from: { data: 'marks' },
            encode: {
                enter: {
                    fill: { value: 'transparent' },
                    strokeWidth: { value: 0.35 },
                    stroke: { value: 'transparent' },
                    isVoronoi: { value: true }
                }
            },
            transform: [
                {
                    type: 'voronoi',
                    x: x || { expr: 'datum.datum.x || 0' },
                    y: y || { expr: 'datum.datum.y || 0' },
                    size: [{ signal: 'width' }, { signal: 'height' }]
                }
            ]
        }
    ];
}
describe('Nearest Selection Transform', () => {
    it('identifies transform invocation', () => {
        const selCmpts = getModel('circle').component.selection;
        expect(nearest.has(selCmpts['one'])).not.toBe(false);
        expect(nearest.has(selCmpts['two'])).not.toBe(false);
        expect(nearest.has(selCmpts['three'])).not.toBe(true);
        expect(nearest.has(selCmpts['four'])).not.toBe(true);
        expect(nearest.has(selCmpts['five'])).not.toBe(true);
        expect(nearest.has(selCmpts['six'])).not.toBe(true);
    });
    it('adds voronoi for non-path marks', () => {
        const model = getModel('circle');
        const selCmpts = model.component.selection;
        const marks = [{ hello: 'world' }];
        expect(nearest.marks(model, selCmpts['one'], marks)).toEqual(voronoiMark());
    });
    it('should warn for path marks', log.wrap(localLogger => {
        const model = getModel('line');
        const selCmpts = model.component.selection;
        const marks = [];
        expect(nearest.marks(model, selCmpts['one'], marks)).toEqual(marks);
        expect(localLogger.warns[0]).toEqual(log.message.nearestNotSupportForContinuous('line'));
    }));
    it('limits to a single voronoi per unit', () => {
        const model = getModel('circle');
        const selCmpts = model.component.selection;
        const marks = [{ hello: 'world' }];
        const marks2 = nearest.marks(model, selCmpts['one'], marks);
        expect(nearest.marks(model, selCmpts['two'], marks2)).toEqual(voronoiMark());
    });
    it('supports 1D voronoi', () => {
        const model = getModel('circle');
        const selCmpts = model.component.selection;
        const marks = [{ hello: 'world' }];
        expect(nearest.marks(model, selCmpts['seven'], duplicate(marks))).toEqual(voronoiMark(null, { expr: '0' }));
        expect(nearest.marks(model, selCmpts['eight'], duplicate(marks))).toEqual(voronoiMark({ expr: '0' }));
        expect(nearest.marks(model, selCmpts['nine'], duplicate(marks))).toEqual(voronoiMark());
    });
});
//# sourceMappingURL=nearest.test.js.map