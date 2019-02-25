import {TopLevelSpec} from './../src/spec/index';

import {parse, View} from 'vega';
import {compile} from '../src';

interface Opts {
  bubbles?: boolean;
  clientX?: number;
  clientY?: number;
  shiftKey?: boolean;
  deltaX?: number;
  deltaY?: number;
  deltaZ?: number;
}

let view: View;

export function embed(vlSpec: TopLevelSpec) {
  const vgSpec = compile(vlSpec).spec;
  view = new View(parse(vgSpec))
    .renderer('svg')
    .initialize('#vis')
    .run();
}

const winSrc = ['mousemove', 'mouseup'];
export function mouseEvt(type: string, target: Element | Window, opts?: Opts) {
  opts.bubbles = true;
  target = winSrc.indexOf(type) < 0 ? target : window;

  target.dispatchEvent(new MouseEvent('mousemove', {...opts, clientX: opts.clientX - 5, clientY: opts.clientY - 5}));

  target.dispatchEvent(new MouseEvent('mousemove', opts));

  target.dispatchEvent(type === 'wheel' ? new WheelEvent('wheel', opts) : new MouseEvent(type, opts));

  target.dispatchEvent(new MouseEvent('mousemove', {...opts, clientX: opts.clientX + 5, clientY: opts.clientY + 5}));
}

export function mark(id: string, parent: string) {
  return document.querySelector((parent ? `g.${parent} ` : '') + `g.mark-symbol.role-mark path:nth-child(${id})`);
}

export function coords(el: Element) {
  const rect = el.getBoundingClientRect();
  return [Math.ceil(rect.left + rect.width / 2), Math.ceil(rect.top + rect.height / 2)];
}

export function brushOrEl(el: Element, parent: string, _: boolean) {
  return !_ ? el : document.querySelector((parent ? `g.${parent} ` : '') + 'g.sel_brush > path');
}

export function click(el: Element, evt: Opts) {
  mouseEvt('mousedown', el, evt);
  mouseEvt('mouseup', window, evt);
  mouseEvt('click', el, evt);
}

export function brush(id0: string, id1: string, parent: string, targetBrush: boolean) {
  const el0 = mark(id0, parent);
  const el1 = mark(id1, parent);
  const [mdX, mdY] = coords(el0);
  const [muX, muY] = coords(el1);
  mouseEvt('mousedown', brushOrEl(el0, parent, targetBrush), {clientX: mdX, clientY: mdY});
  mouseEvt('mouseup', window, {clientX: muX, clientY: muY});
  return view.data('sel_store');
}

export function pt(id: string, parent: string, shiftKey: boolean) {
  const el = mark(id, parent);
  const [clientX, clientY] = coords(el);
  click(el, {clientX, clientY, shiftKey});
  return view.data('sel_store');
}

export function clear(id: string, parent: string, shiftKey: boolean) {
  const bg = document.querySelector((parent ? `g.${parent} ` : '') + 'path.background');
  const el = mark(id, parent);
  let [clientX, clientY] = coords(el);
  clientX += 10;
  clientY -= 10;
  click(bg, {clientX, clientY, shiftKey});
  return view.data('sel_store');
}

export function zoom(id: string, delta: number, parent: string, targetBrush: boolean) {
  const el = mark(id, parent);
  const [clientX, clientY] = coords(el);
  mouseEvt('wheel', brushOrEl(el, parent, targetBrush), {
    clientX,
    clientY,
    deltaX: delta,
    deltaY: delta,
    deltaZ: delta
  });
  mouseEvt('wheel', brushOrEl(el, parent, targetBrush), {
    clientX,
    clientY,
    deltaX: Math.sign(delta),
    deltaY: Math.sign(delta),
    deltaZ: Math.sign(delta)
  });
  return view.data('sel_store');
}

// window['embed'] = embed;
// window['click'] = click;
// window['brush'] = brush;
// window['pt'] = pt;
// window['clear'] = clear;
// window['zoom'] = zoom;
