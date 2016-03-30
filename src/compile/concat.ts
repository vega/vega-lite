import {Channel} from '../channel';
import {keys, duplicate, mergeDeep, flatten, unique, isArray, vals, forEach, hash, Dict, extend} from '../util';
import {defaultConfig, Config} from '../config';
import {ConcatSpec, isConcatSpec, isUnitSpec} from '../spec';
import {assembleData, parseConcatData} from './data/data';
import {assembleLayout, parseConcatLayout} from './layout';
import {Model, isUnitModel} from './model';
import {UnitModel} from './unit';
import {buildModel} from './common';
import {FieldDef} from '../fielddef';
import {ScaleComponents} from './scale';
import {VgData, VgAxis, VgLegend, isUnionedDomain, isDataRefDomain, VgDataRef} from '../vega.schema';
import {RepeatValues} from './repeat';
import {LAYOUT} from '../data';
import * as selections from './selections';

export class ConcatModel extends Model {
  _direction;
  public _select: any;  // To collate all the child selections

  constructor(spec: ConcatSpec, parent: Model, parentGivenName: string, repeatValues: RepeatValues) {
    super(spec, parent, parentGivenName, repeatValues);

    this._select = {};
    this._direction = spec.direction;
    this._config = this._initConfig(spec.config, parent);
    this._children = spec.concat.map((child, i) => {
      if (isUnitSpec(child)) {
        child.select = extend(this._select, child.select);
        extend(this._select, child.select);
      }

      return buildModel(child, this, this.name('child_' + i), repeatValues);
    });
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), specConfig, parent ? parent.config() : {});
  }

  public has(channel: Channel): boolean {
    // concat does not have any channels
    return false;
  }

  public isOrdinalScale(channel: Channel) {
    return null;
  }

  public dataTable(): string {
    // FIXME: remove this hack
    return this._children[0].dataTable();
  }

  public isRepeatRef(channel: Channel) {
    // todo
    return false;
  }

  public fieldDef(channel: Channel): FieldDef {
    return null; // layer does not have field defs
  }

  public stack() {
    return null; // this is only a property for UnitModel
  }

  public parseSelection() {
    this._select = {};
    this.component.selection = [];
    this._children.forEach((child) => {
      // Children within layers can reference selections defined prior.
      // We first parse a child's selections, then extend them with their siblings'.
      child.parseSelection();
      if (isUnitModel(child)) {
        extend(this._select, child._select);
        this.component.selection.push.apply(this.component.selection, child.selection());
      }
    });
  }

  public parseData() {
    this._children.forEach((child) => {
      child.parseData();
    });
    this.component.data = parseConcatData(this);
  }

  public parseLayoutData() {
    // TODO: correctly union ordinal scales rather than just using the layout of the first child
    this._children.forEach((child) => {
      child.parseLayoutData();
    });
    this.component.layout = parseConcatLayout(this);
  }

  public parseScale() {
    this._children.forEach(function(child) {
      child.parseScale();
    });
  }

  public parseMark() {
    this._children.forEach(function(child) {
      child.parseMark();
    });
  }

  public parseAxis() {
    this._children.forEach(function(child) {
      child.parseAxis();
    });
  }

  public parseAxisGroup() {
    return null;
  }

  public parseGridGroup() {
    return null;
  }

  public parseLegend() {
    this.component.legend = {} as Dict<VgLegend>;

    this._children.forEach(function(child) {
      child.parseLegend();
    });
  }

  public assembleParentGroupProperties() {
    return {
      unitName: { value: this.name() }
    };
  }

  public assembleData(data: VgData[]): VgData[] {
    // Prefix traversal – parent data might be referred to by children data
    assembleData(this, data);
    this._children.forEach((child) => {
      child.assembleData(data);
    });
    return data;
  }

  public assemblePreSelectionData(data: VgData[]): VgData[] {
    this._children.forEach((child) => child.assemblePreSelectionData(data));
    return selections.assembleCompositeData(this, data);
  }

  public assemblePostSelectionData(data: VgData[]): VgData[] {
    this._children.forEach((child) => child.assemblePostSelectionData(data));
    return selections.assembleCompositeData(this, data);
  }

  public assembleSignals(signals) {
    this._children.forEach((child) => child.assembleSignals(signals));
    return selections.assembleCompositeSignals(this, signals);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this._children.forEach((child) => {
      child.assembleLayout(layoutData);
    });
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    const offset = +this.children()[0].component.layout.height.formula[0].expr + 60;
    return flatten(this._children.map((child, i) => {
      return extend(
        {
          name: child.name('cell'),
          type: 'group',
          from: {data: child.dataName(LAYOUT)},
          properties: {
            update: getConcatGroupProperties(this, child, i > 0 ? offset: 0)
          }
        },
        // Call child's assembleGroup to add marks and axes (legends and scales should have been moved up).
        // Note that we can call child's assembleGroup() here because parseMark()
        // is the last method in compile() and thus the child is completely compiled
        // at this point.
        child.assembleGroup()
      );
    }));
  }

  public channels() {
    return [];
  }

  protected mapping() {
    return null;
  }

  public isConcat() {
    return true;
  }

  public compatibleSource(child: UnitModel) {
    const sourceUrl = this.data() && this.data().url;
    const childData = child.component.data;
    const compatible = !childData.source || (sourceUrl && sourceUrl === childData.source.url);
    return compatible;
  }
}

function getConcatGroupProperties(model: ConcatModel, child: Model, offset: number) {
  const mergedCellConfig = extend({}, child.config().cell, child.config().facet.cell);

  return extend(model._direction === 'vertical' ? {
      y: {value: offset},
      width: {field: child.sizeName('width')},
      height: {field: child.sizeName('height')}
    }:{
      x: {value: offset},
      width: {field: child.sizeName('width')},
      height: {field: child.sizeName('height')}
    },
    child.assembleParentGroupProperties(mergedCellConfig)
  );
}
