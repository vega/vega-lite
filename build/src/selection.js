"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECTION_ID = '_vgsid_';
exports.defaultConfig = {
    single: { on: 'click', fields: [exports.SELECTION_ID], resolve: 'global' },
    multi: { on: 'click', fields: [exports.SELECTION_ID], toggle: 'event.shiftKey', resolve: 'global' },
    interval: {
        on: '[mousedown, window:mouseup] > window:mousemove!',
        encodings: ['x', 'y'],
        translate: '[mousedown, window:mouseup] > window:mousemove!',
        zoom: 'wheel!',
        mark: { fill: '#333', fillOpacity: 0.125, stroke: 'white' },
        resolve: 'global'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdhLFFBQUEsWUFBWSxHQUFHLFNBQVMsQ0FBQztBQXFMekIsUUFBQSxhQUFhLEdBQW1CO0lBQzNDLE1BQU0sRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsb0JBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUM7SUFDaEUsS0FBSyxFQUFFLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxvQkFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUM7SUFDekYsUUFBUSxFQUFFO1FBQ1IsRUFBRSxFQUFFLGlEQUFpRDtRQUNyRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3JCLFNBQVMsRUFBRSxpREFBaUQ7UUFDNUQsSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQztRQUN6RCxPQUFPLEVBQUUsUUFBUTtLQUNsQjtDQUNGLENBQUMifQ==