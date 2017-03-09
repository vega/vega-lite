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
            else if (data_1.isNamedData(data)) {
                return { name: data.name };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBb0Y7QUFDcEYsbUNBQTRDO0FBUTVDLDJDQUF3QztBQUN4QyxtQ0FBZ0M7QUFDaEMsNkJBQTBCO0FBQzFCLHFDQUFrQztBQUNsQyx1Q0FBb0M7QUFFcEMsSUFBaUIsTUFBTSxDQXlHdEI7QUF6R0QsV0FBaUIsTUFBTTtJQUNyQixlQUFlLEtBQVk7UUFDekIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUV0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsaUNBQWlDO1lBRWpDLElBQUksVUFBVSxHQUFXLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBTSxDQUFDLEVBQUMsQ0FBQztZQUN4RCxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNoQyxVQUFVLENBQUMsTUFBTSxHQUFHLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO1lBQ3JDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLFVBQVUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFFMUIsZ0RBQWdEO2dCQUNoRCx3R0FBd0c7Z0JBQ3hHLElBQUksZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxF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