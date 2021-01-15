import {BinParams, isBinParams} from '../bin';
import {Field} from '../channeldef';
import {LogicalComposition, normalizeLogicalComposition} from '../logical';
import {SelectionParameter} from '../selection';
import {FacetedUnitSpec, GenericSpec, LayerSpec, RepeatSpec, UnitSpec} from '../spec';
import {SpecMapper} from '../spec/map';
import {isBin, isFilter, isLookup} from '../transform';
import {NormalizerParams} from './base';

export class SelectionCompatibilityNormalizer extends SpecMapper<
  NormalizerParams,
  FacetedUnitSpec<Field>,
  LayerSpec<Field>,
  UnitSpec<Field>
> {
  public map(spec: GenericSpec<FacetedUnitSpec<Field>, LayerSpec<Field>, RepeatSpec, Field>, params: NormalizerParams) {
    if (spec.transform) {
      spec.transform = spec.transform.map(t => {
        if (isFilter(t)) {
          return {filter: normalizePredicate(t)};
        } else if (isBin(t) && isBinParams(t.bin)) {
          return {
            ...t,
            bin: normalizeBinExtent(t.bin)
          };
        } else if (isLookup(t)) {
          const {selection, ...rest} = t.from as any;
          return selection
            ? {
                ...t,
                from: {param: selection, ...rest}
              }
            : t;
        }
        return t;
      });
    }

    return super.map(spec, params);
  }

  public mapUnit(spec: UnitSpec<Field>) {
    const {selection, ...rest} = spec as any;
    const encoding = {};
    const params: SelectionParameter[] = [];

    if (!selection) return spec;

    for (const [name, selDef] of Object.entries(selection)) {
      const {init, bind, ...select} = selDef as any;
      if (select.type === 'single') {
        select.type = 'point';
        select.toggle = false;
      } else if (select.type === 'multi') {
        select.type = 'point';
      }

      params.push({
        name,
        value: init,
        select,
        bind
      });
    }

    for (const [channel, enc] of Object.entries(spec.encoding)) {
      encoding[channel] = {
        ...normalizeChannelDef(enc),
        ...(enc.condition
          ? {
              condition: {
                ...normalizeChannelDef(enc.condition),
                test: normalizePredicate(enc.condition)
              }
            }
          : {})
      };
    }

    return {...rest, params, encoding};
  }
}

function normalizeChannelDef(obj: any) {
  const {bin, scale, selection, ...rest} = obj;
  const {selection: param, ...domain} = scale?.domain || {};
  return {
    ...rest,
    ...(bin ? {bin: isBinParams(bin) ? normalizeBinExtent(bin) : bin} : {}),
    ...(scale
      ? {
          scale: {
            ...scale,
            domain: param ? {...domain, param} : domain
          }
        }
      : {})
  };
}

function normalizeBinExtent(bin: BinParams): BinParams {
  const ext = bin.extent as any;
  if (ext?.selection) {
    const {selection, ...rest} = ext;
    return {...bin, extent: {...rest, param: selection}};
  }

  return bin;
}

function normalizePredicate(op: any) {
  // Normalize old compositions of selection names (e.g., selection: {and: ["one", "two"]})
  const normalizeSelectionComposition = (o: LogicalComposition<string>) => {
    return normalizeLogicalComposition(o, param => ({param} as any));
  };

  return op.selection
    ? normalizeSelectionComposition(op.selection)
    : normalizeLogicalComposition(op.test || op.filter, o =>
        o.selection ? normalizeSelectionComposition(o.selection) : o
      );
}
