"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var config_1 = require("../config");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var rules_1 = require("./axis/rules");
var common_1 = require("./common");
var data_1 = require("./data/data");
var layout_1 = require("./layout");
var model_1 = require("./model");
var init_1 = require("./scale/init");
var parse_2 = require("./scale/parse");
/**
 * Prefix for special data sources for driving column's axis group.
 */
exports.COLUMN_AXES_DATA_PREFIX = 'column-';
/**
 * Prefix for special data sources for driving row's axis group.
 */
exports.ROW_AXES_DATA_PREFIX = 'row-';
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.stack = null;
        _this._spacing = {};
        // Config must be initialized before child as it gets cascaded to the child
        var config = _this.config = _this.initConfig(spec.config, parent);
        var child = _this.child = common_1.buildModel(spec.spec, _this, _this.getName('child'));
        _this.children = [child];
        var facet = _this.facet = _this.initFacet(spec.facet);
        _this.scales = _this.initScalesAndSpacing(facet, config);
        _this.axes = _this.initAxis(facet, config, child);
        _this.legends = {};
        return _this;
    }
    FacetModel.prototype.initConfig = function (specConfig, parent) {
        return util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), parent ? parent.config : {}, specConfig);
    };
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        facet = util_1.duplicate(facet);
        encoding_1.forEach(facet, function (fieldDef, channel) {
            if (!util_1.contains([channel_1.ROW, channel_1.COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                delete facet[channel];
                return;
            }
            // TODO: array of row / column ?
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                delete facet[channel];
                return;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            fielddef_1.normalize(fieldDef, channel);
        });
        return facet;
    };
    FacetModel.prototype.initScalesAndSpacing = function (facet, config) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_scale, channel) {
            if (facet[channel]) {
                _scale[channel] = init_1.default(channel, facet[channel], config, undefined, // Facet doesn't have one single mark
                undefined, // TODO(#1647): support width / height here
                [] // There is no xyRangeSteps here and there is no need to input
                );
                model._spacing[channel] = spacing(facet[channel].scale || {}, model, config);
            }
            return _scale;
        }, {});
    };
    FacetModel.prototype.initAxis = function (facet, config, child) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_axis, channel) {
            if (facet[channel]) {
                var axisSpec = facet[channel].axis;
                if (axisSpec !== false) {
                    var modelAxis = _axis[channel] = tslib_1.__assign({}, axisSpec);
                    if (channel === channel_1.ROW) {
                        var yAxis = child.axis(channel_1.Y);
                        if (yAxis && yAxis.orient !== 'right' && !modelAxis.orient) {
                            modelAxis.orient = 'right';
                        }
                        if (model.hasDescendantWithFieldOnChannel(channel_1.X) && !modelAxis.labelAngle) {
                            modelAxis.labelAngle = modelAxis.orient === 'right' ? 90 : 270;
                        }
                    }
                }
            }
            return _axis;
        }, {});
    };
    FacetModel.prototype.channelHasField = function (channel) {
        return !!this.facet[channel];
    };
    FacetModel.prototype.hasSummary = function () {
        var summary = this.component.data.summary;
        for (var _i = 0, summary_1 = summary; _i < summary_1.length; _i++) {
            var s = summary_1[_i];
            if (util_1.keys(s.measures).length > 0) {
                return true;
            }
        }
        return false;
    };
    FacetModel.prototype.facetedTable = function () {
        // FIXME: revise if the suffix should be 'data'
        return 'faceted-' + this.getName('data');
    };
    FacetModel.prototype.dataTable = function () {
        // FIXME: shouldn't we apply data renaming here?
        if (this.component.data.stack) {
            return 'stacked';
        }
        if (this.hasSummary()) {
            return 'summary';
        }
        return 'source';
    };
    FacetModel.prototype.fieldDef = function (channel) {
        return this.facet[channel];
    };
    FacetModel.prototype.parseData = function () {
        this.child.parseData();
        this.component.data = data_1.parseFacetData(this);
    };
    FacetModel.prototype.parseSelection = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    FacetModel.prototype.parseLayoutData = function () {
        this.child.parseLayoutData();
        this.component.layout = layout_1.parseFacetLayout(this);
    };
    FacetModel.prototype.parseScale = function () {
        var child = this.child;
        var model = this;
        child.parseScale();
        // TODO: support scales for field reference of parent data (e.g., for SPLOM)
        // First, add scale for row and column.
        var scaleComponent = this.component.scales = parse_2.default(this);
        // Then, move shared/union from its child spec.
        util_1.keys(child.component.scales).forEach(function (channel) {
            // TODO: correctly implement independent scale
            if (true) {
                var scale = scaleComponent[channel] = child.component.scales[channel];
                var scaleNameWithoutPrefix = scale.name.substr(child.getName('').length);
                var newName = model.scaleName(scaleNameWithoutPrefix, true);
                child.renameScale(scale.name, newName);
                scale.name = newName;
                // Once put in parent, just remove the child's scale.
                delete child.component.scales[channel];
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child.parseMark();
        this.component.mark = util_1.extend({
            name: this.getName('cell'),
            type: 'group',
            from: util_1.extend({
                facet: {
                    name: this.facetedTable(),
                    data: this.dataTable(),
                    groupby: [].concat(this.channelHasField(channel_1.ROW) ? [this.field(channel_1.ROW)] : [], this.channelHasField(channel_1.COLUMN) ? [this.field(channel_1.COLUMN)] : [])
                }
            }),
            encode: {
                update: getFacetGroupProperties(this)
            }
        }, 
        // FIXME: move this call to assembleMarks()
        // Call child's assembleGroup to add marks, scales, axes, and legends.
        // Note that we can call child's assembleGroup() here because parseMark()
        // is the last method in compile() and thus the child is completely compiled
        // at this point.
        this.child.assembleGroup());
    };
    FacetModel.prototype.parseAxis = function () {
        this.child.parseAxis();
        this.component.axes = parse_1.parseAxisComponent(this, [channel_1.ROW, channel_1.COLUMN]);
    };
    FacetModel.prototype.parseAxisGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child.parseAxisGroup();
        var xAxisGroup = parseAxisGroups(this, channel_1.X);
        var yAxisGroup = parseAxisGroups(this, channel_1.Y);
        this.component.axisGroups = util_1.extend(xAxisGroup ? { x: xAxisGroup } : {}, yAxisGroup ? { y: yAxisGroup } : {});
    };
    FacetModel.prototype.parseGridGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child.parseGridGroup();
        var child = this.child;
        this.component.gridGroups = util_1.extend(!child.channelHasField(channel_1.X) && this.channelHasField(channel_1.COLUMN) ? { column: getColumnGridGroups(this) } : {}, !child.channelHasField(channel_1.Y) && this.channelHasField(channel_1.ROW) ? { row: getRowGridGroups(this) } : {});
    };
    FacetModel.prototype.parseLegend = function () {
        this.child.parseLegend();
        // TODO: support legend for independent non-position scale across facets
        // TODO: support legend for field reference of parent data (e.g., for SPLOM)
        // For now, assuming that non-positional scales are always shared across facets
        // Thus, just move all legends from its child
        this.component.legends = this.child.component.legends;
        this.child.component.legends = {};
    };
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    FacetModel.prototype.assembleSignals = function (signals) {
        return [];
    };
    FacetModel.prototype.assembleSelectionData = function (data) {
        return [];
    };
    FacetModel.prototype.assembleData = function (data) {
        // Prefix traversal – parent data might be referred by children data
        data_1.assembleData(this, data);
        this.child.assembleData(data);
        assembleAxesGroupData(this, data);
        return data;
    };
    FacetModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this.child.assembleLayout(layoutData);
        return layout_1.assembleLayout(this, layoutData);
    };
    FacetModel.prototype.assembleMarks = function () {
        return [].concat(
        // axisGroup is a mapping to VgMarkGroup
        util_1.vals(this.component.axisGroups), util_1.flatten(util_1.vals(this.component.gridGroups)), this.component.mark);
    };
    FacetModel.prototype.channels = function () {
        return [channel_1.ROW, channel_1.COLUMN];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    FacetModel.prototype.spacing = function (channel) {
        return this._spacing[channel];
    };
    FacetModel.prototype.isFacet = function () {
        return true;
    };
    return FacetModel;
}(model_1.Model));
exports.FacetModel = FacetModel;
function hasSubPlotWithXy(model) {
    return model.hasDescendantWithFieldOnChannel('x') ||
        model.hasDescendantWithFieldOnChannel('y');
}
exports.hasSubPlotWithXy = hasSubPlotWithXy;
function spacing(scale, model, config) {
    if (scale.spacing !== undefined) {
        return scale.spacing;
    }
    if (!hasSubPlotWithXy(model)) {
        // If there is no subplot with x/y, it's a simple table so there should be no spacing.
        return 0;
    }
    return config.scale.facetSpacing;
}
exports.spacing = spacing;
function getFacetGroupProperties(model) {
    var child = model.child;
    var mergedCellConfig = util_1.extend({}, child.config.cell, child.config.facet.cell);
    return util_1.extend({
        x: model.channelHasField(channel_1.COLUMN) ? {
            scale: model.scaleName(channel_1.COLUMN),
            field: model.field(channel_1.COLUMN),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.COLUMN) / 2
        } : { value: model.config.scale.facetSpacing / 2 },
        y: model.channelHasField(channel_1.ROW) ? {
            scale: model.scaleName(channel_1.ROW),
            field: model.field(channel_1.ROW),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.ROW) / 2
        } : { value: model.config.scale.facetSpacing / 2 },
        width: { field: { parent: model.child.sizeName('width') } },
        height: { field: { parent: model.child.sizeName('height') } }
    }, hasSubPlotWithXy(model) ? child.assembleParentGroupProperties(mergedCellConfig) : {});
}
// TODO: move the rest of the file src/compile/facet/*.ts
/**
 * Add data for driving row/column axes when there are both row and column
 * Note that we don't have to deal with these in the parse step at all
 * because these items never get merged with any other items.
 */
function assembleAxesGroupData(model, data) {
    if (model.facet.column) {
        data.push({
            name: exports.COLUMN_AXES_DATA_PREFIX + model.dataTable(),
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.COLUMN)]
                }]
        });
    }
    if (model.facet.row) {
        data.push({
            name: exports.ROW_AXES_DATA_PREFIX + model.dataTable(),
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.ROW)]
                }]
        });
    }
    return data;
}
exports.assembleAxesGroupData = assembleAxesGroupData;
function parseAxisGroups(model, channel) {
    // TODO: add a case where inner spec is not a unit (facet/layer/concat)
    var axisGroup = null;
    var child = model.child;
    if (child.channelHasField(channel)) {
        if (child.axis(channel)) {
            if (true) {
                // add a group for the shared axes
                axisGroup = getSharedAxisGroup(model, channel);
                if (child.axis(channel) && rules_1.gridShow(child, channel)) {
                    // add inner axis (aka axis that shows only grid to )
                    child.component.axes[channel] = [parse_1.parseGridAxis(channel, child)];
                }
                else {
                    // Delete existing child axes
                    delete child.component.axes[channel];
                }
            }
            else {
                // TODO: implement independent axes support
            }
        }
    }
    return axisGroup;
}
function getSharedAxisGroup(model, channel) {
    var isX = channel === 'x';
    var facetChannel = isX ? 'column' : 'row';
    var hasFacet = !!model.facet[facetChannel];
    var dataPrefix = isX ? exports.COLUMN_AXES_DATA_PREFIX : exports.ROW_AXES_DATA_PREFIX;
    var axesGroup = {
        name: model.getName(channel + '-axes'),
        type: 'group'
    };
    if (hasFacet) {
        // Need to drive this with special data source that has one item for each column/row value.
        // TODO: We might only need to drive this with special data source if there are both row and column
        // However, it might be slightly difficult as we have to merge this with the main group.
        axesGroup.from = { data: dataPrefix + model.dataTable() };
    }
    if (isX) {
        axesGroup.encode = {
            update: {
                width: { field: { parent: model.child.sizeName('width') } },
                height: { field: { group: 'height' } },
                x: hasFacet ? {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN),
                    // offset by the spacing
                    offset: model.spacing(channel_1.COLUMN) / 2
                } : {
                    // TODO: support custom spacing here
                    // offset by the spacing
                    value: model.config.scale.facetSpacing / 2
                }
            }
        };
    }
    else {
        axesGroup.encode = {
            update: {
                width: { field: { group: 'width' } },
                height: { field: { parent: model.child.sizeName('height') } },
                y: hasFacet ? {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW),
                    // offset by the spacing
                    offset: model.spacing(channel_1.ROW) / 2
                } : {
                    // offset by the spacing
                    value: model.config.scale.facetSpacing / 2
                }
            }
        };
    }
    axesGroup.axes = [parse_1.parseMainAxis(channel, model.child)];
    return axesGroup;
}
exports.getSharedAxisGroup = getSharedAxisGroup;
function getRowGridGroups(model) {
    var facetGridConfig = model.config.facet.grid;
    var rowGrid = {
        name: model.getName('row-grid'),
        type: 'rule',
        from: {
            data: exports.ROW_AXES_DATA_PREFIX + model.dataTable()
        },
        encode: {
            update: {
                y: {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW)
                },
                x: { value: 0, offset: -facetGridConfig.offset },
                x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [rowGrid, {
            name: model.getName('row-grid-end'),
            type: 'rule',
            encode: {
                update: {
                    y: { field: { group: 'height' } },
                    x: { value: 0, offset: -facetGridConfig.offset },
                    x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
function getColumnGridGroups(model) {
    var facetGridConfig = model.config.facet.grid;
    var columnGrid = {
        name: model.getName('column-grid'),
        type: 'rule',
        from: {
            data: exports.COLUMN_AXES_DATA_PREFIX + model.dataTable()
        },
        encode: {
            update: {
                x: {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN)
                },
                y: { value: 0, offset: -facetGridConfig.offset },
                y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [columnGrid, {
            name: model.getName('column-grid-end'),
            type: 'rule',
            encode: {
                update: {
                    x: { field: { group: 'width' } },
                    y: { value: 0, offset: -facetGridConfig.offset },
                    y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBc0Q7QUFDdEQsb0NBQWdEO0FBQ2hELHdDQUFvQztBQUVwQyx3Q0FBZ0Q7QUFFaEQsNEJBQThCO0FBSTlCLGdDQUEwRjtBQUcxRixzQ0FBOEU7QUFDOUUsc0NBQXNDO0FBQ3RDLG1DQUFvQztBQUNwQyxvQ0FBeUQ7QUFDekQsbUNBQTBEO0FBQzFELGlDQUE4QjtBQUU5QixxQ0FBcUM7QUFDckMsdUNBQWdEO0FBRWhEOztHQUVHO0FBRVUsUUFBQSx1QkFBdUIsR0FBRyxTQUFTLENBQUM7QUFFakQ7O0dBRUc7QUFDVSxRQUFBLG9CQUFvQixHQUFHLE1BQU0sQ0FBQztBQUUzQztJQUFnQyxzQ0FBSztJQXFCbkMsb0JBQVksSUFBZSxFQUFFLE1BQWEsRUFBRSxlQUF1QjtRQUFuRSxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDLFNBWXJDO1FBNUJrQixZQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUV6QixVQUFJLEdBQWUsRUFBRSxDQUFDO1FBRXRCLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBSTlCLFdBQUssR0FBb0IsSUFBSSxDQUFDO1FBRTdCLGNBQVEsR0FHckIsRUFBRSxDQUFDO1FBS0wsMkVBQTJFO1FBQzNFLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWxFLElBQU0sS0FBSyxHQUFJLEtBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0UsS0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUssQ0FB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