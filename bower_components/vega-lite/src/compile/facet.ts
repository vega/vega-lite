import {AxisOrient, Axis} from '../axis';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {defaultConfig, Config} from '../config';
import {SOURCE, SUMMARY} from '../data';
import {Facet} from '../facet';
import {channelMappingForEach} from '../encoding';
import {FieldDef, isDimension} from '../fielddef';
import {Scale, ScaleType} from '../scale';
import {FacetSpec} from '../spec';
import {getFullName} from '../type';
import {extend, keys, vals, flatten, duplicate, mergeDeep, Dict} from '../util';
import {VgData, VgMarkGroup} from '../vega.schema';

import {parseAxis, parseInnerAxis, gridShow, parseAxisComponent} from './axis';
import {buildModel} from './common';
import {assembleData, parseFacetData} from './data/data';
import {assembleLayout, parseFacetLayout} from './layout';
import {Model} from './model';
import {parseScaleComponent} from './scale';

export class FacetModel extends Model {
  private _facet: Facet;

  private _child: Model;

  constructor(spec: FacetSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    // Config must be initialized before child as it gets cascaded to the child
    const config = this._config = this._initConfig(spec.config, parent);

    const child  = this._child = buildModel(spec.spec, this, this.name('child'));

    const facet  = this._facet = this._initFacet(spec.facet);
    this._scale  = this._initScale(facet, config, child);
    this._axis   = this._initAxis(facet, config, child);
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), specConfig, parent ? parent.config() : {});
  }

  private _initFacet(facet: Facet) {
    // clone to prevent side effect to the original spec
    facet = duplicate(facet);

    const model = this;

    channelMappingForEach(this.channels(), facet, function(fieldDef: FieldDef, channel: Channel) {
      // TODO: if has no field / datum, then drop the field

      if (!isDimension(fieldDef)) {
        model.addWarning(channel + ' encoding should be ordinal.');
      }

      if (fieldDef.type) {
        // convert short type to full type
        fieldDef.type = getFullName(fieldDef.type);
      }
    });
    return facet;
  }

  private _initScale(facet: Facet, config: Config, child: Model): Dict<Scale> {
    return [ROW, COLUMN].reduce(function(_scale, channel) {
      if (facet[channel]) {

        const scaleSpec = facet[channel].scale || {};
        _scale[channel] = extend({
          type: ScaleType.ORDINAL,
          round: config.facet.scale.round,

          // TODO: revise this rule for multiple level of nesting
          padding: (channel === ROW && child.has(Y)) || (channel === COLUMN && child.has(X)) ?
                   config.facet.scale.padding : 0
        }, scaleSpec);
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

  public dataTable(): string {
    return (this.hasSummary() ? SUMMARY : SOURCE) + '';
  }

  public fieldDef(channel: Channel): FieldDef {
    return this.facet()[channel];
  }

  public stack() {
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
        vals(scaleComponent[channel]).forEach(function(scale) {
          const scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
          const newName = model.scaleName(scaleNameWithoutPrefix);
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
          this.dataTable() ? {data: this.dataTable()} : {},
          {
            transform: [{
              type: 'facet',
              groupby: [].concat(
                this.has(ROW) ? [this.field(ROW)] : [],
                this.has(COLUMN) ? [this.field(COLUMN)] : []
              )
            }]
          }
        ),
        properties: {
          update: getFacetGroupProperties(this)
        }
      },
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

    const xAxisGroup = parseAxisGroup(this, X);
    const yAxisGroup = parseAxisGroup(this, Y);

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

  public assembleParentGroupProperties() {
    return null;
  }

  public assembleData(data: VgData[]): VgData[] {
    // Prefix traversal – parent data might be referred by children data
    assembleData(this, data);
    return this._child.assembleData(data);
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

  public isFacet() {
    return true;
  }
}

// TODO: move the rest of the file into FacetModel if possible

function getFacetGroupProperties(model: FacetModel) {
  const child = model.child();
  const mergedCellConfig = extend({}, child.config().cell, child.config().facet.cell);

  return extend({
      x: model.has(COLUMN) ? {
          scale: model.scaleName(COLUMN),
          field: model.field(COLUMN),
          // offset by the padding
          offset: model.scale(COLUMN).padding / 2
        } : {value: model.config().facet.scale.padding / 2},

      y: model.has(ROW) ? {
        scale: model.scaleName(ROW),
        field: model.field(ROW),
        // offset by the padding
        offset: model.scale(ROW).padding / 2
      } : {value: model.config().facet.scale.padding / 2},

      width: {field: {parent: model.child().sizeName('width')}},
      height: {field: {parent: model.child().sizeName('height')}}
    },
    child.assembleParentGroupProperties(mergedCellConfig)
  );
}

function parseAxisGroup(model: FacetModel, channel: Channel) {
  // TODO: add a case where inner spec is not a unit (facet/layer/concat)
  let axisGroup = null;

  const child = model.child();
  if (child.has(channel)) {
    if (child.axis(channel)) {
      if (true) { // the channel has shared axes

        // add a group for the shared axes
        axisGroup = channel === X ? getXAxesGroup(model) : getYAxesGroup(model);

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


function getXAxesGroup(model: FacetModel): VgMarkGroup {
  const hasCol = model.has(COLUMN);
  return extend(
    {
      name: model.name('x-axes'),
      type: 'group'
    },
    hasCol ? {
      from: { // TODO: if we do facet transform at the parent level we can same some transform here
        data: model.dataTable(),
        transform: [{
          type: 'aggregate',
          groupby: [model.field(COLUMN)],
          summarize: {'*': ['count']} // just a placeholder aggregation
        }]
      }
    } : {},
    {
      properties: {
        update: {
          width: {field: {parent: model.child().sizeName('width')}},
          height: {
            field: {group: 'height'}
          },
          x: hasCol ? {
            scale: model.scaleName(COLUMN),
            field: model.field(COLUMN),
            // offset by the padding
            offset: model.scale(COLUMN).padding / 2
          } : {
            // offset by the padding
            value: model.config().facet.scale.padding / 2
          }
        }
      },
      axes: [parseAxis(X, model.child())]
    }
  );
}

function getYAxesGroup(model: FacetModel): VgMarkGroup {
  const hasRow = model.has(ROW);
  return extend(
    {
      name: model.name('y-axes'),
      type: 'group'
    },
    hasRow ? {
      from: {
        data: model.dataTable(),
        transform: [{
          type: 'aggregate',
          groupby: [model.field(ROW)],
          summarize: {'*': ['count']} // just a placeholder aggregation
        }]
      }
    } : {},
    {
      properties: {
        update: {
          width: {
            field: {group: 'width'}
          },
          height: {field: {parent: model.child().sizeName('height')}},
          y: hasRow ? {
            scale: model.scaleName(ROW),
            field: model.field(ROW),
            // offset by the padding
            offset: model.scale(ROW).padding / 2
          } : {
            // offset by the padding
            value: model.config().facet.scale.padding / 2
          }
        }
      },
      axes: [parseAxis(Y, model.child())]
    }
  );
}

function getRowGridGroups(model: Model): any[] { // TODO: VgMarks
  const facetGridConfig = model.config().facet.grid;

  const rowGrid = {
    name: model.name('row-grid'),
    type: 'rule',
    from: {
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(ROW)]}]
    },
    properties: {
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
    properties: {
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
      data: model.dataTable(),
      transform: [{type: 'facet', groupby: [model.field(COLUMN)]}]
    },
    properties: {
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
    properties: {
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
