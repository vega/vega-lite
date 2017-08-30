"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var util_1 = require("./util");
function binToString(bin) {
    if (util_1.isBoolean(bin)) {
        return 'bin';
    }
    return 'bin' + util_1.keys(bin).map(function (p) { return "_" + p + "_" + bin[p]; }).join('');
}
exports.binToString = binToString;
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        case channel_1.COLOR:
        case channel_1.OPACITY:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case channel_1.SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE0RTtBQUM1RSwrQkFBdUM7QUE2RHZDLHFCQUE0QixHQUF3QjtJQUNsRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQUksQ0FBQyxTQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUcsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBTEQsa0NBS0M7QUFFRCxxQkFBNEIsT0FBZ0I7SUFDMUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNoQixLQUFLLGFBQUcsQ0FBQztRQUNULEtBQUssZ0JBQU0sQ0FBQztRQUNaLEtBQUssY0FBSSxDQUFDO1FBQ1YsS0FBSyxlQUFLLENBQUM7UUFDWCxLQUFLLGlCQUFPLENBQUM7UUFDWCwrQ0FBK0M7UUFDL0MsOENBQThDO1FBQ2hELEtBQUssZUFBSztZQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyx1Q0FBdUM7UUFDbkQ7WUFDRSxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFkRCxrQ0FjQyJ9