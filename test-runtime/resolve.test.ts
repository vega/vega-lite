import {
  brush,
  compositeTypes,
  hits as hitsMaster,
  multiviewRegion,
  parentSelector,
  pt,
  resolutions,
  selectionTypes,
  getSpec,
  unitNameRegex,
  embed,
} from './util.js';
import {describe, expect, it} from 'vitest';
import {View} from 'vega';

// Define proper types for the selection functions
type SelectionFn = {
  point: (view: View, key: string, idx: number, parent?: string) => Promise<any[] | HTMLElement>;
  interval: (
    view: View,
    key: string,
    idx: number,
    parent?: string,
    targetBrush?: boolean,
  ) => Promise<any[] | HTMLElement>;
  region: (key: string, idx: number, parent?: string) => void;
};

const fns: SelectionFn = {
  point: pt,
  interval: brush,
  region: multiviewRegion,
};

for (const type of selectionTypes) {
  const hits = hitsMaster[type] as Record<string, any>;

  describe(`${type} selections at runtime`, () => {
    compositeTypes.forEach((specType) => {
      describe(`in ${specType} views`, () => {
        /**
         * Loop through the views, click to add a selection instance.
         * Store size should stay constant, but unit names should vary.
         */
        it('should have one global selection instance', async () => {
          if (!hits[specType]) return;
          const selection = {
            type,
            resolve: 'global',
            ...(specType === 'facet' && type !== 'region' ? {encodings: ['y']} : {}),
          };

          for (let i = 0; i < hits[specType].length; i++) {
            const view = await embed(getSpec(specType, i, selection));
            const parent = parentSelector(specType, i);
            let store;
            if (type === 'region') {
              fns.region(specType, i, parent);
              store = (view.getState().data['sel_store'] ?? []) as any[];
            } else {
              const result = await fns[type](view, specType, i, parent);
              store = Array.isArray(result) ? result : [];
            }
            expect(store).toHaveLength(1);
            if ((specType === 'repeat' || specType === 'facet') && store[0]?.unit) {
              expect(store[0].unit).toMatch(unitNameRegex(specType, i));
            }
            await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/${type}/${specType}/global_${i}.svg`);

            if (i === hits[specType].length - 1) {
              let cleared;
              if (type === 'region') {
                fns.region(`${specType}_clear`, 0, parent);
                cleared = (view.getState().data['sel_store'] ?? []) as any[];
              } else {
                const result = await fns[type](view, `${specType}_clear`, 0, parent);
                cleared = Array.isArray(result) ? result : [];
              }
              expect(cleared).toHaveLength(0);
              await expect(await view.toSVG()).toMatchFileSnapshot(
                `./snapshots/${type}/${specType}/global_clear_${i}.svg`,
              );
            }
          }
        });

        for (const resolve of resolutions) {
          it(`should have one selection instance per ${resolve} view`, async () => {
            if (!hits[specType]) return;
            const selection = {
              type,
              resolve,
              ...(specType === 'facet' && type !== 'region' ? {encodings: ['x']} : {}),
            };

            const view1 = await embed(getSpec(specType, 0, selection));
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              let store;
              if (type === 'region') {
                fns.region(specType, i, parent);
                store = (view1.getState().data['sel_store'] ?? []) as any[];
              } else {
                const result = await fns[type](view1, specType, i, parent);
                store = Array.isArray(result) ? result : [];
              }
              expect(store).toHaveLength(i + 1);
              if ((specType === 'repeat' || specType === 'facet') && store[i]?.unit) {
                expect(store[i].unit).toMatch(unitNameRegex(specType, i));
              }
              await expect(await view1.toSVG()).toMatchFileSnapshot(
                `./snapshots/${type}/${specType}/${resolve}_${i}.svg`,
              );
            }

            const view2 = await embed(getSpec(specType, 1, {type, resolve, encodings: ['x']}));
            for (let i = 0; i < hits[specType].length; i++) {
              const parent = parentSelector(specType, i);
              if (type === 'region') {
                fns.region(specType, i, parent);
              } else {
                await fns[type](view2, specType, i, parent);
              }
            }

            for (let i = (hits[`${specType}_clear`] as any[])?.length - 1; i >= 0; i--) {
              const parent = parentSelector(specType, i);
              let store;
              if (type === 'region') {
                fns.region(`${specType}_clear`, i, parent);
                store = (view2.getState().data['sel_store'] ?? []) as any[];
              } else {
                const result = await fns[type](view2, `${specType}_clear`, i, parent);
                store = Array.isArray(result) ? result : [];
              }
              expect(store).toHaveLength(i);
              if ((specType === 'repeat' || specType === 'facet') && i > 0 && store[i - 1]?.unit) {
                expect(store[i - 1].unit).toMatch(unitNameRegex(specType, i - 1));
              }
              await expect(await view2.toSVG()).toMatchFileSnapshot(
                `./snapshots/${type}/${specType}/${resolve}_clear_${i}.svg`,
              );
            }
          });
        }
      });
    });
  });
}
