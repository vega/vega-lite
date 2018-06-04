"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = tslib_1.__importStar(require("../log"));
var scale_1 = require("../scale");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var assemble_1 = require("./axis/assemble");
var buildmodel_1 = require("./buildmodel");
var assemble_2 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var parse_2 = require("./layoutsize/parse");
var model_1 = require("./model");
var repeater_1 = require("./repeater");
var resolve_1 = require("./resolve");
var domain_1 = require("./scale/domain");
var FacetModel = /** @class */ (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, spec.resolve) || this;
        _this.type = 'facet';
        _this.child = buildmodel_1.buildModel(spec.spec, _this, _this.getName('child'), undefined, repeater, config, false);
        _this.children = [_this.child];
        var facet = repeater_1.replaceRepeaterInFacet(spec.facet, repeater);
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
            var title = fieldDef.title !== undefined ? fieldDef.title :
                header.title !== undefined ? header.title : fielddef_1.title(fieldDef, this.config);
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
        var sizeType = channel === 'row' ? 'height' : 'width';
        return {
            labels: labels,
            sizeSignal: this.child.component.layoutSize.get(sizeType) ? this.child.getSizeSignalRef(sizeType) : undefined,
            axes: []
        };
    };
    FacetModel.prototype.mergeChildAxis = function (channel) {
        var child = this.child;
        if (child.component.axes[channel]) {
            var _a = this.component, layoutHeaders = _a.layoutHeaders, resolve = _a.resolve;
            resolve.axis[channel] = resolve_1.parseGuideResolve(resolve, channel);
            if (resolve.axis[channel] === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = layoutHeaders[headerChannel];
                for (var _i = 0, _b = child.component.axes[channel]; _i < _b.length; _i++) {
                    var axisComponent = _b[_i];
                    var headerType = header_1.getHeaderType(axisComponent.get('orient'));
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    var mainAxis = assemble_1.assembleAxis(axisComponent, 'main', this.config, { header: true });
                    // LayoutHeader no longer keep track of property precedence, thus let's combine.
                    layoutHeader[headerType][0].axes.push(mainAxis);
                    axisComponent.mainExtracted = true;
                }
            }
            else {
                // Otherwise do nothing for independent axes
            }
        }
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
    FacetModel.prototype.getLayoutBandMixins = function (headerType) {
        var bandMixins = {};
        var bandType = headerType === 'header' ? 'headerBand' : 'footerBand';
        for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
            var channel = _a[_i];
            var layoutHeaderComponent = this.component.layoutHeaders[channel];
            var headerComponent = layoutHeaderComponent[headerType];
            if (headerComponent && headerComponent[0]) {
                var sizeType = channel === 'row' ? 'height' : 'width';
                if (!this.child.component.layoutSize.get(sizeType)) {
                    // If facet child does not have size signal, then apply headerBand
                    bandMixins[bandType] = bandMixins[bandType] || {};
                    bandMixins[bandType][channel] = 0.5;
                }
            }
        }
        return bandMixins;
    };
    FacetModel.prototype.assembleLayout = function () {
        var columns = this.channelHasField('column') ? this.columnDistinctSignal() : 1;
        // TODO: determine default align based on shared / independent scales
        return tslib_1.__assign({ padding: { row: 10, column: 10 } }, this.getLayoutBandMixins('header'), this.getLayoutBandMixins('footer'), { 
            // TODO: support offset for rowHeader/rowFooter/rowTitle/columnHeader/columnFooter/columnTitle
            offset: 10, columns: columns, bounds: 'full', align: 'all' });
    };
    FacetModel.prototype.assembleLayoutSignals = function () {
        // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
        return this.child.assembleLayoutSignals();
    };
    FacetModel.prototype.columnDistinctSignal = function () {
        if (this.parent && (this.parent instanceof FacetModel)) {
            // For nested facet, we will add columns to group mark instead
            // See discussion in https://github.com/vega/vega/issues/952
            // and https://github.com/vega/vega-view/releases/tag/v1.2.6
            return undefined;
        }
        else {
            // In facetNode.assemble(), the name is always this.getName('column') + '_layout'.
            var facetLayoutDataName = this.getName('column_domain');
            return { signal: "length(data('" + facetLayoutDataName + "'))" };
        }
    };
    FacetModel.prototype.assembleGroup = function (signals) {
        if (this.parent && (this.parent instanceof FacetModel)) {
            // Provide number of columns for layout.
            // See discussion in https://github.com/vega/vega/issues/952
            // and https://github.com/vega/vega-view/releases/tag/v1.2.6
            return tslib_1.__assign({}, (this.channelHasField('column') ? {
                encode: {
                    update: {
                        // TODO(https://github.com/vega/vega-lite/issues/2759):
                        // Correct the signal for facet of concat of facet_column
                        columns: { field: fielddef_1.vgField(this.facet.column, { prefix: 'distinct' }) }
                    }
                }
            } : {}), _super.prototype.assembleGroup.call(this, signals));
        }
        return _super.prototype.assembleGroup.call(this, signals);
    };
    /**
     * Aggregate cardinality for calculating size
     */
    FacetModel.prototype.getCardinalityAggregateForChild = function () {
        var fields = [];
        var ops = [];
        if (this.child instanceof FacetModel) {
            if (this.child.channelHasField('column')) {
                fields.push(fielddef_1.vgField(this.child.facet.column));
                ops.push('distinct');
            }
        }
        else {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                var childScaleComponent = this.child.component.scales[channel];
                if (childScaleComponent && !childScaleComponent.merged) {
                    var type = childScaleComponent.get('type');
                    var range = childScaleComponent.get('range');
                    if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                        var domain = domain_1.assembleDomain(this.child, channel);
                        var field = domain_1.getFieldFromDomain(domain);
                        if (field) {
                            fields.push(field);
                            ops.push('distinct');
                        }
                        else {
                            log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                        }
                    }
                }
            }
        }
        return fields.length ? { fields: fields, ops: ops } : undefined;
    };
    FacetModel.prototype.assembleMarks = function () {
        var _a = this, child = _a.child, facet = _a.facet;
        var facetRoot = this.component.data.facetRoot;
        var data = assemble_2.assembleFacetData(facetRoot);
        // If we facet by two dimensions, we need to add a cross operator to the aggregation
        // so that we create all groups
        var hasRow = this.channelHasField(channel_1.ROW);
        var hasColumn = this.channelHasField(channel_1.COLUMN);
        var layoutSizeEncodeEntry = child.assembleLayoutSize();
        var aggregateMixins = {};
        if (hasRow && hasColumn) {
            aggregateMixins.aggregate = { cross: true };
        }
        var cardinalityAggregateForChild = this.getCardinalityAggregateForChild();
        if (cardinalityAggregateForChild) {
            aggregateMixins.aggregate = tslib_1.__assign({}, aggregateMixins.aggregate, cardinalityAggregateForChild);
        }
        var title = child.assembleTitle();
        var style = child.assembleGroupStyle();
        var markGroup = tslib_1.__assign({ name: this.getName('cell'), type: 'group' }, (title ? { title: title } : {}), (style ? { style: style } : {}), { from: {
                facet: tslib_1.__assign({ name: facetRoot.name, data: facetRoot.data, groupby: [].concat(hasRow ? [this.vgField(channel_1.ROW)] : [], hasColumn ? [this.vgField(channel_1.COLUMN)] : []) }, aggregateMixins)
            }, sort: {
                field: [].concat(hasRow ? [this.vgField(channel_1.ROW, { expr: 'datum', })] : [], hasColumn ? [this.vgField(channel_1.COLUMN, { expr: 'datum' })] : []),
                order: [].concat(hasRow ? [(facet.row.sort) || 'ascending'] : [], hasColumn ? [(facet.column.sort) || 'ascending'] : [])
            } }, (data.length > 0 ? { data: data } : {}), (layoutSizeEncodeEntry ? { encode: { update: layoutSizeEncodeEntry } } : {}), child.assembleGroup());
        return [markGroup];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    return FacetModel;
}(model_1.ModelWithField));
exports.FacetModel = FacetModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBOEQ7QUFFOUQsd0NBQW1DO0FBRW5DLHdDQUFpRjtBQUNqRixrREFBOEI7QUFDOUIsa0NBQTJDO0FBRTNDLGdDQUFpQztBQUNqQyw4Q0FBc0c7QUFDdEcsNENBQTZDO0FBQzdDLDJDQUF3QztBQUN4Qyw0Q0FBa0Q7QUFDbEQsc0NBQXVDO0FBQ3ZDLDBDQUE4RTtBQUM5RSw0Q0FBMkQ7QUFDM0QsaUNBQThDO0FBQzlDLHVDQUFpRTtBQUNqRSxxQ0FBNEM7QUFDNUMseUNBQWtFO0FBRWxFO0lBQWdDLHNDQUFjO0lBUTVDLG9CQUFZLElBQXlCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQUUsUUFBdUIsRUFBRSxNQUFjO1FBQXRILFlBQ0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBU3JFO1FBakJlLFVBQUksR0FBWSxPQUFPLENBQUM7UUFXdEMsS0FBSSxDQUFDLEtBQUssR0FBRyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSSxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEcsS0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU3QixJQUFNLEtBQUssR0FBeUIsaUNBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVqRixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBQ3JDLENBQUM7SUFFTyw4QkFBUyxHQUFqQixVQUFr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QUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNyQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxxQkFBcUIsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUN4RSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQ3pCLENBQUM7UUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVTLCtCQUFVLEdBQXBCO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUExVUQsQ0FBZ0Msc0JBQWMsR0EwVTdDO0FBMVVZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5pbXBvcnQge0NoYW5uZWwsIENPTFVNTiwgUk9XLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge3JlZHVjZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGYWNldE1hcHBpbmd9IGZyb20gJy4uL2ZhY2V0JztcbmltcG9ydCB7RmllbGREZWYsIG5vcm1hbGl6ZSwgdGl0bGUgYXMgZmllbGREZWZUaXRsZSwgdmdGaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge05vcm1hbGl6ZWRGYWNldFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2lzVmdSYW5nZVN0ZXAsIFJvd0NvbCwgVmdBeGlzLCBWZ0RhdGEsIFZnTGF5b3V0LCBWZ01hcmtHcm91cCwgVmdTaWduYWx9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YXNzZW1ibGVBeGlzfSBmcm9tICcuL2F4aXMvYXNzZW1ibGUnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZUZhY2V0RGF0YX0gZnJvbSAnLi9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7cGFyc2VEYXRhfSBmcm9tICcuL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHtnZXRIZWFkZXJUeXBlLCBIZWFkZXJDaGFubmVsLCBIZWFkZXJDb21wb25lbnR9IGZyb20gJy4vbGF5b3V0L2hlYWRlcic7XG5pbXBvcnQge3BhcnNlQ2hpbGRyZW5MYXlvdXRTaXplfSBmcm9tICcuL2xheW91dHNpemUvcGFyc2UnO1xuaW1wb3J0IHtNb2RlbCwgTW9kZWxXaXRoRmllbGR9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlLCByZXBsYWNlUmVwZWF0ZXJJbkZhY2V0fSBmcm9tICcuL3JlcGVhdGVyJztcbmltcG9ydCB7cGFyc2VHdWlkZVJlc29sdmV9IGZyb20gJy4vcmVzb2x2ZSc7XG5pbXBvcnQge2Fzc2VtYmxlRG9tYWluLCBnZXRGaWVsZEZyb21Eb21haW59IGZyb20gJy4vc2NhbGUvZG9tYWluJztcblxuZXhwb3J0IGNsYXNzIEZhY2V0TW9kZWwgZXh0ZW5kcyBNb2RlbFdpdGhGaWVsZCB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiAnZmFjZXQnID0gJ2ZhY2V0JztcbiAgcHVibGljIHJlYWRvbmx5IGZhY2V0OiBGYWNldE1hcHBpbmc8c3RyaW5nPjtcblxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGQ6IE1vZGVsO1xuXG4gIHB1YmxpYyByZWFkb25seSBjaGlsZHJlbjogTW9kZWxbXTtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBOb3JtYWxpemVkRmFjZXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZywgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgcmVwZWF0ZXIsIHNwZWMucmVzb2x2ZSk7XG5cblxuICAgIHRoaXMuY2hpbGQgPSBidWlsZE1vZGVsKHNwZWMuc3BlYywgdGhpcywgdGhpcy5nZXROYW1lKCdjaGlsZCcpLCB1bmRlZmluZWQsIHJlcGVhdGVyLCBjb25maWcsIGZhbHNlKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW3RoaXMuY2hpbGRdO1xuXG4gICAgY29uc3QgZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+ID0gcmVwbGFjZVJlcGVhdGVySW5GYWNldChzcGVjLmZhY2V0LCByZXBlYXRlcik7XG5cbiAgICB0aGlzLmZhY2V0ID0gdGhpcy5pbml0RmFjZXQoZmFjZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RmFjZXQoZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+KTogRmFjZXRNYXBwaW5nPHN0cmluZz4ge1xuICAgIC8vIGNsb25lIHRvIHByZXZlbnQgc2lkZSBlZmZlY3QgdG8gdGhlIG9yaWdpbmFsIHNwZWNcbiAgICByZXR1cm4gcmVkdWNlKGZhY2V0LCBmdW5jdGlvbihub3JtYWxpemVkRmFjZXQsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoIWNvbnRhaW5zKFtST1csIENPTFVNTl0sIGNoYW5uZWwpKSB7XG4gICAgICAgIC8vIERyb3AgdW5zdXBwb3J0ZWQgY2hhbm5lbFxuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWwsICdmYWNldCcpKTtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRGYWNldDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLmZpZWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW1wdHlGaWVsZERlZihmaWVsZERlZiwgY2hhbm5lbCkpO1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgICAgfVxuXG4gICAgICAvLyBDb252ZXJ0IHR5cGUgdG8gZnVsbCwgbG93ZXJjYXNlIHR5cGUsIG9yIGF1Z21lbnQgdGhlIGZpZWxkRGVmIHdpdGggYSBkZWZhdWx0IHR5cGUgaWYgbWlzc2luZy5cbiAgICAgIG5vcm1hbGl6ZWRGYWNldFtjaGFubmVsXSA9IG5vcm1hbGl6ZShmaWVsZERlZiwgY2hhbm5lbCk7XG4gICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBjaGFubmVsSGFzRmllbGQoY2hhbm5lbDogQ2hhbm5lbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZmFjZXRbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmZhY2V0W2NoYW5uZWxdO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICAgIHRoaXMuY2hpbGQucGFyc2VEYXRhKCk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlQ2hpbGRyZW5MYXlvdXRTaXplKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIC8vIEFzIGEgZmFjZXQgaGFzIGEgc2luZ2xlIGNoaWxkLCB0aGUgc2VsZWN0aW9uIGNvbXBvbmVudHMgYXJlIHRoZSBzYW1lLlxuICAgIC8vIFRoZSBjaGlsZCBtYWludGFpbnMgaXRzIHNlbGVjdGlvbnMgdG8gYXNzZW1ibGUgc2lnbmFscywgd2hpY2ggcmVtYWluXG4gICAgLy8gd2l0aGluIGl0cyB1bml0LlxuICAgIHRoaXMuY2hpbGQucGFyc2VTZWxlY3Rpb24oKTtcbiAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB0aGlzLmNoaWxkLmNvbXBvbmVudC5zZWxlY3Rpb247XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgdGhpcy5jaGlsZC5wYXJzZU1hcmtHcm91cCgpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICB0aGlzLmNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgdGhpcy5wYXJzZUhlYWRlcignY29sdW1uJyk7XG4gICAgdGhpcy5wYXJzZUhlYWRlcigncm93Jyk7XG5cbiAgICB0aGlzLm1lcmdlQ2hpbGRBeGlzKCd4Jyk7XG4gICAgdGhpcy5tZXJnZUNoaWxkQXhpcygneScpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUhlYWRlcihjaGFubmVsOiBIZWFkZXJDaGFubmVsKSB7XG5cbiAgICBpZiAodGhpcy5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5mYWNldFtjaGFubmVsXTtcbiAgICAgIGNvbnN0IGhlYWRlciA9IGZpZWxkRGVmLmhlYWRlciB8fCB7fTtcbiAgICAgIGxldCB0aXRsZSA9IGZpZWxkRGVmLnRpdGxlICE9PSB1bmRlZmluZWQgPyBmaWVsZERlZi50aXRsZSA6XG4gICAgICAgIGhlYWRlci50aXRsZSAhPT0gdW5kZWZpbmVkID8gaGVhZGVyLnRpdGxlIDogZmllbGREZWZUaXRsZShmaWVsZERlZiwgdGhpcy5jb25maWcpO1xuXG4gICAgICBpZiAodGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXS50aXRsZSkge1xuICAgICAgICAvLyBtZXJnZSB0aXRsZSB3aXRoIGNoaWxkIHRvIHByb2R1Y2UgXCJUaXRsZSAvIFN1YnRpdGxlIC8gU3ViLXN1YnRpdGxlXCJcbiAgICAgICAgdGl0bGUgKz0gJyAvICcgKyB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlO1xuICAgICAgICB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXSA9IHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGZhY2V0RmllbGREZWY6IGZpZWxkRGVmLFxuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IGFkZGluZyBsYWJlbCB0byBmb290ZXIgYXMgd2VsbFxuICAgICAgICBoZWFkZXI6IFt0aGlzLm1ha2VIZWFkZXJDb21wb25lbnQoY2hhbm5lbCwgdHJ1ZSldXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbWFrZUhlYWRlckNvbXBvbmVudChjaGFubmVsOiBIZWFkZXJDaGFubmVsLCBsYWJlbHM6IGJvb2xlYW4pOiBIZWFkZXJDb21wb25lbnQge1xuICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWxzLFxuICAgICAgc2l6ZVNpZ25hbDogdGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXQoc2l6ZVR5cGUpID8gdGhpcy5jaGlsZC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKSA6IHVuZGVmaW5lZCxcbiAgICAgIGF4ZXM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VDaGlsZEF4aXMoY2hhbm5lbDogJ3gnIHwgJ3knKSB7XG4gICAgY29uc3Qge2NoaWxkfSA9IHRoaXM7XG4gICAgaWYgKGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICBjb25zdCB7bGF5b3V0SGVhZGVycywgcmVzb2x2ZX0gPSB0aGlzLmNvbXBvbmVudDtcbiAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKHJlc29sdmUsIGNoYW5uZWwpO1xuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBGb3Igc2hhcmVkIGF4aXMsIG1vdmUgdGhlIGF4ZXMgdG8gZmFjZXQncyBoZWFkZXIgb3IgZm9vdGVyXG4gICAgICAgIGNvbnN0IGhlYWRlckNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnY29sdW1uJyA6ICdyb3cnO1xuXG4gICAgICAgIGNvbnN0IGxheW91dEhlYWRlciA9IGxheW91dEhlYWRlcnNbaGVhZGVyQ2hhbm5lbF07XG4gICAgICAgIGZvciAoY29uc3QgYXhpc0NvbXBvbmVudCBvZiBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIGNvbnN0IGhlYWRlclR5cGUgPSBnZXRIZWFkZXJUeXBlKGF4aXNDb21wb25lbnQuZ2V0KCdvcmllbnQnKSk7XG4gICAgICAgICAgbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdID0gbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdIHx8XG4gICAgICAgICAgW3RoaXMubWFrZUhlYWRlckNvbXBvbmVudChoZWFkZXJDaGFubmVsLCBmYWxzZSldO1xuXG4gICAgICAgICAgY29uc3QgbWFpbkF4aXMgPSBhc3NlbWJsZUF4aXMoYXhpc0NvbXBvbmVudCwgJ21haW4nLCB0aGlzLmNvbmZpZywge2hlYWRlcjogdHJ1ZX0pO1xuICAgICAgICAgIC8vIExheW91dEhlYWRlciBubyBsb25nZXIga2VlcCB0cmFjayBvZiBwcm9wZXJ0eSBwcmVjZWRlbmNlLCB0aHVzIGxldCdzIGNvbWJpbmUuXG4gICAgICAgICAgbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdWzBdLmF4ZXMucHVzaChtYWluQXhpcyk7XG4gICAgICAgICAgYXhpc0NvbXBvbmVudC5tYWluRXh0cmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGRvIG5vdGhpbmcgZm9yIGluZGVwZW5kZW50IGF4ZXNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGF5b3V0QmFuZE1peGlucyhoZWFkZXJUeXBlOiAnaGVhZGVyJyB8ICdmb290ZXInKToge1xuICAgIGhlYWRlckJhbmQ/OiBSb3dDb2w8bnVtYmVyPixcbiAgICBmb290ZXJCYW5kPzogUm93Q29sPG51bWJlcj5cbiAgfSB7XG4gICAgY29uc3QgYmFuZE1peGlucyA9IHt9O1xuXG4gICAgY29uc3QgYmFuZFR5cGUgPSBoZWFkZXJUeXBlID09PSAnaGVhZGVyJyA/ICdoZWFkZXJCYW5kJyA6ICdmb290ZXJCYW5kJztcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3JvdycsICdjb2x1bW4nXSBhcyAoJ3JvdycgfCAnY29sdW1uJylbXSkge1xuICAgICAgY29uc3QgbGF5b3V0SGVhZGVyQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXTtcbiAgICAgIGNvbnN0IGhlYWRlckNvbXBvbmVudCA9IGxheW91dEhlYWRlckNvbXBvbmVudFtoZWFkZXJUeXBlXTtcbiAgICAgIGlmIChoZWFkZXJDb21wb25lbnQgJiYgaGVhZGVyQ29tcG9uZW50WzBdKSB7XG4gICAgICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSkpIHtcbiAgICAgICAgICAvLyBJZiBmYWNldCBjaGlsZCBkb2VzIG5vdCBoYXZlIHNpemUgc2lnbmFsLCB0aGVuIGFwcGx5IGhlYWRlckJhbmRcbiAgICAgICAgICBiYW5kTWl4aW5zW2JhbmRUeXBlXSA9IGJhbmRNaXhpbnNbYmFuZFR5cGVdIHx8IHt9O1xuICAgICAgICAgIGJhbmRNaXhpbnNbYmFuZFR5cGVdW2NoYW5uZWxdID0gMC41O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiYW5kTWl4aW5zO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpID8gdGhpcy5jb2x1bW5EaXN0aW5jdFNpZ25hbCgpIDogMTtcblxuICAgIC8vIFRPRE86IGRldGVybWluZSBkZWZhdWx0IGFsaWduIGJhc2VkIG9uIHNoYXJlZCAvIGluZGVwZW5kZW50IHNjYWxlc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgIC4uLnRoaXMuZ2V0TGF5b3V0QmFuZE1peGlucygnaGVhZGVyJyksXG4gICAgICAuLi50aGlzLmdldExheW91dEJhbmRNaXhpbnMoJ2Zvb3RlcicpLFxuXG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IG9mZnNldCBmb3Igcm93SGVhZGVyL3Jvd0Zvb3Rlci9yb3dUaXRsZS9jb2x1bW5IZWFkZXIvY29sdW1uRm9vdGVyL2NvbHVtblRpdGxlXG4gICAgICBvZmZzZXQ6IDEwLFxuICAgICAgY29sdW1ucyxcbiAgICAgIGJvdW5kczogJ2Z1bGwnLFxuICAgICAgYWxpZ246ICdhbGwnXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMTkzKTogdGhpcyBjYW4gYmUgaW5jb3JyZWN0IGlmIHdlIGhhdmUgaW5kZXBlbmRlbnQgc2NhbGVzLlxuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2x1bW5EaXN0aW5jdFNpZ25hbCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgRmFjZXRNb2RlbCkpIHtcbiAgICAgIC8vIEZvciBuZXN0ZWQgZmFjZXQsIHdlIHdpbGwgYWRkIGNvbHVtbnMgdG8gZ3JvdXAgbWFyayBpbnN0ZWFkXG4gICAgICAvLyBTZWUgZGlzY3Vzc2lvbiBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL2lzc3Vlcy85NTJcbiAgICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLXZpZXcvcmVsZWFzZXMvdGFnL3YxLjIuNlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gZmFjZXROb2RlLmFzc2VtYmxlKCksIHRoZSBuYW1lIGlzIGFsd2F5cyB0aGlzLmdldE5hbWUoJ2NvbHVtbicpICsgJ19sYXlvdXQnLlxuICAgICAgY29uc3QgZmFjZXRMYXlvdXREYXRhTmFtZSA9IHRoaXMuZ2V0TmFtZSgnY29sdW1uX2RvbWFpbicpO1xuICAgICAgcmV0dXJuIHtzaWduYWw6IGBsZW5ndGgoZGF0YSgnJHtmYWNldExheW91dERhdGFOYW1lfScpKWB9O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUdyb3VwKHNpZ25hbHM6IFZnU2lnbmFsW10pIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgRmFjZXRNb2RlbCkpIHtcbiAgICAgIC8vIFByb3ZpZGUgbnVtYmVyIG9mIGNvbHVtbnMgZm9yIGxheW91dC5cbiAgICAgIC8vIFNlZSBkaXNjdXNzaW9uIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EvaXNzdWVzLzk1MlxuICAgICAgLy8gYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2Etdmlldy9yZWxlYXNlcy90YWcvdjEuMi42XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi4odGhpcy5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpID8ge1xuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzU5KTpcbiAgICAgICAgICAgICAgLy8gQ29ycmVjdCB0aGUgc2lnbmFsIGZvciBmYWNldCBvZiBjb25jYXQgb2YgZmFjZXRfY29sdW1uXG4gICAgICAgICAgICAgIGNvbHVtbnM6IHtmaWVsZDogdmdGaWVsZCh0aGlzLmZhY2V0LmNvbHVtbiwge3ByZWZpeDogJ2Rpc3RpbmN0J30pfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6IHt9KSxcbiAgICAgICAgLi4uc3VwZXIuYXNzZW1ibGVHcm91cChzaWduYWxzKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmFzc2VtYmxlR3JvdXAoc2lnbmFscyk7XG4gIH1cblxuICAvKipcbiAgICogQWdncmVnYXRlIGNhcmRpbmFsaXR5IGZvciBjYWxjdWxhdGluZyBzaXplXG4gICAqL1xuICBwcml2YXRlIGdldENhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGQoKSB7XG4gICAgY29uc3QgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGlmICh0aGlzLmNoaWxkIGluc3RhbmNlb2YgRmFjZXRNb2RlbCkge1xuICAgICAgaWYgKHRoaXMuY2hpbGQuY2hhbm5lbEhhc0ZpZWxkKCdjb2x1bW4nKSkge1xuICAgICAgICBmaWVsZHMucHVzaCh2Z0ZpZWxkKHRoaXMuY2hpbGQuZmFjZXQuY29sdW1uKSk7XG4gICAgICAgIG9wcy5wdXNoKCdkaXN0aW5jdCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBTY2FsZUNoYW5uZWxbXSkge1xuICAgICAgICBjb25zdCBjaGlsZFNjYWxlQ29tcG9uZW50ID0gdGhpcy5jaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hpbGRTY2FsZUNvbXBvbmVudCAmJiAhY2hpbGRTY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgICAgICBjb25zdCB0eXBlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgICAgICBjb25zdCBkb21haW4gPSBhc3NlbWJsZURvbWFpbih0aGlzLmNoaWxkLCBjaGFubmVsKTtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgICBvcHMucHVzaCgnZGlzdGluY3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHMubGVuZ3RoID8ge2ZpZWxkcywgb3BzfSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZU1hcmtzKCk6IFZnTWFya0dyb3VwW10ge1xuICAgIGNvbnN0IHtjaGlsZCwgZmFjZXR9ID0gdGhpcztcbiAgICBjb25zdCBmYWNldFJvb3QgPSB0aGlzLmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdDtcbiAgICBjb25zdCBkYXRhID0gYXNzZW1ibGVGYWNldERhdGEoZmFjZXRSb290KTtcblxuICAgIC8vIElmIHdlIGZhY2V0IGJ5IHR3byBkaW1lbnNpb25zLCB3ZSBuZWVkIHRvIGFkZCBhIGNyb3NzIG9wZXJhdG9yIHRvIHRoZSBhZ2dyZWdhdGlvblxuICAgIC8vIHNvIHRoYXQgd2UgY3JlYXRlIGFsbCBncm91cHNcbiAgICBjb25zdCBoYXNSb3cgPSB0aGlzLmNoYW5uZWxIYXNGaWVsZChST1cpO1xuICAgIGNvbnN0IGhhc0NvbHVtbiA9IHRoaXMuY2hhbm5lbEhhc0ZpZWxkKENPTFVNTik7XG4gICAgY29uc3QgbGF5b3V0U2l6ZUVuY29kZUVudHJ5ID0gY2hpbGQuYXNzZW1ibGVMYXlvdXRTaXplKCk7XG5cbiAgICBjb25zdCBhZ2dyZWdhdGVNaXhpbnM6IGFueSA9IHt9O1xuICAgIGlmIChoYXNSb3cgJiYgaGFzQ29sdW1uKSB7XG4gICAgICBhZ2dyZWdhdGVNaXhpbnMuYWdncmVnYXRlID0ge2Nyb3NzOiB0cnVlfTtcbiAgICB9XG4gICAgY29uc3QgY2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZCA9IHRoaXMuZ2V0Q2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZCgpO1xuICAgIGlmIChjYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkKSB7XG4gICAgICBhZ2dyZWdhdGVNaXhpbnMuYWdncmVnYXRlID0ge1xuICAgICAgICAuLi5hZ2dyZWdhdGVNaXhpbnMuYWdncmVnYXRlLFxuICAgICAgICAuLi5jYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gY2hpbGQuYXNzZW1ibGVUaXRsZSgpO1xuICAgIGNvbnN0IHN0eWxlID0gY2hpbGQuYXNzZW1ibGVHcm91cFN0eWxlKCk7XG5cbiAgICBjb25zdCBtYXJrR3JvdXAgPSB7XG4gICAgICBuYW1lOiB0aGlzLmdldE5hbWUoJ2NlbGwnKSxcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAuLi4odGl0bGU/IHt0aXRsZX0gOiB7fSksXG4gICAgICAuLi4oc3R5bGU/IHtzdHlsZX0gOiB7fSksXG4gICAgICBmcm9tOiB7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgbmFtZTogZmFjZXRSb290Lm5hbWUsXG4gICAgICAgICAgZGF0YTogZmFjZXRSb290LmRhdGEsXG4gICAgICAgICAgZ3JvdXBieTogW10uY29uY2F0KFxuICAgICAgICAgICAgaGFzUm93ID8gW3RoaXMudmdGaWVsZChST1cpXSA6IFtdLFxuICAgICAgICAgICAgaGFzQ29sdW1uID8gW3RoaXMudmdGaWVsZChDT0xVTU4pXSA6IFtdXG4gICAgICAgICAgKSxcbiAgICAgICAgICAuLi5hZ2dyZWdhdGVNaXhpbnNcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFtdLmNvbmNhdChcbiAgICAgICAgICBoYXNSb3cgPyBbdGhpcy52Z0ZpZWxkKFJPVywge2V4cHI6ICdkYXR1bScsfSldIDogW10sXG4gICAgICAgICAgaGFzQ29sdW1uID8gW3RoaXMudmdGaWVsZChDT0xVTU4sIHtleHByOiAnZGF0dW0nfSldIDogW11cbiAgICAgICAgKSxcbiAgICAgICAgb3JkZXI6IFtdLmNvbmNhdChcbiAgICAgICAgICBoYXNSb3cgPyBbIChmYWNldC5yb3cuc29ydCkgfHwgJ2FzY2VuZGluZyddIDogW10sXG4gICAgICAgICAgaGFzQ29sdW1uID8gWyAoZmFjZXQuY29sdW1uLnNvcnQpIHx8ICdhc2NlbmRpbmcnXSA6IFtdXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICAuLi4oZGF0YS5sZW5ndGggPiAwID8ge2RhdGE6IGRhdGF9IDoge30pLFxuICAgICAgLi4uKGxheW91dFNpemVFbmNvZGVFbnRyeSA/IHtlbmNvZGU6IHt1cGRhdGU6IGxheW91dFNpemVFbmNvZGVFbnRyeX19IDoge30pLFxuICAgICAgLi4uY2hpbGQuYXNzZW1ibGVHcm91cCgpXG4gICAgfTtcblxuICAgIHJldHVybiBbbWFya0dyb3VwXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNYXBwaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmZhY2V0O1xuICB9XG59XG4iXX0=