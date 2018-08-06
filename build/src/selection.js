"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECTION_ID = '_vgsid_';
exports.defaultConfig = {
    single: {
        on: 'click',
        fields: [exports.SELECTION_ID],
        resolve: 'global',
        empty: 'all'
    },
    multi: {
        on: 'click',
        fields: [exports.SELECTION_ID],
        toggle: 'event.shiftKey',
        resolve: 'global',
        empty: 'all'
    },
    interval: {
        on: '[mousedown, window:mouseup] > window:mousemove!',
        encodings: ['x', 'y'],
        translate: '[mousedown, window:mouseup] > window:mousemove!',
        zoom: 'wheel!',
        mark: { fill: '#333', fillOpacity: 0.125, stroke: 'white' },
        resolve: 'global'
    }
};
//# sourceMappingURL=selection.js.map