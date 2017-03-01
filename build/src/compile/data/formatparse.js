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
//# sourceMappingURL=formatparse.js.map