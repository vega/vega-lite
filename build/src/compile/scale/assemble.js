"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var log = require("../../log");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var SELECTION_OPS = {
    global: 'union', independent: 'intersect',
    union: 'union', union_others: 'union',
    intersect: 'intersect', intersect_others: 'intersect'
};
function assembleScale(model) {
    return util_1.vals(model.component.scales).map(function (scale) {
        // As selections are parsed _after_ scales, we can only shim in a domainRaw
        // in the output Vega during assembly. FIXME: This should be moved to
        // selection.ts, but any reference to it throws an error. Possible circular dependency?
        var raw = scale.domainRaw;
        if (raw && raw.selection) {
            raw.field = raw.field || null;
            raw.encoding = raw.encoding || null;
            var selName = raw.selection;
            var selCmpt = model.component.selection && model.component.selection[selName];
            if (selCmpt) {
                log.warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
            }
            else {
                selCmpt = model.getComponent('selection', selName);
                scale.domainRaw = {
                    signal: (selCmpt.type === 'interval' ? 'vlIntervalDomain' : 'vlPointDomain') +
                        ("(" + util_1.stringValue(selCmpt.name + '_store') + ", " + util_1.stringValue(raw.encoding) + ", " + util_1.stringValue(raw.field) + ", ") +
                        (util_1.stringValue(SELECTION_OPS[selCmpt.resolve]) + ")")
                };
            }
        }
        // correct references to data
        var domain = scale.domain;
        if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
            return scale;
        }
        else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
            domain.fields = domain.fields.map(function (f) {
                return tslib_1.__assign({}, f, { data: model.lookupDataSource(f.data) });
            });
            return scale;
        }
        else if (vega_schema_1.isSignalRefDomain(domain) || vega_util_1.isArray(domain)) {
            return scale;
        }
        else {
            throw new Error('invalid scale domain');
        }
    });
}
exports.assembleScale = assembleScale;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMsK0JBQWlDO0FBRWpDLG1DQUE2QztBQUM3QyxpREFBK0g7QUFHL0gsSUFBTSxhQUFhLEdBQUc7SUFDcEIsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVztJQUN6QyxLQUFLLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxPQUFPO0lBQ3JDLFNBQVMsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVztDQUN0RCxDQUFDO0FBRUYsdUJBQThCLEtBQVk7SUFDdEMsTUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7UUFDM0MsMkVBQTJFO1FBQzNFLHFFQUFxRTtRQUNyRSx1RkFBdUY7UUFDdkYsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztZQUM5QixHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1lBQ3BDLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDOUIsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLENBQUMsSUFBSSxDQUFDLHlGQUF5RixDQUFDLENBQUM7WUFDdEcsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE9BQU8sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbkQsS0FBSyxDQUFDLFNBQVMsR0FBRztvQkFDaEIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLEdBQUcsa0JBQWtCLEdBQUcsZUFBZSxDQUFDO3lCQUM1RSxNQUFJLGtCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsVUFBSyxrQkFBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBSyxrQkFBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBSSxDQUFBO3lCQUNsRyxrQkFBVyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBRyxDQUFBO2lCQUNsRCxDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7UUFFRCw2QkFBNkI7UUFDN0IsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyw2QkFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1DQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsb0NBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFZO2dCQUM3QyxNQUFNLHNCQUNELENBQUMsSUFDSixJQUFJLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFDcEM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLG1CQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDMUMsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTFDRCxzQ0EwQ0MifQ==