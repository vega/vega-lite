import {parse, resetSVGDefIds, View} from 'vega';
import {describe, expect, it} from 'vitest';
import {compile, TopLevelSpec} from '../src/index.js';

describe('Responsive container sizing at runtime', () => {
  it('updates container width and height when view.resize() runs', async () => {
    document.body.innerHTML = '';
    resetSVGDefIds();

    const div = document.createElement('div');
    div.style.width = '240px';
    div.style.height = '160px';
    document.body.appendChild(div);

    const spec: TopLevelSpec = {
      width: 'container',
      height: 'container',
      padding: 0,
      data: {values: [{a: 0}]},
      mark: 'point',
    };

    const view = new View(parse(compile(spec).spec), {container: div, renderer: 'svg'});
    await view.runAsync();

    expect(view.signal('width')).toBe(240);
    expect(view.signal('height')).toBe(160);

    div.style.width = '360px';
    div.style.height = '220px';
    await view.resize().runAsync();

    expect(view.signal('width')).toBe(360);
    expect(view.signal('height')).toBe(220);

    view.finalize();
  });
});
