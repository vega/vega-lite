import {OnEvent, Signal} from 'vega';
import {stringValue} from 'vega-util';
import {SelectionCompiler, STORE, TUPLE, unitName, SelectionComponent} from './index.js';
import {warn} from '../../log/index.js';
import {BRUSH} from './interval.js';
import scales from './scales.js';
import {SELECTION_ID} from '../../selection.js';
import type {UnitModel} from '../unit.js';
import type {SelectionParameter} from '../../selection.js';
export const SCREEN_PATH = '_screen_path';

const region: SelectionCompiler<'region'> = {
  defined: (selCmpt: SelectionComponent) => selCmpt.type === 'region',

  parse: (model: UnitModel, selCmpt: SelectionComponent, selDef: SelectionParameter) => {
    // Region selections are only valid over the SELECTION_ID field.
    // As a result, we don't expose "fields" as a valid property of the interface
    // and instead hardwire it here during parsing.
    selDef.select = {type: 'region', fields: [SELECTION_ID]} as any;
  },

  signals: (model: UnitModel, selCmpt: SelectionComponent, signals: Signal[]) => {
    const name = selCmpt.name;
    const signalsToAdd: Signal[] = [];

    const screenPathName = `${name}${SCREEN_PATH}`;

    const w = model.getSizeSignalRef('width').signal;
    const h = model.getSizeSignalRef('height').signal;

    signalsToAdd.push({
      name: `${name}${TUPLE}`,
      on: [
        {
          events: [{signal: screenPathName}],
          update: `vlSelectionTuples(intersectLasso(${stringValue(
            model.getName('marks'),
          )}, ${screenPathName}, unit), {unit: ${unitName(model)}})`,
        },
      ],
    });

    const regionEvents = selCmpt.events.reduce((on: OnEvent[], evt: any) => {
      if (!evt.between) {
        warn(`${evt} is not an ordered event stream for region selections.`);
        return on;
      }

      return [
        ...on,
        {events: evt.between[0], update: `[[x(unit), y(unit)]]`},
        {events: evt, update: `lassoAppend(${screenPathName}, clamp(x(unit), 0, ${w}), clamp(y(unit), 0, ${h}))`},
      ];
    }, [] as OnEvent[]);

    signalsToAdd.push({
      name: screenPathName,
      init: '[]',
      on: regionEvents,
    });

    return [...signals, ...signalsToAdd];
  },

  marks: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => {
    const name = selCmpt.name;
    const {fill, fillOpacity, stroke, strokeDash, strokeWidth} = selCmpt.mark;

    const screenPathName = `${name}${SCREEN_PATH}`;
    const store = `data(${stringValue(selCmpt.name + STORE)})`;

    // Do not add a brush if we're binding to scales.
    if (scales.defined(selCmpt)) {
      return marks;
    }

    const path = {signal: `lassoPath(${screenPathName})`};

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
            strokeDash: {value: strokeDash},
          },
          update: {
            path:
              // If the selection is resolved to global, only a single region is in the store.
              // We wrap a region mark's path encoding with a production rule to hide the mark
              // if it corresponds to a unit different from the one in the store.
              selCmpt.resolve === 'global'
                ? [
                    {
                      test: `${store}.length && ${store}[0].unit === ${unitName(model)}`,
                      ...path,
                    },
                    {
                      value: '[]',
                    },
                  ]
                : path,
          },
        },
      },
      ...marks,
    ];
  },
};

export default region;
