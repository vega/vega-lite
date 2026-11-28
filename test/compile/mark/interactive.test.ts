import {compile} from '../../../src/compile/compile.js';
import {Config} from '../../../src/config.js';
import {TopLevelSpec} from '../../../src/spec/index.js';

function labelSpec(interactive?: boolean, config?: Config, selection = false): TopLevelSpec {
  return {
    data: {values: [{x: 'A', y: 'B', value: 25}]},
    encoding: {
      x: {field: 'x', type: 'ordinal'},
      y: {field: 'y', type: 'ordinal'},
    },
    layer: [
      {
        mark: 'rect',
        ...(selection ? {params: [{name: 'pick', select: 'point' as const}]} : {}),
        encoding: {tooltip: {field: 'value', type: 'quantitative'}},
      },
      {
        mark: {type: 'text', style: 'label', ...(interactive === undefined ? {} : {interactive})},
        encoding: {text: {field: 'value', type: 'quantitative'}},
      },
    ],
    config,
  };
}

describe('mark interactivity', () => {
  it.each([false, true])('preserves inferred behavior with selection=%s when unset', (selection) => {
    const {marks} = compile(labelSpec(undefined, undefined, selection)).spec;
    expect(marks[0].interactive).toBe(selection ? true : undefined);
    expect(marks[1].interactive).toBe(selection ? false : undefined);
  });

  describe.each([false, true])('with selection=%s', (selection) => {
    it.each([false, true])('emits explicit interactive=%s', (interactive) => {
      const {marks} = compile(labelSpec(interactive, undefined, selection)).spec;
      expect(marks[1].interactive).toBe(interactive);
    });

    it.each([false, true])('uses general mark configuration interactive=%s', (interactive) => {
      const {marks, config} = compile(labelSpec(undefined, {mark: {interactive}}, selection)).spec;
      expect(marks[0].interactive).toBe(interactive);
      expect(marks[1].interactive).toBe(interactive);
      expect(config?.mark ?? {}).not.toHaveProperty('interactive');
    });

    it('uses mark-specific configuration before general configuration', () => {
      const {marks, config} = compile(
        labelSpec(undefined, {mark: {interactive: true}, text: {interactive: false}}, selection),
      ).spec;
      expect(marks[0].interactive).toBe(true);
      expect(marks[1].interactive).toBe(false);
      expect(config?.style?.text ?? {}).not.toHaveProperty('interactive');
    });

    it('uses style configuration before mark-specific configuration', () => {
      const {marks, config} = compile(
        labelSpec(undefined, {text: {interactive: true}, style: {label: {interactive: false}}}, selection),
      ).spec;
      expect(marks[1].interactive).toBe(false);
      expect(config?.style?.label).not.toHaveProperty('interactive');
    });

    it.each([false, true])('lets explicit interactive=%s override configuration', (interactive) => {
      const {marks} = compile(labelSpec(interactive, {style: {label: {interactive: !interactive}}}, selection)).spec;
      expect(marks[1].interactive).toBe(interactive);
    });
  });

  it('can disable a mark that has its own selection and tooltip', () => {
    const {marks} = compile({
      data: {values: [{value: 25}]},
      mark: {type: 'point', interactive: false, tooltip: true},
      params: [{name: 'pick', select: 'point'}],
      encoding: {x: {field: 'value', type: 'quantitative'}},
    }).spec;
    expect(marks[0].interactive).toBe(false);
  });
});
