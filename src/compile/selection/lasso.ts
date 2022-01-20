import {NewSignal, OnEvent, Signal, Stream} from 'vega';
import {stringValue} from 'vega-util';
import {SelectionCompiler, SelectionComponent, TUPLE, unitName} from '.';
import {ScaleChannel, X} from '../../channel';
import {warn} from '../../log';
import {UnitModel} from '../unit';
import {assembleInit} from './assemble';
import {SelectionProjection, TUPLE_FIELDS} from './project';
import scales from './scales';
export const BRUSH = '_brush';
export const SELECTION_IDS = '_selectionids'
export const SCREEN_PATH = '_screen_path'

const lasso: SelectionCompiler<'lasso'> = {
  defined: selCmpt => selCmpt.type === 'lasso',

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const init = selCmpt.init ? selCmpt.init[0] : null;
    const signalsToAdd: Signal[] = [];

    const fieldsSg = `${name}${TUPLE_FIELDS}`;
    const screenPathName = `${name}${SCREEN_PATH}`;
    const selectionIds = `${name}${SELECTION_IDS}`

    const xScale = model.getScaleComponent('x')
    const yScale = model.getScaleComponent('y')

    const xField = model.fieldDef('x')
    const yField = model.fieldDef('y')

    const w = model.getSizeSignalRef('width').signal;
    const h = model.getSizeSignalRef('height').signal;

    signalsToAdd.push({
      name: `${name}_selectionids`,
      on: [
        {
          events: [{signal: screenPathName}],
          update: `invertLasso(${stringValue(model.getName('marks'))}, ${screenPathName}, ${stringValue(xScale.implicit.name)}, ${stringValue(xField.field)}, ${stringValue(yScale.implicit.name)}, ${stringValue(yField.field)})`
        }
      ]
    })

    const on = events(selCmpt, (def: OnEvent[], evt: Stream) => {
      return [
        ...def,
        {events: evt.between[0], update: `[[x(unit), y(unit)]]`},
        {events: evt, update: `lassoAppend(${screenPathName}, clamp(x(unit), 0, ${w}), clamp(y(unit), 0, ${h}))`}
      ];
    });

    signalsToAdd.push({
      name: screenPathName,
      init: '[]',
      on: on
    });

    const update = `unit: ${unitName(model)}, fields: ${fieldsSg}, values`;
    signalsToAdd.push({
      name: name + TUPLE,
      ...(init ? {init: `{${update}: ${assembleInit(init)}}`} : {}),
      on: [
        {
          events: [{signal: selectionIds}], // Prevents double invocation, see https://github.com/vega/vega#1672.
          update: `${selectionIds} ? {${update}: [${selectionIds}]} : null`
        }
      ]
    });

    return [...signals, ...signalsToAdd];
  },

  marks: (model, selCmpt, marks) => {
    const name = selCmpt.name;
    const {fill, fillOpacity, stroke, strokeDash, strokeWidth} = selCmpt.mark;

    const screenPathName = `${name}${SCREEN_PATH}`;

    // Do not add a brush if we're binding to scales.
    if (scales.defined(selCmpt)) {
      return marks;
    }

    return [
      {
        name: `${name + BRUSH}`,
        type: 'path',
        encode: {
          enter: {
            fill: {value: fill},
            fillOpacity: {value: fillOpacity},
            stroke: {value: stroke},
            strokeWidth: {value: strokeWidth},
            strokeDash: {value: strokeDash}
          },
          update: {
            path: {
              test: true,
              signal: `lassoPath(${screenPathName})`
            }
          }
        }
      },
      ...marks
    ];
  }
};


function events(selCmpt: SelectionComponent<'lasso'>, cb: (def: OnEvent[], evt: Stream) => OnEvent[]): OnEvent[] {
  return selCmpt.events.reduce((on, evt) => {
    if (!evt.between) {
      warn(`${evt} is not an ordered event stream for interval selections.`);
      return on;
    }
    return cb(on, evt);
  }, [] as OnEvent[]);
}

export default lasso;
