import * as tslib_1 from "tslib";
import { COLUMN, ROW } from '../channel';
import { reduce } from '../encoding';
import { normalize, title as fieldDefTitle, vgField } from '../fielddef';
import * as log from '../log';
import { hasDiscreteDomain } from '../scale';
import { contains } from '../util';
import { isVgRangeStep } from '../vega.schema';
import { assembleAxis } from './axis/assemble';
import { buildModel } from './buildmodel';
import { assembleFacetData } from './data/assemble';
import { parseData } from './data/parse';
import { getHeaderType } from './layout/header';
import { parseChildrenLayoutSize } from './layoutsize/parse';
import { ModelWithField } from './model';
import { replaceRepeaterInFacet } from './repeater';
import { parseGuideResolve } from './resolve';
import { assembleDomain, getFieldFromDomain } from './scale/domain';
var FacetModel = /** @class */ (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, spec.resolve) || this;
        _this.type = 'facet';
        _this.child = buildModel(spec.spec, _this, _this.getName('child'), undefined, repeater, config, false);
        _this.children = [_this.child];
        var facet = replaceRepeaterInFacet(spec.facet, repeater);
        _this.facet = _this.initFacet(facet);
        return _this;
    }
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        return reduce(facet, function (normalizedFacet, fieldDef, channel) {
            if (!contains([ROW, COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                return normalizedFacet;
            }
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                return normalizedFacet;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            normalizedFacet[channel] = normalize(fieldDef, channel);
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
        this.component.data = parseData(this);
        this.child.parseData();
    };
    FacetModel.prototype.parseLayoutSize = function () {
        parseChildrenLayoutSize(this);
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
                header.title !== undefined ? header.title : fieldDefTitle(fieldDef, this.config);
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
            resolve.axis[channel] = parseGuideResolve(resolve, channel);
            if (resolve.axis[channel] === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = layoutHeaders[headerChannel];
                for (var _i = 0, _b = child.component.axes[channel]; _i < _b.length; _i++) {
                    var axisComponent = _b[_i];
                    var headerType = getHeaderType(axisComponent.get('orient'));
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    var mainAxis = assembleAxis(axisComponent, 'main', this.config, { header: true });
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
                        columns: { field: vgField(this.facet.column, { prefix: 'distinct' }) }
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
                fields.push(vgField(this.child.facet.column));
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
                    if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                        var domain = assembleDomain(this.child, channel);
                        var field = getFieldFromDomain(domain);
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
        var data = assembleFacetData(facetRoot);
        // If we facet by two dimensions, we need to add a cross operator to the aggregation
        // so that we create all groups
        var hasRow = this.channelHasField(ROW);
        var hasColumn = this.channelHasField(COLUMN);
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
                facet: tslib_1.__assign({ name: facetRoot.name, data: facetRoot.data, groupby: [].concat(hasRow ? [this.vgField(ROW)] : [], hasColumn ? [this.vgField(COLUMN)] : []) }, aggregateMixins)
            }, sort: {
                field: [].concat(hasRow ? [this.vgField(ROW, { expr: 'datum', })] : [], hasColumn ? [this.vgField(COLUMN, { expr: 'datum' })] : []),
                order: [].concat(hasRow ? [(facet.row.sort) || 'ascending'] : [], hasColumn ? [(facet.column.sort) || 'ascending'] : [])
            } }, (data.length > 0 ? { data: data } : {}), (layoutSizeEncodeEntry ? { encode: { update: layoutSizeEncodeEntry } } : {}), child.assembleGroup());
        return [markGroup];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    return FacetModel;
}(ModelWithField));
export { FacetModel };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxFQUFVLE1BQU0sRUFBRSxHQUFHLEVBQWUsTUFBTSxZQUFZLENBQUM7QUFFOUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVuQyxPQUFPLEVBQVcsU0FBUyxFQUFFLEtBQUssSUFBSSxhQUFhLEVBQUUsT0FBTyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pGLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUUzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxhQUFhLEVBQTBELE1BQU0sZ0JBQWdCLENBQUM7QUFDdEcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDeEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsYUFBYSxFQUFpQyxNQUFNLGlCQUFpQixDQUFDO0FBQzlFLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzNELE9BQU8sRUFBUSxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDOUMsT0FBTyxFQUFnQixzQkFBc0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNqRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDNUMsT0FBTyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWxFO0lBQWdDLHNDQUFj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cnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7Q2hhbm5lbCwgQ09MVU1OLCBST1csIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZhY2V0TWFwcGluZ30gZnJvbSAnLi4vZmFjZXQnO1xuaW1wb3J0IHtGaWVsZERlZiwgbm9ybWFsaXplLCB0aXRsZSBhcyBmaWVsZERlZlRpdGxlLCB2Z0ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7Tm9ybWFsaXplZEZhY2V0U3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7aXNWZ1JhbmdlU3RlcCwgUm93Q29sLCBWZ0F4aXMsIFZnRGF0YSwgVmdMYXlvdXQsIFZnTWFya0dyb3VwLCBWZ1NpZ25hbH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHthc3NlbWJsZUF4aXN9IGZyb20gJy4vYXhpcy9hc3NlbWJsZSc7XG5pbXBvcnQge2J1aWxkTW9kZWx9IGZyb20gJy4vYnVpbGRtb2RlbCc7XG5pbXBvcnQge2Fzc2VtYmxlRmFjZXREYXRhfSBmcm9tICcuL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtwYXJzZURhdGF9IGZyb20gJy4vZGF0YS9wYXJzZSc7XG5pbXBvcnQge2dldEhlYWRlclR5cGUsIEhlYWRlckNoYW5uZWwsIEhlYWRlckNvbXBvbmVudH0gZnJvbSAnLi9sYXlvdXQvaGVhZGVyJztcbmltcG9ydCB7cGFyc2VDaGlsZHJlbkxheW91dFNpemV9IGZyb20gJy4vbGF5b3V0c2l6ZS9wYXJzZSc7XG5pbXBvcnQge01vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWUsIHJlcGxhY2VSZXBlYXRlckluRmFjZXR9IGZyb20gJy4vcmVwZWF0ZXInO1xuaW1wb3J0IHtwYXJzZUd1aWRlUmVzb2x2ZX0gZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi9zY2FsZS9kb21haW4nO1xuXG5leHBvcnQgY2xhc3MgRmFjZXRNb2RlbCBleHRlbmRzIE1vZGVsV2l0aEZpZWxkIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6ICdmYWNldCcgPSAnZmFjZXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+O1xuXG4gIHB1YmxpYyByZWFkb25seSBjaGlsZDogTW9kZWw7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNoaWxkcmVuOiBNb2RlbFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IE5vcm1hbGl6ZWRGYWNldFNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzcGVjLCBwYXJlbnQsIHBhcmVudEdpdmVuTmFtZSwgY29uZmlnLCByZXBlYXRlciwgc3BlYy5yZXNvbHZlKTtcblxuXG4gICAgdGhpcy5jaGlsZCA9IGJ1aWxkTW9kZWwoc3BlYy5zcGVjLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2NoaWxkJyksIHVuZGVmaW5lZCwgcmVwZWF0ZXIsIGNvbmZpZywgZmFsc2UpO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbdGhpcy5jaGlsZF07XG5cbiAgICBjb25zdCBmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZz4gPSByZXBsYWNlUmVwZWF0ZXJJbkZhY2V0KHNwZWMuZmFjZXQsIHJlcGVhdGVyKTtcblxuICAgIHRoaXMuZmFjZXQgPSB0aGlzLmluaXRGYWNldChmYWNldCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRGYWNldChmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZz4pOiBGYWNldE1hcHBpbmc8c3RyaW5nPiB7XG4gICAgLy8gY2xvbmUgdG8gcHJldmVudCBzaWRlIGVmZmVjdCB0byB0aGUgb3JpZ2luYWwgc3BlY1xuICAgIHJldHVybiByZWR1Y2UoZmFjZXQsIGZ1bmN0aW9uKG5vcm1hbGl6ZWRGYWNldCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGlmICghY29udGFpbnMoW1JPVywgQ09MVU1OXSwgY2hhbm5lbCkpIHtcbiAgICAgICAgLy8gRHJvcCB1bnN1cHBvcnRlZCBjaGFubmVsXG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoY2hhbm5lbCwgJ2ZhY2V0JykpO1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGREZWYuZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5lbXB0eUZpZWxkRGVmKGZpZWxkRGVmLCBjaGFubmVsKSk7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkRmFjZXQ7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbnZlcnQgdHlwZSB0byBmdWxsLCBsb3dlcmNhc2UgdHlwZSwgb3IgYXVnbWVudCB0aGUgZmllbGREZWYgd2l0aCBhIGRlZmF1bHQgdHlwZSBpZiBtaXNzaW5nLlxuICAgICAgbm9ybWFsaXplZEZhY2V0W2NoYW5uZWxdID0gbm9ybWFsaXplKGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgICAgIHJldHVybiBub3JtYWxpemVkRmFjZXQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHVibGljIGNoYW5uZWxIYXNGaWVsZChjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5mYWNldFtjaGFubmVsXTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZERlZihjaGFubmVsOiBDaGFubmVsKTogRmllbGREZWY8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZmFjZXRbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgcGFyc2VEYXRhKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmRhdGEgPSBwYXJzZURhdGEodGhpcyk7XG4gICAgdGhpcy5jaGlsZC5wYXJzZURhdGEoKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUxheW91dFNpemUoKSB7XG4gICAgcGFyc2VDaGlsZHJlbkxheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgLy8gQXMgYSBmYWNldCBoYXMgYSBzaW5nbGUgY2hpbGQsIHRoZSBzZWxlY3Rpb24gY29tcG9uZW50cyBhcmUgdGhlIHNhbWUuXG4gICAgLy8gVGhlIGNoaWxkIG1haW50YWlucyBpdHMgc2VsZWN0aW9ucyB0byBhc3NlbWJsZSBzaWduYWxzLCB3aGljaCByZW1haW5cbiAgICAvLyB3aXRoaW4gaXRzIHVuaXQuXG4gICAgdGhpcy5jaGlsZC5wYXJzZVNlbGVjdGlvbigpO1xuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHRoaXMuY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZU1hcmtHcm91cCgpIHtcbiAgICB0aGlzLmNoaWxkLnBhcnNlTWFya0dyb3VwKCk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIHRoaXMuY2hpbGQucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICB0aGlzLnBhcnNlSGVhZGVyKCdjb2x1bW4nKTtcbiAgICB0aGlzLnBhcnNlSGVhZGVyKCdyb3cnKTtcblxuICAgIHRoaXMubWVyZ2VDaGlsZEF4aXMoJ3gnKTtcbiAgICB0aGlzLm1lcmdlQ2hpbGRBeGlzKCd5Jyk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSGVhZGVyKGNoYW5uZWw6IEhlYWRlckNoYW5uZWwpIHtcblxuICAgIGlmICh0aGlzLmNoYW5uZWxIYXNGaWVsZChjaGFubmVsKSkge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZhY2V0W2NoYW5uZWxdO1xuICAgICAgY29uc3QgaGVhZGVyID0gZmllbGREZWYuaGVhZGVyIHx8IHt9O1xuICAgICAgbGV0IHRpdGxlID0gZmllbGREZWYudGl0bGUgIT09IHVuZGVmaW5lZCA/IGZpZWxkRGVmLnRpdGxlIDpcbiAgICAgICAgaGVhZGVyLnRpdGxlICE9PSB1bmRlZmluZWQgPyBoZWFkZXIudGl0bGUgOiBmaWVsZERlZlRpdGxlKGZpZWxkRGVmLCB0aGlzLmNvbmZpZyk7XG5cbiAgICAgIGlmICh0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlKSB7XG4gICAgICAgIC8vIG1lcmdlIHRpdGxlIHdpdGggY2hpbGQgdG8gcHJvZHVjZSBcIlRpdGxlIC8gU3VidGl0bGUgLyBTdWItc3VidGl0bGVcIlxuICAgICAgICB0aXRsZSArPSAnIC8gJyArIHRoaXMuY2hpbGQuY29tcG9uZW50LmxheW91dEhlYWRlcnNbY2hhbm5lbF0udGl0bGU7XG4gICAgICAgIHRoaXMuY2hpbGQuY29tcG9uZW50LmxheW91dEhlYWRlcnNbY2hhbm5lbF0udGl0bGUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdID0ge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgZmFjZXRGaWVsZERlZjogZmllbGREZWYsXG4gICAgICAgIC8vIFRPRE86IHN1cHBvcnQgYWRkaW5nIGxhYmVsIHRvIGZvb3RlciBhcyB3ZWxsXG4gICAgICAgIGhlYWRlcjogW3RoaXMubWFrZUhlYWRlckNvbXBvbmVudChjaGFubmVsLCB0cnVlKV1cbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYWtlSGVhZGVyQ29tcG9uZW50KGNoYW5uZWw6IEhlYWRlckNoYW5uZWwsIGxhYmVsczogYm9vbGVhbik6IEhlYWRlckNvbXBvbmVudCB7XG4gICAgY29uc3Qgc2l6ZVR5cGUgPSBjaGFubmVsID09PSAncm93JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHJldHVybiB7XG4gICAgICBsYWJlbHMsXG4gICAgICBzaXplU2lnbmFsOiB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSkgPyB0aGlzLmNoaWxkLmdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGUpIDogdW5kZWZpbmVkLFxuICAgICAgYXhlczogW11cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZUNoaWxkQXhpcyhjaGFubmVsOiAneCcgfCAneScpIHtcbiAgICBjb25zdCB7Y2hpbGR9ID0gdGhpcztcbiAgICBpZiAoY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgIGNvbnN0IHtsYXlvdXRIZWFkZXJzLCByZXNvbHZlfSA9IHRoaXMuY29tcG9uZW50O1xuICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gcGFyc2VHdWlkZVJlc29sdmUocmVzb2x2ZSwgY2hhbm5lbCk7XG5cbiAgICAgIGlmIChyZXNvbHZlLmF4aXNbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIC8vIEZvciBzaGFyZWQgYXhpcywgbW92ZSB0aGUgYXhlcyB0byBmYWNldCdzIGhlYWRlciBvciBmb290ZXJcbiAgICAgICAgY29uc3QgaGVhZGVyQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICd4JyA/ICdjb2x1bW4nIDogJ3Jvdyc7XG5cbiAgICAgICAgY29uc3QgbGF5b3V0SGVhZGVyID0gbGF5b3V0SGVhZGVyc1toZWFkZXJDaGFubmVsXTtcbiAgICAgICAgZm9yIChjb25zdCBheGlzQ29tcG9uZW50IG9mIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVyVHlwZSA9IGdldEhlYWRlclR5cGUoYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpKTtcbiAgICAgICAgICBsYXlvdXRIZWFkZXJbaGVhZGVyVHlwZV0gPSBsYXlvdXRIZWFkZXJbaGVhZGVyVHlwZV0gfHxcbiAgICAgICAgICBbdGhpcy5tYWtlSGVhZGVyQ29tcG9uZW50KGhlYWRlckNoYW5uZWwsIGZhbHNlKV07XG5cbiAgICAgICAgICBjb25zdCBtYWluQXhpcyA9IGFzc2VtYmxlQXhpcyhheGlzQ29tcG9uZW50LCAnbWFpbicsIHRoaXMuY29uZmlnLCB7aGVhZGVyOiB0cnVlfSk7XG4gICAgICAgICAgLy8gTGF5b3V0SGVhZGVyIG5vIGxvbmdlciBrZWVwIHRyYWNrIG9mIHByb3BlcnR5IHByZWNlZGVuY2UsIHRodXMgbGV0J3MgY29tYmluZS5cbiAgICAgICAgICBsYXlvdXRIZWFkZXJbaGVhZGVyVHlwZV1bMF0uYXhlcy5wdXNoKG1haW5BeGlzKTtcbiAgICAgICAgICBheGlzQ29tcG9uZW50Lm1haW5FeHRyYWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UgZG8gbm90aGluZyBmb3IgaW5kZXBlbmRlbnQgYXhlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzOiBhbnlbXSk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICB0aGlzLmNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGF0YTogVmdEYXRhW10pOiBWZ0RhdGFbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRMYXlvdXRCYW5kTWl4aW5zKGhlYWRlclR5cGU6ICdoZWFkZXInIHwgJ2Zvb3RlcicpOiB7XG4gICAgaGVhZGVyQmFuZD86IFJvd0NvbDxudW1iZXI+LFxuICAgIGZvb3RlckJhbmQ/OiBSb3dDb2w8bnVtYmVyPlxuICB9IHtcbiAgICBjb25zdCBiYW5kTWl4aW5zID0ge307XG5cbiAgICBjb25zdCBiYW5kVHlwZSA9IGhlYWRlclR5cGUgPT09ICdoZWFkZXInID8gJ2hlYWRlckJhbmQnIDogJ2Zvb3RlckJhbmQnO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsncm93JywgJ2NvbHVtbiddIGFzICgncm93JyB8ICdjb2x1bW4nKVtdKSB7XG4gICAgICBjb25zdCBsYXlvdXRIZWFkZXJDb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdO1xuICAgICAgY29uc3QgaGVhZGVyQ29tcG9uZW50ID0gbGF5b3V0SGVhZGVyQ29tcG9uZW50W2hlYWRlclR5cGVdO1xuICAgICAgaWYgKGhlYWRlckNvbXBvbmVudCAmJiBoZWFkZXJDb21wb25lbnRbMF0pIHtcbiAgICAgICAgY29uc3Qgc2l6ZVR5cGUgPSBjaGFubmVsID09PSAncm93JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgICAgICBpZiAoIXRoaXMuY2hpbGQuY29tcG9uZW50LmxheW91dFNpemUuZ2V0KHNpemVUeXBlKSkge1xuICAgICAgICAgIC8vIElmIGZhY2V0IGNoaWxkIGRvZXMgbm90IGhhdmUgc2l6ZSBzaWduYWwsIHRoZW4gYXBwbHkgaGVhZGVyQmFuZFxuICAgICAgICAgIGJhbmRNaXhpbnNbYmFuZFR5cGVdID0gYmFuZE1peGluc1tiYW5kVHlwZV0gfHwge307XG4gICAgICAgICAgYmFuZE1peGluc1tiYW5kVHlwZV1bY2hhbm5lbF0gPSAwLjU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJhbmRNaXhpbnM7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQge1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmNoYW5uZWxIYXNGaWVsZCgnY29sdW1uJykgPyB0aGlzLmNvbHVtbkRpc3RpbmN0U2lnbmFsKCkgOiAxO1xuXG4gICAgLy8gVE9ETzogZGV0ZXJtaW5lIGRlZmF1bHQgYWxpZ24gYmFzZWQgb24gc2hhcmVkIC8gaW5kZXBlbmRlbnQgc2NhbGVzXG5cbiAgICByZXR1cm4ge1xuICAgICAgcGFkZGluZzoge3JvdzogMTAsIGNvbHVtbjogMTB9LFxuICAgICAgLi4udGhpcy5nZXRMYXlvdXRCYW5kTWl4aW5zKCdoZWFkZXInKSxcbiAgICAgIC4uLnRoaXMuZ2V0TGF5b3V0QmFuZE1peGlucygnZm9vdGVyJyksXG5cbiAgICAgIC8vIFRPRE86IHN1cHBvcnQgb2Zmc2V0IGZvciByb3dIZWFkZXIvcm93Rm9vdGVyL3Jvd1RpdGxlL2NvbHVtbkhlYWRlci9jb2x1bW5Gb290ZXIvY29sdW1uVGl0bGVcbiAgICAgIG9mZnNldDogMTAsXG4gICAgICBjb2x1bW5zLFxuICAgICAgYm91bmRzOiAnZnVsbCcsXG4gICAgICBhbGlnbjogJ2FsbCdcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICAvLyBGSVhNRShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzExOTMpOiB0aGlzIGNhbiBiZSBpbmNvcnJlY3QgaWYgd2UgaGF2ZSBpbmRlcGVuZGVudCBzY2FsZXMuXG4gICAgcmV0dXJuIHRoaXMuY2hpbGQuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk7XG4gIH1cblxuICBwcml2YXRlIGNvbHVtbkRpc3RpbmN0U2lnbmFsKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAmJiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBGYWNldE1vZGVsKSkge1xuICAgICAgLy8gRm9yIG5lc3RlZCBmYWNldCwgd2Ugd2lsbCBhZGQgY29sdW1ucyB0byBncm91cCBtYXJrIGluc3RlYWRcbiAgICAgIC8vIFNlZSBkaXNjdXNzaW9uIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EvaXNzdWVzLzk1MlxuICAgICAgLy8gYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2Etdmlldy9yZWxlYXNlcy90YWcvdjEuMi42XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbiBmYWNldE5vZGUuYXNzZW1ibGUoKSwgdGhlIG5hbWUgaXMgYWx3YXlzIHRoaXMuZ2V0TmFtZSgnY29sdW1uJykgKyAnX2xheW91dCcuXG4gICAgICBjb25zdCBmYWNldExheW91dERhdGFOYW1lID0gdGhpcy5nZXROYW1lKCdjb2x1bW5fZG9tYWluJyk7XG4gICAgICByZXR1cm4ge3NpZ25hbDogYGxlbmd0aChkYXRhKCcke2ZhY2V0TGF5b3V0RGF0YU5hbWV9JykpYH07XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlR3JvdXAoc2lnbmFsczogVmdTaWduYWxbXSkge1xuICAgIGlmICh0aGlzLnBhcmVudCAmJiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBGYWNldE1vZGVsKSkge1xuICAgICAgLy8gUHJvdmlkZSBudW1iZXIgb2YgY29sdW1ucyBmb3IgbGF5b3V0LlxuICAgICAgLy8gU2VlIGRpc2N1c3Npb24gaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS9pc3N1ZXMvOTUyXG4gICAgICAvLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS12aWV3L3JlbGVhc2VzL3RhZy92MS4yLjZcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLih0aGlzLmNoYW5uZWxIYXNGaWVsZCgnY29sdW1uJykgPyB7XG4gICAgICAgICAgZW5jb2RlOiB7XG4gICAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgICAgLy8gVE9ETyhodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI3NTkpOlxuICAgICAgICAgICAgICAvLyBDb3JyZWN0IHRoZSBzaWduYWwgZm9yIGZhY2V0IG9mIGNvbmNhdCBvZiBmYWNldF9jb2x1bW5cbiAgICAgICAgICAgICAgY29sdW1uczoge2ZpZWxkOiB2Z0ZpZWxkKHRoaXMuZmFjZXQuY29sdW1uLCB7cHJlZml4OiAnZGlzdGluY3QnfSl9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IDoge30pLFxuICAgICAgICAuLi5zdXBlci5hc3NlbWJsZUdyb3VwKHNpZ25hbHMpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuYXNzZW1ibGVHcm91cChzaWduYWxzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGUgY2FyZGluYWxpdHkgZm9yIGNhbGN1bGF0aW5nIHNpemVcbiAgICovXG4gIHByaXZhdGUgZ2V0Q2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZCgpIHtcbiAgICBjb25zdCBmaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3Qgb3BzOiBBZ2dyZWdhdGVPcFtdID0gW107XG4gICAgaWYgKHRoaXMuY2hpbGQgaW5zdGFuY2VvZiBGYWNldE1vZGVsKSB7XG4gICAgICBpZiAodGhpcy5jaGlsZC5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpKSB7XG4gICAgICAgIGZpZWxkcy5wdXNoKHZnRmllbGQodGhpcy5jaGlsZC5mYWNldC5jb2x1bW4pKTtcbiAgICAgICAgb3BzLnB1c2goJ2Rpc3RpbmN0Jyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIFNjYWxlQ2hhbm5lbFtdKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkU2NhbGVDb21wb25lbnQgPSB0aGlzLmNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICAgIGlmIChjaGlsZFNjYWxlQ29tcG9uZW50ICYmICFjaGlsZFNjYWxlQ29tcG9uZW50Lm1lcmdlZCkge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBjaGlsZFNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgICAgICBpZiAoaGFzRGlzY3JldGVEb21haW4odHlwZSkgJiYgaXNWZ1JhbmdlU3RlcChyYW5nZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMuY2hpbGQsIGNoYW5uZWwpO1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluKTtcbiAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgIG9wcy5wdXNoKCdkaXN0aW5jdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbG9nLndhcm4oJ1Vua25vd24gZmllbGQgZm9yICR7Y2hhbm5lbH0uICBDYW5ub3QgY2FsY3VsYXRlIHZpZXcgc2l6ZS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcy5sZW5ndGggPyB7ZmllbGRzLCBvcHN9IDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTWFya3MoKTogVmdNYXJrR3JvdXBbXSB7XG4gICAgY29uc3Qge2NoaWxkLCBmYWNldH0gPSB0aGlzO1xuICAgIGNvbnN0IGZhY2V0Um9vdCA9IHRoaXMuY29tcG9uZW50LmRhdGEuZmFjZXRSb290O1xuICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZUZhY2V0RGF0YShmYWNldFJvb3QpO1xuXG4gICAgLy8gSWYgd2UgZmFjZXQgYnkgdHdvIGRpbWVuc2lvbnMsIHdlIG5lZWQgdG8gYWRkIGEgY3Jvc3Mgb3BlcmF0b3IgdG8gdGhlIGFnZ3JlZ2F0aW9uXG4gICAgLy8gc28gdGhhdCB3ZSBjcmVhdGUgYWxsIGdyb3Vwc1xuICAgIGNvbnN0IGhhc1JvdyA9IHRoaXMuY2hhbm5lbEhhc0ZpZWxkKFJPVyk7XG4gICAgY29uc3QgaGFzQ29sdW1uID0gdGhpcy5jaGFubmVsSGFzRmllbGQoQ09MVU1OKTtcbiAgICBjb25zdCBsYXlvdXRTaXplRW5jb2RlRW50cnkgPSBjaGlsZC5hc3NlbWJsZUxheW91dFNpemUoKTtcblxuICAgIGNvbnN0IGFnZ3JlZ2F0ZU1peGluczogYW55ID0ge307XG4gICAgaWYgKGhhc1JvdyAmJiBoYXNDb2x1bW4pIHtcbiAgICAgIGFnZ3JlZ2F0ZU1peGlucy5hZ2dyZWdhdGUgPSB7Y3Jvc3M6IHRydWV9O1xuICAgIH1cbiAgICBjb25zdCBjYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkID0gdGhpcy5nZXRDYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkKCk7XG4gICAgaWYgKGNhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGQpIHtcbiAgICAgIGFnZ3JlZ2F0ZU1peGlucy5hZ2dyZWdhdGUgPSB7XG4gICAgICAgIC4uLmFnZ3JlZ2F0ZU1peGlucy5hZ2dyZWdhdGUsXG4gICAgICAgIC4uLmNhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBjaGlsZC5hc3NlbWJsZVRpdGxlKCk7XG4gICAgY29uc3Qgc3R5bGUgPSBjaGlsZC5hc3NlbWJsZUdyb3VwU3R5bGUoKTtcblxuICAgIGNvbnN0IG1hcmtHcm91cCA9IHtcbiAgICAgIG5hbWU6IHRoaXMuZ2V0TmFtZSgnY2VsbCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIC4uLih0aXRsZT8ge3RpdGxlfSA6IHt9KSxcbiAgICAgIC4uLihzdHlsZT8ge3N0eWxlfSA6IHt9KSxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBmYWNldFJvb3QubmFtZSxcbiAgICAgICAgICBkYXRhOiBmYWNldFJvb3QuZGF0YSxcbiAgICAgICAgICBncm91cGJ5OiBbXS5jb25jYXQoXG4gICAgICAgICAgICBoYXNSb3cgPyBbdGhpcy52Z0ZpZWxkKFJPVyldIDogW10sXG4gICAgICAgICAgICBoYXNDb2x1bW4gPyBbdGhpcy52Z0ZpZWxkKENPTFVNTildIDogW11cbiAgICAgICAgICApLFxuICAgICAgICAgIC4uLmFnZ3JlZ2F0ZU1peGluc1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogW10uY29uY2F0KFxuICAgICAgICAgIGhhc1JvdyA/IFt0aGlzLnZnRmllbGQoUk9XLCB7ZXhwcjogJ2RhdHVtJyx9KV0gOiBbXSxcbiAgICAgICAgICBoYXNDb2x1bW4gPyBbdGhpcy52Z0ZpZWxkKENPTFVNTiwge2V4cHI6ICdkYXR1bSd9KV0gOiBbXVxuICAgICAgICApLFxuICAgICAgICBvcmRlcjogW10uY29uY2F0KFxuICAgICAgICAgIGhhc1JvdyA/IFsgKGZhY2V0LnJvdy5zb3J0KSB8fCAnYXNjZW5kaW5nJ10gOiBbXSxcbiAgICAgICAgICBoYXNDb2x1bW4gPyBbIChmYWNldC5jb2x1bW4uc29ydCkgfHwgJ2FzY2VuZGluZyddIDogW11cbiAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIC4uLihkYXRhLmxlbmd0aCA+IDAgPyB7ZGF0YTogZGF0YX0gOiB7fSksXG4gICAgICAuLi4obGF5b3V0U2l6ZUVuY29kZUVudHJ5ID8ge2VuY29kZToge3VwZGF0ZTogbGF5b3V0U2l6ZUVuY29kZUVudHJ5fX0gOiB7fSksXG4gICAgICAuLi5jaGlsZC5hc3NlbWJsZUdyb3VwKClcbiAgICB9O1xuXG4gICAgcmV0dXJuIFttYXJrR3JvdXBdO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1hcHBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmFjZXQ7XG4gIH1cbn1cbiJdfQ==