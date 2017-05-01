"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var dataflow_1 = require("./dataflow");
/**
 * A node that helps us track what fields we are faceting by.
 */
var FacetNode = (function (_super) {
    tslib_1.__extends(FacetNode, _super);
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    function FacetNode(model, name, data) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.name = name;
        _this.data = data;
        if (model.facet.column) {
            _this.columnField = model.field(channel_1.COLUMN);
            _this.columnName = model.getName('column');
        }
        if (model.facet.row) {
            _this.rowField = model.field(channel_1.ROW);
            _this.rowName = model.getName('row');
        }
        return _this;
    }
    Object.defineProperty(FacetNode.prototype, "fields", {
        get: function () {
            var fields = [];
            if (this.columnField) {
                fields.push(this.columnField);
            }
            if (this.rowField) {
                fields.push(this.rowField);
            }
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetNode.prototype, "source", {
        /**
         * The name to reference this source is its name
         */
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    FacetNode.prototype.assemble = function () {
        var data = [];
        if (this.columnName) {
            data.push({
                name: this.columnName,
                source: this.data,
                transform: [{
                        type: 'aggregate',
                        groupby: [this.columnField]
                    }]
            });
            // Column needs another data source to calculate cardinality as input to layout
            data.push({
                name: this.columnName + '_layout',
                source: this.columnName,
                transform: [{
                        type: 'aggregate',
                        ops: ['distinct'],
                        fields: [this.columnField]
                    }]
            });
        }
        if (this.rowName) {
            data.push({
                name: this.rowName,
                source: this.data,
                transform: [{
                        type: 'aggregate',
                        groupby: [this.rowField]
                    }]
            });
        }
        return data;
    };
    return FacetNode;
}(dataflow_1.DataFlowNode));
exports.FacetNode = FacetNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUEwQztBQUcxQyx1Q0FBb0Q7QUFFcEQ7O0dBRUc7QUFDSDtJQUErQixxQ0FBWTtJQU96Qzs7OztPQUlHO0lBQ0gsbUJBQW1DLEtBQWlCLEVBQWtCLElBQVksRUFBUyxJQUFZO1FBQXZHLFlBQ0UsaUJBQU8sU0FXUjtRQVprQyxXQUFLLEdBQUwsS0FBSyxDQUFZO1FBQWtCLFVBQUksR0FBSixJQUFJLENBQVE7UUFBUyxVQUFJLEdBQUosSUFBSSxDQUFRO1FBR3JHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2QixLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQU0sQ0FBQyxDQUFDO1lBQ3ZDLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsQ0FBQztZQUNqQyxLQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQzs7SUFDSCxDQUFDO0lBRUQsc0JBQUksNkJBQU07YUFBVjtZQUNFLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUtELHNCQUFJLDZCQUFNO1FBSFY7O1dBRUc7YUFDSDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7OztPQUFBO0lBRU0sNEJBQVEsR0FBZjtRQUNFLElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUUxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNSLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUsV0FBVzt3QkFDakIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztxQkFDNUIsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILCtFQUErRTtZQUMvRSxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNSLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVM7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDdkIsU0FBUyxFQUFFLENBQUM7d0JBQ1YsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQzt3QkFDakIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztxQkFDM0IsQ0FBQzthQUNILENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNSLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUsV0FBVzt3QkFDakIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztxQkFDekIsQ0FBQzthQUNILENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWxGRCxDQUErQix1QkFBWSxHQWtGMUM7QUFsRlksOEJBQVMifQ==