"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var util_1 = require("../util");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var parse_2 = require("./layout/parse");
var parse_3 = require("./legend/parse");
var model_1 = require("./model");
var repeat_1 = require("./repeat");
var resolve_1 = require("./resolve");
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.child = common_1.buildModel(spec.spec, _this, _this.getName('child'), undefined, repeater, config);
        _this.children = [_this.child];
        var facet = repeat_1.replaceRepeaterInFacet(spec.facet, repeater);
        _this.facet = _this.initFacet(facet);
        return _this;
    }
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        return encoding_1.reduce(facet, function (normalizedFacet, fieldDef, channel) {
            if (!util_1.contains([channel_1.ROW, channel_1.COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                return normalizedFacet;
            }
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                return normalizedFacet;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            normalizedFacet[channel] = fielddef_1.normalize(fieldDef, channel);
            return normalizedFacet;
        }, {});
    };
    FacetModel.prototype.channelHasField = function (channel) {
        return !!this.facet[channel];
    };
    FacetModel.prototype.hasDiscreteDomain = function (channel) {
        return true;
    };
    FacetModel.prototype.fieldDef = function (channel) {
        return this.facet[channel];
    };
    FacetModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        this.child.parseData();
    };
    FacetModel.prototype.parseLayoutSize = function () {
        parse_2.parseChildrenLayoutSize(this);
    };
    FacetModel.prototype.parseSelection = function () {
        // As a facet has a single child, the selection components are the same.
        // The child maintains its selections to assemble signals, which remain
        // within its unit.
        this.child.parseSelection();
        this.component.selection = this.child.component.selection;
    };
    FacetModel.prototype.parseMarkGroup = function () {
        this.child.parseMarkGroup();
        // if we facet by two dimensions, we need to add a cross operator to the aggregation
        // so that we create all groups
        var hasRow = this.channelHasField(channel_1.ROW);
        var hasColumn = this.channelHasField(channel_1.COLUMN);
        var groupProperties = this.child.assembleParentGroupProperties();
        this.component.mark = [tslib_1.__assign({ name: this.getName('cell'), type: 'group', from: {
                    facet: tslib_1.__assign({ name: this.component.data.facetRoot.name, data: this.component.data.facetRoot.data, groupby: [].concat(hasRow ? [this.field(channel_1.ROW)] : [], hasColumn ? [this.field(channel_1.COLUMN)] : []) }, (hasRow && hasColumn ? { aggregate: {
                            cross: true
                        } } : {}))
                }, sort: {
                    field: [].concat(hasRow ? [this.field(channel_1.ROW, { expr: 'datum' })] : [], hasColumn ? [this.field(channel_1.COLUMN, { expr: 'datum' })] : []),
                    order: [].concat(hasRow ? [(this.facet.row.header && this.facet.row.header.sort) || 'ascending'] : [], hasColumn ? [(this.facet.column.header && this.facet.column.header.sort) || 'ascending'] : [])
                } }, (groupProperties ? { encode: { update: groupProperties } } : {}))];
    };
    FacetModel.prototype.parseAxisAndHeader = function () {
        this.child.parseAxisAndHeader();
        this.parseHeader('column');
        this.parseHeader('row');
        this.mergeChildAxis('x');
        this.mergeChildAxis('y');
    };
    FacetModel.prototype.parseHeader = function (channel) {
        if (this.channelHasField(channel)) {
            var fieldDef = this.facet[channel];
            var header = fieldDef.header || {};
            var title = header.title !== undefined ? header.title : fielddef_1.title(fieldDef, this.config);
            if (this.child.component.layoutHeaders[channel].title) {
                // merge title with child to produce "Title / Subtitle / Sub-subtitle"
                title += ' / ' + this.child.component.layoutHeaders[channel].title;
                this.child.component.layoutHeaders[channel].title = null;
            }
            this.component.layoutHeaders[channel] = {
                title: title,
                facetFieldDef: fieldDef,
                // TODO: support adding label to footer as well
                header: [this.makeHeaderComponent(channel, true)]
            };
        }
    };
    FacetModel.prototype.makeHeaderComponent = function (channel, labels) {
        var sizeChannel = channel === 'row' ? 'height' : 'width';
        return {
            labels: labels,
            sizeSignal: this.child.getSizeSignalRef(sizeChannel),
            axes: []
        };
    };
    FacetModel.prototype.mergeChildAxis = function (channel) {
        var child = this.child;
        if (child.component.axes[channel]) {
            var _a = this.component, layoutHeaders = _a.layoutHeaders, resolve = _a.resolve;
            var channelResolve = resolve[channel];
            channelResolve.axis = resolve_1.parseGuideResolve(resolve, channel);
            if (channelResolve.axis === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = layoutHeaders[headerChannel];
                for (var _i = 0, _b = child.component.axes[channel]; _i < _b.length; _i++) {
                    var axisComponent = _b[_i];
                    var mainAxis = axisComponent.main;
                    var headerType = header_1.getHeaderType(mainAxis.get('orient'));
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    // LayoutHeader no longer keep track of property precedence, thus let's combine.
                    layoutHeader[headerType][0].axes.push(mainAxis.combine());
                    delete axisComponent.main;
                }
            }
            else {
                // Otherwise do nothing for independent axes
            }
        }
    };
    FacetModel.prototype.parseLegend = function () {
        parse_3.parseNonUnitLegend(this);
    };
    FacetModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(this.component.data);
        }
        return [];
    };
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    FacetModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return this.child.assembleSelectionTopLevelSignals(signals);
    };
    FacetModel.prototype.assembleSelectionSignals = function () {
        this.child.assembleSelectionSignals();
        return [];
    };
    FacetModel.prototype.assembleSelectionData = function (data) {
        return this.child.assembleSelectionData(data);
    };
    FacetModel.prototype.assembleLayout = function () {
        var columns = this.channelHasField('column') ? {
            signal: this.columnDistinctSignal()
        } : 1;
        // TODO: determine default align based on shared / independent scales
        return {
            padding: { row: 10, column: 10 },
            // TODO: support offset for rowHeader/rowFooter/rowTitle/columnHeader/columnFooter/columnTitle
            offset: 10,
            columns: columns,
            bounds: 'full'
        };
    };
    FacetModel.prototype.assembleLayoutSignals = function () {
        // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
        return this.child.assembleLayoutSignals();
    };
    FacetModel.prototype.columnDistinctSignal = function () {
        // In facetNode.assemble(), the name is always this.getName('column') + '_layout'.
        var facetLayoutDataName = this.getName('column') + '_layout';
        var columnDistinct = this.field('column', { prefix: 'distinct' });
        return "data('" + facetLayoutDataName + "')[0][" + util_1.stringValue(columnDistinct) + "]";
    };
    FacetModel.prototype.assembleMarks = function () {
        var facetRoot = this.component.data.facetRoot;
        var data = assemble_1.assembleFacetData(facetRoot);
        var mark = this.component.mark[0];
        // correct the name of the faceted data source
        mark.from.facet = tslib_1.__assign({}, mark.from.facet, { name: facetRoot.name, data: facetRoot.data });
        var marks = [tslib_1.__assign({}, (data.length > 0 ? { data: data } : {}), mark, this.child.assembleGroup())];
        return marks;
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    return FacetModel;
}(model_1.ModelWithField));
exports.FacetModel = FacetModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBc0Y7QUFFdEYsd0NBQW1DO0FBRW5DLHdDQUF3RTtBQUN4RSw0QkFBOEI7QUFLOUIsZ0NBQTBEO0FBWTFELG1DQUFrRTtBQUNsRSw0Q0FBb0Y7QUFDcEYsc0NBQXVDO0FBQ3ZDLDBDQUE4RTtBQUM5RSx3Q0FBdUQ7QUFFdkQsd0NBQWtEO0FBQ2xELGlDQUE4QztBQUM5QyxtQ0FBK0Q7QUFDL0QscUNBQTRDO0FBSTVDO0lBQWdDLHNDQUFjO0lBTzVDLG9CQUFZLElBQWUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBNUcsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQVMzRDtRQU5DLEtBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0YsS0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU3QixJQUFNLEtBQUssR0FBa0IsK0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxRSxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBQ3JDLENBQUM7SUFFTyw4QkFBUyxHQUFqQixVQUFrQixLQUFvQjtRQUNwQyxvREFBb0Q7UUFDcEQsTUFBTSxDQUFDLGlCQUFNLENBQUMsS0FBSyxFQUFFLFVBQVMsZUFBZSxFQUFFLFFBQTBCLEVBQUUsT0FB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