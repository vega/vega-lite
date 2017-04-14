import {Channel, X, Y} from '../../channel';
import {warn} from '../../log';
import {extend, stringValue} from '../../util';
import {UnitModel} from '../unit';
import {channelSignalName, invert as invertFn, SelectionCompiler, SelectionComponent, TUPLE} from './selection';
import scales from './transforms/scales';

export const BRUSH = '_brush',
  SIZE = '_size';

const interval:SelectionCompiler = {
  predicate: 'vlInterval',

  signals: function(model, selCmpt) {
    const signals: any[] = [],
        intervals:any[] = [],
        name = selCmpt.name,
        size = name + SIZE;

    if (selCmpt.translate && !(scales.has(selCmpt))) {
      events(selCmpt, function(_: any[], evt: any) {
        const filters = evt.between[0].filter || (evt.between[0].filter = []);
        filters.push('!event.item || (event.item && ' +
          `event.item.mark.name !== ${stringValue(name + BRUSH)})`);
      });
    }

    selCmpt.project.forEach(function(p) {
      if (p.encoding !== X && p.encoding !== Y) {
        warn('Interval selections only support x and y encoding channels.');
        return;
      }

      const cs = channelSignal(model, selCmpt, p.encoding);
      signals.push(cs);
      intervals.push(`{field: ${stringValue(p.field)}, extent: ${cs.name}}`);
    });

    signals.push({
      name: size,
      value: [],
      on: events(selCmpt, function(on: any[], evt: any) {
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

  tupleExpr: function(model, selCmpt) {
    return `intervals: ${selCmpt.name}`;
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return `${tpl}, {unit: ${tpl}.unit}`;
  },

  marks: function(model, selCmpt, marks) {
    const name = selCmpt.name,
        {x, y} = projections(selCmpt);

    // Do not add a brush if we're binding to scales.
    if (scales.has(selCmpt)) {
      return marks;
    }

    const update = {
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
      name: name + BRUSH,
      type: 'rect',
      encode: {
        enter: {fill: {value: 'transparent'}},
        update: update
      }
    });
  }
};
export {interval as default};

export function projections(selCmpt: SelectionComponent) {
  let x:number = null, y:number = null;
  selCmpt.project.forEach(function(p, i) {
    if (p.encoding === X) {
      x = i;
    } else if (p.encoding === Y) {
      y = i;
    }
  });
  return {x: x, y: y};
}

function channelSignal(model: UnitModel, selCmpt: SelectionComponent, channel: Channel): any {
  const name  = channelSignalName(selCmpt, channel),
      size  = (channel === X ? 'width' : 'height'),
      coord = `${channel}(unit)`,
      invert = invertFn.bind(null, model, selCmpt, channel);

  return {
    name: name,
    value: [],
    on: scales.has(selCmpt) ? [] : events(selCmpt, function(on: any[], evt: any) {
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

function events(selCmpt: SelectionComponent, cb: Function) {
  return selCmpt.events.reduce(function(on: any[], evt: any) {
    if (!evt.between) {
      warn(`${evt} is not an ordered event stream for interval selections`);
      return on;
    }
    return cb(on, evt);
  }, []);
}
