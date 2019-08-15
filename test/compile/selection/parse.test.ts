import {selector as parseSelector} from 'vega-event-selector';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
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
    const component = parseUnitSelection(model, {
      one: {type: 'single'},
      two: {type: 'multi'},
      three: {type: 'interval'}
    });

    expect(keys(component)).toEqual(['one', 'two', 'three']);

    expect(component.one.name).toBe('one');
    expect(component.one.type).toBe('single');
    expect(component['one'].project.items).toEqual(
      expect.arrayContaining([{field: '_vgsid_', type: 'E', signals: {data: 'one__vgsid_'}}])
    );
    expect(component['one'].events).toEqual(parseSelector('click', 'scope'));

    expect(component.two.name).toBe('two');
    expect(component.two.type).toBe('multi');
    expect(component.two.toggle).toBe('event.shiftKey');
    expect(component['two'].project.items).toEqual(
      expect.arrayContaining([{field: '_vgsid_', type: 'E', signals: {data: 'two__vgsid_'}}])
    );
    expect(component['two'].events).toEqual(parseSelector('click', 'scope'));

    expect(component.three.name).toBe('three');
    expect(component.three.type).toBe('interval');
    expect(component.three.translate).toBe('[mousedown, window:mouseup] > window:mousemove!');
    expect(component.three.zoom).toBe('wheel!');
    expect(component['three'].project.items).toEqual(
      expect.arrayContaining([
        {field: 'Horsepower', channel: 'x', type: 'R', signals: {data: 'three_Horsepower', visual: 'three_x'}},
        {
          field: 'Miles_per_Gallon',
          channel: 'y',
          type: 'R',
          signals: {data: 'three_Miles_per_Gallon', visual: 'three_y'}
        }
      ])
    );
    expect(component['three'].events).toEqual(
      parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')
    );
  });

  it('supports inline default overrides', () => {
    const component = parseUnitSelection(model, {
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
    expect(component['one'].project.items).toEqual(
      expect.arrayContaining([{field: 'Cylinders', type: 'E', signals: {data: 'one_Cylinders'}}])
    );
    expect(component['one'].events).toEqual(parseSelector('dblclick', 'scope'));

    expect(component.two.name).toBe('two');
    expect(component.two.type).toBe('multi');
    expect(component.two.toggle).toBe('event.ctrlKey');
    expect(component['two'].project.items).toEqual(
      expect.arrayContaining([
        {field: 'Origin', channel: 'color', type: 'E', signals: {data: 'two_Origin', visual: 'two_color'}}
      ])
    );
    expect(component['two'].events).toEqual(parseSelector('mouseover', 'scope'));

    expect(component.three.name).toBe('three');
    expect(component.three.type).toBe('interval');
    expect(component.three.translate).toEqual(false);
    expect(component.three.zoom).toBe('wheel[event.altKey]');
    expect(component['three'].project.items).toEqual(
      expect.arrayContaining([
        {
          field: 'Miles_per_Gallon',
          channel: 'y',
          type: 'R',
          signals: {data: 'three_Miles_per_Gallon', visual: 'three_y'}
        }
      ])
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

    const component = parseUnitSelection(model, {
      one: {type: 'single'},
      two: {type: 'multi'},
      three: {type: 'interval'}
    });

    expect(keys(component)).toEqual(['one', 'two', 'three']);

    expect(component.one.name).toBe('one');
    expect(component.one.type).toBe('single');
    expect(component['one'].project.items).toEqual(
      expect.arrayContaining([{field: 'Cylinders', type: 'E', signals: {data: 'one_Cylinders'}}])
    );
    expect(component['one'].events).toEqual(parseSelector('dblclick', 'scope'));

    expect(component.two.name).toBe('two');
    expect(component.two.type).toBe('multi');
    expect(component.two.toggle).toBe('event.ctrlKey');
    expect(component['two'].project.items).toEqual(
      expect.arrayContaining([
        {field: 'Origin', channel: 'color', type: 'E', signals: {data: 'two_Origin', visual: 'two_color'}}
      ])
    );
    expect(component['two'].events).toEqual(parseSelector('mouseover', 'scope'));

    expect(component.three.name).toBe('three');
    expect(component.three.type).toBe('interval');
    expect(!component.three.translate).toBeTruthy();
    expect(component.three.zoom).toBe('wheel[event.altKey]');
    expect(component['three'].project.items).toEqual(
      expect.arrayContaining([
        {
          field: 'Miles_per_Gallon',
          channel: 'y',
          type: 'R',
          signals: {data: 'three_Miles_per_Gallon', visual: 'three_y'}
        }
      ])
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

      let c = parseUnitSelection(m, {
        one: {type: 'interval', encodings: ['x']}
      });

      expect(c['one'].project.items).toEqual(
        expect.arrayContaining([
          {field: 'Origin', channel: 'x', type: 'E', signals: {data: 'one_Origin', visual: 'one_x'}}
        ])
      );

      m = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });

      m.parseScale();

      c = parseUnitSelection(m, {
        one: {type: 'interval', encodings: ['x']}
      });

      expect(c['one'].project.items).toEqual(
        expect.arrayContaining([
          {field: 'Origin', channel: 'x', type: 'E', signals: {data: 'one_Origin', visual: 'one_x'}}
        ])
      );
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

      let c = parseUnitSelection(m, {
        one: {type: 'single', encodings: ['x']}
      });

      expect(c['one'].project.items).toEqual(
        expect.arrayContaining([
          {field: 'Acceleration', channel: 'x', type: 'R-RE', signals: {data: 'one_Acceleration', visual: 'one_x'}}
        ])
      );

      m = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'Acceleration', type: 'quantitative', bin: true},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });

      m.parseScale();

      c = parseUnitSelection(m, {
        one: {type: 'multi', encodings: ['x']}
      });

      expect(c['one'].project.items).toEqual(
        expect.arrayContaining([
          {field: 'Acceleration', channel: 'x', type: 'R-RE', signals: {data: 'one_Acceleration', visual: 'one_x'}}
        ])
      );
    });

    it('infers from initial values', () => {
      const component = parseUnitSelection(model, {
        one: {type: 'single', init: {Origin: 5}},
        two: {type: 'multi', init: [{color: 10}]},
        three: {type: 'interval', init: {x: [10, 100]}}
      });

      expect(component['one'].project.items).toEqual(
        expect.arrayContaining([{field: 'Origin', type: 'E', signals: {data: 'one_Origin'}}])
      );

      expect(component['two'].project.items).toEqual(
        expect.arrayContaining([
          {channel: 'color', field: 'Origin', type: 'E', signals: {data: 'two_Origin', visual: 'two_color'}}
        ])
      );

      expect(component['three'].project.items).toEqual(
        expect.arrayContaining([
          {field: 'Horsepower', channel: 'x', type: 'R', signals: {data: 'three_Horsepower', visual: 'three_x'}}
        ])
      );
    });
  });
});
