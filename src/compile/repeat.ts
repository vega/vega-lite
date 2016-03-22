import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {defaultConfig, Config} from '../config';
import {Repeat} from '../repeat';
import {FieldDef} from '../fielddef';
import {Scale, ScaleType} from '../scale';
import {RepeatSpec} from '../spec';
import {extend, keys, vals, flatten, duplicate, mergeDeep, contains, Dict} from '../util';
import {VgData} from '../vega.schema';
import {ORDINAL} from '../type';

import {parseAxisComponent} from './axis';
import {buildModel} from './common';
import {assembleLayout, parseRepeatLayout} from './layout';
import {Model} from './model';
import {parseScaleComponent} from './scale';

export class RepeatModel extends Model {
  private _repeat: Repeat;

  private _child: Model;

  constructor(spec: RepeatSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    // Config must be initialized before child as it gets cascaded to the child
    const config = this._config = this._initConfig(spec.config, parent);

    const child  = this._child = buildModel(spec.spec, this, this.name('child'));

    const repeat  = this._repeat = spec.repeat;
    this._scale  = this._initScale(repeat, config, child);
    this._axis = {};
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), specConfig, parent ? parent.config() : {});
  }

  private _initScale(repeat: Repeat, config: Config, child: Model): Dict<Scale> {
    return [ROW, COLUMN].reduce(function(_scale, channel) {
      if (repeat[channel]) {

        _scale[channel] = extend({
          type: ScaleType.ORDINAL,
          round: config.facet.scale.round,
          domain: repeat[channel],

          padding: 50
        }, {});
      }
      return _scale;
    }, {} as Dict<Scale>);
  }

  public repeat() {
    return this._repeat;
  }

  public hasMultipleDimensions() {
    return this.has(ROW) && this.has(COLUMN);
  }

  public has(channel: Channel): boolean {
    return !!this._repeat[channel];
  }

  public child() {
    return this._child;
  }

  public dataTable(): string {
    return this.has(ROW) ? 'fields_row' : 'fields_column';
  }

  public fieldDef(channel: Channel): FieldDef {
    return {
      type: ORDINAL
    };
  }

  public stack() {
    return null; // this is only a property for UnitModel
  }

  public parseData() {
    this.child().parseData();
  }

  public parseSelectionData() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    this.child().parseLayoutData();
    this.component.layout = parseRepeatLayout(this);
  }

  public parseScale() {
    const child = this.child();
    const model = this;

    child.parseScale();

    // First, add scale for row and column.
    let scaleComponent = this.component.scale = parseScaleComponent(this);

    // Then, move shared/union from its child spec.
    keys(child.component.scale).forEach(function(channel) {
      // TODO: correctly implement independent scales
      if (!contains([String(X), String(Y)], channel)) {  // union everything except X and Y
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
          {data: this.dataTable()},
          this.hasMultipleDimensions() ? {
            transform: [{
              type: 'cross',
              with: 'fields_column',
              output: {left: 'row', right: 'column'}
            }]
          } : {}
        ),
        properties: {
          update: getRepeatGroupProperties(this)
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
    return null;
  }

  public parseGridGroup() {
    return null;
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
    [COLUMN, ROW].forEach((channel) => {
      if (this.has(channel)) {
        data.push({
          name: 'fields_' + channel,
          values: this._repeat[channel]
        });
      }
    });
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
    return this.repeat();
  }

  public isRepeat() {
    return true;
  }
}

// TODO: move the rest of the file into RepeatModel if possible

function getRepeatGroupProperties(model: RepeatModel) {
  const child = model.child();
  const mergedCellConfig = extend({}, child.config().cell, child.config().facet.cell);

  return extend({
      x: model.has(COLUMN) ? {
          scale: model.scaleName(COLUMN),
          field: model.hasMultipleDimensions() ? 'column.data' : 'data',
          // offset by the padding
          offset: model.scale(COLUMN).padding / 2
        } : {value: model.config().facet.scale.padding / 2},

      y: model.has(ROW) ? {
        scale: model.scaleName(ROW),
        field: model.hasMultipleDimensions() ? 'row.data' : 'data',
        // offset by the padding
        offset: model.scale(ROW).padding / 2
      } : {value: model.config().facet.scale.padding / 2},

      width: {field: {parent: model.child().sizeName('width')}},
      height: {field: {parent: model.child().sizeName('height')}}
    },
    child.assembleParentGroupProperties(mergedCellConfig)
  );
}
