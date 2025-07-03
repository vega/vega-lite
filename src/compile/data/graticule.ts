import {GraticuleTransform as VgGraticuleTransform} from 'vega';
import {GraticuleParams} from '../../data.js';
import {hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';

export class GraticuleNode extends DataFlowNode {
  public clone() {
    return new GraticuleNode(null, this.params);
  }

  constructor(
    parent: DataFlowNode,
    private params: true | GraticuleParams,
  ) {
    super(parent);
  }

  public dependentFields() {
    return new Set<string>();
  }

  public producedFields(): undefined {
    return undefined; // there should never be a node before graticule
  }

  public hash() {
    return `Graticule ${hash(this.params)}`;
  }

  public assemble(): VgGraticuleTransform {
    return {
      type: 'graticule',
      ...(this.params === true ? {} : this.params),
    };
  }
}
