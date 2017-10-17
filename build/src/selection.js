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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdhLFFBQUEsWUFBWSxHQUFHLFNBQVMsQ0FBQztBQTJNekIsUUFBQSxhQUFhLEdBQW1CO0lBQzNDLE1BQU0sRUFBRTtRQUNOLEVBQUUsRUFBRSxPQUFPO1FBQ1gsTUFBTSxFQUFFLENBQUMsb0JBQVksQ0FBQztRQUN0QixPQUFPLEVBQUUsUUFBUTtRQUNqQixLQUFLLEVBQUUsS0FBSztLQUNiO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLE9BQU87UUFDWCxNQUFNLEVBQUUsQ0FBQyxvQkFBWSxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxnQkFBZ0I7UUFDeEIsT0FBTyxFQUFFLFFBQVE7UUFDakIsS0FBSyxFQUFFLEtBQUs7S0FDYjtJQUNELFFBQVEsRUFBRTtRQUNSLEVBQUUsRUFBRSxpREFBaUQ7UUFDckQsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUNyQixTQUFTLEVBQUUsaURBQWlEO1FBQzVELElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUM7UUFDekQsT0FBTyxFQUFFLFFBQVE7S0FDbEI7Q0FDRixDQUFDIn0=