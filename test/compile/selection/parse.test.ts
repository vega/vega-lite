/* tslint:disable quotemark */

import {assert} from 'chai';
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

    assert.sameMembers(keys(component), ['one', 'two', 'three']);

    assert.equal(component.one.name, 'one');
    assert.equal(component.one.type, 'single');
    assert.sameDeepMembers(component['one'].project, [{field: '_vgsid_', type: 'E'}]);
    assert.sameDeepMembers(component['one'].events, parseSelector('click', 'scope'));

    assert.equal(component.two.name, 'two');
    assert.equal(component.two.type, 'multi');
    assert.equal(component.two.toggle, 'event.shiftKey');
    assert.sameDeepMembers(component['two'].project, [{field: '_vgsid_', type: 'E'}]);
    assert.sameDeepMembers(component['two'].events, parseSelector('click', 'scope'));

    assert.equal(component.three.name, 'three');
    assert.equal(component.three.type, 'interval');
    assert.equal(component.three.translate, '[mousedown, window:mouseup] > window:mousemove!');
    assert.equal(component.three.zoom, 'wheel!');
    assert.sameDeepMembers<selection.ProjectSelectionComponent>(component['three'].project, [
      {field: 'Horsepower', channel: 'x', type: 'R'},
      {field: 'Miles_per_Gallon', channel: 'y', type: 'R'}
    ]);
    assert.sameDeepMembers(
      component['three'].events,
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

    assert.sameMembers(keys(component), ['one', 'two', 'three']);

    assert.equal(component.one.name, 'one');
    assert.equal(component.one.type, 'single');
    assert.sameDeepMembers(component['one'].project, [{field: 'Cylinders', type: 'E'}]);
    assert.sameDeepMembers(component['one'].events, parseSelector('dblclick', 'scope'));

    assert.equal(component.two.name, 'two');
    assert.equal(component.two.type, 'multi');
    assert.equal(component.two.toggle, 'event.ctrlKey');
    assert.sameDeepMembers<selection.ProjectSelectionComponent>(component['two'].project, [{field: 'Origin', channel: 'color', type: 'E'}]);
    assert.sameDeepMembers(component['two'].events, parseSelector('mouseover', 'scope'));

    assert.equal(component.three.name, 'three');
    assert.equal(component.three.type, 'interval');
    assert.equal(component.three.translate, false);
    assert.equal(component.three.zoom, 'wheel[event.altKey]');
    assert.sameDeepMembers<selection.ProjectSelectionComponent>(component['three'].project, [
      {field: 'Miles_per_Gallon', channel: 'y', type: 'R'}
    ]);
    assert.sameDeepMembers(
      component['three'].events,
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

    assert.sameMembers(keys(component), ['one', 'two', 'three']);

    assert.equal(component.one.name, 'one');
    assert.equal(component.one.type, 'single');
    assert.sameDeepMembers(component['one'].project, [{field: 'Cylinders', type: 'E'}]);
    assert.sameDeepMembers(component['one'].events, parseSelector('dblclick', 'scope'));

    assert.equal(component.two.name, 'two');
    assert.equal(component.two.type, 'multi');
    assert.equal(component.two.toggle, 'event.ctrlKey');
    assert.sameDeepMembers<selection.ProjectSelectionComponent>(component['two'].project, [{field: 'Origin', channel: 'color', type: 'E'}]);
    assert.sameDeepMembers(component['two'].events, parseSelector('mouseover', 'scope'));

    assert.equal(component.three.name, 'three');
    assert.equal(component.three.type, 'interval');
    assert(!component.three.translate);
    assert.equal(component.three.zoom, 'wheel[event.altKey]');
    assert.sameDeepMembers<selection.ProjectSelectionComponent>(component['three'].project, [
      {field: 'Miles_per_Gallon', channel: 'y', type: 'R'}
    ]);
    assert.sameDeepMembers(
      component['three'].events,
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

      assert.sameDeepMembers(c['one'].project, [{field: 'Origin', channel: 'x', type: 'E'}]);

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

      assert.sameDeepMembers(c['one'].project, [{field: 'Origin', channel: 'x', type: 'E'}]);
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

      assert.sameDeepMembers(c['one'].project, [{field: 'Acceleration', channel: 'x', type: 'R'}]);

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

      assert.sameDeepMembers(c['one'].project, [{field: 'Acceleration', channel: 'x', type: 'R'}]);
    });
  });
});
