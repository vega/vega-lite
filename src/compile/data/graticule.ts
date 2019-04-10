import {GraticuleParams} from '../../data';
import {VgGraticuleTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class GraticuleNode extends DataFlowNode {
  public clone() {
    return new GraticuleNode(null, this.params);
  }

  constructor(parent: DataFlowNode, private params: true | GraticuleParams) {
    super(parent);
  }

  public assemble(): VgGraticuleTransform {
    return {
      type: 'graticule',
      ...(this.params === true ? {} : this.params)
    };
  }
}
