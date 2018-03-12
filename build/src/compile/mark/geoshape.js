"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mixins = require("./mixins");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
exports.geoshape = {
    vgMark: 'shape',
    encodeEntry: function (model) {
        return __assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }));
    },
    postEncodingTransform: function (model) {
        var encoding = model.encoding;
        var shapeDef = encoding.shape;
        var transform = __assign({ type: 'geoshape', projection: model.projectionName() }, (shapeDef && fielddef_1.isFieldDef(shapeDef) && shapeDef.type === type_1.GEOJSON ? { field: fielddef_1.vgField(shapeDef, { expr: 'datum' }) } : {}));
        return [transform];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vvc2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL2dlb3NoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxpQ0FBbUM7QUFFbkMsMkNBQW1EO0FBQ25ELG1DQUFtQztBQUl0QixRQUFBLFFBQVEsR0FBaUI7SUFDcEMsTUFBTSxFQUFFLE9BQU87SUFDZixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUNwRTtJQUNKLENBQUM7SUFDRCxxQkFBcUIsRUFBRSxVQUFDLEtBQWdCO1FBQy9CLElBQUEseUJBQVEsQ0FBVTtRQUN6QixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBRWhDLElBQU0sU0FBUyxjQUNiLElBQUksRUFBRSxVQUFVLEVBQ2hCLFVBQVUsRUFBRSxLQUFLLENBQUMsY0FBYyxFQUFFLElBRS9CLENBQUMsUUFBUSxJQUFJLHFCQUFVLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxjQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ3RILENBQUM7UUFDRixNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCAqIGFzIG1peGlucyBmcm9tICcuL21peGlucyc7XG5cbmltcG9ydCB7aXNGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHRU9KU09OfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7VmdHZW9TaGFwZVRyYW5zZm9ybSwgVmdQb3N0RW5jb2RpbmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY29uc3QgZ2Vvc2hhcGU6IE1hcmtDb21waWxlciA9IHtcbiAgdmdNYXJrOiAnc2hhcGUnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwge3NpemU6ICdpZ25vcmUnLCBvcmllbnQ6ICdpZ25vcmUnfSlcbiAgICB9O1xuICB9LFxuICBwb3N0RW5jb2RpbmdUcmFuc2Zvcm06IChtb2RlbDogVW5pdE1vZGVsKTogVmdQb3N0RW5jb2RpbmdUcmFuc2Zvcm1bXSA9PiB7XG4gICAgY29uc3Qge2VuY29kaW5nfSA9IG1vZGVsO1xuICAgIGNvbnN0IHNoYXBlRGVmID0gZW5jb2Rpbmcuc2hhcGU7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm06IFZnR2VvU2hhcGVUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnZ2Vvc2hhcGUnLFxuICAgICAgcHJvamVjdGlvbjogbW9kZWwucHJvamVjdGlvbk5hbWUoKSxcbiAgICAgIC8vIGFzOiAnc2hhcGUnLFxuICAgICAgLi4uKHNoYXBlRGVmICYmIGlzRmllbGREZWYoc2hhcGVEZWYpICYmIHNoYXBlRGVmLnR5cGUgPT09IEdFT0pTT04gPyB7ZmllbGQ6IHZnRmllbGQoc2hhcGVEZWYsIHtleHByOiAnZGF0dW0nfSl9IDoge30pXG4gICAgfTtcbiAgICByZXR1cm4gW3RyYW5zZm9ybV07XG4gIH1cbn07XG4iXX0=