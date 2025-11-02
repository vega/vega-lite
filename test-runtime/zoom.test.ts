import {View} from 'vega';
import {describe, expect, it} from 'vitest';
import {
  bound,
  brush,
  BrushKeys,
  compositeTypes,
  embed,
  getGeoSpec,
  getSpec,
  parentSelector,
  tuples,
  unbound,
  zoom as zoom_,
} from './util.js';

const hits = {
  zoom: [9, 23],
  bins: [8, 2],
};

type InOut = 'in' | 'out';

function zoom(
  view: View,
  key: keyof typeof hits,
  idx: number,
  direction: InOut,
  parent?: string,
  targetBrush?: boolean,
) {
  const delta = direction === 'out' ? 200 : -200;
  return zoom_(view, hits[key][idx], delta, parent, targetBrush);
}

describe('Zoom interval selections at runtime', () => {
  for (const bind of [bound, unbound] as const) {
    describe(`Zoom ${bind} interval selections at runtime`, () => {
      const type = 'interval';
      const binding = bind === bound ? {bind: 'scales'} : {};
      const cmp = (a: number, b: number) => a - b;

      const assertExtent = {
        in: ['toBeGreaterThanOrEqual', 'toBeLessThanOrEqual'],
        out: ['toBeLessThanOrEqual', 'toBeGreaterThanOrEqual'],
      } as const;

      async function setup(view: View, brushKey: BrushKeys, idx: number, encodings: string[], parent?: string) {
        const inOut: InOut = idx % 2 ? 'out' : 'in';
        let xold: number[];
        let yold: number[];

        if (bind === unbound) {
          const result = await brush(view, brushKey, idx, parent);
          if (result instanceof HTMLElement) {
            throw new Error('Expected brush result to be an array');
          }
          const drag = result[0];
          xold = drag.values[0].sort(cmp);
          yold = encodings.includes('y') ? drag.values[encodings.indexOf('x') + 1].sort(cmp) : null;
        } else {
          xold = (view as any)._runtime.scales.x.value.domain() as number[];
          yold = (view as any)._runtime.scales.y.value.domain() as number[];
        }

        return {inOut, xold, yold};
      }

      it('should zoom in and out', async () => {
        for (let i = 0; i < hits.zoom.length; i++) {
          const view = await embed(getSpec('unit', i, {type, ...binding}));
          const {inOut, xold, yold} = await setup(view, 'drag', i, ['x', 'y']);
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/zoom/${bind}/${inOut}-0.svg`);

          const zoomed = (await zoom(view, 'zoom', i, inOut, null, bind === unbound))[0];
          const xnew = zoomed.values[0].sort(cmp);
          const ynew = zoomed.values[1].sort(cmp);
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/zoom/${bind}/${inOut}-1.svg`);
          expect(xnew[0])[assertExtent[inOut][0]](xold[0]);
          expect(xnew[1])[assertExtent[inOut][1]](xold[1]);
          expect(ynew[0])[assertExtent[inOut][0]](yold[0]);
          expect(ynew[1])[assertExtent[inOut][1]](yold[1]);
        }
      });

      it('should work with binned domains', async () => {
        for (let i = 0; i < hits.bins.length; i++) {
          const encodings = ['y'];
          const view = await embed(
            getSpec(
              'unit',
              1,
              {type, ...binding, encodings},
              {
                x: {aggregate: 'count', type: 'quantitative'},
                y: {bin: true},
                color: {value: 'steelblue', field: undefined, type: undefined},
              },
            ),
          );

          const {inOut, yold} = await setup(view, 'bins', i, encodings);
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/zoom/${bind}/bins_${inOut}-0.svg`);

          const zoomed = (await zoom(view, 'bins', i, inOut, null, bind === unbound))[0];
          const ynew = zoomed.values[0].sort(cmp);
          expect(ynew[0])[assertExtent[inOut][0]](yold[0]);
          expect(ynew[1])[assertExtent[inOut][1]](yold[1]);
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/zoom/${bind}/bins_${inOut}-1.svg`);
        }
      });

      it('should work with temporal domains', async () => {
        const values = tuples.map((d) => ({...d, a: new Date(2017, d.a)}));
        const encodings = ['x'];

        for (let i = 0; i < hits.zoom.length; i++) {
          const view = await embed(getSpec('unit', i, {type, ...binding, encodings}, {values, x: {type: 'temporal'}}));
          const {inOut, xold} = await setup(view, 'drag', i, encodings);
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/zoom/${bind}/temporal_${inOut}-0.svg`,
          );

          const zoomed = (await zoom(view, 'zoom', i, inOut, null, bind === unbound))[0];
          const xnew = zoomed.values[0].sort(cmp);
          expect(+xnew[0])[assertExtent[inOut][0]](+new Date(xold[0]));
          expect(+xnew[1])[assertExtent[inOut][1]](+new Date(xold[1]));
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/zoom/${bind}/temporal_${inOut}-1.svg`,
          );
        }
      });

      it('should work with log/pow scales', async () => {
        for (let i = 0; i < hits.zoom.length; i++) {
          const view = await embed(
            getSpec(
              'unit',
              i,
              {type, ...binding},
              {
                x: {scale: {type: 'pow', exponent: 1.5}},
                y: {scale: {type: 'log'}},
              },
            ),
          );
          const {inOut, xold, yold} = await setup(view, 'drag', i, ['x', 'y']);
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/zoom/${bind}/logpow_${inOut}-0.svg`,
          );

          const zoomed = (await zoom(view, 'zoom', i, inOut, null, bind === unbound))[0];
          const xnew = zoomed.values[0].sort(cmp);
          const ynew = zoomed.values[1].sort(cmp);
          expect(xnew[0])[assertExtent[inOut][0]](xold[0]);
          expect(xnew[1])[assertExtent[inOut][1]](xold[1]);
          expect(ynew[0])[assertExtent[inOut][0]](yold[0]);
          expect(ynew[1])[assertExtent[inOut][1]](yold[1]);
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/zoom/${bind}/logpow_${inOut}-1.svg`,
          );
        }
      });

      if (bind === unbound) {
        it('should work with ordinal/nominal domains', async () => {
          for (let i = 0; i < hits.zoom.length; i++) {
            const view = await embed(
              getSpec(
                'unit',
                i,
                {type, ...binding},
                {
                  x: {type: 'ordinal'},
                  y: {type: 'nominal'},
                },
              ),
            );
            const {inOut, xold, yold} = await setup(view, 'drag', i, ['x', 'y']);
            await expect(await view.toSVG()).toMatchFileSnapshot(
              `./snapshots/interval/zoom/${bind}/ord_${inOut}-0.svg`,
            );

            const zoomed = (await zoom(view, 'zoom', i, inOut, null, bind === unbound))[0];
            const xnew = zoomed.values[0].sort(cmp);
            const ynew = zoomed.values[1].sort(cmp);

            if (inOut === 'in') {
              expect(xnew.length).toBeLessThanOrEqual(xold.length);
              expect(ynew.length).toBeLessThanOrEqual(yold.length);
            } else {
              expect(xnew.length).toBeGreaterThanOrEqual(xold.length);
              expect(ynew.length).toBeGreaterThanOrEqual(yold.length);
            }

            await expect(await view.toSVG()).toMatchFileSnapshot(
              `./snapshots/interval/zoom/${bind}/ord_${inOut}-1.svg`,
            );
          }
        });
      } else {
        for (const specType of compositeTypes) {
          it(`should work with shared scales in ${specType} views`, async () => {
            for (let i = 0; i < hits.bins.length; i++) {
              const view = await embed(
                getSpec(specType, 0, {type, ...binding}, {resolve: {scale: {x: 'shared', y: 'shared'}}}),
              );
              const parent = parentSelector(specType, i);
              const {inOut, xold, yold} = await setup(view, specType as any, i, ['x', 'y'], parent);
              const zoomed = (await zoom(view, 'bins', i, inOut, null, false /* bind === unbound */))[0];
              const xnew = zoomed.values[0].sort(cmp);
              const ynew = zoomed.values[1].sort(cmp);
              expect(xnew[0])[assertExtent[inOut][0]](xold[0]);
              expect(xnew[1])[assertExtent[inOut][1]](xold[1]);
              expect(ynew[0])[assertExtent[inOut][0]](yold[0]);
              expect(ynew[1])[assertExtent[inOut][1]](yold[1]);
              await expect(await view.toSVG()).toMatchFileSnapshot(
                `./snapshots/interval/zoom/${bind}/${specType}_${inOut}.svg`,
              );
            }
          });
        }
      }
    });
  }

  it('should work with geo intervals', async () => {
    const view = await embed(getGeoSpec());
    const drag = await brush(view, 'drag', 1);
    expect(drag).toHaveLength(13);
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/zoom/geo-0.svg`);

    for (let i = 0; i < hits.zoom.length; i++) {
      const zoomed: any = await zoom(view, 'zoom', i, i % 2 ? 'out' : 'in', null, true);
      expect(zoomed.length).toBeGreaterThan(0);
      await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/zoom/geo-${i + 1}.svg`);
    }
  });
});
