"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var util_1 = require("../../util");
exports.nonPositiveFilter = {
    parseUnit: function (model) {
        return model.channels().reduce(function (nonPositiveComponent, channel) {
            var scale = model.scale(channel);
            if (!model.field(channel) || !scale) {
                // don't set anything
                return nonPositiveComponent;
            }
            nonPositiveComponent[model.field(channel)] = scale.type === scale_1.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});
    },
    parseFacet: function (model) {
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then consider merging
        if (!childDataComponent.source) {
            // For now, let's assume it always has union scale
            var nonPositiveFilterComponent = childDataComponent.nonPositiveFilter;
            delete childDataComponent.nonPositiveFilter;
            return nonPositiveFilterComponent;
        }
        return {};
    },
    parseLayer: function (model) {
        // note that we run this before source.parseLayer
        var nonPositiveFilterComponent = {};
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util_1.differ(childDataComponent.nonPositiveFilter, nonPositiveFilterComponent)) {
                util_1.extend(nonPositiveFilterComponent, childDataComponent.nonPositiveFilter);
                delete childDataComponent.nonPositiveFilter;
            }
        });
        return nonPositiveFilterComponent;
    },
    assemble: function (nonPositiveFilterComponent) {
        if (nonPositiveFilterComponent) {
            return util_1.keys(nonPositiveFilterComponent).filter(function (field) {
                // Only filter fields (keys) with value = true
                return nonPositiveFilterComponent[field];
            }).map(function (field) {
                return {
                    type: 'filter',
                    expr: 'datum["' + field + '"] > 0'
                };
            });
        }
        return [];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscUNBQXNDO0FBQ3RDLG1DQUFzRDtBQU96QyxRQUFBLGlCQUFpQixHQUF5QztJQUNyRSxTQUFTLEVBQUUsVUFBUyxLQUFZO1FBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVMsb0JBQW9CLEVBQUUsT0FBTztZQUNuRSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLHFCQUFxQjtnQkFDckIsTUFBTSxDQUFDLG9CQUFvQixDQUFDO1lBQzlCLENBQUM7WUFDRCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxpQkFBUyxDQUFDLEdBQUcsQ0FBQztZQUMxRSxNQUFNLENBQUMsb0JBQW9CLENBQUM7UUFDOUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQWlCO1FBQ3BDLElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRXRELG1FQUFtRTtRQUNuRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0Isa0RBQWtEO1lBQ2xELElBQU0sMEJBQTBCLEdBQUcsa0JBQWtCLENBQUMsaUJBQWlCLENBQUM7WUFDeEUsT0FBTyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQztZQUM1QyxNQUFNLENBQUMsMEJBQTBCLENBQUM7UUFDcEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsVUFBVSxFQUFFLFVBQVMsS0FBaUI7UUFDcEMsaURBQWlEO1FBQ2pELElBQUksMEJBQTBCLEdBQUcsRUFBRSxDQUFDO1FBRXBDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMzQixJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0csYUFBTSxDQUFDLDBCQUEwQixFQUFFLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3pFLE9BQU8sa0JBQWtCLENBQUMsaUJBQWlCLENBQUM7WUFDOUMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLDBCQUEwQixDQUFDO0lBQ3BDLENBQUM7SUFFRCxRQUFRLEVBQUUsVUFBUywwQkFBeUM7UUFDMUQsRUFBRSxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxXQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLO2dCQUNuRCw4Q0FBOEM7Z0JBQzlDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxLQUFLO2dCQUNuQixNQUFNLENBQUM7b0JBQ0wsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLFNBQVMsR0FBRyxLQUFLLEdBQUcsUUFBUTtpQkFDbkMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0NBQ0YsQ0FBQyJ9