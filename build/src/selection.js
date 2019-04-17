export const SELECTION_ID = '_vgsid_';
export function isIntervalSelection(s) {
    return s.type === 'interval';
}
export const defaultConfig = {
    single: {
        on: 'click',
        fields: [SELECTION_ID],
        resolve: 'global',
        empty: 'all',
        clear: 'dblclick'
    },
    multi: {
        on: 'click',
        fields: [SELECTION_ID],
        toggle: 'event.shiftKey',
        resolve: 'global',
        empty: 'all',
        clear: 'dblclick'
    },
    interval: {
        on: '[mousedown, window:mouseup] > window:mousemove!',
        encodings: ['x', 'y'],
        translate: '[mousedown, window:mouseup] > window:mousemove!',
        zoom: 'wheel!',
        mark: { fill: '#333', fillOpacity: 0.125, stroke: 'white' },
        resolve: 'global',
        clear: 'dblclick'
    }
};
//# sourceMappingURL=selection.js.map