import * as log from '../log';

import {AxisOrient, Axis} from '../axis';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {defaultConfig, Config} from '../config';
import {SOURCE, SUMMARY} from '../data';
import {Facet} from '../facet';
import {forEach} from '../encoding';
import {FieldDef, isDimension} from '../fielddef';
import {Scale} from '../scale';
import {FacetSpec} from '../spec';
import {getFullName} from '../type';
import {contains, extend, keys, vals, flatten, duplicate, mergeDeep, Dict} from '../util';
import {VgData, VgMarkGroup} from '../vega.schema';
import {StackProperties} from '../stack';

import {parseAxis, parseInnerAxis, gridShow, parseAxisComponent} from './axis';
import {buildModel} from './common';
import {assembleData, parseFacetData} from './data/data';
import {assembleLayout, parseFacetLayout} from './layout';
import {Model} from './model';
import {initScale, parseScaleComponent} from './scale';

/**
 * Prefix for special data sources for driving column's axis group.
 */

export const COLUMN_AXES_DATA_PREFIX = 'column-';

/**
 * Prefix for special data sources for driving row's axis group.
 */
export const ROW_AXES_DATA_PREFIX = 'row-';

export class FacetModel extends Model {
  private _facet: Facet;

  private _child: Model;

  private _spacing: {
    row?: number;
    column?: number;
  } = {};

  constructor(spec: FacetSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    // Config must be initialized before child as it gets cascaded to the child
    const config = this._config = this._initConfig(spec.config, parent);

    const child  = this._child = buildModel(spec.spec, this, this.name('child'));

    const facet  = this._facet = this._initFacet(spec.facet);
    this._scale  = this._initScaleAndSpacing(facet, config, child);
    this._axis   = this._initAxis(facet, config, child);
    this._legend = {};
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), parent ? parent.config() : {}, specConfig);
  }

  private _initFacet(facet: Facet) {
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
      if (fieldDef.field === undefined && fieldDef.value === undefined) { // TODO: datum
        log.warn(log.message.emptyFieldDef(fieldDef, channel));
        delete facet[channel];
        return;
      }

      // TODO: if has no field / datum, then drop the field
      if (fieldDef.type) {
        // convert short type to full type
        fieldDef.type = getFullName(fieldDef.type);
      }

      if (!isDimension(fieldDef)) {
        log.warn(log.message.facetChannelShouldBeDiscrete(channel));
      }
    });
    return facet;
  }

  private _initScaleAndSpacing(facet: Facet, config: Config, child: Model): Dict<Scale> {
    const model = this;
    return [ROW, COLUMN].reduce(function(_scale, channel) {
      if (facet[channel]) {
        _scale[channel] = initScale(
          undefined, // TODO(#1647): support width / height here
          undefined, // Facet doesn't have one single mark
          channel, facet[channel], config.scale
        );
        model._spacing[channel] = (facet[channel].scale || {}).spacing !== undefined ?
          (facet[channel].scale || {}).spacing : config.scale.facetSpacing;
      }
      return _scale;
    }, {} as Dict<Scale>);
  }

  private _initAxis(facet: Facet, config: Config, child: Model): Dict<Axis> {
    return [ROW, COLUMN].reduce(function(_axis, channel) {
      if (facet[channel]) {
        const axisSpec = facet[channel].axis;
        if (axisSpec !== false) {
          const modelAxis = _axis[channel] = extend({},
            config.facet.axis,
            axisSpec === true ? {} : axisSpec || {}
          );

          if (channel === ROW) {
            const yAxis: any = child.axis(Y);
            if (yAxis && yAxis.orient !== AxisOrient.RIGHT && !modelAxis.orient) {
              modelAxis.orient = AxisOrient.RIGHT;
            }
            if( child.has(X) && !modelAxis.labelAngle) {
              modelAxis.labelAngle = modelAxis.orient === AxisOrient.RIGHT ? 90 : 270;
            }
          }
        }
      }
      return _axis;
    }, {} as Dict<Axis>);
  }

  public facet() {
    return this._facet;
  }

  public has(channel: Channel): boolean {
    return !!this._facet[channel];
  }

  public child() {
    return this._child;
  }

  private hasSummary() {
    const summary = this.component.data.summary;
    for (let i = 0 ; i < summary.length ; i++) {
      if (keys(summary[i].measures).length > 0) {
        return true;
      }
    }
    return false;
  }

  public facetedTable(): string {
    // FIXME: revise if the suffix should be 'data'
    return 'faceted-' + this.name('data');
  }

  public dataTable(): string {
    return (this.hasSummary() ? SUMMARY : SOURCE) + '';
  }

  public fieldDef(channel: Channel): FieldDef {
    return this.facet()[channel];
  }

  public stack(): StackProperties {
    return null; // this is only a property for UnitModel
  }

  public parseData() {
    this.child().parseData();
    this.component.data = parseFacetData(this);
  }

  public parseSelectionData() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    this.child().parseLayoutData();
    this.component.layout = parseFacetLayout(this);
  }

  public parseScale() {
    const child = this.child();
    const model = this;

    child.parseScale();

    // TODO: support scales for field reference of parent data (e.g., for SPLOM)

    // First, add scale for row and column.
    let scaleComponent = this.component.scale = parseScaleComponent(this);

    // Then, move shared/union from its child spec.
    keys(child.component.scale).forEach(function(channel) {
      // TODO: correctly implement independent scale
      if (true) { // if shared/union scale
        scaleComponent[channel] = child.component.scale[channel];

        // for each scale, need to rename
        vals(scaleComponent[channel]).forEach(function(scale: any) {
          const scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
          const newName = model.scaleName(scaleNameWithoutPrefix, true);
          child.renameScale(scale.name, newName);
          scale.name = newName;
        });

        // Once put in parent, just remove the child's scale.
        delete child.component.scale[channel];
      }
    });
  }

  public parseMark() {
    this.child().parseMark();

    this.component.mark = extend(
      {
        name: this.name('cell'),
        type: 'group',
        from: extend(
          {
            facet: {
              name: this.facetedTable(),
              data: this.dataTable(),
              groupby: [].concat(
                this.has(ROW) ? [this.field(ROW)] : [],
                this.has(COLUMN) ? [this.field(COLUMN)] : []
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
      this.child().assembleGroup()
    );
  }

  public parseAxis() {
    this.child().parseAxis();
    this.component.axis = parseAxisComponent(this, [ROW, COLUMN]);
  }

  public parseAxisGroup() {
    // TODO: with nesting, we might need to consider calling child
    // this.child().parseAxisGroup();

    const xAxisGroup = parseAxisGroups(this, X);
    const yAxisGroup = parseAxisGroups(this, Y);

    this.component.axisGroup = extend(
      xAxisGroup ? {x: xAxisGroup} : {},
      yAxisGroup ? {y: yAxisGroup} : {}
    );
  }

  public parseGridGroup() {
    // TODO: with nesting, we might need to consider calling child
    // this.child().parseGridGroup();

    const child = this.child();

    this.component.gridGroup = extend(
      !child.has(X) && this.has(COLUMN) ? { column: getColumnGridGroups(this) } : {},
      !child.has(Y) && this.has(ROW) ? { row: getRowGridGroups(this) } : {}
    );
  }

  public parseLegend() {
    this.child().parseLegend();

    // TODO: support legend for independent non-position scale across facets
    // TODO: support legend for field reference of parent data (e.g., for SPLOM)

    // For now, assuming that non-positional scales are always shared across facets
    // Thus, just move all legends from its child
    this.component.legend = this._child.component.legend;
    this._child.component.legend = {};
  }

  public assembleParentGroupProperties(): any {
    return null;
  }

  public assembleData(data: VgData[]): VgData[] {
    // Prefix traversal – parent data might be referred by children data
    assembleData(this, data);
    this._child.assembleData(data);
    assembleAxesGroupData(this, data);

    return data;
  }


  public assembleLayout(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this._child.assembleLayout(layoutData);
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    return [].concat(
      // axisGroup is a mapping to VgMarkGroup
      vals(this.component.axisGroup),
      flatten(vals(this.component.gridGroup)),
      this.component.mark
    );
  }

  public channels() {
    return [ROW, COLUMN];
  }

  protected mapping() {
    return this.facet();
  }

  public spacing(channel: Channel) {
    return this._spacing[channel];
  }

  public isFacet() {
    return true;
  }
}




function getFacetGroupProperties(model: FacetModel) {
  const child = model.child();
  const mergedCellConfig = extend({}, child.config().cell, child.config().facet.cell);

  return extend({
      x: model.has(COLUMN) ? {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN),
          // offset by the spacing / 2
          offset: model.spacing(COLUMN) / 2
        } : {value: model.config().scale.facetSpacing / 2},

      y: model.has(ROW) ? {
        scale: model.scaleName(ROW),
        field: model.field(ROW),
        // offset by the spacing / 2
        offset: model.spacing(ROW) / 2
      } : {value: model.config().scale.facetSpacing / 2},

      width: {field: {parent: model.child().sizeName('width')}},
      height: {field: {parent: model.child().sizeName('height')}}
    },
    child.assembleParentGroupProperties(mergedCellConfig)
  );
}


// TODO: move the rest of the file src/compile/facet/*.ts

/**
 * Add data for driving row/column axes when there are both row and column
 * Note that we don't have to deal with these in the parse step at all
 * because these items never get merged with any other items.
 */
export function assembleAxesGroupData(model: FacetModel, data: VgData[]) {
  if (model.facet().column) {
    data.push({
      name: COLUMN_AXES_DATA_PREFIX + model.dataTable(),
      source: model.dataTable(),
      transform: [{
        type: 'aggregate',
        groupby: [model.field(COLUMN)]
      }]
    });
  }

  if (model.facet().row) {
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

  const child = model.child();
  if (child.has(channel)) {
    if (child.axis(channel)) {
      if (true) { // the channel has shared axes

        // add a group for the shared axes
        axisGroup = getSharedAxisGroup(model, channel);

        if (child.axis(channel) && gridShow(child, channel)) { // show inner grid
          // add inner axis (aka axis that shows only grid to )
          child.component.axis[channel] = parseInnerAxis(channel, child);
        } else {
          delete child.component.axis[channel];
        }
      } else {
        // TODO: implement independent axes support
      }
    }
  }
  return axisGroup;
}


export function getSharedAxisGroup(model: FacetModel, channel: 'x' | 'y'): VgMarkGroup {
  const isX = channel === 'x' ;
  const facetChannel = isX ? 'column' : 'row';
  const hasFacet = !!model.facet()[facetChannel];
  const dataPrefix = isX ? COLUMN_AXES_DATA_PREFIX : ROW_AXES_DATA_PREFIX;

  let axesGroup:VgMarkGroup = {
    name: model.name(channel + '-axes'),
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
        width: {field: {parent: model.child().sizeName('width')}},
        height: {field: {group: 'height'}},
        x: hasFacet ? {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN),
          // offset by the spacing
          offset: model.spacing(COLUMN) / 2
        } : {
          // TODO: support custom spacing here
          // offset by the spacing
          value: model.config().scale.facetSpacing / 2
        }
      }
    };
  } else {
    axesGroup.encode = {
      update: {
        width: {field: {group: 'width'}},
        height: {field: {parent: model.child().sizeName('height')}},
        y: hasFacet ? {
          scale: model.scaleName(ROW),
          field: model.field(ROW),
          // offset by the spacing
          offset: model.spacing(ROW) / 2
        } : {
          // offset by the spacing
          value: model.config().scale.facetSpacing / 2
        }
      }
    };
  }

  axesGroup.axes = [parseAxis(channel, model.child())];
  return axesGroup;
}


function getRowGridGroups(model: Model): any[] { // TODO: VgMarks
  const facetGridConfig = model.config().facet.grid;

  const rowGrid = {
    name: model.name('row-grid'),
    type: 'rule',
    from: {
      facet: {
        data: model.dataTable(),
        groupby: [model.field(ROW)]
      }
    },
    encode: {
      update: {
        y: {
          scale: model.scaleName(ROW),
          field: model.field(ROW)
        },
        x: {value: 0, offset: -facetGridConfig.offset },
        x2: {field: {group: 'width'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
        strokeWidth: {value: 0.5}
      }
    }
  };

  return [rowGrid, {
    name: model.name('row-grid-end'),
    type: 'rule',
    encode: {
      update: {
        y: { field: {group: 'height'}},
        x: {value: 0, offset: -facetGridConfig.offset },
        x2: {field: {group: 'width'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
        strokeWidth: {value: 0.5}
      }
    }
  }];
}

function getColumnGridGroups(model: Model): any { // TODO: VgMarks
  const facetGridConfig = model.config().facet.grid;

  const columnGrid = {
    name: model.name('column-grid'),
    type: 'rule',
    from: {
      facet: {
        data: model.dataTable(),
        groupby: [model.field(COLUMN)]
      }
    },
    encode: {
      update: {
        x: {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN)
        },
        y: {value: 0, offset: -facetGridConfig.offset},
        y2: {field: {group: 'height'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
        strokeWidth: {value: 0.5}
      }
    }
  };

  return [columnGrid,  {
    name: model.name('column-grid-end'),
    type: 'rule',
    encode: {
      update: {
        x: { field: {group: 'width'}},
        y: {value: 0, offset: -facetGridConfig.offset},
        y2: {field: {group: 'height'}, offset: facetGridConfig.offset },
        stroke: { value: facetGridConfig.color },
        strokeOpacity: { value: facetGridConfig.opacity },
        strokeWidth: {value: 0.5}
      }
    }
  }];
}
