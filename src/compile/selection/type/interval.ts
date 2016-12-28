import {SelectionSpec, SelectionComponent, SelectionDomain, SelectionNames} from '../../../selection';
import {SelectionCompiler} from './';
import {X, Y, Channel} from '../../../channel';
import {UnitModel} from '../../unit';
import {defaultValue, invert as invertFn} from '../';
import {stringValue} from '../../../util';
import {warn} from '../../../log';

const intervalCompiler:SelectionCompiler = {
  parseUnitSelection: function(model: UnitModel, def: SelectionSpec) {
    return {
      events: defaultValue(def.on, '[mousedown, window:mouseup] > window:mousemove'),
      project: defaultValue(def.project, {encodings: ['x', 'y']}),
      translate: defaultValue(def.translate, true),
      // TODO: Only zoom intervals by default if we're initializing scales?
      zoom: defaultValue(def.zoom, def.bind && def.bind.scales)
    };
  },

  assembleUnitSignals: function(model: UnitModel, sel: SelectionComponent) {
    let signals: any[] = [],
        intervals:any[] = [];

    sel.project.forEach(function(p: any) {
      if (p.encoding !== X && p.encoding !== Y) {
        warn('Interval selections only support x and y encoding channels.');
        return;
      }

      let cs = channelSignal(model, sel, p.encoding);
      signals.unshift(cs);
      intervals.push('{field: ' + stringValue(p.field) + ', extent: ' + cs.name + '}')
    });

    signals.push({
      name: sel.name,
      update: '[' + intervals.join(', ') + ']'
    });

    return signals;
  },

  tupleExpression: function(model: UnitModel, sel: SelectionComponent) {
    return 'intervals: ' + sel.name;
  },

  modifyExpression: function(model: UnitModel, sel: SelectionComponent) {
    let tpl = sel.name + SelectionNames.TUPLE; 
    return tpl + ', {unit: ' + tpl + '.unit}';
  }
};
export {intervalCompiler as default};

function channelSignal(model: UnitModel, sel: SelectionComponent, channel: Channel): any {
  let name  = sel.name + '_' + channel,
      size  = 'unit.' + (channel === X ? 'width' : 'height'),
      coord = channel + '(unit)',
      invert = invertFn.bind(null, model, sel, channel);

  return {
    name: name,
    value: [],
    on: mapEvents(sel, function(on: any[], evt: any) {
      on.push({
        events: evt.between[0],
        update: invert('[' + coord + ', ' + coord + ']')
      });

      on.push({
        events: evt,
        update: '[' + name + '[0], ' + invert('clamp(' + coord + ', 0, ' + size + ')') + ']'
      });

      return on;
    })
  };
}

function mapEvents(sel: SelectionComponent, cb: Function) {
  return sel.events.reduce(function(on: any[], evt: any) {
    if (!evt.between) {
      warn(evt + ' is not an ordered event stream for interval selections');
      return on;
    }
    return cb(on, evt);
  }, []);
}
