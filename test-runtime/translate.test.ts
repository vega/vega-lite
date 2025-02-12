import {
  bound,
  brush,
  compositeTypes,
  embed,
  getGeoSpec,
  getSpec,
  hits as hitsMaster,
  parentSelector,
  tuples,
  unbound,
} from './util.js';
import {describe, expect, it} from 'vitest';

describe('Translate interval selections at runtime', () => {
  const hits = hitsMaster.interval;

  for (const bind of [bound, unbound] as const) {
    describe(`${bind} intervals`, () => {
      beforeAll(() => {
        // testRender = testRenderFn(page, `interval/translate/${bind}`);
      });

      const type = 'interval';
      const binding = bind === bound ? {bind: 'scales'} : {};

      const assertExtent = {
        [unbound]: {
          x: ['toBeGreaterThan', 'toBeLessThan'],
          y: ['toBeLessThan', 'toBeGreaterThan'],
        },
        [bound]: {
          x: ['toBeLessThan', 'toBeGreaterThan'],
          y: ['toBeGreaterThan', 'toBeLessThan'],
        },
      } as const;

      it('should move back-and-forth', async () => {
        for (let i = 0; i < hits.translate.length; i++) {
          const view = await embed(getSpec('unit', i, {type, ...binding}));
          const drag = ((await brush(view, 'drag', i)) as [any])[0];
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/translate/${bind}/${i}-0.svg`);
          const translate = ((await brush(view, 'translate', i, null, bind === unbound)) as [any])[0];
          expect(translate.values[0][0])[assertExtent[bind].x[i]](drag.values[0][0]);
          expect(translate.values[0][1])[assertExtent[bind].x[i]](drag.values[0][1]);
          expect(translate.values[1][0])[assertExtent[bind].y[i]](drag.values[1][0]);
          expect(translate.values[1][1])[assertExtent[bind].y[i]](drag.values[1][1]);
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/translate/${bind}/${i}-1.svg`);
        }
      });

      it('should work with binned domains', async () => {
        for (let i = 0; i < hits.bins.length; i++) {
          const view = await embed(
            getSpec(
              'unit',
              1,
              {type, ...binding, encodings: ['y']},
              {
                x: {aggregate: 'count', type: 'quantitative'},
                y: {bin: true},
                color: {value: 'steelblue', field: undefined, type: undefined},
              },
            ),
          );
          const drag = ((await brush(view, 'bins', i)) as [any])[0];
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/translate/${bind}/bins_${i}-0.svg`,
          );
          const translate = ((await brush(view, 'bins_translate', i, null, bind === unbound)) as [any])[0];
          expect(translate.values[0][0])[assertExtent[bind].y[i]](drag.values[0][0]);
          expect(translate.values[0][1])[assertExtent[bind].y[i]](drag.values[0][1]);
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/translate/${bind}/bins_${i}-1.svg`,
          );
        }
      });

      it('should work with temporal domains', async () => {
        const values = tuples.map((d) => ({...d, a: new Date(2017, d.a)}));
        const toNumber = (a: any) => a[0].values[0].map((d: any) => +d);

        for (let i = 0; i < hits.translate.length; i++) {
          const view = await embed(
            getSpec('unit', i, {type, ...binding, encodings: ['x']}, {values, x: {type: 'temporal'}}),
          );
          const drag = toNumber(await brush(view, 'drag', i));
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/translate/${bind}/temporal_${i}-0.svg`,
          );
          const translate = toNumber(await brush(view, 'translate', i, null, bind === unbound));
          expect(translate[0])[assertExtent[bind].x[i]](drag[0]);
          expect(translate[1])[assertExtent[bind].x[i]](drag[1]);
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/translate/${bind}/temporal_${i}-1.svg`,
          );
        }
      });

      it('should work with log/pow scales', async () => {
        for (let i = 0; i < hits.translate.length; i++) {
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
          const drag = ((await brush(view, 'drag', i)) as [any])[0];
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/translate/${bind}/logpow_${i}-0.svg`,
          );
          const translate = ((await brush(view, 'translate', i, null, bind === unbound)) as [any])[0];
          expect(translate.values[0][0])[assertExtent[bind].x[i]](drag.values[0][0]);
          expect(translate.values[0][1])[assertExtent[bind].x[i]](drag.values[0][1]);
          expect(translate.values[1][0])[assertExtent[bind].y[i]](drag.values[1][0]);
          expect(translate.values[1][1])[assertExtent[bind].y[i]](drag.values[1][1]);
          await expect(await view.toSVG()).toMatchFileSnapshot(
            `./snapshots/interval/translate/${bind}/logpow_${i}-1.svg`,
          );
        }
      });

      if (bind === unbound) {
        it('should work with ordinal/nominal domains', async () => {
          for (let i = 0; i < hits.translate.length; i++) {
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
            const drag = ((await brush(view, 'drag', i)) as [any])[0];
            await expect(await view.toSVG()).toMatchFileSnapshot(
              `./snapshots/interval/translate/${bind}/ord_${i}-0.svg`,
            );
            const translate = ((await brush(view, 'translate', i, null, true)) as [any])[0];
            expect(translate.values[0][0])[assertExtent[bind].x[i]](drag.values[0][0]);
            expect(translate.values[0][1])[assertExtent[bind].x[i]](drag.values[0][1]);
            expect(translate.values[1][0])[assertExtent[bind].y[i]](drag.values[1][0]);
            expect(translate.values[1][1])[assertExtent[bind].y[i]](drag.values[1][1]);
            await expect(await view.toSVG()).toMatchFileSnapshot(
              `./snapshots/interval/translate/${bind}/ord_${i}-1.svg`,
            );
          }
        });
      } else {
        for (const specType of compositeTypes) {
          const assertExtents = {
            repeat: {
              x: ['toBeLessThan', 'toBeLessThan', 'toBeLessThan'],
              y: ['toBeGreaterThan', 'toBeGreaterThan', 'toBeGreaterThan'],
            },
            facet: {
              x: ['toBeLessThan', 'toBeLessThan', 'toBeLessThan'],
              y: ['toBeLessThan', 'toBeGreaterThan', 'toBeLessThan'],
            },
          };
          it(`should work with shared scales in ${specType} views`, async () => {
            for (let i = 0; i < (hits as any)[specType].length; i++) {
              const view = await embed(
                getSpec(specType, 0, {type, ...binding}, {resolve: {scale: {x: 'shared', y: 'shared'}}}),
              );
              const parent = parentSelector(specType, i);
              const xscale = (view as any)._runtime.scales.x.value.domain() as any[];
              const yscale = (view as any)._runtime.scales.y.value.domain() as any[];
              const drag = ((await page.evaluate(brush(specType, i, parent))) as [any])[0];
              (expect(drag.values[0][0]) as any)[(assertExtents as any)[specType].x[i]](xscale[0]);
              (expect(drag.values[0][1]) as any)[(assertExtents as any)[specType].x[i]](xscale[1]);
              (expect(drag.values[1][0]) as any)[(assertExtents as any)[specType].y[i]](yscale[0]);
              (expect(drag.values[1][1]) as any)[(assertExtents as any)[specType].y[i]](yscale[1]);
              await expect(await view.toSVG()).toMatchFileSnapshot(
                `./snapshots/interval/translate/${bind}/${specType}_${i}.svg`,
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
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/translate/geo-0.svg`);

    for (let i = 0; i < hits.translate.length; i++) {
      const translate: any = await brush(view, 'translate', i, null, true);
      expect(translate.length).toBeGreaterThan(0);
      await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/translate/geo-${i + 1}.svg`);
    }
  });
});
