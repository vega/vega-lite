import {parse, resetSVGDefIds, View} from 'vega';
import {describe, expect, it} from 'vitest';
import {compile, TopLevelSpec} from '../src/index.js';

describe('Responsive container sizing at runtime', () => {
  it('updates width and height when the container resizes', async () => {
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

    // picked up via the compiled spec's container:resize handler, which needs a Vega
    // release that has the container event source (vega/vega#4318)
    await expect.poll(() => view.signal('width')).toBe(360);
    await expect.poll(() => view.signal('height')).toBe(220);

    view.finalize();
  });
});
