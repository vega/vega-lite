"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    single: { on: 'click', fields: ['_id'], resolve: 'global' },
    multi: { on: 'click', fields: ['_id'], toggle: 'event.shiftKey', resolve: 'global' },
    interval: {
        on: '[mousedown, window:mouseup] > window:mousemove!',
        encodings: ['x', 'y'],
        translate: '[mousedown, window:mouseup] > window:mousemove!',
        zoom: 'wheel',
        resolve: 'global'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWlDYSxRQUFBLGFBQWEsR0FBbUI7SUFDM0MsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFDO0lBQ3pELEtBQUssRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUM7SUFDbEYsUUFBUSxFQUFFO1FBQ1IsRUFBRSxFQUFFLGlEQUFpRDtRQUNyRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3JCLFNBQVMsRUFBRSxpREFBaUQ7UUFDNUQsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsUUFBUTtLQUNsQjtDQUNGLENBQUMifQ==