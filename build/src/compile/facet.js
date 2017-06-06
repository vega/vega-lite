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
var vega_schema_1 = require("../vega.schema");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var parse_2 = require("./legend/parse");
var model_1 = require("./model");
var repeat_1 = require("./repeat");
var parse_3 = require("./scale/parse");
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.resolve = resolve_1.initFacetResolve(spec.resolve || {});
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
    FacetModel.prototype.parseScale = function () {
        var _this = this;
        var child = this.child;
        var model = this;
        child.parseScale();
        var scaleComponent = this.component.scales = {};
        util_1.keys(child.component.scales).forEach(function (channel) {
            if (_this.resolve[channel].scale === 'shared') {
                var scale = parse_3.moveSharedScaleUp(_this, scaleComponent, child, channel);
                // Replace the scale domain with data output from a cloned subtree after the facet.
                var domain = scale.domain;
                if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
                    domain.data = assemble_1.FACET_SCALE_PREFIX + _this.getName(domain.data);
                }
                else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
                    domain.fields = domain.fields.map(function (f) {
                        return tslib_1.__assign({}, f, { data: assemble_1.FACET_SCALE_PREFIX + _this.getName(f.data) });
                    });
                }
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child.parseMark();
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
                for (var _i = 0, _a = child.component.axes[channel].axes; _i < _a.length; _i++) {
                    var axis = _a[_i];
                    var headerType = header_1.getHeaderType(axis.orient);
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    layoutHeader[headerType][0].axes.push(axis);
                }
                child.component.axes[channel].axes = [];
            }
            else {
                // Otherwise do nothing for independent axes
            }
        }
    };
    FacetModel.prototype.parseLegend = function () {
        var _this = this;
        this.child.parseLegend();
        this.component.legends = {};
        util_1.keys(this.child.component.legends).forEach(function (channel) {
            if (_this.resolve[channel].legend === 'shared') {
                parse_2.moveSharedLegendUp(_this.component.legends, _this.child, channel);
            }
        });
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
        return marks.map(this.correctDataNames);
    };
    FacetModel.prototype.channels = function () {
        return [channel_1.ROW, channel_1.COLUMN];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBOEQ7QUFFOUQsd0NBQW1DO0FBRW5DLHdDQUF3RTtBQUN4RSw0QkFBOEI7QUFDOUIsZ0NBQTJDO0FBQzNDLHNDQUE0RDtBQUU1RCxnQ0FBMEQ7QUFDMUQsOENBUXdCO0FBRXhCLG1DQUFrRTtBQUNsRSw0Q0FBb0Y7QUFDcEYsc0NBQXVDO0FBQ3ZDLDBDQUE4RTtBQUU5RSx3Q0FBa0Q7QUFDbEQsaUNBQThDO0FBQzlDLG1DQUErRDtBQUMvRCx1Q0FBZ0Q7QUFFaEQ7SUFBZ0Msc0NBQWM7SUFTNUMsb0JBQVksSUFBZSxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUE1RyxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxTQVU3QztRQVJDLEtBQUksQ0FBQyxPQUFPLEdBQUcsMEJBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVwRCxLQUFJLENBQUMsS0FBSyxHQUFHLG1CQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdGLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0IsSUFBTSxLQUFLLEdBQWtCLCtCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFMUUsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUNyQyxDQUFDO0lBRU8sOEJBQVMsR0FBakIsVUFBa0IsS0FBb0I7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