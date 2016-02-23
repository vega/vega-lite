"use strict";
var scale_schema_1 = require('./scale.schema');
var axis_schema_1 = require('./axis.schema');
var config_cell_schema_1 = require('./config.cell.schema');
var defaultFacetGridConfig = {
    color: '#000000',
    opacity: 0.4,
    offset: 0
};
exports.defaultFacetConfig = {
    scale: scale_schema_1.defaultFacetScaleConfig,
    axis: axis_schema_1.defaultFacetAxisConfig,
    grid: defaultFacetGridConfig,
    cell: config_cell_schema_1.defaultFacetCellConfig
};
//# sourceMappingURL=config.facet.schema.js.map