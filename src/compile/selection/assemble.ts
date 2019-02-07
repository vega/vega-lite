import {identity, isArray, SignalRef, stringValue} from 'vega';
import {selector as parseSelector} from 'vega-event-selector';
import {forEachSelection, LEGEND, MODIFY, SELECTION_DOMAIN, STORE, VL_SELECTION_RESOLVE} from '.';
import {COLOR, OPACITY, SHAPE, SIZE} from '../../channel';
import {dateTimeExpr, isDateTime} from '../../datetime';
import {warn} from '../../log';
import {LogicalOperand} from '../../logical';
import {accessPathWithDatum, keys, logicalExpr, varName} from '../../util';
import {VgData} from '../../vega.schema';
import {DataFlowNode} from '../data/dataflow';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {isUnitModel, Model} from '../model';
import {UnitModel} from '../unit';
import {forEachTransform} from './transforms/transforms';

export function assembleInit(init: any, wrap: (str: string) => string = identity): string {
  return isArray(init)
    ? `[${init.map(v => assembleInit(v, wrap)).join(', ')}]`
    : isDateTime(init)
      ? wrap(dateTimeExpr(init))
      : wrap(JSON.stringify(init));
}
export function assembleUnitSelectionSignals(model: UnitModel, signals: any[]) {
  forEachSelection(model, (selCmpt, selCompiler) => {
    const name = selCmpt.name;
    let modifyExpr = selCompiler.modifyExpr(model, selCmpt);

    signals.push(...selCompiler.signals(model, selCmpt));

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.signals) {
        signals = txCompiler.signals(model, selCmpt, signals);
      }
      if (txCompiler.modifyExpr) {
        modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
      }
    });

    signals.push({
      name: name + MODIFY,
      update: `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`
    });
  });

  return signals;
}

export function assembleFacetSignals(model: FacetModel, signals: any[]) {
  if (model.component.selection && keys(model.component.selection).length) {
    const name = stringValue(model.getName('cell'));
    signals.unshift({
      name: 'facet',
      value: {},
      on: [
        {
          events: parseSelector('mousemove', 'scope'),
          update: `isTuple(facet) ? facet : group(${name}).datum`
        }
      ]
    });
  }

  return signals;
}

export function assembleTopLevelSignals(model: UnitModel, signals: any[]) {
  let hasSelections = false;
  forEachSelection(model, (selCmpt, selCompiler) => {
    const name = selCmpt.name;
    const store = stringValue(name + STORE);
    const hasSg = signals.filter(s => s.name === name);
    if (!hasSg.length) {
      signals.push({
        name: selCmpt.name,
        update:
          `${VL_SELECTION_RESOLVE}(${store}` +
          (selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`)
      });
    }
    hasSelections = true;

    if (selCompiler.topLevelSignals) {
      signals = selCompiler.topLevelSignals(model, selCmpt, signals);
    }

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.topLevelSignals) {
        signals = txCompiler.topLevelSignals(model, selCmpt, signals);
      }
    });
  });

  if (hasSelections) {
    const hasUnit = signals.filter(s => s.name === 'unit');
    if (!hasUnit.length) {
      signals.unshift({
        name: 'unit',
        value: {},
        on: [{events: 'mousemove', update: 'isTuple(group()) ? group() : unit'}]
      });
    }
  }

  return signals;
}

export function assembleUnitSelectionData(model: UnitModel, data: VgData[]): VgData[] {
  forEachSelection(model, selCmpt => {
    const contains = data.filter(d => d.name === selCmpt.name + STORE);
    if (!contains.length) {
      data.push({name: selCmpt.name + STORE});
    }
  });

  return data;
}

export function assembleUnitSelectionMarks(model: UnitModel, marks: any[]): any[] {
  forEachSelection(model, (selCmpt, selCompiler) => {
    marks = selCompiler.marks ? selCompiler.marks(model, selCmpt, marks) : marks;
    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.marks) {
        marks = txCompiler.marks(model, selCmpt, marks);
      }
    });
  });

  return marks;
}

export function assembleLayerSelectionMarks(model: LayerModel, marks: any[]): any[] {
  for (const child of model.children) {
    if (isUnitModel(child)) {
      marks = assembleUnitSelectionMarks(child, marks);
    }
  }

  return marks;
}

// Todo: Add more specific type checking
// Todo: Remove unecessary arguments
export function assembleLegendSelection(channel: string, fieldDef: any, part: string, value: any, model: Model) {
  switch (channel) {
    case COLOR:
    case OPACITY:
    case SIZE:
    case SHAPE:
      break;
    default:
      return {};
  }

  let hasLegend = false;
  let field;
  let store;
  let selection;
  forEachSelection(model, selCmpt => {
    selection = varName(fieldDef.selection);
    const selfield = selCmpt['fields'];
    if (selection === selCmpt.name && selfield.length === 1 && selfield[0] === fieldDef.field) {
      hasLegend = true;
      field = fieldDef.field;
      store = stringValue(selection + STORE);
    }
  });
  // Todo: Remove hardcoded values
  if (hasLegend) {
    let newValue;
    if (part === 'symbols' && channel === 'opacity') {
      newValue = value;
      if (newValue.stroke.value === 'transparent') {
        newValue.stroke = [
          {test: `vlSelectionTest(${store}, {${field}: datum.value})`, value: '#000000'},
          {value: 'transparent'}
        ];
      } else {
        newValue.stroke = [
          {test: `length(data(${store}))) && vlSelectionTest(${store}, {${field}: datum.value})`, value: '#000000'},
          newValue.stroke
        ];
      }
    } else {
      newValue = value ? value : {opacity: {value: 0.9}};
      // To do : Add tests
      newValue.opacity = [
        {test: `!(length(data(${store}))) || vlSelectionTest(${store}, {${field}: datum.value})`, value: 0.9},
        {value: 0.25}
      ];
    }
    return {name: `${part}_${selection}${LEGEND}`, interactive: true, update: newValue};
  }
  return {};
}

export function assembleSelectionPredicate(
  model: Model,
  selections: LogicalOperand<string>,
  dfnode?: DataFlowNode
): string {
  const stores: string[] = [];
  function expr(name: string): string {
    const vname = varName(name);
    const selCmpt = model.getSelectionComponent(vname, name);
    const store = stringValue(vname + STORE);

    if (selCmpt.project.timeUnit) {
      const child = dfnode || model.component.data.raw;
      const tunode = selCmpt.project.timeUnit.clone();
      if (child.parent) {
        tunode.insertAsParentOf(child);
      } else {
        child.parent = tunode;
      }
    }

    if (selCmpt.empty !== 'none') {
      stores.push(store);
    }

    return (
      `vlSelectionTest(${store}, datum` + (selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`)
    );
  }

  const predicateStr = logicalExpr(selections, expr);
  return (
    (stores.length ? '!(' + stores.map(s => `length(data(${s}))`).join(' || ') + ') || ' : '') + `(${predicateStr})`
  );
}

// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
export function assembleSelectionScaleDomain(model: Model, domainRaw: SignalRef): SignalRef {
  const selDomain = JSON.parse(domainRaw.signal.replace(SELECTION_DOMAIN, ''));
  const name = varName(selDomain.selection);
  const encoding = selDomain.encoding;
  let field = selDomain.field;

  let selCmpt = model.component.selection && model.component.selection[name];
  if (selCmpt) {
    warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
  } else {
    selCmpt = model.getSelectionComponent(name, selDomain.selection);
    if (!encoding && !field) {
      field = selCmpt.project[0].field;
      if (selCmpt.project.length > 1) {
        warn(
          'A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
            `Using "field": ${stringValue(field)}.`
        );
      }
    } else if (encoding && !field) {
      const encodings = selCmpt.project.filter(p => p.channel === encoding);
      if (!encodings.length || encodings.length > 1) {
        field = selCmpt.project[0].field;
        warn(
          (!encodings.length ? 'No ' : 'Multiple ') +
            `matching ${stringValue(encoding)} encoding found for selection ${stringValue(selDomain.selection)}. ` +
            `Using "field": ${stringValue(field)}.`
        );
      } else {
        field = encodings[0].field;
      }
    }

    return {signal: accessPathWithDatum(field, name)};
  }

  return {signal: 'null'};
}
