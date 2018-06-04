"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_event_selector_1 = require("vega-event-selector");
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var log_1 = require("../../log");
var selection_1 = require("../../selection");
var util_1 = require("../../util");
var model_1 = require("../model");
var interval_1 = tslib_1.__importDefault(require("./interval"));
var multi_1 = tslib_1.__importDefault(require("./multi"));
var single_1 = tslib_1.__importDefault(require("./single"));
var transforms_1 = require("./transforms/transforms");
exports.STORE = '_store';
exports.TUPLE = '_tuple';
exports.MODIFY = '_modify';
exports.SELECTION_DOMAIN = '_selection_domain_';
function parseUnitSelection(model, selDefs) {
    var selCmpts = {};
    var selectionConfig = model.config.selection;
    var _loop_1 = function (name_1) {
        if (!selDefs.hasOwnProperty(name_1)) {
            return "continue";
        }
        var selDef = selDefs[name_1];
        var cfg = selectionConfig[selDef.type];
        // Set default values from config if a property hasn't been specified,
        // or if it is true. E.g., "translate": true should use the default
        // event handlers for translate. However, true may be a valid value for
        // a property (e.g., "nearest": true).
        for (var key in cfg) {
            // A selection should contain either `encodings` or `fields`, only use
            // default values for these two values if neither of them is specified.
            if ((key === 'encodings' && selDef.fields) || (key === 'fields' && selDef.encodings)) {
                continue;
            }
            if (key === 'mark') {
                selDef[key] = tslib_1.__assign({}, cfg[key], selDef[key]);
            }
            if (selDef[key] === undefined || selDef[key] === true) {
                selDef[key] = cfg[key] || selDef[key];
            }
        }
        name_1 = util_1.varName(name_1);
        var selCmpt = selCmpts[name_1] = tslib_1.__assign({}, selDef, { name: name_1, events: vega_util_1.isString(selDef.on) ? vega_event_selector_1.selector(selDef.on, 'scope') : selDef.on });
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.parse) {
                txCompiler.parse(model, selDef, selCmpt);
            }
        });
    };
    for (var name_1 in selDefs) {
        _loop_1(name_1);
    }
    return selCmpts;
}
exports.parseUnitSelection = parseUnitSelection;
function assembleUnitSelectionSignals(model, signals) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        var name = selCmpt.name;
        var modifyExpr = selCompiler.modifyExpr(model, selCmpt);
        signals.push.apply(signals, selCompiler.signals(model, selCmpt));
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.signals) {
                signals = txCompiler.signals(model, selCmpt, signals);
            }
            if (txCompiler.modifyExpr) {
                modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
            }
        });
        signals.push({
            name: name + exports.MODIFY,
            on: [{
                    events: { signal: name + exports.TUPLE },
                    update: "modify(" + vega_util_1.stringValue(selCmpt.name + exports.STORE) + ", " + modifyExpr + ")"
                }]
        });
    });
    var facetModel = getFacetModel(model);
    if (signals.length && facetModel) {
        var name_2 = vega_util_1.stringValue(facetModel.getName('cell'));
        signals.unshift({
            name: 'facet',
            value: {},
            on: [{
                    events: vega_event_selector_1.selector('mousemove', 'scope'),
                    update: "isTuple(facet) ? facet : group(" + name_2 + ").datum"
                }]
        });
    }
    return signals;
}
exports.assembleUnitSelectionSignals = assembleUnitSelectionSignals;
function assembleTopLevelSignals(model, signals) {
    var needsUnit = false;
    forEachSelection(model, function (selCmpt, selCompiler) {
        if (selCompiler.topLevelSignals) {
            signals = selCompiler.topLevelSignals(model, selCmpt, signals);
        }
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.topLevelSignals) {
                signals = txCompiler.topLevelSignals(model, selCmpt, signals);
            }
        });
        needsUnit = true;
    });
    if (needsUnit) {
        var hasUnit = signals.filter(function (s) { return s.name === 'unit'; });
        if (!(hasUnit.length)) {
            signals.unshift({
                name: 'unit',
                value: {},
                on: [{ events: 'mousemove', update: 'isTuple(group()) ? group() : unit' }]
            });
        }
    }
    return signals;
}
exports.assembleTopLevelSignals = assembleTopLevelSignals;
function assembleUnitSelectionData(model, data) {
    forEachSelection(model, function (selCmpt) {
        var contains = data.filter(function (d) { return d.name === selCmpt.name + exports.STORE; });
        if (!contains.length) {
            data.push({ name: selCmpt.name + exports.STORE });
        }
    });
    return data;
}
exports.assembleUnitSelectionData = assembleUnitSelectionData;
function assembleUnitSelectionMarks(model, marks) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        marks = selCompiler.marks ? selCompiler.marks(model, selCmpt, marks) : marks;
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.marks) {
                marks = txCompiler.marks(model, selCmpt, marks);
            }
        });
    });
    return marks;
}
exports.assembleUnitSelectionMarks = assembleUnitSelectionMarks;
function assembleLayerSelectionMarks(model, marks) {
    model.children.forEach(function (child) {
        if (model_1.isUnitModel(child)) {
            marks = assembleUnitSelectionMarks(child, marks);
        }
    });
    return marks;
}
exports.assembleLayerSelectionMarks = assembleLayerSelectionMarks;
function selectionPredicate(model, selections, dfnode) {
    var stores = [];
    function expr(name) {
        var vname = util_1.varName(name);
        var selCmpt = model.getSelectionComponent(vname, name);
        var store = vega_util_1.stringValue(vname + exports.STORE);
        if (selCmpt.timeUnit) {
            var child = dfnode || model.component.data.raw;
            var tunode = selCmpt.timeUnit.clone();
            if (child.parent) {
                tunode.insertAsParentOf(child);
            }
            else {
                child.parent = tunode;
            }
        }
        if (selCmpt.empty !== 'none') {
            stores.push(store);
        }
        return compiler(selCmpt.type).predicate + ("(" + store + ", datum") +
            (selCmpt.resolve === 'global' ? ')' : ", " + vega_util_1.stringValue(selCmpt.resolve) + ")");
    }
    var predicateStr = util_1.logicalExpr(selections, expr);
    return (stores.length
        ? '!(' + stores.map(function (s) { return "length(data(" + s + "))"; }).join(' || ') + ') || '
        : '') + ("(" + predicateStr + ")");
}
exports.selectionPredicate = selectionPredicate;
// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
function isRawSelectionDomain(domainRaw) {
    return domainRaw.signal.indexOf(exports.SELECTION_DOMAIN) >= 0;
}
exports.isRawSelectionDomain = isRawSelectionDomain;
function selectionScaleDomain(model, domainRaw) {
    var selDomain = JSON.parse(domainRaw.signal.replace(exports.SELECTION_DOMAIN, ''));
    var name = util_1.varName(selDomain.selection);
    var selCmpt = model.component.selection && model.component.selection[name];
    if (selCmpt) {
        log_1.warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
    }
    else {
        selCmpt = model.getSelectionComponent(name, selDomain.selection);
        if (!selDomain.encoding && !selDomain.field) {
            selDomain.field = selCmpt.project[0].field;
            if (selCmpt.project.length > 1) {
                log_1.warn('A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
                    ("Using \"field\": " + vega_util_1.stringValue(selDomain.field) + "."));
            }
        }
        return {
            signal: compiler(selCmpt.type).scaleDomain +
                ("(" + vega_util_1.stringValue(name + exports.STORE) + ", " + vega_util_1.stringValue(selDomain.encoding || null) + ", ") +
                vega_util_1.stringValue(selDomain.field || null) +
                (selCmpt.resolve === 'global' ? ')' : ", " + vega_util_1.stringValue(selCmpt.resolve) + ")")
        };
    }
    return { signal: 'null' };
}
exports.selectionScaleDomain = selectionScaleDomain;
// Utility functions
function forEachSelection(model, cb) {
    var selections = model.component.selection;
    for (var name_3 in selections) {
        if (selections.hasOwnProperty(name_3)) {
            var sel = selections[name_3];
            cb(sel, compiler(sel.type));
        }
    }
}
function compiler(type) {
    switch (type) {
        case 'single':
            return single_1.default;
        case 'multi':
            return multi_1.default;
        case 'interval':
            return interval_1.default;
    }
    return null;
}
function getFacetModel(model) {
    var parent = model.parent;
    while (parent) {
        if (model_1.isFacetModel(parent)) {
            break;
        }
        parent = parent.parent;
    }
    return parent;
}
function unitName(model) {
    var name = vega_util_1.stringValue(model.name);
    var facet = getFacetModel(model);
    if (facet) {
        name += (facet.facet.row ? " + '_' + (" + util_1.accessPathWithDatum(facet.vgField('row'), 'facet') + ")" : '')
            + (facet.facet.column ? " + '_' + (" + util_1.accessPathWithDatum(facet.vgField('column'), 'facet') + ")" : '');
    }
    return name;
}
exports.unitName = unitName;
function requiresSelectionId(model) {
    var identifier = false;
    forEachSelection(model, function (selCmpt) {
        identifier = identifier || selCmpt.project.some(function (proj) { return proj.field === selection_1.SELECTION_ID; });
    });
    return identifier;
}
exports.requiresSelectionId = requiresSelectionId;
function channelSignalName(selCmpt, channel, range) {
    var sgNames = selCmpt._signalNames || (selCmpt._signalNames = {});
    if (sgNames[channel] && sgNames[channel][range]) {
        return sgNames[channel][range];
    }
    sgNames[channel] = sgNames[channel] || {};
    var basename = util_1.varName(selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]));
    var name = basename;
    var counter = 1;
    while (sgNames[name]) {
        name = basename + "_" + counter++;
    }
    return (sgNames[name] = sgNames[channel][range] = name);
}
exports.channelSignalName = channelSignalName;
function positionalProjections(selCmpt) {
    var x = null;
    var xi = null;
    var y = null;
    var yi = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.channel === channel_1.X) {
            x = p;
            xi = i;
        }
        else if (p.channel === channel_1.Y) {
            y = p;
            yi = i;
        }
    });
    return { x: x, xi: xi, y: y, yi: yi };
}
exports.positionalProjections = positionalProjections;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBOEQ7QUFDOUQsdUNBQWdEO0FBQ2hELHlDQUEwRDtBQUMxRCxpQ0FBK0I7QUFFL0IsNkNBQTRHO0FBQzVHLG1DQUEyRTtBQU0zRSxrQ0FBMEQ7QUFFMUQsZ0VBQTBDO0FBQzFDLDBEQUFvQztBQUVwQyw0REFBc0M7QUFDdEMsc0RBQXlEO0FBRzVDLFFBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUNqQixRQUFBLEtBQUssR0FBRyxRQUFRLENBQUM7QUFDakIsUUFBQSxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ25CLFFBQUEsZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUM7QUF1Q3JELDRCQUFtQyxLQUFnQixFQUFFLE9BQTJCO0lBQzlFLElBQU0sUUFBUSxHQUE2QixFQUFFLENBQUM7SUFDOUMsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7NEJBRXRDLE1BQUk7UUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFJLENBQUMsRUFBRTs7U0FFbEM7UUFFRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxzRUFBc0U7UUFDdEUsbUVBQW1FO1FBQ25FLHVFQUF1RTtRQUN2RSxzQ0FBc0M7UUFDdEMsS0FBSyxJQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUU7WUFDckIsc0VBQXNFO1lBQ3RFLHVFQUF1RTtZQUN2RSxJQUFJLENBQUMsR0FBRyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FB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QUUsQ0FBQyxHQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUMsQ0FBQztBQUN4QixDQUFDO0FBaEJELHNEQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c2VsZWN0b3IgYXMgcGFyc2VTZWxlY3Rvcn0gZnJvbSAndmVnYS1ldmVudC1zZWxlY3Rvcic7XG5pbXBvcnQge2lzU3RyaW5nLCBzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbCwgU2NhbGVDaGFubmVsLCBYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7d2Fybn0gZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4uLy4uL2xvZ2ljYWwnO1xuaW1wb3J0IHtCcnVzaENvbmZpZywgU0VMRUNUSU9OX0lELCBTZWxlY3Rpb25EZWYsIFNlbGVjdGlvblJlc29sdXRpb24sIFNlbGVjdGlvblR5cGV9IGZyb20gJy4uLy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge2FjY2Vzc1BhdGhXaXRoRGF0dW0sIERpY3QsIGxvZ2ljYWxFeHByLCB2YXJOYW1lfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdCaW5kaW5nLCBWZ0RhdGEsIFZnRXZlbnRTdHJlYW0sIFZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi4vZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4uL2ZhY2V0JztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi4vbGF5ZXInO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IGludGVydmFsQ29tcGlsZXIgZnJvbSAnLi9pbnRlcnZhbCc7XG5pbXBvcnQgbXVsdGlDb21waWxlciBmcm9tICcuL211bHRpJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcG9uZW50fSBmcm9tICcuL3NlbGVjdGlvbic7XG5pbXBvcnQgc2luZ2xlQ29tcGlsZXIgZnJvbSAnLi9zaW5nbGUnO1xuaW1wb3J0IHtmb3JFYWNoVHJhbnNmb3JtfSBmcm9tICcuL3RyYW5zZm9ybXMvdHJhbnNmb3Jtcyc7XG5cblxuZXhwb3J0IGNvbnN0IFNUT1JFID0gJ19zdG9yZSc7XG5leHBvcnQgY29uc3QgVFVQTEUgPSAnX3R1cGxlJztcbmV4cG9ydCBjb25zdCBNT0RJRlkgPSAnX21vZGlmeSc7XG5leHBvcnQgY29uc3QgU0VMRUNUSU9OX0RPTUFJTiA9ICdfc2VsZWN0aW9uX2RvbWFpbl8nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdGlvbkNvbXBvbmVudCB7XG4gIG5hbWU6IHN0cmluZztcbiAgdHlwZTogU2VsZWN0aW9uVHlwZTtcbiAgZXZlbnRzOiBWZ0V2ZW50U3RyZWFtO1xuICAvLyBwcmVkaWNhdGU/OiBzdHJpbmc7XG4gIGJpbmQ/OiAnc2NhbGVzJyB8IFZnQmluZGluZyB8IHtba2V5OiBzdHJpbmddOiBWZ0JpbmRpbmd9O1xuICByZXNvbHZlOiBTZWxlY3Rpb25SZXNvbHV0aW9uO1xuICBlbXB0eTogJ2FsbCcgfCAnbm9uZSc7XG4gIG1hcms/OiBCcnVzaENvbmZpZztcblxuICBfc2lnbmFsTmFtZXM6IHt9O1xuXG4gIC8vIFRyYW5zZm9ybXNcbiAgcHJvamVjdD86IFByb2plY3RDb21wb25lbnRbXTtcbiAgZmllbGRzPzogYW55O1xuICB0aW1lVW5pdD86IFRpbWVVbml0Tm9kZTtcbiAgc2NhbGVzPzogQ2hhbm5lbFtdO1xuICB0b2dnbGU/OiBhbnk7XG4gIHRyYW5zbGF0ZT86IGFueTtcbiAgem9vbT86IGFueTtcbiAgbmVhcmVzdD86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9qZWN0Q29tcG9uZW50IHtcbiAgZmllbGQ/OiBzdHJpbmc7XG4gIGNoYW5uZWw/OiBTY2FsZUNoYW5uZWw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0aW9uQ29tcGlsZXIge1xuICBzaWduYWxzOiAobW9kZWw6IFVuaXRNb2RlbCwgc2VsQ21wdDogU2VsZWN0aW9uQ29tcG9uZW50KSA9PiBhbnlbXTtcbiAgdG9wTGV2ZWxTaWduYWxzPzogKG1vZGVsOiBNb2RlbCwgc2VsQ21wdDogU2VsZWN0aW9uQ29tcG9uZW50LCBzaWduYWxzOiBhbnlbXSkgPT4gYW55W107XG4gIG1vZGlmeUV4cHI6IChtb2RlbDogVW5pdE1vZGVsLCBzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQpID0+IHN0cmluZztcbiAgbWFya3M/OiAobW9kZWw6IFVuaXRNb2RlbCwgc2VsQ21wdDpTZWxlY3Rpb25Db21wb25lbnQsIG1hcmtzOiBhbnlbXSkgPT4gYW55W107XG4gIHByZWRpY2F0ZTogc3RyaW5nOyAgLy8gVmVnYSBleHByIHN0cmluZyB0byBkZXRlcm1pbmUgaW5jbHVzaW9uIGluIHNlbGVjdGlvbi5cbiAgc2NhbGVEb21haW46IHN0cmluZzsgIC8vIFZlZ2EgZXhwciBzdHJpbmcgdG8gbWF0ZXJpYWxpemUgYSBzY2FsZSBkb21haW4uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVuaXRTZWxlY3Rpb24obW9kZWw6IFVuaXRNb2RlbCwgc2VsRGVmczogRGljdDxTZWxlY3Rpb25EZWY+KSB7XG4gIGNvbnN0IHNlbENtcHRzOiBEaWN0PFNlbGVjdGlvbkNvbXBvbmVudD4gPSB7fTtcbiAgY29uc3Qgc2VsZWN0aW9uQ29uZmlnID0gbW9kZWwuY29uZmlnLnNlbGVjdGlvbjtcblxuICBmb3IgKGxldCBuYW1lIGluIHNlbERlZnMpIHtcbiAgICBpZiAoIXNlbERlZnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbERlZiA9IHNlbERlZnNbbmFtZV07XG4gICAgY29uc3QgY2ZnID0gc2VsZWN0aW9uQ29uZmlnW3NlbERlZi50eXBlXTtcblxuICAgIC8vIFNldCBkZWZhdWx0IHZhbHVlcyBmcm9tIGNvbmZpZyBpZiBhIHByb3BlcnR5IGhhc24ndCBiZWVuIHNwZWNpZmllZCxcbiAgICAvLyBvciBpZiBpdCBpcyB0cnVlLiBFLmcuLCBcInRyYW5zbGF0ZVwiOiB0cnVlIHNob3VsZCB1c2UgdGhlIGRlZmF1bHRcbiAgICAvLyBldmVudCBoYW5kbGVycyBmb3IgdHJhbnNsYXRlLiBIb3dldmVyLCB0cnVlIG1heSBiZSBhIHZhbGlkIHZhbHVlIGZvclxuICAgIC8vIGEgcHJvcGVydHkgKGUuZy4sIFwibmVhcmVzdFwiOiB0cnVlKS5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBjZmcpIHtcbiAgICAgIC8vIEEgc2VsZWN0aW9uIHNob3VsZCBjb250YWluIGVpdGhlciBgZW5jb2RpbmdzYCBvciBgZmllbGRzYCwgb25seSB1c2VcbiAgICAgIC8vIGRlZmF1bHQgdmFsdWVzIGZvciB0aGVzZSB0d28gdmFsdWVzIGlmIG5laXRoZXIgb2YgdGhlbSBpcyBzcGVjaWZpZWQuXG4gICAgICBpZiAoKGtleSA9PT0gJ2VuY29kaW5ncycgJiYgc2VsRGVmLmZpZWxkcykgfHwgKGtleSA9PT0gJ2ZpZWxkcycgJiYgc2VsRGVmLmVuY29kaW5ncykpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdtYXJrJykge1xuICAgICAgICBzZWxEZWZba2V5XSA9IHsuLi5jZmdba2V5XSwgLi4uc2VsRGVmW2tleV19O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsRGVmW2tleV0gPT09IHVuZGVmaW5lZCB8fCBzZWxEZWZba2V5XSA9PT0gdHJ1ZSkge1xuICAgICAgICBzZWxEZWZba2V5XSA9IGNmZ1trZXldIHx8IHNlbERlZltrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hbWUgPSB2YXJOYW1lKG5hbWUpO1xuICAgIGNvbnN0IHNlbENtcHQgPSBzZWxDbXB0c1tuYW1lXSA9IHtcbiAgICAgIC4uLnNlbERlZixcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBldmVudHM6IGlzU3RyaW5nKHNlbERlZi5vbikgPyBwYXJzZVNlbGVjdG9yKHNlbERlZi5vbiwgJ3Njb3BlJykgOiBzZWxEZWYub24sXG4gICAgfSBhcyBTZWxlY3Rpb25Db21wb25lbnQ7XG5cbiAgICBmb3JFYWNoVHJhbnNmb3JtKHNlbENtcHQsIHR4Q29tcGlsZXIgPT4ge1xuICAgICAgaWYgKHR4Q29tcGlsZXIucGFyc2UpIHtcbiAgICAgICAgdHhDb21waWxlci5wYXJzZShtb2RlbCwgc2VsRGVmLCBzZWxDbXB0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBzZWxDbXB0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWw6IFVuaXRNb2RlbCwgc2lnbmFsczogYW55W10pIHtcbiAgZm9yRWFjaFNlbGVjdGlvbihtb2RlbCwgKHNlbENtcHQsIHNlbENvbXBpbGVyKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IHNlbENtcHQubmFtZTtcbiAgICBsZXQgbW9kaWZ5RXhwciA9IHNlbENvbXBpbGVyLm1vZGlmeUV4cHIobW9kZWwsIHNlbENtcHQpO1xuXG4gICAgc2lnbmFscy5wdXNoLmFwcGx5KHNpZ25hbHMsIHNlbENvbXBpbGVyLnNpZ25hbHMobW9kZWwsIHNlbENtcHQpKTtcblxuICAgIGZvckVhY2hUcmFuc2Zvcm0oc2VsQ21wdCwgdHhDb21waWxlciA9PiB7XG4gICAgICBpZiAodHhDb21waWxlci5zaWduYWxzKSB7XG4gICAgICAgIHNpZ25hbHMgPSB0eENvbXBpbGVyLnNpZ25hbHMobW9kZWwsIHNlbENtcHQsIHNpZ25hbHMpO1xuICAgICAgfVxuICAgICAgaWYgKHR4Q29tcGlsZXIubW9kaWZ5RXhwcikge1xuICAgICAgICBtb2RpZnlFeHByID0gdHhDb21waWxlci5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0LCBtb2RpZnlFeHByKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNpZ25hbHMucHVzaCh7XG4gICAgICBuYW1lOiBuYW1lICsgTU9ESUZZLFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czoge3NpZ25hbDogbmFtZSArIFRVUExFfSxcbiAgICAgICAgdXBkYXRlOiBgbW9kaWZ5KCR7c3RyaW5nVmFsdWUoc2VsQ21wdC5uYW1lICsgU1RPUkUpfSwgJHttb2RpZnlFeHByfSlgXG4gICAgICB9XVxuICAgIH0pO1xuICB9KTtcblxuICBjb25zdCBmYWNldE1vZGVsID0gZ2V0RmFjZXRNb2RlbChtb2RlbCk7XG4gIGlmIChzaWduYWxzLmxlbmd0aCAmJiBmYWNldE1vZGVsKSB7XG4gICAgY29uc3QgbmFtZSA9IHN0cmluZ1ZhbHVlKGZhY2V0TW9kZWwuZ2V0TmFtZSgnY2VsbCcpKTtcbiAgICBzaWduYWxzLnVuc2hpZnQoe1xuICAgICAgbmFtZTogJ2ZhY2V0JyxcbiAgICAgIHZhbHVlOiB7fSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHBhcnNlU2VsZWN0b3IoJ21vdXNlbW92ZScsICdzY29wZScpLFxuICAgICAgICB1cGRhdGU6IGBpc1R1cGxlKGZhY2V0KSA/IGZhY2V0IDogZ3JvdXAoJHtuYW1lfSkuZGF0dW1gXG4gICAgICB9XVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHNpZ25hbHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVRvcExldmVsU2lnbmFscyhtb2RlbDogVW5pdE1vZGVsLCBzaWduYWxzOiBhbnlbXSkge1xuICBsZXQgbmVlZHNVbml0ID0gZmFsc2U7XG4gIGZvckVhY2hTZWxlY3Rpb24obW9kZWwsIChzZWxDbXB0LCBzZWxDb21waWxlcikgPT4ge1xuICAgIGlmIChzZWxDb21waWxlci50b3BMZXZlbFNpZ25hbHMpIHtcbiAgICAgIHNpZ25hbHMgPSBzZWxDb21waWxlci50b3BMZXZlbFNpZ25hbHMobW9kZWwsIHNlbENtcHQsIHNpZ25hbHMpO1xuICAgIH1cblxuICAgIGZvckVhY2hUcmFuc2Zvcm0oc2VsQ21wdCwgdHhDb21waWxlciA9PiB7XG4gICAgICBpZiAodHhDb21waWxlci50b3BMZXZlbFNpZ25hbHMpIHtcbiAgICAgICAgc2lnbmFscyA9IHR4Q29tcGlsZXIudG9wTGV2ZWxTaWduYWxzKG1vZGVsLCBzZWxDbXB0LCBzaWduYWxzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG5lZWRzVW5pdCA9IHRydWU7XG4gIH0pO1xuXG4gIGlmIChuZWVkc1VuaXQpIHtcbiAgICBjb25zdCBoYXNVbml0ID0gc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3VuaXQnKTtcbiAgICBpZiAoIShoYXNVbml0Lmxlbmd0aCkpIHtcbiAgICAgIHNpZ25hbHMudW5zaGlmdCh7XG4gICAgICAgIG5hbWU6ICd1bml0JyxcbiAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICBvbjogW3tldmVudHM6ICdtb3VzZW1vdmUnLCB1cGRhdGU6ICdpc1R1cGxlKGdyb3VwKCkpID8gZ3JvdXAoKSA6IHVuaXQnfV1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzaWduYWxzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YShtb2RlbDogVW5pdE1vZGVsLCBkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgZm9yRWFjaFNlbGVjdGlvbihtb2RlbCwgc2VsQ21wdCA9PiB7XG4gICAgY29uc3QgY29udGFpbnMgPSBkYXRhLmZpbHRlcigoZCkgPT4gZC5uYW1lID09PSBzZWxDbXB0Lm5hbWUgKyBTVE9SRSk7XG4gICAgaWYgKCFjb250YWlucy5sZW5ndGgpIHtcbiAgICAgIGRhdGEucHVzaCh7bmFtZTogc2VsQ21wdC5uYW1lICsgU1RPUkV9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3MobW9kZWw6IFVuaXRNb2RlbCwgbWFya3M6IGFueVtdKTogYW55W10ge1xuICBmb3JFYWNoU2VsZWN0aW9uKG1vZGVsLCAoc2VsQ21wdCwgc2VsQ29tcGlsZXIpID0+IHtcbiAgICBtYXJrcyA9IHNlbENvbXBpbGVyLm1hcmtzID8gc2VsQ29tcGlsZXIubWFya3MobW9kZWwsIHNlbENtcHQsIG1hcmtzKSA6IG1hcmtzO1xuICAgIGZvckVhY2hUcmFuc2Zvcm0oc2VsQ21wdCwgKHR4Q29tcGlsZXIpID0+IHtcbiAgICAgIGlmICh0eENvbXBpbGVyLm1hcmtzKSB7XG4gICAgICAgIG1hcmtzID0gdHhDb21waWxlci5tYXJrcyhtb2RlbCwgc2VsQ21wdCwgbWFya3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gbWFya3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUxheWVyU2VsZWN0aW9uTWFya3MobW9kZWw6IExheWVyTW9kZWwsIG1hcmtzOiBhbnlbXSk6IGFueVtdIHtcbiAgbW9kZWwuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgaWYgKGlzVW5pdE1vZGVsKGNoaWxkKSkge1xuICAgICAgbWFya3MgPSBhc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyhjaGlsZCwgbWFya3MpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1hcmtzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0aW9uUHJlZGljYXRlKG1vZGVsOiBNb2RlbCwgc2VsZWN0aW9uczogTG9naWNhbE9wZXJhbmQ8c3RyaW5nPiwgZGZub2RlPzogRGF0YUZsb3dOb2RlKTogc3RyaW5nIHtcbiAgY29uc3Qgc3RvcmVzOiBzdHJpbmdbXSA9IFtdO1xuICBmdW5jdGlvbiBleHByKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgdm5hbWUgPSB2YXJOYW1lKG5hbWUpO1xuICAgIGNvbnN0IHNlbENtcHQgPSBtb2RlbC5nZXRTZWxlY3Rpb25Db21wb25lbnQodm5hbWUsIG5hbWUpO1xuICAgIGNvbnN0IHN0b3JlID0gc3RyaW5nVmFsdWUodm5hbWUgKyBTVE9SRSk7XG5cbiAgICBpZiAoc2VsQ21wdC50aW1lVW5pdCkge1xuICAgICAgY29uc3QgY2hpbGQgPSBkZm5vZGUgfHwgbW9kZWwuY29tcG9uZW50LmRhdGEucmF3O1xuICAgICAgY29uc3QgdHVub2RlID0gc2VsQ21wdC50aW1lVW5pdC5jbG9uZSgpO1xuICAgICAgaWYgKGNoaWxkLnBhcmVudCkge1xuICAgICAgICB0dW5vZGUuaW5zZXJ0QXNQYXJlbnRPZihjaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0dW5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbENtcHQuZW1wdHkgIT09ICdub25lJykge1xuICAgICAgc3RvcmVzLnB1c2goc3RvcmUpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21waWxlcihzZWxDbXB0LnR5cGUpLnByZWRpY2F0ZSArIGAoJHtzdG9yZX0sIGRhdHVtYCArXG4gICAgICAoc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyA/ICcpJyA6IGAsICR7c3RyaW5nVmFsdWUoc2VsQ21wdC5yZXNvbHZlKX0pYCk7XG4gIH1cblxuICBjb25zdCBwcmVkaWNhdGVTdHIgPSBsb2dpY2FsRXhwcihzZWxlY3Rpb25zLCBleHByKTtcbiAgcmV0dXJuIChzdG9yZXMubGVuZ3RoXG4gICAgPyAnISgnICsgc3RvcmVzLm1hcCgocykgPT4gYGxlbmd0aChkYXRhKCR7c30pKWApLmpvaW4oJyB8fCAnKSArICcpIHx8ICdcbiAgICA6ICcnXG4gICkgKyBgKCR7cHJlZGljYXRlU3RyfSlgO1xufVxuXG4vLyBTZWxlY3Rpb25zIGFyZSBwYXJzZWQgX2FmdGVyXyBzY2FsZXMuIElmIGEgc2NhbGUgZG9tYWluIGlzIHNldCB0b1xuLy8gdXNlIGEgc2VsZWN0aW9uLCB0aGUgU0VMRUNUSU9OX0RPTUFJTiBjb25zdGFudCBpcyB1c2VkIGFzIHRoZVxuLy8gZG9tYWluUmF3LnNpZ25hbCBkdXJpbmcgc2NhbGUucGFyc2UgYW5kIHRoZW4gcmVwbGFjZWQgd2l0aCB0aGUgbmVjZXNzYXJ5XG4vLyBzZWxlY3Rpb24gZXhwcmVzc2lvbiBmdW5jdGlvbiBkdXJpbmcgc2NhbGUuYXNzZW1ibGUuIFRvIG5vdCBwb2xsdXRlIHRoZVxuLy8gdHlwZSBzaWduYXR1cmVzIHRvIGFjY291bnQgZm9yIHRoaXMgc2V0dXAsIHRoZSBzZWxlY3Rpb24gZG9tYWluIGRlZmluaXRpb25cbi8vIGlzIGNvZXJjZWQgdG8gYSBzdHJpbmcgYW5kIGFwcGVuZGVkIHRvIFNFTEVDVElPTl9ET01BSU4uXG5leHBvcnQgZnVuY3Rpb24gaXNSYXdTZWxlY3Rpb25Eb21haW4oZG9tYWluUmF3OiBWZ1NpZ25hbFJlZikge1xuICByZXR1cm4gZG9tYWluUmF3LnNpZ25hbC5pbmRleE9mKFNFTEVDVElPTl9ET01BSU4pID49IDA7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0aW9uU2NhbGVEb21haW4obW9kZWw6IE1vZGVsLCBkb21haW5SYXc6IFZnU2lnbmFsUmVmKTogVmdTaWduYWxSZWYge1xuICBjb25zdCBzZWxEb21haW4gPSBKU09OLnBhcnNlKGRvbWFpblJhdy5zaWduYWwucmVwbGFjZShTRUxFQ1RJT05fRE9NQUlOLCAnJykpO1xuICBjb25zdCBuYW1lID0gdmFyTmFtZShzZWxEb21haW4uc2VsZWN0aW9uKTtcblxuICBsZXQgc2VsQ21wdCA9IG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gJiYgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbltuYW1lXTtcbiAgaWYgKHNlbENtcHQpIHtcbiAgICB3YXJuKCdVc2UgXCJiaW5kXCI6IFwic2NhbGVzXCIgdG8gc2V0dXAgYSBiaW5kaW5nIGZvciBzY2FsZXMgYW5kIHNlbGVjdGlvbnMgd2l0aGluIHRoZSBzYW1lIHZpZXcuJyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsQ21wdCA9IG1vZGVsLmdldFNlbGVjdGlvbkNvbXBvbmVudChuYW1lLCBzZWxEb21haW4uc2VsZWN0aW9uKTtcbiAgICBpZiAoIXNlbERvbWFpbi5lbmNvZGluZyAmJiAhc2VsRG9tYWluLmZpZWxkKSB7XG4gICAgICBzZWxEb21haW4uZmllbGQgPSBzZWxDbXB0LnByb2plY3RbMF0uZmllbGQ7XG4gICAgICBpZiAoc2VsQ21wdC5wcm9qZWN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgd2FybignQSBcImZpZWxkXCIgb3IgXCJlbmNvZGluZ1wiIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gdXNpbmcgYSBzZWxlY3Rpb24gYXMgYSBzY2FsZSBkb21haW4uICcgK1xuICAgICAgICBgVXNpbmcgXCJmaWVsZFwiOiAke3N0cmluZ1ZhbHVlKHNlbERvbWFpbi5maWVsZCl9LmApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBjb21waWxlcihzZWxDbXB0LnR5cGUpLnNjYWxlRG9tYWluICtcbiAgICAgICAgYCgke3N0cmluZ1ZhbHVlKG5hbWUgKyBTVE9SRSl9LCAke3N0cmluZ1ZhbHVlKHNlbERvbWFpbi5lbmNvZGluZyB8fCBudWxsKX0sIGAgK1xuICAgICAgICAgIHN0cmluZ1ZhbHVlKHNlbERvbWFpbi5maWVsZCB8fCBudWxsKSArXG4gICAgICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAnKScgOiBgLCAke3N0cmluZ1ZhbHVlKHNlbENtcHQucmVzb2x2ZSl9KWApXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7c2lnbmFsOiAnbnVsbCd9O1xufVxuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBmb3JFYWNoU2VsZWN0aW9uKG1vZGVsOiBNb2RlbCwgY2I6IChzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQsIHNlbENvbXBpbGVyOiBTZWxlY3Rpb25Db21waWxlcikgPT4gdm9pZCkge1xuICBjb25zdCBzZWxlY3Rpb25zID0gbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbjtcbiAgZm9yIChjb25zdCBuYW1lIGluIHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY29uc3Qgc2VsID0gc2VsZWN0aW9uc1tuYW1lXTtcbiAgICAgIGNiKHNlbCwgY29tcGlsZXIoc2VsLnR5cGUpKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZXIodHlwZTogU2VsZWN0aW9uVHlwZSk6IFNlbGVjdGlvbkNvbXBpbGVyIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc2luZ2xlJzpcbiAgICAgIHJldHVybiBzaW5nbGVDb21waWxlcjtcbiAgICBjYXNlICdtdWx0aSc6XG4gICAgICByZXR1cm4gbXVsdGlDb21waWxlcjtcbiAgICBjYXNlICdpbnRlcnZhbCc6XG4gICAgICByZXR1cm4gaW50ZXJ2YWxDb21waWxlcjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0RmFjZXRNb2RlbChtb2RlbDogTW9kZWwpOiBGYWNldE1vZGVsIHtcbiAgbGV0IHBhcmVudCA9IG1vZGVsLnBhcmVudDtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChpc0ZhY2V0TW9kZWwocGFyZW50KSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICByZXR1cm4gcGFyZW50IGFzIEZhY2V0TW9kZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bml0TmFtZShtb2RlbDogTW9kZWwpIHtcbiAgbGV0IG5hbWUgPSBzdHJpbmdWYWx1ZShtb2RlbC5uYW1lKTtcbiAgY29uc3QgZmFjZXQgPSBnZXRGYWNldE1vZGVsKG1vZGVsKTtcbiAgaWYgKGZhY2V0KSB7XG4gICAgbmFtZSArPSAoZmFjZXQuZmFjZXQucm93ID8gYCArICdfJyArICgke2FjY2Vzc1BhdGhXaXRoRGF0dW0oZmFjZXQudmdGaWVsZCgncm93JyksICdmYWNldCcpfSlgIDogJycpXG4gICAgICArIChmYWNldC5mYWNldC5jb2x1bW4gPyBgICsgJ18nICsgKCR7YWNjZXNzUGF0aFdpdGhEYXR1bShmYWNldC52Z0ZpZWxkKCdjb2x1bW4nKSwgJ2ZhY2V0Jyl9KWAgOiAnJyk7XG4gIH1cbiAgcmV0dXJuIG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsOiBNb2RlbCkge1xuICBsZXQgaWRlbnRpZmllciA9IGZhbHNlO1xuICBmb3JFYWNoU2VsZWN0aW9uKG1vZGVsLCAoc2VsQ21wdCkgPT4ge1xuICAgIGlkZW50aWZpZXIgPSBpZGVudGlmaWVyIHx8IHNlbENtcHQucHJvamVjdC5zb21lKChwcm9qKSA9PiBwcm9qLmZpZWxkID09PSBTRUxFQ1RJT05fSUQpO1xuICB9KTtcbiAgcmV0dXJuIGlkZW50aWZpZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQsIGNoYW5uZWw6IENoYW5uZWwsIHJhbmdlOiAndmlzdWFsJyB8ICdkYXRhJykge1xuICBjb25zdCBzZ05hbWVzID0gc2VsQ21wdC5fc2lnbmFsTmFtZXMgfHwgKHNlbENtcHQuX3NpZ25hbE5hbWVzID0ge30pO1xuICBpZiAoc2dOYW1lc1tjaGFubmVsXSAmJiBzZ05hbWVzW2NoYW5uZWxdW3JhbmdlXSkge1xuICAgIHJldHVybiBzZ05hbWVzW2NoYW5uZWxdW3JhbmdlXTtcbiAgfVxuXG4gIHNnTmFtZXNbY2hhbm5lbF0gPSBzZ05hbWVzW2NoYW5uZWxdIHx8IHt9O1xuICBjb25zdCBiYXNlbmFtZSA9IHZhck5hbWUoc2VsQ21wdC5uYW1lICsgJ18nICsgKHJhbmdlID09PSAndmlzdWFsJyA/IGNoYW5uZWwgOiBzZWxDbXB0LmZpZWxkc1tjaGFubmVsXSkpO1xuICBsZXQgbmFtZSA9IGJhc2VuYW1lO1xuICBsZXQgY291bnRlciA9IDE7XG4gIHdoaWxlIChzZ05hbWVzW25hbWVdKSB7XG4gICAgbmFtZSA9IGAke2Jhc2VuYW1lfV8ke2NvdW50ZXIrK31gO1xuICB9XG5cbiAgcmV0dXJuIChzZ05hbWVzW25hbWVdID0gc2dOYW1lc1tjaGFubmVsXVtyYW5nZV0gPSBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvc2l0aW9uYWxQcm9qZWN0aW9ucyhzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQpIHtcbiAgbGV0IHg6UHJvamVjdENvbXBvbmVudCA9IG51bGw7XG4gIGxldCB4aTpudW1iZXIgPSBudWxsO1xuICBsZXQgeTpQcm9qZWN0Q29tcG9uZW50ID0gbnVsbDtcbiAgbGV0IHlpOiBudW1iZXIgPSBudWxsO1xuXG4gIHNlbENtcHQucHJvamVjdC5mb3JFYWNoKChwLCBpKSA9PiB7XG4gICAgaWYgKHAuY2hhbm5lbCA9PT0gWCkge1xuICAgICAgeCA9IHA7XG4gICAgICB4aSA9IGk7XG4gICAgfSBlbHNlIGlmIChwLmNoYW5uZWwgPT09IFkpIHtcbiAgICAgIHkgPSBwO1xuICAgICAgeWkgPSBpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7eCwgeGksIHksIHlpfTtcbn1cbiJdfQ==