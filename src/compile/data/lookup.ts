import {LookupTransform} from '../../transform';
import {duplicate} from '../../util';
import {VgLookupTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class LookupNode extends DataFlowNode {
  private readonly secondaryDataName: string;

  public clone() {
    return new LookupNode(duplicate(this.transform));
  }

  constructor(private transform: LookupTransform) {
    super();
  }

  public assemble(): VgLookupTransform {
    // TODO: this.transform.from.fields isn't used
    // it'll be used either in a subsequent transform to isolate those variables and merge them in
    // or via some object name properties trickery
    return {
      type: 'lookup',
      from: 'foo', // this.transform.from.data.name,
      key: this.transform.from.key,
      fields: [this.transform.lookup],
      as: this.transform.as ? ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as]) : ['foo'],
      ...(this.transform.default ? {default: this.transform.default} : {})
    };
  }
}
