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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdDYSxRQUFBLGFBQWEsR0FBbUI7SUFDM0MsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBQztJQUN0QyxLQUFLLEVBQUUsRUFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBQztJQUMvRCxRQUFRLEVBQUU7UUFDUixFQUFFLEVBQUUsaURBQWlEO1FBQ3JELFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDckIsU0FBUyxFQUFFLGlEQUFpRDtRQUM1RCxJQUFJLEVBQUUsT0FBTztLQUNkO0NBQ0YsQ0FBQyJ9