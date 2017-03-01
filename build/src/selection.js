"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    single: { on: 'click', fields: ['_id'] },
    multi: { on: 'click', fields: ['_id'], toggle: 'event.shiftKey' },
    interval: {
        on: '[mousedown, window:mouseup] > window:mousemove!',
        encodings: ['x', 'y'],
        translate: '[mousedown, window:mouseup] > window:mousemove!',
        zoom: 'wheel'
    }
};
//# sourceMappingURL=selection.js.map