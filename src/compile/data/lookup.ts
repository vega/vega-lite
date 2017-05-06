import {Data} from '../../data';
import {LookupTransform} from '../../transform';
import {duplicate} from '../../util';
import {VgLookupTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class LookupNode extends DataFlowNode {
  private readonly secondaryDataName: string;

  public clone() {
    return new LookupNode(duplicate(this.transform));
  }

  constructor(private transform: LookupTransform) {
    super();
  }

  public static make(model: UnitModel, secondaryData: Data) {
    const transform: LookupTransform = null;

    // replace transform.form with some kind of object where we can collect:
    // from.fields
    // from.key
    // and where we can replace from: with the NAME of the sourceNode

    return new LookupNode(transform);
  }

  public assemble(): VgLookupTransform {
    // TODO: this.transform.from.fields isn't used
    const DEFAULT_AS = '_lookup';
    // it'll be used either in a subsequent transform to isolate those variables and merge them in
    // or via some object name properties trickery
    return {
      type: 'lookup',
      from: 'foo', // this.transform.from.data.name,
      key: this.transform.from.key,
      fields: [this.transform.lookup],
      as: this.transform.as
        ? ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as])
        : [DEFAULT_AS],
      ...(this.transform.default ? {default: this.transform.default} : {})
    };
  }
}
