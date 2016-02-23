"use strict";
var config_cell_schema_1 = require('./config.cell.schema');
var config_facet_schema_1 = require('./config.facet.schema');
var config_mark_schema_1 = require('./config.mark.schema');
var scale_schema_1 = require('./scale.schema');
var axis_schema_1 = require('./axis.schema');
var legend_schema_1 = require('./legend.schema');
exports.defaultConfig = {
    numberFormat: 's',
    timeFormat: '%Y-%m-%d',
    cell: config_cell_schema_1.defaultCellConfig,
    mark: config_mark_schema_1.defaultMarkConfig,
    scale: scale_schema_1.defaultScaleConfig,
    axis: axis_schema_1.defaultAxisConfig,
    legend: legend_schema_1.defaultLegendConfig,
    facet: config_facet_schema_1.defaultFacetConfig,
};
//# sourceMappingURL=config.schema.js.map