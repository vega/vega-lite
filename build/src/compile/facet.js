"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var scale_1 = require("../scale");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var buildmodel_1 = require("./buildmodel");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var parse_2 = require("./layoutsize/parse");
var model_1 = require("./model");
var repeater_1 = require("./repeater");
var resolve_1 = require("./resolve");
var domain_1 = require("./scale/domain");
var FacetModel = /** @class */ (function (_super) {
    __extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
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
        return __assign({ padding: { row: 10, column: 10 } }, this.getLayoutBandMixins('header'), this.getLayoutBandMixins('footer'), { 
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
            return __assign({}, (this.channelHasField('column') ? {
                encode: {
                    update: {
                        // TODO(https://github.com/vega/vega-lite/issues/2759):
                        // Correct the signal for facet of concat of facet_column
                        columns: { field: fielddef_1.field(this.facet.column, { prefix: 'distinct' }) }
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
                fields.push(fielddef_1.field(this.child.facet.column));
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
                        var field_1 = domain_1.getFieldFromDomain(domain);
                        if (field_1) {
                            fields.push(field_1);
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
        var data = assemble_1.assembleFacetData(facetRoot);
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
            aggregateMixins.aggregate = __assign({}, aggregateMixins.aggregate, cardinalityAggregateForChild);
        }
        var title = child.assembleTitle();
        var style = child.assembleGroupStyle();
        var markGroup = __assign({ name: this.getName('cell'), type: 'group' }, (title ? { title: title } : {}), (style ? { style: style } : {}), { from: {
                facet: __assign({ name: facetRoot.name, data: facetRoot.data, groupby: [].concat(hasRow ? [this.field(channel_1.ROW)] : [], hasColumn ? [this.field(channel_1.COLUMN)] : []) }, aggregateMixins)
            }, sort: {
                field: [].concat(hasRow ? [this.field(channel_1.ROW, { expr: 'datum', })] : [], hasColumn ? [this.field(channel_1.COLUMN, { expr: 'datum' })] : []),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUE4RDtBQUU5RCx3Q0FBbUM7QUFFbkMsd0NBQStFO0FBQy9FLDRCQUE4QjtBQUM5QixrQ0FBMkM7QUFFM0MsZ0NBQWlDO0FBQ2pDLDhDQUErRztBQUMvRywyQ0FBd0M7QUFDeEMsNENBQWtEO0FBQ2xELHNDQUF1QztBQUN2QywwQ0FBOEU7QUFDOUUsNENBQTJEO0FBQzNELGlDQUE4QztBQUM5Qyx1Q0FBaUU7QUFDakUscUNBQTRDO0FBRTVDLHlDQUFrRTtBQUVsRTtJQUFnQyw4QkFBYztJQVE1QyxvQkFBWSxJQUFlLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQUUsUUFBdUIsRUFBRSxNQUFjO1FBQTVHLFlBQ0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FTM0Q7UUFqQmUsVUFBSSxHQUFZLE9BQU8sQ0FBQztRQVd0QyxLQUFJLENBQUMsS0FBSyxHQUFHLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRyxLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdCLElBQU0sS0FBSyxHQUF5QixpQ0FBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWpGLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFDckMsQ0FBQztJQUVPLDhCQUFTLEdBQWpCLFVBQWtCLEtBQTJC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Li4vYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbCwgQ09MVU1OLCBST1csIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZhY2V0TWFwcGluZ30gZnJvbSAnLi4vZmFjZXQnO1xuaW1wb3J0IHtmaWVsZCwgRmllbGREZWYsIG5vcm1hbGl6ZSwgdGl0bGUgYXMgZmllbGREZWZUaXRsZX0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge0ZhY2V0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7aXNWZ1JhbmdlU3RlcCwgUm93Q29sLCBWZ0F4aXMsIFZnRGF0YSwgVmdMYXlvdXQsIFZnTWFya0dyb3VwLCBWZ1NjYWxlLCBWZ1NpZ25hbH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZUZhY2V0RGF0YX0gZnJvbSAnLi9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7cGFyc2VEYXRhfSBmcm9tICcuL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHtnZXRIZWFkZXJUeXBlLCBIZWFkZXJDaGFubmVsLCBIZWFkZXJDb21wb25lbnR9IGZyb20gJy4vbGF5b3V0L2hlYWRlcic7XG5pbXBvcnQge3BhcnNlQ2hpbGRyZW5MYXlvdXRTaXplfSBmcm9tICcuL2xheW91dHNpemUvcGFyc2UnO1xuaW1wb3J0IHtNb2RlbCwgTW9kZWxXaXRoRmllbGR9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlLCByZXBsYWNlUmVwZWF0ZXJJbkZhY2V0fSBmcm9tICcuL3JlcGVhdGVyJztcbmltcG9ydCB7cGFyc2VHdWlkZVJlc29sdmV9IGZyb20gJy4vcmVzb2x2ZSc7XG5pbXBvcnQge2Fzc2VtYmxlU2NhbGVzRm9yTW9kZWx9IGZyb20gJy4vc2NhbGUvYXNzZW1ibGUnO1xuaW1wb3J0IHthc3NlbWJsZURvbWFpbiwgZ2V0RmllbGRGcm9tRG9tYWlufSBmcm9tICcuL3NjYWxlL2RvbWFpbic7XG5cbmV4cG9ydCBjbGFzcyBGYWNldE1vZGVsIGV4dGVuZHMgTW9kZWxXaXRoRmllbGQge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ2ZhY2V0JyA9ICdmYWNldCc7XG4gIHB1YmxpYyByZWFkb25seSBmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZz47XG5cbiAgcHVibGljIHJlYWRvbmx5IGNoaWxkOiBNb2RlbDtcblxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogRmFjZXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZywgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgc3BlYy5yZXNvbHZlKTtcblxuXG4gICAgdGhpcy5jaGlsZCA9IGJ1aWxkTW9kZWwoc3BlYy5zcGVjLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2NoaWxkJyksIHVuZGVmaW5lZCwgcmVwZWF0ZXIsIGNvbmZpZywgZmFsc2UpO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbdGhpcy5jaGlsZF07XG5cbiAgICBjb25zdCBmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZz4gPSByZXBsYWNlUmVwZWF0ZXJJbkZhY2V0KHNwZWMuZmFjZXQsIHJlcGVhdGVyKTtcblxuICAgIHRoaXMuZmFjZXQgPSB0aGlzLmluaXRGYWNldChmYWNldCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRGYWNldChmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZz4pOiBGYWNldE1hcHBpbmc8c3RyaW5nPiB7XG4gICAgLy8gY2xvbmUgdG8gcHJldmVudCBzaWRlIGVmZmVjdCB0byB0aGUgb3JpZ2luYWwgc3BlY1xuICAgIHJldHVybiByZWR1Y2UoZmFjZXQsIGZ1bmN0aW9uKG5vcm1hbGl6ZWRGYWNldCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGlmICghY29udGFpbnMoW1JPVywgQ09MVU1OXSwgY2hhbm5lbCkpIHtcbiAgICAgICAgLy8gRHJvcCB1bnN1cHBvcnRlZCBjaGFubmVsXG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoY2hhbm5lbCwgJ2ZhY2V0JykpO1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGREZWYuZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5lbXB0eUZpZWxkRGVmKGZpZWxkRGVmLCBjaGFubmVsKSk7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkRmFjZXQ7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbnZlcnQgdHlwZSB0byBmdWxsLCBsb3dlcmNhc2UgdHlwZSwgb3IgYXVnbWVudCB0aGUgZmllbGREZWYgd2l0aCBhIGRlZmF1bHQgdHlwZSBpZiBtaXNzaW5nLlxuICAgICAgbm9ybWFsaXplZEZhY2V0W2NoYW5uZWxdID0gbm9ybWFsaXplKGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgICAgIHJldHVybiBub3JtYWxpemVkRmFjZXQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHVibGljIGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5mYWNldFtjaGFubmVsXTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZERlZihjaGFubmVsOiBDaGFubmVsKTogRmllbGREZWY8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZmFjZXRbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgcGFyc2VEYXRhKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmRhdGEgPSBwYXJzZURhdGEodGhpcyk7XG4gICAgdGhpcy5jaGlsZC5wYXJzZURhdGEoKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUxheW91dFNpemUoKSB7XG4gICAgcGFyc2VDaGlsZHJlbkxheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgLy8gQXMgYSBmYWNldCBoYXMgYSBzaW5nbGUgY2hpbGQsIHRoZSBzZWxlY3Rpb24gY29tcG9uZW50cyBhcmUgdGhlIHNhbWUuXG4gICAgLy8gVGhlIGNoaWxkIG1haW50YWlucyBpdHMgc2VsZWN0aW9ucyB0byBhc3NlbWJsZSBzaWduYWxzLCB3aGljaCByZW1haW5cbiAgICAvLyB3aXRoaW4gaXRzIHVuaXQuXG4gICAgdGhpcy5jaGlsZC5wYXJzZVNlbGVjdGlvbigpO1xuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHRoaXMuY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZU1hcmtHcm91cCgpIHtcbiAgICB0aGlzLmNoaWxkLnBhcnNlTWFya0dyb3VwKCk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIHRoaXMuY2hpbGQucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICB0aGlzLnBhcnNlSGVhZGVyKCdjb2x1bW4nKTtcbiAgICB0aGlzLnBhcnNlSGVhZGVyKCdyb3cnKTtcblxuICAgIHRoaXMubWVyZ2VDaGlsZEF4aXMoJ3gnKTtcbiAgICB0aGlzLm1lcmdlQ2hpbGRBeGlzKCd5Jyk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSGVhZGVyKGNoYW5uZWw6IEhlYWRlckNoYW5uZWwpIHtcblxuICAgIGlmICh0aGlzLmNoYW5uZWxIYXNGaWVsZChjaGFubmVsKSkge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZhY2V0W2NoYW5uZWxdO1xuICAgICAgY29uc3QgaGVhZGVyID0gZmllbGREZWYuaGVhZGVyIHx8IHt9O1xuICAgICAgbGV0IHRpdGxlID0gaGVhZGVyLnRpdGxlICE9PSB1bmRlZmluZWQgPyBoZWFkZXIudGl0bGUgOiBmaWVsZERlZlRpdGxlKGZpZWxkRGVmLCB0aGlzLmNvbmZpZyk7XG5cbiAgICAgIGlmICh0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlKSB7XG4gICAgICAgIC8vIG1lcmdlIHRpdGxlIHdpdGggY2hpbGQgdG8gcHJvZHVjZSBcIlRpdGxlIC8gU3VidGl0bGUgLyBTdWItc3VidGl0bGVcIlxuICAgICAgICB0aXRsZSArPSAnIC8gJyArIHRoaXMuY2hpbGQuY29tcG9uZW50LmxheW91dEhlYWRlcnNbY2hhbm5lbF0udGl0bGU7XG4gICAgICAgIHRoaXMuY2hpbGQuY29tcG9uZW50LmxheW91dEhlYWRlcnNbY2hhbm5lbF0udGl0bGUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdID0ge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgZmFjZXRGaWVsZERlZjogZmllbGREZWYsXG4gICAgICAgIC8vIFRPRE86IHN1cHBvcnQgYWRkaW5nIGxhYmVsIHRvIGZvb3RlciBhcyB3ZWxsXG4gICAgICAgIGhlYWRlcjogW3RoaXMubWFrZUhlYWRlckNvbXBvbmVudChjaGFubmVsLCB0cnVlKV1cbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYWtlSGVhZGVyQ29tcG9uZW50KGNoYW5uZWw6IEhlYWRlckNoYW5uZWwsIGxhYmVsczogYm9vbGVhbik6IEhlYWRlckNvbXBvbmVudCB7XG4gICAgY29uc3Qgc2l6ZVR5cGUgPSBjaGFubmVsID09PSAncm93JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHJldHVybiB7XG4gICAgICBsYWJlbHMsXG4gICAgICBzaXplU2lnbmFsOiB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSkgPyB0aGlzLmNoaWxkLmdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGUpIDogdW5kZWZpbmVkLFxuICAgICAgYXhlczogW11cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZUNoaWxkQXhpcyhjaGFubmVsOiAneCcgfCAneScpIHtcbiAgICBjb25zdCB7Y2hpbGR9ID0gdGhpcztcbiAgICBpZiAoY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgIGNvbnN0IHtsYXlvdXRIZWFkZXJzLCByZXNvbHZlfSA9IHRoaXMuY29tcG9uZW50O1xuICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gcGFyc2VHdWlkZVJlc29sdmUocmVzb2x2ZSwgY2hhbm5lbCk7XG5cbiAgICAgIGlmIChyZXNvbHZlLmF4aXNbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIC8vIEZvciBzaGFyZWQgYXhpcywgbW92ZSB0aGUgYXhlcyB0byBmYWNldCdzIGhlYWRlciBvciBmb290ZXJcbiAgICAgICAgY29uc3QgaGVhZGVyQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICd4JyA/ICdjb2x1bW4nIDogJ3Jvdyc7XG5cbiAgICAgICAgY29uc3QgbGF5b3V0SGVhZGVyID0gbGF5b3V0SGVhZGVyc1toZWFkZXJDaGFubmVsXTtcbiAgICAgICAgZm9yIChjb25zdCBheGlzQ29tcG9uZW50IG9mIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgY29uc3QgbWFpbkF4aXMgPSBheGlzQ29tcG9uZW50Lm1haW47XG4gICAgICAgICAgY29uc3QgaGVhZGVyVHlwZSA9IGdldEhlYWRlclR5cGUobWFpbkF4aXMuZ2V0KCdvcmllbnQnKSk7XG4gICAgICAgICAgbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdID0gbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdIHx8XG4gICAgICAgICAgICBbdGhpcy5tYWtlSGVhZGVyQ29tcG9uZW50KGhlYWRlckNoYW5uZWwsIGZhbHNlKV07XG5cbiAgICAgICAgICAvLyBMYXlvdXRIZWFkZXIgbm8gbG9uZ2VyIGtlZXAgdHJhY2sgb2YgcHJvcGVydHkgcHJlY2VkZW5jZSwgdGh1cyBsZXQncyBjb21iaW5lLlxuICAgICAgICAgIGxheW91dEhlYWRlcltoZWFkZXJUeXBlXVswXS5heGVzLnB1c2gobWFpbkF4aXMuY29tYmluZSgpIGFzIFZnQXhpcyk7XG4gICAgICAgICAgZGVsZXRlIGF4aXNDb21wb25lbnQubWFpbjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGRvIG5vdGhpbmcgZm9yIGluZGVwZW5kZW50IGF4ZXNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGF5b3V0QmFuZE1peGlucyhoZWFkZXJUeXBlOiAnaGVhZGVyJyB8ICdmb290ZXInKToge1xuICAgIGhlYWRlckJhbmQ/OiBSb3dDb2w8bnVtYmVyPixcbiAgICBmb290ZXJCYW5kPzogUm93Q29sPG51bWJlcj5cbiAgfSB7XG4gICAgY29uc3QgYmFuZE1peGlucyA9IHt9O1xuXG4gICAgY29uc3QgYmFuZFR5cGUgPSBoZWFkZXJUeXBlID09PSAnaGVhZGVyJyA/ICdoZWFkZXJCYW5kJyA6ICdmb290ZXJCYW5kJztcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3JvdycsICdjb2x1bW4nXSBhcyAoJ3JvdycgfCAnY29sdW1uJylbXSkge1xuICAgICAgY29uc3QgbGF5b3V0SGVhZGVyQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXTtcbiAgICAgIGNvbnN0IGhlYWRlckNvbXBvbmVudCA9IGxheW91dEhlYWRlckNvbXBvbmVudFtoZWFkZXJUeXBlXTtcbiAgICAgIGlmIChoZWFkZXJDb21wb25lbnQgJiYgaGVhZGVyQ29tcG9uZW50WzBdKSB7XG4gICAgICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSkpIHtcbiAgICAgICAgICAvLyBJZiBmYWNldCBjaGlsZCBkb2VzIG5vdCBoYXZlIHNpemUgc2lnbmFsLCB0aGVuIGFwcGx5IGhlYWRlckJhbmRcbiAgICAgICAgICBiYW5kTWl4aW5zW2JhbmRUeXBlXSA9IGJhbmRNaXhpbnNbYmFuZFR5cGVdIHx8IHt9O1xuICAgICAgICAgIGJhbmRNaXhpbnNbYmFuZFR5cGVdW2NoYW5uZWxdID0gMC41O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiYW5kTWl4aW5zO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpID8gdGhpcy5jb2x1bW5EaXN0aW5jdFNpZ25hbCgpIDogMTtcblxuICAgIC8vIFRPRE86IGRldGVybWluZSBkZWZhdWx0IGFsaWduIGJhc2VkIG9uIHNoYXJlZCAvIGluZGVwZW5kZW50IHNjYWxlc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgIC4uLnRoaXMuZ2V0TGF5b3V0QmFuZE1peGlucygnaGVhZGVyJyksXG4gICAgICAuLi50aGlzLmdldExheW91dEJhbmRNaXhpbnMoJ2Zvb3RlcicpLFxuXG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IG9mZnNldCBmb3Igcm93SGVhZGVyL3Jvd0Zvb3Rlci9yb3dUaXRsZS9jb2x1bW5IZWFkZXIvY29sdW1uRm9vdGVyL2NvbHVtblRpdGxlXG4gICAgICBvZmZzZXQ6IDEwLFxuICAgICAgY29sdW1ucyxcbiAgICAgIGJvdW5kczogJ2Z1bGwnLFxuICAgICAgYWxpZ246ICdhbGwnXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMTkzKTogdGhpcyBjYW4gYmUgaW5jb3JyZWN0IGlmIHdlIGhhdmUgaW5kZXBlbmRlbnQgc2NhbGVzLlxuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2x1bW5EaXN0aW5jdFNpZ25hbCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgRmFjZXRNb2RlbCkpIHtcbiAgICAgIC8vIEZvciBuZXN0ZWQgZmFjZXQsIHdlIHdpbGwgYWRkIGNvbHVtbnMgdG8gZ3JvdXAgbWFyayBpbnN0ZWFkXG4gICAgICAvLyBTZWUgZGlzY3Vzc2lvbiBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL2lzc3Vlcy85NTJcbiAgICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLXZpZXcvcmVsZWFzZXMvdGFnL3YxLjIuNlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gZmFjZXROb2RlLmFzc2VtYmxlKCksIHRoZSBuYW1lIGlzIGFsd2F5cyB0aGlzLmdldE5hbWUoJ2NvbHVtbicpICsgJ19sYXlvdXQnLlxuICAgICAgY29uc3QgZmFjZXRMYXlvdXREYXRhTmFtZSA9IHRoaXMuZ2V0TmFtZSgnY29sdW1uX2RvbWFpbicpO1xuICAgICAgcmV0dXJuIHtzaWduYWw6IGBsZW5ndGgoZGF0YSgnJHtmYWNldExheW91dERhdGFOYW1lfScpKWB9O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUdyb3VwKHNpZ25hbHM6IFZnU2lnbmFsW10pIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgRmFjZXRNb2RlbCkpIHtcbiAgICAgIC8vIFByb3ZpZGUgbnVtYmVyIG9mIGNvbHVtbnMgZm9yIGxheW91dC5cbiAgICAgIC8vIFNlZSBkaXNjdXNzaW9uIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EvaXNzdWVzLzk1MlxuICAgICAgLy8gYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2Etdmlldy9yZWxlYXNlcy90YWcvdjEuMi42XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi4odGhpcy5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpID8ge1xuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzU5KTpcbiAgICAgICAgICAgICAgLy8gQ29ycmVjdCB0aGUgc2lnbmFsIGZvciBmYWNldCBvZiBjb25jYXQgb2YgZmFjZXRfY29sdW1uXG4gICAgICAgICAgICAgIGNvbHVtbnM6IHtmaWVsZDogZmllbGQodGhpcy5mYWNldC5jb2x1bW4sIHtwcmVmaXg6ICdkaXN0aW5jdCd9KX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gOiB7fSksXG4gICAgICAgIC4uLnN1cGVyLmFzc2VtYmxlR3JvdXAoc2lnbmFscylcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5hc3NlbWJsZUdyb3VwKHNpZ25hbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0ZSBjYXJkaW5hbGl0eSBmb3IgY2FsY3VsYXRpbmcgc2l6ZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkKCkge1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBvcHM6IEFnZ3JlZ2F0ZU9wW10gPSBbXTtcbiAgICBpZiAodGhpcy5jaGlsZCBpbnN0YW5jZW9mIEZhY2V0TW9kZWwpIHtcbiAgICAgIGlmICh0aGlzLmNoaWxkLmNoYW5uZWxIYXNGaWVsZCgnY29sdW1uJykpIHtcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQodGhpcy5jaGlsZC5mYWNldC5jb2x1bW4pKTtcbiAgICAgICAgb3BzLnB1c2goJ2Rpc3RpbmN0Jyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIFNjYWxlQ2hhbm5lbFtdKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkU2NhbGVDb21wb25lbnQgPSB0aGlzLmNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICAgIGlmIChjaGlsZFNjYWxlQ29tcG9uZW50ICYmICFjaGlsZFNjYWxlQ29tcG9uZW50Lm1lcmdlZCkge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBjaGlsZFNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgICAgICBpZiAoaGFzRGlzY3JldGVEb21haW4odHlwZSkgJiYgaXNWZ1JhbmdlU3RlcChyYW5nZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMuY2hpbGQsIGNoYW5uZWwpO1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluKTtcbiAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgIG9wcy5wdXNoKCdkaXN0aW5jdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbG9nLndhcm4oJ1Vua25vd24gZmllbGQgZm9yICR7Y2hhbm5lbH0uICBDYW5ub3QgY2FsY3VsYXRlIHZpZXcgc2l6ZS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcy5sZW5ndGggPyB7ZmllbGRzLCBvcHN9IDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTWFya3MoKTogVmdNYXJrR3JvdXBbXSB7XG4gICAgY29uc3Qge2NoaWxkLCBmYWNldH0gPSB0aGlzO1xuICAgIGNvbnN0IGZhY2V0Um9vdCA9IHRoaXMuY29tcG9uZW50LmRhdGEuZmFjZXRSb290O1xuICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZUZhY2V0RGF0YShmYWNldFJvb3QpO1xuXG4gICAgLy8gSWYgd2UgZmFjZXQgYnkgdHdvIGRpbWVuc2lvbnMsIHdlIG5lZWQgdG8gYWRkIGEgY3Jvc3Mgb3BlcmF0b3IgdG8gdGhlIGFnZ3JlZ2F0aW9uXG4gICAgLy8gc28gdGhhdCB3ZSBjcmVhdGUgYWxsIGdyb3Vwc1xuICAgIGNvbnN0IGhhc1JvdyA9IHRoaXMuY2hhbm5lbEhhc0ZpZWxkKFJPVyk7XG4gICAgY29uc3QgaGFzQ29sdW1uID0gdGhpcy5jaGFubmVsSGFzRmllbGQoQ09MVU1OKTtcbiAgICBjb25zdCBsYXlvdXRTaXplRW5jb2RlRW50cnkgPSBjaGlsZC5hc3NlbWJsZUxheW91dFNpemUoKTtcblxuICAgIGNvbnN0IGFnZ3JlZ2F0ZU1peGluczogYW55ID0ge307XG4gICAgaWYgKGhhc1JvdyAmJiBoYXNDb2x1bW4pIHtcbiAgICAgIGFnZ3JlZ2F0ZU1peGlucy5hZ2dyZWdhdGUgPSB7Y3Jvc3M6IHRydWV9O1xuICAgIH1cbiAgICBjb25zdCBjYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkID0gdGhpcy5nZXRDYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkKCk7XG4gICAgaWYgKGNhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGQpIHtcbiAgICAgIGFnZ3JlZ2F0ZU1peGlucy5hZ2dyZWdhdGUgPSB7XG4gICAgICAgIC4uLmFnZ3JlZ2F0ZU1peGlucy5hZ2dyZWdhdGUsXG4gICAgICAgIC4uLmNhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBjaGlsZC5hc3NlbWJsZVRpdGxlKCk7XG4gICAgY29uc3Qgc3R5bGUgPSBjaGlsZC5hc3NlbWJsZUdyb3VwU3R5bGUoKTtcblxuICAgIGNvbnN0IG1hcmtHcm91cCA9IHtcbiAgICAgIG5hbWU6IHRoaXMuZ2V0TmFtZSgnY2VsbCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIC4uLih0aXRsZT8ge3RpdGxlfSA6IHt9KSxcbiAgICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBmYWNldFJvb3QubmFtZSxcbiAgICAgICAgICBkYXRhOiBmYWNldFJvb3QuZGF0YSxcbiAgICAgICAgICBncm91cGJ5OiBbXS5jb25jYXQoXG4gICAgICAgICAgICBoYXNSb3cgPyBbdGhpcy5maWVsZChST1cpXSA6IFtdLFxuICAgICAgICAgICAgaGFzQ29sdW1uID8gW3RoaXMuZmllbGQoQ09MVU1OKV0gOiBbXVxuICAgICAgICAgICksXG4gICAgICAgICAgLi4uYWdncmVnYXRlTWl4aW5zXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbXS5jb25jYXQoXG4gICAgICAgICAgaGFzUm93ID8gW3RoaXMuZmllbGQoUk9XLCB7ZXhwcjogJ2RhdHVtJyx9KV0gOiBbXSxcbiAgICAgICAgICBoYXNDb2x1bW4gPyBbdGhpcy5maWVsZChDT0xVTU4sIHtleHByOiAnZGF0dW0nfSldIDogW11cbiAgICAgICAgKSxcbiAgICAgICAgb3JkZXI6IFtdLmNvbmNhdChcbiAgICAgICAgICBoYXNSb3cgPyBbIChmYWNldC5yb3cuc29ydCkgfHwgJ2FzY2VuZGluZyddIDogW10sXG4gICAgICAgICAgaGFzQ29sdW1uID8gWyAoZmFjZXQuY29sdW1uLnNvcnQpIHx8ICdhc2NlbmRpbmcnXSA6IFtdXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICAuLi4oZGF0YS5sZW5ndGggPiAwID8ge2RhdGE6IGRhdGF9IDoge30pLFxuICAgICAgLi4uKGxheW91dFNpemVFbmNvZGVFbnRyeSA/IHtlbmNvZGU6IHt1cGRhdGU6IGxheW91dFNpemVFbmNvZGVFbnRyeX19IDoge30pLFxuICAgICAgLi4uY2hpbGQuYXNzZW1ibGVHcm91cCgpXG4gICAgfTtcblxuICAgIHJldHVybiBbbWFya0dyb3VwXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNYXBwaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmZhY2V0O1xuICB9XG59XG4iXX0=