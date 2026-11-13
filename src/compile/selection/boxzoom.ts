import {NewSignal, Signal} from 'vega';
import {isScaleChannel} from '../../channel.js';
import * as log from '../../log/index.js';
import {hasContinuousDomain} from '../../scale.js';
import type {Model} from '../model.js';
import {SelectionCompiler} from './index.js';
import {SelectionProjection} from './project.js';

/**
 * "Box zoom" for interval selections: on drag-release, commit the brush's
 * final data extent to the bound scale's domain (via `domainRaw`), instead of
 * updating it continuously like `bind: "scales"` does. The brush then clears
 * itself (piggybacking on the existing scale-trigger machinery that keeps a
 * brush glued to its data extent when a bound scale's domain changes for
 * other reasons -- here we simply always reset to empty instead).
 *
 * A dedicated "commit" signal per projected field (see `commitSignalName`
 * below) is used, rather than routing through the selection's own
 * store/resolve (which updates on every intermediate drag event), so that
 * the scale's domain only jumps once, at release. The commit signal ignores
 * updates while no valid drag extent is present (`isValid(...)`), which
 * keeps it inert to unrelated `pointerup` events elsewhere on the page after
 * the brush has cleared.
 *
 * Not supported for geographic (projected longitude/latitude) views: those
 * don't have per-channel continuous scales to bind a domain to -- a
 * projection's pan/zoom state is a single `scale`/`translate` pair instead.
 *
 * Also requires `resolve: "global"` (the default), mirroring `scales.ts`
 * (`bind: "scales"`): `"union"`/`"intersect"` describe how per-datum
 * membership tests combine across multiple selection instances, which
 * doesn't have well-defined semantics for mutating a single shared scale's
 * domain the way box zoom does.
 *
 * In multi-view compositions (concat/facet/repeat, but not layer -- see
 * `isTopLevelLayer`), vega-lite hoists each unit's scales up to a shared
 * ancestor group, while selection signals stay scoped locally to the unit
 * that defines them. Left alone, that's a name-resolution mismatch: the
 * hoisted scale's `domainRaw` couldn't see the commit signal at all ("cannot
 * resolve signal" at Vega parse time). `scales.ts` (`bind: "scales"`) hits
 * the exact same problem and solves it with a top-level placeholder signal
 * plus Vega's `push: 'outer'` (which mirrors a nested signal's value up to
 * an outer-scoped signal of the same name); `topLevelSignals`/`signals`
 * below do the same, minus the extra store/resolve bookkeeping `scales.ts`
 * needs (our commit signal is independent of that machinery already).
 *
 * `isTopLevelLayer` inlines the `model?.type === 'layer'` check itself
 * (rather than importing `isLayerModel` from `../model.js`) and only takes
 * `Model` as a type-only import: `../model.js` is a large, heavily-imported
 * module, and a real (value) import of it from here forms a cycle back
 * through `./index.js` that can leave `boxZoom`'s default export
 * unresolved (`undefined`) in `selectionCompilers` depending on module
 * evaluation order -- e.g., a test file that imports this module directly.
 *
 * The commit signal is named off `proj.signals.data` (e.g. `grid_Horsepower`,
 * already a selection-name+field-derived, sanitized identifier) rather than
 * just `<name>_<channel>`: a `repeat`/SPLOM-style composition reuses the
 * same selection and channel (e.g. `x`) across cells projecting *different*
 * fields, each getting hoisted to the same shared multiview scope (per the
 * note above) -- keying only on channel would collide their commit signals
 * and make every cell zoom together. Keying on the field-derived name keeps
 * cells with different fields independent, while cells that legitimately
 * share the same field (true multi-cell binding, as `scales.ts` supports)
 * still share one commit signal, consistent with `resolve: "global"`.
 */
const boxZoom: SelectionCompiler<'interval'> = {
  defined: (selCmpt) => selCmpt.type === 'interval' && !!selCmpt.boxZoom && selCmpt.bind !== 'scales',

  parse: (model, selCmpt) => {
    if (model.hasProjection) {
      log.warn(log.message.BOX_ZOOM_NOT_SUPPORTED_FOR_PROJECTION);
      return;
    }

    if (selCmpt.resolve !== 'global') {
      log.warn(log.message.BOX_ZOOM_REQUIRES_GLOBAL_RESOLVE);
      return;
    }

    const bound: SelectionProjection[] = (selCmpt.scales = selCmpt.scales ?? []);

    for (const proj of selCmpt.project.items) {
      const channel = proj.channel;
      if (!isScaleChannel(channel)) {
        continue;
      }

      const scale = model.getScaleComponent(channel);
      const scaleType = scale ? scale.get('type') : undefined;

      if (!scale || !hasContinuousDomain(scaleType)) {
        log.warn(log.message.SCALE_BINDINGS_CONTINUOUS);
        continue;
      }

      scale.set('selectionExtent', {param: commitSignalName(proj)}, true);
      bound.push(proj);
    }
  },

  topLevelSignals: (model, selCmpt, signals) => {
    if (!model.parent || isTopLevelLayer(model)) {
      return signals;
    }

    const bound = (selCmpt.scales ?? []).filter((proj) => !signals.some((s) => s.name === commitSignalName(proj)));

    return signals.concat(bound.map((proj) => ({name: commitSignalName(proj)})));
  },

  signals: (model, selCmpt, signals) => {
    const release = selCmpt.events.filter((evt) => evt.between).map((evt) => evt.between[1]);

    for (const proj of selCmpt.scales ?? []) {
      const name = commitSignalName(proj);
      if (!release.length || signals.some((s) => s.name === name)) {
        continue;
      }

      const dname = proj.signals.data;
      // The brush's pixel-space extent isn't sorted (it's [start, current]
      // in whichever order the user dragged), and inverting it through a
      // channel whose scale range is flipped (e.g., y, which ranges from
      // height to 0) can additionally produce a descending data-space pair
      // regardless of drag direction. Sort before committing so the scale's
      // domain is never accidentally reversed.
      const sorted = `${dname}[0] < ${dname}[1] ? ${dname} : [${dname}[1], ${dname}[0]]`;
      signals.push({
        name,
        value: null,
        on: [
          // Commit the brush's data extent once the drag ends. `isValid`
          // guards against clobbering the committed zoom when a *different*,
          // unrelated pointerup fires after the brush has cleared and dname
          // has gone back to null.
          {events: release, update: `isValid(${dname}) ? (${sorted}) : ${name}`},
          // Reset back to the un-zoomed domain on the selection's clear event
          // (double-click, by default).
          ...(selCmpt.clear ? [{events: selCmpt.clear, update: 'null'}] : []),
        ],
      } as Signal);
    }

    // Nested (non-layer) multiview units mirror their commit signal up to
    // the top-level placeholder declared in `topLevelSignals`, since that's
    // the scope the hoisted scale's `domainRaw` actually resolves names in.
    if (model.parent && !isTopLevelLayer(model)) {
      for (const proj of selCmpt.scales ?? []) {
        const name = commitSignalName(proj);
        const signal = signals.find((s) => s.name === name) as NewSignal;
        if (signal) {
          (signal as any).push = 'outer';
          delete signal.value;
        }
      }
    }

    return signals;
  },
};

export default boxZoom;

function commitSignalName(proj: SelectionProjection) {
  return `${proj.signals.data}_zoom`;
}

function isTopLevelLayer(model: Model): boolean {
  return model.parent?.type === 'layer' && (!model.parent.parent || isTopLevelLayer(model.parent.parent));
}
