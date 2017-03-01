"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var util_1 = require("../../util");
var nullfilter_1 = require("./nullfilter");
var filter_1 = require("./filter");
var bin_1 = require("./bin");
var formula_1 = require("./formula");
var timeunit_1 = require("./timeunit");
var source;
(function (source) {
    function parse(model) {
        var data = model.data;
        if (data) {
            // If data is explicitly provided
            var sourceData = { name: model.dataName(data_1.SOURCE) };
            if (data_1.isInlineData(data)) {
                sourceData.values = data.values;
                sourceData.format = { type: 'json' };
            }
            else if (data_1.isUrlData(data)) {
                sourceData.url = data.url;
                // Extract extension from URL using snippet from
                // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
                var defaultExtension = /(?:\.([^.]+))?$/.exec(sourceData.url)[1];
                if (!util_1.contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
                    defaultExtension = 'json';
                }
                var dataFormat = data.format || {};
                // For backward compatibility for former `data.formatType` property
                var formatType = dataFormat.type || data['formatType'];
                sourceData.format =
                    util_1.extend({ type: formatType ? formatType : defaultExtension }, dataFormat.property ? { property: dataFormat.property } : {}, 
                    // Feature and mesh are two mutually exclusive properties
                    dataFormat.feature ?
                        { feature: dataFormat.feature } :
                        dataFormat.mesh ?
                            { mesh: dataFormat.mesh } :
                            {});
            }
            return sourceData;
        }
        else if (!model.parent) {
            // If data is not explicitly provided but the model is a root,
            // need to produce a source as well
            return { name: model.dataName(data_1.SOURCE) };
        }
        return undefined;
    }
    source.parseUnit = parse;
    function parseFacet(model) {
        var sourceData = parse(model);
        if (!model.child.component.data.source) {
            // If the child does not have its own source, have to rename its source.
            model.child.renameData(model.child.dataName(data_1.SOURCE), model.dataName(data_1.SOURCE));
        }
        return sourceData;
    }
    source.parseFacet = parseFacet;
    function parseLayer(model) {
        var sourceData = parse(model);
        model.children.forEach(function (child) {
            var childData = child.component.data;
            if (model.compatibleSource(child)) {
                // we cannot merge if the child has filters defined even after we tried to move them up
                var canMerge = !childData.filter && !childData.formatParse && !childData.nullFilter;
                if (canMerge) {
                    // rename source because we can just remove it
                    child.renameData(child.dataName(data_1.SOURCE), model.dataName(data_1.SOURCE));
                    delete childData.source;
                }
                else {
                    // child does not have data defined or the same source so just use the parents source
                    childData.source = {
                        name: child.dataName(data_1.SOURCE),
                        source: model.dataName(data_1.SOURCE)
                    };
                }
            }
        });
        return sourceData;
    }
    source.parseLayer = parseLayer;
    function assemble(component) {
        if (component.source) {
            var sourceData = component.source;
            if (component.formatParse) {
                component.source.format = component.source.format || {};
                component.source.format.parse = component.formatParse;
            }
            sourceData.transform = [].concat(formula_1.formula.assemble(component.calculate), nullfilter_1.nullFilter.assemble(component.nullFilter), filter_1.filter.assemble(component.filter), bin_1.bin.assemble(component.bin), timeunit_1.timeUnit.assemble(component.timeUnit));
            return sourceData;
        }
        return null;
    }
    source.assemble = assemble;
})(source = exports.source || (exports.source = {}));
//# sourceMappingURL=source.js.map