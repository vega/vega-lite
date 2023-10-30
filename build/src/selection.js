import { isObject } from 'vega-util';
export const SELECTION_ID = '_vgsid_';
export const defaultConfig = {
    point: {
        on: 'click',
        fields: [SELECTION_ID],
        toggle: 'event.shiftKey',
        resolve: 'global',
        clear: 'dblclick'
    },
    interval: {
        on: '[pointerdown, window:pointerup] > window:pointermove!',
        encodings: ['x', 'y'],
        translate: '[pointerdown, window:pointerup] > window:pointermove!',
        zoom: 'wheel!',
        mark: { fill: '#333', fillOpacity: 0.125, stroke: 'white' },
        resolve: 'global',
        clear: 'dblclick'
    }
};
export function isLegendBinding(bind) {
    return bind === 'legend' || !!bind?.legend;
}
export function isLegendStreamBinding(bind) {
    return isLegendBinding(bind) && isObject(bind);
}
export function isSelectionParameter(param) {
    return !!param?.['select'];
}
//# sourceMappingURL=selection.js.map