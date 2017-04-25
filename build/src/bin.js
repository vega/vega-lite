"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var util_1 = require("./util");
function binToString(bin) {
    if (util_1.isBoolean(bin)) {
        return 'bin';
    }
    return 'bin' + Object.keys(bin).map(function (p) { return "_" + p + "_" + bin[p]; }).join('');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE0RTtBQUM1RSwrQkFBaUM7QUEyRGpDLHFCQUE0QixHQUFrQjtJQUM1QyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFJLENBQUMsU0FBSSxHQUFHLENBQUMsQ0FBQyxDQUFHLEVBQWpCLENBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUxELGtDQUtDO0FBRUQscUJBQTRCLE9BQWdCO0lBQzFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxhQUFHLENBQUM7UUFDVCxLQUFLLGdCQUFNLENBQUM7UUFDWixLQUFLLGNBQUksQ0FBQztRQUNWLEtBQUssZUFBSyxDQUFDO1FBQ1gsS0FBSyxpQkFBTyxDQUFDO1FBQ1gsK0NBQStDO1FBQy9DLDhDQUE4QztRQUNoRCxLQUFLLGVBQUs7WUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsdUNBQXVDO1FBQ25EO1lBQ0UsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDO0FBZEQsa0NBY0MifQ==