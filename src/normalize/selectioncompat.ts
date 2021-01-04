import {SelectionDef} from '../selection';
import {NormalizedUnitSpec} from '../spec';
import {SpecMapper} from '../spec/map';
import {NormalizerParams} from './base';

export class SelectionCompatibilityNormalizer extends SpecMapper<NormalizerParams, NormalizedUnitSpec> {
  public mapUnit(spec: NormalizedUnitSpec) {
    const oldSelection = (spec as any).selection;
    const selections: SelectionDef[] = [];

    if (!oldSelection) return spec;

    for (const [name, selDef] of Object.entries(oldSelection)) {
      const {init, bind, ...select} = selDef as any;
      if (select.type === 'single') {
        select.type = 'point';
        select.toggle = false;
      } else if (select.type === 'multi') {
        select.type = 'point';
      }

      selections.push({
        name,
        value: init,
        select,
        bind
      });
    }

    if (selections.length) {
      spec.selections = selections;
    }
    return spec;
  }
}
