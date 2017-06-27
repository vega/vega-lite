"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var mark_1 = require("../mark");
var resolve_1 = require("../resolve");
var util_1 = require("../util");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var parse_2 = require("./legend/parse");
var model_1 = require("./model");
var repeat_1 = require("./repeat");
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, resolve_1.initFacetResolve(spec.resolve || {})) || this;
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
        var isCrossedFacet = this.channelHasField(channel_1.ROW) && this.channelHasField(channel_1.COLUMN);
        this.component.mark = [tslib_1.__assign({ name: this.getName('cell'), type: 'group', from: {
                    facet: tslib_1.__assign({ name: this.component.data.facetRoot.name, data: this.component.data.facetRoot.data, groupby: [].concat(this.channelHasField(channel_1.ROW) ? [this.field(channel_1.ROW)] : [], this.channelHasField(channel_1.COLUMN) ? [this.field(channel_1.COLUMN)] : []) }, (isCrossedFacet ? { aggregate: {
                            cross: true
                        } } : {}))
                } }, (isCrossedFacet ? { sort: {
                    field: [this.field(channel_1.ROW, { expr: 'datum' }), this.field(channel_1.COLUMN, { expr: 'datum' })],
                    order: ['ascending', 'ascending']
                } } : {}), { encode: {
                    update: getFacetGroupProperties(this)
                } })];
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
                fieldRef: common_1.formatSignalRef(fieldDef, header.format, 'parent', this.config, true),
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
            if (this.resolve[channel].axis === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = this.component.layoutHeaders[headerChannel];
                for (var _i = 0, _a = child.component.axes[channel]; _i < _a.length; _i++) {
                    var axisComponent = _a[_i];
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
        parse_2.parseNonUnitLegend(this);
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
function getFacetGroupProperties(model) {
    var encodeEntry = model.child.assembleParentGroupProperties();
    return tslib_1.__assign({}, (encodeEntry ? encodeEntry : {}), common_1.applyConfig({}, model.config.facet.cell, mark_1.FILL_STROKE_CONFIG.concat(['clip'])));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBc0Y7QUFFdEYsd0NBQW1DO0FBRW5DLHdDQUF3RTtBQUN4RSw0QkFBOEI7QUFDOUIsZ0NBQTJDO0FBQzNDLHNDQUE0RDtBQUc1RCxnQ0FBMEQ7QUFZMUQsbUNBQWtFO0FBQ2xFLDRDQUFvRjtBQUNwRixzQ0FBdUM7QUFDdkMsMENBQThFO0FBRTlFLHdDQUFrRDtBQUNsRCxpQ0FBOEM7QUFDOUMsbUNBQStEO0FBSS9EO0lBQWdDLHNDQUFjO0lBTzVDLG9CQUFZLElBQWUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBNUcsWUFDRSxrQkFDRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQ3JDLDBCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQ3JDLFNBU0Y7UUFOQyxLQUFJLENBQUMsS0FBSyxHQUFHLG1CQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdGLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0IsSUFBTSxLQUFLLEdBQWtCLCtCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFMUUsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUNyQyxDQUFDO0lBRU8sOEJBQVMsR0FBakIsVUFBa0IsS0FBb0I7UUFDcEMsb0RBQW9EO1FBQ3BELE1BQU0sQ0FBQyxpQkFBTSxDQUFDLEtBQUssRUFBRSxV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