"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mark_1 = require("./../mark");
var boxplot_1 = require("./boxplot");
var errorbar_1 = require("./errorbar");
/**
 * Registry index for all composite mark's normalizer
 */
var normalizerRegistry = {};
function add(mark, normalizer) {
    normalizerRegistry[mark] = normalizer;
}
exports.add = add;
function remove(mark) {
    delete normalizerRegistry[mark];
}
exports.remove = remove;
add(boxplot_1.BOXPLOT, boxplot_1.normalizeBoxPlot);
add(errorbar_1.ERRORBAR, errorbar_1.normalizeErrorBar);
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
function normalize(
    // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec, config) {
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var normalizer = normalizerRegistry[mark];
    if (normalizer) {
        return normalizer(spec, config);
    }
    throw new Error("Unregistered composite mark " + mark);
}
exports.normalize = normalize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtDQUE2QztBQUU3QyxxQ0FBb0Q7QUFDcEQsdUNBQXVEO0FBS3ZEOztHQUVHO0FBQ0gsSUFBTSxrQkFBa0IsR0FBcUMsRUFBRSxDQUFDO0FBRWhFLGFBQW9CLElBQVksRUFBRSxVQUEwQjtJQUMxRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDeEMsQ0FBQztBQUZELGtCQUVDO0FBRUQsZ0JBQXVCLElBQVk7SUFDakMsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkQsd0JBRUM7QUFLRCxHQUFHLENBQUMsaUJBQU8sRUFBRSwwQkFBZ0IsQ0FBQyxDQUFDO0FBQy9CLEdBQUcsQ0FBQyxtQkFBUSxFQUFFLDRCQUFpQixDQUFDLENBQUM7QUFFakM7O0dBRUc7QUFDSDtJQUNJLHlIQUF5SDtJQUN6SCxJQUE0QyxFQUM1QyxNQUFjO0lBR2hCLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDL0QsSUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUErQixJQUFNLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBYkQsOEJBYUMifQ==