import {isArray} from 'vega';
import {BinParams, isBinParams} from '../bin';
import {ChannelDef, Field, isConditionalDef, isFieldDef, isScaleFieldDef} from '../channeldef';
import {LogicalComposition, normalizeLogicalComposition} from '../logical';
import {FacetedUnitSpec, GenericSpec, LayerSpec, RepeatSpec, UnitSpec} from '../spec';
import {SpecMapper} from '../spec/map';
import {isBin, isFilter, isLookup} from '../transform';
import {duplicate, entries, vals} from '../util';
import {NormalizerParams} from './base';

export class SelectionCompatibilityNormalizer extends SpecMapper<
  NormalizerParams,
  FacetedUnitSpec<Field>,
  LayerSpec<Field>,
  UnitSpec<Field>
> {
  public map(
    spec: GenericSpec<FacetedUnitSpec<Field>, LayerSpec<Field>, RepeatSpec, Field>,
    normParams: NormalizerParams
  ) {
    normParams.emptySelections ??= {};
    normParams.selectionPredicates ??= {};
    spec = normalizeTransforms(spec, normParams);
    return super.map(spec, normParams);
  }

  public mapLayerOrUnit(spec: FacetedUnitSpec<Field> | LayerSpec<Field>, normParams: NormalizerParams) {
    spec = normalizeTransforms(spec, normParams);

    if (spec.encoding) {
      const encoding = {};
      for (const [channel, enc] of entries(spec.encoding)) {
        encoding[channel] = normalizeChannelDef(enc, normParams);
      }

      spec = {...spec, encoding};
    }

    return super.mapLayerOrUnit(spec, normParams);
  }

  public mapUnit(spec: UnitSpec<Field>, normParams: NormalizerParams) {
    const {selection, ...rest} = spec as any;
    if (selection) {
      return {
        ...rest,
        params: entries(selection).map(([name, selDef]) => {
          const {init: value, bind, empty, ...select} = selDef as any;
          if (select.type === 'single') {
            select.type = 'point';
            select.toggle = false;
          } else if (select.type === 'multi') {
            select.type = 'point';
          }

          // Propagate emptiness forwards and backwards
          normParams.emptySelections[name] = empty !== 'none';
          for (const pred of vals(normParams.selectionPredicates[name] ?? {})) {
            pred.empty = empty !== 'none';
          }

          return {name, value, select, bind};
        })
      };
    }

    return spec;
  }
}

function normalizeTransforms(spec: any, normParams: NormalizerParams) {
  const {transform: tx, ...rest} = spec;
  if (tx) {
    const transform = tx.map((t: any) => {
      if (isFilter(t)) {
        return {filter: normalizePredicate(t, normParams)};
      } else if (isBin(t) && isBinParams(t.bin)) {
        return {
          ...t,
          bin: normalizeBinExtent(t.bin)
        };
      } else if (isLookup(t)) {
        const {selection: param, ...from} = t.from as any;
        return param
          ? {
              ...t,
              from: {param, ...from}
            }
          : t;
      }
      return t;
    });

    return {...rest, transform};
  }

  return spec;
}

function normalizeChannelDef(obj: any, normParams: NormalizerParams): ChannelDef {
  const enc = duplicate(obj);

  if (isFieldDef(enc) && isBinParams(enc.bin)) {
    enc.bin = normalizeBinExtent(enc.bin);
  }

  if (isScaleFieldDef(enc) && (enc.scale?.domain as any)?.selection) {
    const {selection: param, ...domain} = enc.scale.domain as any;
    enc.scale.domain = {...domain, ...(param ? {param} : {})};
  }

  if (isConditionalDef(enc)) {
    if (isArray(enc.condition)) {
      enc.condition = enc.condition.map((c: any) => {
        const {selection, param, test, ...cond} = c;
        return param ? c : {...cond, test: normalizePredicate(c, normParams)};
      });
    } else {
      const {selection, param, test, ...cond} = normalizeChannelDef(enc.condition, normParams) as any;
      enc.condition = param
        ? enc.condition
        : {
            ...cond,
            test: normalizePredicate(enc.condition, normParams)
          };
    }
  }

  return enc;
}

function normalizeBinExtent(bin: BinParams): BinParams {
  const ext = bin.extent as any;
  if (ext?.selection) {
    const {selection: param, ...rest} = ext;
    return {...bin, extent: {...rest, param}};
  }

  return bin;
}

function normalizePredicate(op: any, normParams: NormalizerParams) {
  // Normalize old compositions of selection names (e.g., selection: {and: ["one", "two"]})
  const normalizeSelectionComposition = (o: LogicalComposition<string>) => {
    return normalizeLogicalComposition(o, param => {
      const empty = normParams.emptySelections[param] ?? true;
      const pred = {param, empty};
      normParams.selectionPredicates[param] ??= [];
      normParams.selectionPredicates[param].push(pred);
      return pred as any;
    });
  };

  return op.selection
    ? normalizeSelectionComposition(op.selection)
    : normalizeLogicalComposition(op.test || op.filter, o =>
        o.selection ? normalizeSelectionComposition(o.selection) : o
      );
}
