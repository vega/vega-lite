import {SelectionComponent} from '../../../selection';
import {TypeCompiler} from './';
import {X, Y, Channel} from '../../../channel';
import {UnitModel} from '../../unit';
import {NS as NAMES, invert as invertFn, channelSignalName} from '../';
import {stringValue, extend} from '../../../util';
import {warn} from '../../../log';
import scales from '../transforms/scales';

export const NS = {
  BRUSH: '_brush',
  SIZE: '_size'
};

const interval:TypeCompiler = {
  predicate: 'vlInterval',

  signals: function(model, sel) {
    let signals: any[] = [],
        intervals:any[] = [],
        name = sel.name,
        size = name + NS.SIZE;

    if (sel.translate && !(scales.has(sel))) {
      events(sel, function(_: any[], evt: any) {
        let filters = evt.between[0].filter || (evt.between[0].filter = []);
        filters.push('!event.item || (event.item && ' +
          `event.item.mark.name !== ${stringValue(name + NS.BRUSH)})`);
      });
    }

    sel.project.forEach(function(p) {
      if (p.encoding !== X && p.encoding !== Y) {
        warn('Interval selections only support x and y encoding channels.');
        return;
      }

      let cs = channelSignal(model, sel, p.encoding);
      signals.push(cs);
      intervals.push(`{field: ${stringValue(p.field)}, extent: ${cs.name}}`);
    });

    signals.push({
      name: size,
      value: [],
      on: events(sel, function(on: any[], evt: any) {
        on.push({
          events: evt.between[0],
          update: '{x: x(unit), y: y(unit), width: 0, height: 0}'
        });

        on.push({
          events: evt,
          update: `{x: ${size}.x, y: ${size}.y, ` +
           `width: abs(x(unit) - ${size}.x), height: abs(y(unit) - ${size}.y)}`
        });

        return on;
      })
    }, {
      name: name,
      update: `[${intervals.join(', ')}]`
    });

    return signals;
  },

  tupleExpr: function(model, sel) {
    return `intervals: ${sel.name}`;
  },

  modifyExpr: function(model, sel) {
    let tpl = sel.name + NAMES.TUPLE;
    return `${tpl}, {unit: ${tpl}.unit}`;
  },

  marks: function(model, sel, marks) {
    let name = sel.name,
        {x, y} = projections(sel);

    // Do not add a brush if we're binding to scales.
    if (scales.has(sel)) {
      return marks;
    }

    let update = {
      x: extend({}, x !== null ?
        {scale: model.scaleName(X), signal: `${name}[${x}].extent[0]`} :
        {value: 0}),

      x2: extend({}, x !== null ?
        {scale: model.scaleName(X), signal: `${name}[${x}].extent[1]`} :
        {field: {group: 'width'}}),

      y: extend({}, y !== null ?
        {scale: model.scaleName(Y), signal: `${name}[${y}].extent[0]`} :
        {value: 0}),

      y2: extend({}, y !== null ?
        {scale: model.scaleName(Y), signal: `${name}[${y}].extent[1]`} :
        {field: {group: 'height'}}),
    };

    return [{
      name: undefined,
      type: 'rect',
      encode: {
        enter: {fill: {value: '#eee'}},
        update: update
      }
    }].concat(marks, {
      name: name + NS.BRUSH,
      type: 'rect',
      encode: {
        enter: {fill: {value: 'transparent'}},
        update: update
      }
    });
  }
};
export {interval as default};

export function projections(sel: SelectionComponent) {
  let x:number = null, y:number = null;
  sel.project.forEach(function(p, i) {
    if (p.encoding === X) {
      x = i;
    } else if (p.encoding === Y) {
      y = i;
    }
  });
  return {x: x, y: y};
}

function channelSignal(model: UnitModel, sel: SelectionComponent, channel: Channel): any {
  let name  = channelSignalName(sel, channel),
      size  = (channel === X ? 'width' : 'height'),
      coord = `${channel}(unit)`,
      invert = invertFn.bind(null, model, sel, channel);

  return {
    name: name,
    value: [],
    on: scales.has(sel) ? [] : events(sel, function(on: any[], evt: any) {
      on.push({
        events: evt.between[0],
        update: invert(`[${coord}, ${coord}]`)
      });

      on.push({
        events: evt,
        update: `[${name}[0], ` + invert(`clamp(${coord}, 0, ${size})`) + ']'
      });

      return on;
    })
  };
}

function events(sel: SelectionComponent, cb: Function) {
  return sel.events.reduce(function(on: any[], evt: any) {
    if (!evt.between) {
      warn(`${evt} is not an ordered event stream for interval selections`);
      return on;
    }
    return cb(on, evt);
  }, []);
}
