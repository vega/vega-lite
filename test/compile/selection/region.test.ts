import {describe, expect, it} from 'vitest';
import {Stream} from 'vega';
import {stringValue} from 'vega-util';
import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble.js';
import {BRUSH} from '../../../src/compile/selection/interval.js';
import {STORE, TUPLE, unitName} from '../../../src/compile/selection/index.js';
import region, {SCREEN_PATH} from '../../../src/compile/selection/region.js';
import {parseUnitSelection} from '../../../src/compile/selection/parse.js';
import {parseUnitModelWithScale} from '../../util.js';
import * as log from '../../../src/log/index.js';

describe('Region selections (compile)', () => {
  const model = parseUnitModelWithScale({
    mark: 'point',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
    },
  });

  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'lasso',
      select: {type: 'region', clear: false},
    },
  ]));

  const lasso = selCmpts['lasso'];

  it('builds tuple and screen path signals', () => {
    const screenPathName = `lasso${SCREEN_PATH}`;
    const marksName = stringValue(model.getName('marks'));
    const widthSignal = model.getSizeSignalRef('width').signal;
    const heightSignal = model.getSizeSignalRef('height').signal;

    const signals = region.signals(model, lasso, []);

    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: `lasso${TUPLE}`,
          on: [
            {
              events: [{signal: screenPathName}],
              update: `vlSelectionTuples(intersectLasso(${marksName}, ${screenPathName}, unit), {unit: ${unitName(model)}})`,
            },
          ],
        },
        {
          name: screenPathName,
          init: '[]',
          on: [
            {
              events: lasso.events[0].between[0],
              update: '[[x(unit), y(unit)]]',
            },
            {
              events: lasso.events[0],
              update: `lassoAppend(${screenPathName}, clamp(x(unit), 0, ${widthSignal}), clamp(y(unit), 0, ${heightSignal}))`,
            },
          ],
        },
      ]),
    );
  });

  it('builds modify signals', () => {
    const signals = assembleUnitSelectionSignals(model, []);

    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'lasso_modify',
          on: [
            {
              events: {signal: 'lasso_tuple'},
              update: `modify("lasso${STORE}", lasso${TUPLE}, true)`,
            },
          ],
        },
      ]),
    );
  });

  it('builds brush mark', () => {
    const marks = region.marks(model, lasso, []);
    const path = {signal: `lassoPath(lasso${SCREEN_PATH})`};
    const store = `data(${stringValue(`lasso${STORE}`)})`;

    expect(marks).toEqual([
      {
        name: `lasso${BRUSH}`,
        type: 'path',
        encode: {
          enter: {
            fill: {value: '#333'},
            fillOpacity: {value: 0.125},
            stroke: {value: 'gray'},
            strokeWidth: {value: 2},
            strokeDash: {value: [8, 5]},
          },
          update: {
            path: [
              {
                test: `${store}.length && ${store}[0].unit === ${unitName(model)}`,
                ...path,
              },
              {value: '[]'},
            ],
          },
        },
      },
    ]);
  });

  it('builds brush mark with simple path encoding when resolve is not global', () => {
    const modelUnion = parseUnitModelWithScale({
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      },
    });

    const selCmptsUnion = (modelUnion.component.selection = parseUnitSelection(modelUnion, [
      {
        name: 'lasso',
        select: {type: 'region', clear: false, resolve: 'union'},
      },
    ]));

    const lassoUnion = selCmptsUnion['lasso'];
    const marks = region.marks(modelUnion, lassoUnion, []);

    expect(marks).toEqual([
      {
        name: `lasso${BRUSH}`,
        type: 'path',
        encode: {
          enter: {
            fill: {value: '#333'},
            fillOpacity: {value: 0.125},
            stroke: {value: 'gray'},
            strokeWidth: {value: 2},
            strokeDash: {value: [8, 5]},
          },
          update: {
            // With non-global resolve, path should be just the signal without the conditional test wrapping
            path: {signal: `lassoPath(lasso${SCREEN_PATH})`},
          },
        },
      },
    ]);
  });

  it(
    'warns when events without between are provided',
    log.wrap((localLogger) => {
      const modelWithInvalidEvents = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        },
      });

      const selCmptsWithInvalidEvents = (modelWithInvalidEvents.component.selection = parseUnitSelection(
        modelWithInvalidEvents,
        [
          {
            name: 'lasso',
            select: {type: 'region', clear: false},
          },
        ],
      ));

      const lassoWithInvalidEvents = selCmptsWithInvalidEvents['lasso'];

      // Manually add an event without 'between' to trigger the warning path
      // This is a valid Stream type, but missing 'between' property for region selections
      const invalidEvent = {source: 'view', type: 'click'} satisfies Stream;
      lassoWithInvalidEvents.events.push(invalidEvent);

      const signals = region.signals(modelWithInvalidEvents, lassoWithInvalidEvents, []);

      // The warning should have been issued
      expect(localLogger.warns).toHaveLength(1);
      expect(localLogger.warns[0]).toContain('is not an ordered event stream for region selections');

      // The signals should still be generated for valid events
      expect(signals).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: `lasso${TUPLE}`,
          }),
          expect.objectContaining({
            name: `lasso${SCREEN_PATH}`,
          }),
        ]),
      );
    }),
  );
});
