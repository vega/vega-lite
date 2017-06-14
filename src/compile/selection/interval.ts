import {Channel, X, Y} from '../../channel';
import {warn} from '../../log';
import {hasContinuousDomain, isBinScale} from '../../scale';
import {extend, keys, stringValue} from '../../util';
import {VgEventStream} from '../../vega.schema';
import {UnitModel} from '../unit';
import {channelSignalName, ProjectComponent, SelectionCompiler, SelectionComponent, STORE, TUPLE} from './selection';
import scales from './transforms/scales';


export const BRUSH = '_brush';
export const SCALE_TRIGGER = '_scale_trigger';

const interval:SelectionCompiler = {
  predicate: 'vlInterval',
  scaleDomain: 'vlIntervalDomain',

  signals: function(model, selCmpt) {
    const name = selCmpt.name;
    const hasScales = scales.has(selCmpt);
    const signals: any[] = [];
    const intervals:any[] = [];
    const scaleTriggers: any[] = [];

    if (selCmpt.translate && !hasScales) {
      const filterExpr = `!event.item || event.item.mark.name !== ${stringValue(name + BRUSH)}`;
      events(selCmpt, function(_: any[], evt: VgEventStream) {
        const filters = evt.between[0].filter || (evt.between[0].filter = []);
        if (filters.indexOf(filterExpr) < 0) {
          filters.push(filterExpr);
        }
      });
    }

    selCmpt.project.forEach(function(p) {
      const channel = p.encoding;
      if (channel !== X && channel !== Y) {
        warn('Interval selections only support x and y encoding channels.');
        return;
      }

      const cs = channelSignals(model, selCmpt, channel);
      const dname = channelSignalName(selCmpt, channel, 'data');
      const vname = channelSignalName(selCmpt, channel, 'visual');
      const scaleStr = stringValue(model.scaleName(channel));

      signals.push.apply(signals, cs);
      intervals.push(`{encoding: ${stringValue(channel)}, ` +
        `field: ${stringValue(p.field)}, extent: ${dname}}`);

      scaleTriggers.push({
        scaleName: model.scaleName(channel),
        expr: `(!isArray(${dname}) || ` +
          `(invert(${scaleStr}, ${vname})[0] === ${dname}[0] && ` +
            `invert(${scaleStr}, ${vname})[1] === ${dname}[1]))`
      });
    });

    // Proxy scale reactions to ensure that an infinite loop doesn't occur
    // when an interval selection filter touches the scale.
    if (!hasScales) {
      signals.push({
        name: name + SCALE_TRIGGER,
        value: {},
        on: [{
          events: scaleTriggers.map((t) => { return {scale: t.scaleName}; }),
          update: scaleTriggers.map((t) => t.expr).join(' && ') +
            ` ? ${name + SCALE_TRIGGER} : {}`
        }]
      });
    }

    return signals.concat({
      name: name + TUPLE,
      update: `{unit: ${stringValue(model.getName(''))}, intervals: [${intervals.join(', ')}]}`
    });
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'true' : `{unit: ${stringValue(model.getName(''))}}`);
  },

  marks: function(model, selCmpt, marks) {
    const name = selCmpt.name;
    const {xi, yi} = projections(selCmpt);
    const tpl = name + TUPLE;
    const store = `data(${stringValue(selCmpt.name + STORE)})`;

    // Do not add a brush if we're binding to scales.
    if (scales.has(selCmpt)) {
      return marks;
    }

    const update = {
      x: xi !== null ? {signal: `${name}_x[0]`} : {value: 0},
      y: yi !== null ? {signal: `${name}_y[0]`} : {value: 0},
      x2: xi !== null ? {signal: `${name}_x[1]`} : {field: {group: 'width'}},
      y2: yi !== null ? {signal: `${name}_y[1]`} : {field: {group: 'height'}}
    };

    // If the selection is resolved to global, only a single interval is in
    // the store. Wrap brush mark's encodings with a production rule to test
    // this based on the `unit` property. Hide the brush mark if it corresponds
    // to a unit different from the one in the store.
    if (selCmpt.resolve === 'global') {
      keys(update).forEach(function(key) {
        update[key] = [{
          test: `${store}.length && ${store}[0].unit === ${stringValue(model.getName(''))}`,
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
  let x:ProjectComponent = null;
  let xi:number = null;
  let y:ProjectComponent = null;
  let yi: number = null;

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

/**
 * Returns the visual and data signals for an interval selection.
 */
function channelSignals(model: UnitModel, selCmpt: SelectionComponent, channel: 'x'|'y'): any {
  const vname = channelSignalName(selCmpt, channel, 'visual');
  const dname = channelSignalName(selCmpt, channel, 'data');
  const hasScales = scales.has(selCmpt);
  const scaleName = model.scaleName(channel);
  const scaleStr = stringValue(scaleName);
  const scale = model.getScaleComponent(channel);
  const scaleType = scale ? scale.get('type') : undefined;
  const size  = model.getSizeSignalRef(channel === X ? 'width' : 'height').signal;
  const coord = `${channel}(unit)`;

  const on = events(selCmpt, function(def: any[], evt: VgEventStream) {
    return def.concat(
      {events: evt.between[0], update: `[${coord}, ${coord}]`},           // Brush Start
      {events: evt, update: `[${vname}[0], clamp(${coord}, 0, ${size})]`} // Brush End
    );
  });

  // React to pan/zooms of continuous scales. Non-continuous scales
  // (bin-linear, band, point) cannot be pan/zoomed and any other changes
  // to their domains (e.g., filtering) should clear the brushes.
  if (hasContinuousDomain(scaleType) && !isBinScale(scaleType)) {
    on.push({
      events: {signal: selCmpt.name + SCALE_TRIGGER},
      update: `[scale(${scaleStr}, ${dname}[0]), scale(${scaleStr}, ${dname}[1])]`
    });
  }

  return hasScales ? [{name: dname, on: []}] : [{
    name: vname, value: [], on: on
  }, {
    name: dname,
    on: [{events: {signal: vname}, update: `invert(${scaleStr}, ${vname})`}]
  }];
}

function events(selCmpt: SelectionComponent, cb: Function) {
  return selCmpt.events.reduce(function(on: any[], evt: VgEventStream) {
    if (!evt.between) {
      warn(`${evt} is not an ordered event stream for interval selections`);
      return on;
    }
    return cb(on, evt);
  }, []);
}
