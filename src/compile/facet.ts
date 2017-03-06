import * as log from '../log';

import {Axis, VlOnlyAxisBase, VL_ONLY_AXIS_PROPERTIES} from '../axis';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {defaultConfig, Config} from '../config';
import {Facet} from '../facet';
import {forEach} from '../encoding';
import {FieldDef, normalize} from '../fielddef';
import {Legend} from '../legend';
import {Scale} from '../scale';
import {FacetSpec} from '../spec';
import {contains, extend, keys, vals, flatten, duplicate, mergeDeep, Dict} from '../util';
import {VgData, VgEncodeEntry} from '../vega.schema';
import {StackProperties} from '../stack';

import {parseMainAxis, parseGridAxis, parseAxisComponent} from './axis/parse';
import {gridShow} from './axis/rules';
import {buildModel} from './common';
import {assembleData, parseFacetData} from './data/data';
import {assembleLayout, parseFacetLayout} from './layout';
import {Model} from './model';

import initScale from './scale/init';
import parseScaleComponent from './scale/parse';

/**
 * Prefix for special data sources for driving column's axis group.
 */

export const COLUMN_AXES_DATA_PREFIX = 'column-';

/**
 * Prefix for special data sources for driving row's axis group.
 */
export const ROW_AXES_DATA_PREFIX = 'row-';

export class FacetModel extends Model {
  public readonly facet: Facet;

  public readonly child: Model;

  public readonly children: Model[];
  protected readonly scales: Dict<Scale> = {};

  protected readonly axes: Dict<Axis> = {};

  protected readonly legends: Dict<Legend> = {};

  public readonly config: Config;

  public readonly stack: StackProperties = null;

  private readonly _spacing: {
    row?: number;
    column?: number;
  } = {};

  constructor(spec: FacetSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    // Config must be initialized before child as it gets cascaded to the child
    const config = this.config = this.initConfig(spec.config, parent);

    const child  = this.child = buildModel(spec.spec, this, this.getName('child'));
    this.children = [child];

    const facet  = this.facet = this.initFacet(spec.facet);
    this.scales  = this.initScalesAndSpacing(facet, config);
    this.axes   = this.initAxis(facet, config, child);
    this.legends = {};
  }

  private initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), parent ? parent.config : {}, specConfig);
  }

  private initFacet(facet: Facet) {
    // clone to prevent side effect to the original spec
    facet = duplicate(facet);

    forEach(facet, function(fieldDef: FieldDef, channel: Channel) {
      if (!contains([ROW, COLUMN], channel)) {
        // Drop unsupported channel
        log.warn(log.message.incompatibleChannel(channel, 'facet'));
        delete facet[channel];
        return;
      }

      // TODO: array of row / column ?
      if (fieldDef.field === undefined) { // TODO: datum
        log.warn(log.message.emptyFieldDef(fieldDef, channel));
        delete facet[channel];
        return;
      }

      // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
      normalize(fieldDef, channel);
    });
    return facet;
  }

  private initScalesAndSpacing(facet: Facet, config: Config): Dict<Scale> {
    const model = this;
    return [ROW, COLUMN].reduce(function(_scale, channel) {
      if (facet[channel]) {
        _scale[channel] = initScale(
          channel, facet[channel], config,
          undefined, // Facet doesn't have one single mark
          undefined, // TODO(#1647): support width / height here
          [] // There is no xyRangeSteps here and there is no need to input
        );

        model._spacing[channel] = spacing(facet[channel].scale || {}, model, config);
      }
      return _scale;
    }, {});
  }

  private initAxis(facet: Facet, config: Config, child: Model): Dict<Axis> {
    const model = this;
    return [ROW, COLUMN].reduce(function(_axis, channel) {
      if (facet[channel]) {
        const axisSpec = facet[channel].axis;
        if (axisSpec !== false) {
          let vlOnlyAxisProperties: VlOnlyAxisBase = {};
          VL_ONLY_AXIS_PROPERTIES.forEach(function(property) {
            if (config.facet.axis[property] !== undefined) {
              vlOnlyAxisProperties[property] = config.facet.axis[property];
            }
          });

          const modelAxis = _axis[channel] = {
            ...vlOnlyAxisProperties,
            ...axisSpec
          };

          if (channel === ROW) {
            const yAxis: any = child.axis(Y);
            if (yAxis && yAxis.orient !== 'right' && !modelAxis.orient) {
              modelAxis.orient = 'right';
            }
            if (model.hasDescendantWithFieldOnChannel(X) && !modelAxis.labelAngle) {
              modelAxis.labelAngle = modelAxis.orient === 'right' ? 90 : 270;
            }
          }
        }
      }
      return _axis;
    }, {});
  }

  public channelHasField(channel: Channel): boolean {
    return !!this.facet[channel];
  }

  private hasSummary() {
    const summary = this.component.data.summary;
    for (const s of summary) {
      if (keys(s.measures).length > 0) {
        return true;
      }
    }
    return false;
  }

  public facetedTable(): string {
    // FIXME: revise if the suffix should be 'data'
    return 'faceted-' + this.getName('data');
  }

  public dataTable(): string {
    // FIXME: shouldn't we apply data renaming here?
    if (this.component.data.stack) {
      return 'stacked';
    }
    if (this.hasSummary()) {
      return 'summary';
    }
    return 'source';
  }

  public fieldDef(channel: Channel): FieldDef {
    return this.facet[channel];
  }

  public parseData() {
    this.child.parseData();
    this.component.data = parseFacetData(this);
  }

  public parseSelection() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    this.child.parseLayoutData();
    this.component.layout = parseFacetLayout(this);
  }

  public parseScale() {
    const child = this.child;
    const model = this;

    child.parseScale();

    // TODO: support scales for field reference of parent data (e.g., for SPLOM)

    // First, add scale for row and column.
    let scaleComponent = this.component.scales = parseScaleComponent(this);

    // Then, move shared/union from its child spec.
    keys(child.component.scales).forEach(function(channel) {
      // TODO: correctly implement independent scale
      if (true) { // if shared/union scale
        const scale = scaleComponent[channel] = child.component.scales[channel];

        const scaleNameWithoutPrefix = scale.name.substr(child.getName('').length);
        const newName = model.scaleName(scaleNameWithoutPrefix, true);
        child.renameScale(scale.name, newName);

        // Once put in parent, just remove the child's scale.
        delete child.component.scales[channel];
      }
    });
  }

  public parseMark() {
    this.child.parseMark();

    this.component.mark = extend(
      {
        name: this.getName('cell'),
        type: 'group',
        from: extend(
          {
            facet: {
              name: this.facetedTable(),
              data: this.dataTable(),
              groupby: [].concat(
                this.channelHasField(ROW) ? [this.field(ROW)] : [],
                this.channelHasField(COLUMN) ? [this.field(COLUMN)] : []
              )
            }
          }
        ),
        encode: {
          update: getFacetGroupProperties(this)
        }
      },
      // FIXME: move this call to assembleMarks()
      // Call child's assembleGroup to add marks, scales, axes, and legends.
      // Note that we can call child's assembleGroup() here because parseMark()
      // is the last method in compile() and thus the child is completely compiled
      // at this point.
      this.child.assembleGroup()
    );
  }

  public parseAxis() {
    this.child.parseAxis();
    this.component.axes = parseAxisComponent(this, [ROW, COLUMN]);
  }

  public parseAxisGroup() {
    // TODO: with nesting, we might need to consider calling child
    // this.child.parseAxisGroup();

    const xAxisGroup = parseAxisGroups(this, X);
    const yAxisGroup = parseAxisGroups(this, Y);

    this.component.axisGroups = extend(
      xAxisGroup ? {x: xAxisGroup} : {},
      yAxisGroup ? {y: yAxisGroup} : {}
    );
  }

  public parseGridGroup() {
    // TODO: with nesting, we might need to consider calling child
    // this.child.parseGridGroup();

    const child = this.child;

    this.component.gridGroups = extend(
      !child.channelHasField(X) && this.channelHasField(COLUMN) ? {column: getColumnGridGroups(this)} : {},
      !child.channelHasField(Y) && this.channelHasField(ROW) ? {row: getRowGridGroups(this)} : {}
    );
  }

  public parseLegend() {
    this.child.parseLegend();

    // TODO: support legend for independent non-position scale across facets
    // TODO: support legend for field reference of parent data (e.g., for SPLOM)

    // For now, assuming that non-positional scales are always shared across facets
    // Thus, just move all legends from its child
    this.component.legends = this.child.component.legends;
    this.child.component.legends = {};
  }

  public assembleParentGroupProperties(): any {
    return null;
  }

  public assembleSignals(signals: any): any[] {
    return [];
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return [];
  }

  public assembleData(data: VgData[]): VgData[] {
    // Prefix traversal – parent data might be referred by children data
    assembleData(this, data);
    this.child.assembleData(data);
    assembleAxesGroupData(this, data);

    return data;
  }


  public assembleLayout(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this.child.assembleLayout(layoutData);
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    return [].concat(
      // axisGroup is a mapping to VgMarkGroup
      vals(this.component.axisGroups),
      flatten(vals(this.component.gridGroups)),
      this.component.mark
    );
  }

  public channels() {
    return [ROW, COLUMN];
  }

  protected getMapping() {
    return this.facet;
  }

  public spacing(channel: Channel) {
    return this._spacing[channel];
  }

  public isFacet() {
    return true;
  }
}

export function hasSubPlotWithXy(model: FacetModel) {
  return model.hasDescendantWithFieldOnChannel('x') ||
    model.hasDescendantWithFieldOnChannel('y');
}

export function spacing(scale: Scale, model: FacetModel, config: Config) {
  if (scale.spacing !== undefined) {
    return scale.spacing;
  }

  if (!hasSubPlotWithXy(model)) {
    // If there is no subplot with x/y, it's a simple table so there should be no spacing.
    return 0;
  }
  return config.scale.facetSpacing;
}

function getFacetGroupProperties(model: FacetModel) {
  const child = model.child;
  const mergedCellConfig = extend({}, child.config.cell, child.config.facet.cell);

  return extend({
      x: model.channelHasField(COLUMN) ? {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN),
          // offset by the spacing / 2
          offset: model.spacing(COLUMN) / 2
        } : {value: model.config.scale.facetSpacing / 2},

      y: model.channelHasField(ROW) ? {
        scale: model.scaleName(ROW),
        field: model.field(ROW),
        // offset by the spacing / 2
        offset: model.spacing(ROW) / 2
      } : {value: model.config.scale.facetSpacing / 2},

      width: {field: {parent: model.child.sizeName('width')}},
      height: {field: {parent: model.child.sizeName('height')}}
    },
    hasSubPlotWithXy(model) ? child.assembleParentGroupProperties(mergedCellConfig) : {}
  );
}

// TODO: move the rest of the file src/compile/facet/*.ts

/**
 * Add data for driving row/column axes when there are both row and column
 * Note that we don't have to deal with these in the parse step at all
 * because these items never get merged with any other items.
 */
export function assembleAxesGroupData(model: FacetModel, data: VgData[]) {
  if (model.facet.column) {
    data.push({
      name: COLUMN_AXES_DATA_PREFIX + model.dataTable(),
      source: model.dataTable(),
      transform: [{
        type: 'aggregate',
        groupby: [model.field(COLUMN)]
      }]
    });
  }

  if (model.facet.row) {
    data.push({
      name: ROW_AXES_DATA_PREFIX + model.dataTable(),
      source: model.dataTable(),
      transform: [{
        type: 'aggregate',
        groupby: [model.field(ROW)]
      }]
    });
  }
  return data;
}

function parseAxisGroups(model: FacetModel, channel: 'x' | 'y') {
  // TODO: add a case where inner spec is not a unit (facet/layer/concat)
  let axisGroup: any = null;

  const child = model.child;
  if (child.channelHasField(channel)) {
    if (child.axis(channel)) {
      if (true) { // the channel has shared axes

        // add a group for the shared axes
        axisGroup = getSharedAxisGroup(model, channel);

        if (child.axis(channel) && gridShow(child, channel)) { // show inner grid
          // add inner axis (aka axis that shows only grid to )
          child.component.axes[channel] = [parseGridAxis(channel, child)];
        } else {
          // Delete existing child axes
          delete child.component.axes[channel];
        }
      } else {
        // TODO: implement independent axes support
      }
    }
  }
  return axisGroup;
}


export function getSharedAxisGroup(model: FacetModel, channel: 'x' | 'y'): VgEncodeEntry {
  const isX = channel === 'x' ;
  const facetChannel = isX ? 'column' : 'row';
  const hasFacet = !!model.facet[facetChannel];
  const dataPrefix = isX ? COLUMN_AXES_DATA_PREFIX : ROW_AXES_DATA_PREFIX;

  let axesGroup: VgEncodeEntry = {
    name: model.getName(channel + '-axes'),
    type: 'group'
  };

  if (hasFacet) {
    // Need to drive this with special data source that has one item for each column/row value.

    // TODO: We might only need to drive this with special data source if there are both row and column
    // However, it might be slightly difficult as we have to merge this with the main group.
    axesGroup.from = {data: dataPrefix + model.dataTable()};
  }

  if (isX) {
    axesGroup.encode = {
      update: {
        width: {field: {parent: model.child.sizeName('width')}},
        height: {field: {group: 'height'}},
        x: hasFacet ? {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN),
          // offset by the spacing
          offset: model.spacing(COLUMN) / 2
        } : {
          // TODO: support custom spacing here
          // offset by the spacing
          value: model.config.scale.facetSpacing / 2
        }
      }
    };
  } else {
    axesGroup.encode = {
      update: {
        width: {field: {group: 'width'}},
        height: {field: {parent: model.child.sizeName('height')}},
        y: hasFacet ? {
          scale: model.scaleName(ROW),
          field: model.field(ROW),
          // offset by the spacing
          offset: model.spacing(ROW) / 2
        } : {
          // offset by the spacing
          value: model.config.scale.facetSpacing / 2
        }
      }
    };
  }

  axesGroup.axes = [parseMainAxis(channel, model.child)];
  return axesGroup;
}


function getRowGridGroups(model: Model): any[] { // TODO: VgMarks
  const facetGridConfig = model.config.facet.grid;

  const rowGrid = {
    name: model.getName('row-grid'),
    type: 'rule',
    from: {
      data: ROW_AXES_DATA_PREFIX + model.dataTable()
    },
    encode: {
      update: {
        y: {
          scale: model.scaleName(ROW),
          field: model.field(ROW)
        },
        x: {value: 0, offset: -facetGridConfig.offset},
        x2: {field: {group: 'width'}, offset: facetGridConfig.offset},
        stroke: {value: facetGridConfig.color},
        strokeOpacity: {value: facetGridConfig.opacity},
        strokeWidth: {value: 0.5}
      }
    }
  };

  return [rowGrid, {
    name: model.getName('row-grid-end'),
    type: 'rule',
    encode: {
      update: {
        y: {field: {group: 'height'}},
        x: {value: 0, offset: -facetGridConfig.offset},
        x2: {field: {group: 'width'}, offset: facetGridConfig.offset},
        stroke: {value: facetGridConfig.color},
        strokeOpacity: {value: facetGridConfig.opacity},
        strokeWidth: {value: 0.5}
      }
    }
  }];
}

function getColumnGridGroups(model: Model): any { // TODO: VgMarks
  const facetGridConfig = model.config.facet.grid;

  const columnGrid = {
    name: model.getName('column-grid'),
    type: 'rule',
    from: {
      data: COLUMN_AXES_DATA_PREFIX + model.dataTable()
    },
    encode: {
      update: {
        x: {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN)
        },
        y: {value: 0, offset: -facetGridConfig.offset},
        y2: {field: {group: 'height'}, offset: facetGridConfig.offset},
        stroke: {value: facetGridConfig.color},
        strokeOpacity: {value: facetGridConfig.opacity},
        strokeWidth: {value: 0.5}
      }
    }
  };

  return [columnGrid,  {
    name: model.getName('column-grid-end'),
    type: 'rule',
    encode: {
      update: {
        x: {field: {group: 'width'}},
        y: {value: 0, offset: -facetGridConfig.offset},
        y2: {field: {group: 'height'}, offset: facetGridConfig.offset},
        stroke: {value: facetGridConfig.color},
        strokeOpacity: {value: facetGridConfig.opacity},
        strokeWidth: {value: 0.5}
      }
    }
  }];
}
