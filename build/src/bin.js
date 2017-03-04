"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case channel_1.SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE0RDtBQTBDNUQscUJBQTRCLE9BQWdCO0lBQzFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxhQUFHLENBQUM7UUFDVCxLQUFLLGdCQUFNLENBQUM7UUFDWixLQUFLLGNBQUksQ0FBQztRQUNSLCtDQUErQztRQUMvQyw4Q0FBOEM7UUFDaEQsS0FBSyxlQUFLO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztRQUNuRDtZQUNFLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0FBQ0gsQ0FBQztBQVpELGtDQVlDIn0=