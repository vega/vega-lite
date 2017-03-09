"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetime_1 = require("../../datetime");
var data_1 = require("../../data");
var fielddef_1 = require("../../fielddef");
var filter_1 = require("../../filter");
var type_1 = require("../../type");
var util_1 = require("../../util");
function parse(model) {
    var calcFieldMap = (model.calculate() || []).reduce(function (fieldMap, formula) {
        fieldMap[formula.as] = true;
        return fieldMap;
    }, {});
    var parseComponent = {};
    // Parse filter fields
    var filter = model.filter();
    if (!util_1.isArray(filter)) {
        filter = [filter];
    }
    filter.forEach(function (f) {
        var val = null;
        // For EqualFilter, just use the equal property.
        // For RangeFilter and OneOfFilter, all array members should have
        // the same type, so we only use the first one.
        if (filter_1.isEqualFilter(f)) {
            val = f.equal;
        }
        else if (filter_1.isRangeFilter(f)) {
            val = f.range[0];
        }
        else if (filter_1.isOneOfFilter(f)) {
            val = (f.oneOf || f['in'])[0];
        } // else -- for filter expression, we can't infer anything
        if (!!val) {
            if (datetime_1.isDateTime(val)) {
                parseComponent[f['field']] = 'date';
            }
            else if (util_1.isNumber(val)) {
                parseComponent[f['field']] = 'number';
            }
            else if (util_1.isString(val)) {
                parseComponent[f['field']] = 'string';
            }
        }
    });
    // Parse encoded fields
    model.forEachFieldDef(function (fieldDef) {
        if (fieldDef.type === type_1.TEMPORAL) {
            parseComponent[fieldDef.field] = 'date';
        }
        else if (fieldDef.type === type_1.QUANTITATIVE) {
            if (fielddef_1.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
                return;
            }
            parseComponent[fieldDef.field] = 'number';
        }
    });
    // Custom parse should override inferred parse
    var data = model.data;
    if (data && data_1.isUrlData(data) && data.format && data.format.parse) {
        var parse_1 = data.format.parse;
        util_1.keys(parse_1).forEach(function (field) {
            parseComponent[field] = parse_1[field];
        });
    }
    return parseComponent;
}
exports.formatParse = {
    parseUnit: parse,
    parseFacet: function (model) {
        var parseComponent = parse(model);
        // If child doesn't have its own data source, but has its own parse, then merge
        var childDataComponent = model.child.component.data;
        if (!childDataComponent.source && childDataComponent.formatParse) {
            util_1.extend(parseComponent, childDataComponent.formatParse);
            delete childDataComponent.formatParse;
        }
        return parseComponent;
    },
    parseLayer: function (model) {
        // note that we run this before source.parseLayer
        var parseComponent = parse(model);
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util_1.differ(childDataComponent.formatParse, parseComponent)) {
                // merge parse up if the child does not have an incompatible parse
                util_1.extend(parseComponent, childDataComponent.formatParse);
                delete childDataComponent.formatParse;
            }
        });
        return parseComponent;
    },
    // identity function
    assemble: function (x) { return x; }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsMkNBQW9EO0FBQ3BELG1DQUFxQztBQUNyQywyQ0FBaUQ7QUFDakQsdUNBQXlFO0FBQ3pFLG1DQUFrRDtBQUNsRCxtQ0FBbUY7QUFNbkYsZUFBZSxLQUFZO0lBQ3pCLElBQU0sWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFTLFFBQVEsRUFBRSxPQUFPO1FBQzlFLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRVAsSUFBSSxjQUFjLEdBQWlCLEVBQUUsQ0FBQztJQUV0QyxzQkFBc0I7SUFDdEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7UUFDZCxJQUFJLEdBQUcsR0FBeUMsSUFBSSxDQUFDO1FBQ3JELGdEQUFnRDtRQUNoRCxpRUFBaUU7UUFDakUsK0NBQStDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLHNCQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsc0JBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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