/* tslint:disable quotemark */

import {selector as parseSelector} from 'vega-event-selector';
import * as selection from '../../../src/compile/selection/selection';
import {keys} from '../../../src/util';
import {parseUnitModel} from '../../util';

describe('Selection', () => {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();

  it('parses default selection definitions', () => {
    const component = selection.parseUnitSelection(model, {
      one: {type: 'single'},
      two: {type: 'multi'},
      three: {type: 'interval'}
    });

    expect(keys(component)).toEqual(['one', 'two', 'three']);

    expect(component.one.name).toBe('one');
    expect(component.one.type).toBe('single');
    expect(component['one'].project).toEqual([{field: '_vgsid_', type: 'E'}]);
    expect(component['one'].events).toEqual(parseSelector('click', 'scope'));

    expect(component.two.name).toBe('two');
    expect(component.two.type).toBe('multi');
    expect(component.two.toggle).toEqual('event.shiftKey');
    expect(component['two'].project).toEqual([{field: '_vgsid_', type: 'E'}]);
    expect(component['two'].events).toEqual(parseSelector('click', 'scope'));

    expect(component.three.name).toBe('three');
    expect(component.three.type).toBe('interval');
    expect(component.three.translate).toEqual('[mousedown, window:mouseup] > window:mousemove!');
    expect(component.three.zoom).toEqual('wheel!');
    expect(component['three'].project).toEqual(
      expect.arrayContaining([
        {field: 'Horsepower', channel: 'x', type: 'R'},
        {field: 'Miles_per_Gallon', channel: 'y', type: 'R'}
      ])
    );
    expect(component['three'].events).toEqual(
      parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')
    );
  });

  it('supports inline default overrides', () => {
    const component = selection.parseUnitSelection(model, {
      one: {
        type: 'single',
        on: 'dblclick',
        fields: ['Cylinders']
      },
      two: {
        type: 'multi',
        on: 'mouseover',
        toggle: 'event.ctrlKey',
        encodings: ['color']
      },
      three: {
        type: 'interval',
        on: '[mousedown[!event.shiftKey], mouseup] > mousemove',
        encodings: ['y'],
        translate: false,
        zoom: 'wheel[event.altKey]'
      }
    });

    expect(keys(component)).toEqual(['one', 'two', 'three']);

    expect(component.one.name).toBe('one');
    expect(component.one.type).toBe('single');
    expect(component['one'].project).toEqual([{field: 'Cylinders', type: 'E'}]);
    expect(component['one'].events).toEqual(parseSelector('dblclick', 'scope'));

    expect(component.two.name).toBe('two');
    expect(component.two.type).toBe('multi');
    expect(component.two.toggle).toEqual('event.ctrlKey');
    expect(component['two'].project).toEqual(expect.arrayContaining([{field: 'Origin', channel: 'color', type: 'E'}]));
    expect(component['two'].events).toEqual(parseSelector('mouseover', 'scope'));

    expect(component.three.name).toBe('three');
    expect(component.three.type).toBe('interval');
    expect(component.three.translate).toEqual(false);
    expect(component.three.zoom).toEqual('wheel[event.altKey]');
    expect(component['three'].project).toEqual(
      expect.arrayContaining([{field: 'Miles_per_Gallon', channel: 'y', type: 'R'}])
    );
    expect(component['three'].events).toEqual(
      parseSelector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope')
    );
  });

  it('respects selection configs', () => {
    model.config.selection = {
      single: {on: 'dblclick', fields: ['Cylinders']},
      multi: {on: 'mouseover', encodings: ['color'], toggle: 'event.ctrlKey'},
      interval: {
        on: '[mousedown[!event.shiftKey], mouseup] > mousemove',
        encodings: ['y'],
        zoom: 'wheel[event.altKey]'
      }
    };

    const component = selection.parseUnitSelection(model, {
      one: {type: 'single'},
      two: {type: 'multi'},
      three: {type: 'interval'}
    });

    expect(keys(component)).toEqual(['one', 'two', 'three']);

    expect(component.one.name).toBe('one');
    expect(component.one.type).toBe('single');
    expect(component['one'].project).toEqual([{field: 'Cylinders', type: 'E'}]);
    expect(component['one'].events).toEqual(parseSelector('dblclick', 'scope'));

    expect(component.two.name).toBe('two');
    expect(component.two.type).toBe('multi');
    expect(component.two.toggle).toEqual('event.ctrlKey');
    expect(component['two'].project).toEqual(expect.arrayContaining([{field: 'Origin', channel: 'color', type: 'E'}]));
    expect(component['two'].events).toEqual(parseSelector('mouseover', 'scope'));

    expect(component.three.name).toBe('three');
    expect(component.three.type).toBe('interval');
    expect(!component.three.translate).toBeTruthy();
    expect(component.three.zoom).toEqual('wheel[event.altKey]');
    expect(component['three'].project).toEqual(
      expect.arrayContaining([{field: 'Miles_per_Gallon', channel: 'y', type: 'R'}])
    );
    expect(component['three'].events).toEqual(
      parseSelector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope')
    );
  });

  describe('Projection', () => {
    it('uses enumerated types for interval selections', () => {
      let m = parseUnitModel({
        mark: 'circle',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });

      m.parseScale();

      let c = selection.parseUnitSelection(m, {
        one: {type: 'interval', encodings: ['x']}
      });

      expect(c['one'].project).toEqual([{field: 'Origin', channel: 'x', type: 'E'}]);

      m = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });

      m.parseScale();

      c = selection.parseUnitSelection(m, {
        one: {type: 'interval', encodings: ['x']}
      });

      expect(c['one'].project).toEqual([{field: 'Origin', channel: 'x', type: 'E'}]);
    });

    it('uses ranged types for single/multi selections', () => {
      let m = parseUnitModel({
        mark: 'circle',
        encoding: {
          x: {field: 'Acceleration', type: 'quantitative', bin: true},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });

      m.parseScale();

      let c = selection.parseUnitSelection(m, {
        one: {type: 'single', encodings: ['x']}
      });

      expect(c['one'].project).toEqual([{field: 'Acceleration', channel: 'x', type: 'R-RE'}]);

      m = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'Acceleration', type: 'quantitative', bin: true},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });

      m.parseScale();

      c = selection.parseUnitSelection(m, {
        one: {type: 'multi', encodings: ['x']}
      });

      expect(c['one'].project).toEqual([{field: 'Acceleration', channel: 'x', type: 'R-RE'}]);
    });
  });
});
