import {Channel, X, Y} from '../../channel';
import {warn} from '../../log';
import {extend, keys, stringValue} from '../../util';
import {UnitModel} from '../unit';
import {channelSignalName, ProjectComponent, SelectionCompiler, SelectionComponent, STORE, TUPLE} from './selection';
import scales from './transforms/scales';

export const BRUSH = '_brush';

const interval:SelectionCompiler = {
  predicate: 'vlInterval',

  signals: function(model, selCmpt) {
    const signals: any[] = [],
        intervals:any[] = [],
        name = selCmpt.name;

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

      const cs = channelSignals(model, selCmpt, p.encoding);
      signals.push.apply(signals, cs);
      intervals.push(`{encoding: ${stringValue(p.encoding)}, ` +
      `field: ${stringValue(p.field)}, extent: ${cs[1].name}}`);
    });

    signals.push({
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
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'true' : `{unit: ${tpl}.unit}`);
  },

  marks: function(model, selCmpt, marks) {
    const name = selCmpt.name,
        {xi, yi} = projections(selCmpt),
        tpl = name + TUPLE,
        store = `data(${stringValue(selCmpt.name + STORE)})`;

    // Do not add a brush if we're binding to scales.
    if (scales.has(selCmpt)) {
      return marks;
    }

    const update = {
      x: extend({}, xi !== null ? {signal: `${name}_x[0]`} : {value: 0}),
      y: extend({}, yi !== null ? {signal: `${name}_y[0]`} : {value: 0}),
      x2: extend({}, xi !== null ? {signal: `${name}_x[1]`} : {field: {group: 'width'}}),
      y2: extend({}, yi !== null ? {signal: `${name}_y[1]`} : {field: {group: 'height'}})
    };

    // If the selection is resolved to global, only a single interval is in
    // the store. Wrap brush mark's encodings with a production rule to test
    // this based on the `unit` property. Hide the brush mark if it corresponds
    // to a unit different from the one in the store.
    if (selCmpt.resolve === 'global') {
      keys(update).forEach(function(key) {
        update[key] = [{
          test: `${store}.length && ${tpl} && ${tpl}.unit === ${store}[0].unit`,
          ...update[key]
        }, {value: 0}];
      });
    }

    // Two brush marks ensure that fill colors and other aesthetic choices do
    // not interefere with the core marks, but that the brushed region can still
    // be interacted with (e.g., dragging it around).
    return [{
      type: 'rect',
      encode: {
        enter: {
          fill: {value: '#333'},
          fillOpacity: {value: 0.125}
        },
        update: update
      }
    } as any].concat(marks, {
      name: name + BRUSH,
      type: 'rect',
      encode: {
        enter: {
          fill: {value: 'transparent'},
          stroke: {value: 'white'}
        },
        update: update
      }
    });
  }
};
export {interval as default};

export function projections(selCmpt: SelectionComponent) {
  let x:ProjectComponent = null, xi:number = null,
      y:ProjectComponent = null, yi: number = null;
  selCmpt.project.forEach(function(p, i) {
    if (p.encoding === X) {
      x  = p;
      xi = i;
    } else if (p.encoding === Y) {
      y = p;
      yi = i;
    }
  });
  return {x, xi, y, yi};
}

function channelSignals(model: UnitModel, selCmpt: SelectionComponent, channel: Channel): any {
  const name = channelSignalName(selCmpt, channel, 'visual'),
      hasScales = scales.has(selCmpt),
      scale = stringValue(model.scaleName(channel)),
      size  = model.getSizeSignalRef(channel === X ? 'width' : 'height').signal,
      coord = `${channel}(unit)`;

  return [{
    name: name,
    value: [],
    on: hasScales ? [] : events(selCmpt, function(on: any[], evt: any) {
      on.push({
        events: evt.between[0],
        update: `[${coord}, ${coord}]`
      });

      on.push({
        events: evt,
        update: `[${name}[0], clamp(${coord}, 0, ${size})]`
      });

      return on;
    })
  }, {
    name: channelSignalName(selCmpt, channel, 'data'),
    on: [
      {
        events: {signal: name},
        update: `invert(${scale}, ${name})`
      }
    ]
  }];
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
