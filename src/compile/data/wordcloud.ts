import {VgWordCloudTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class WordcloudNode extends DataFlowNode {
  public clone() {
    return new WordcloudNode(null, this.params);
  }

  constructor(parent: DataFlowNode, private params: true) {
    super(parent);
  }

  public assemble(): VgWordCloudTransform {
    return {
      type: 'wordcloud',
      ...(this.params === true ? {} : this.params)
    };
  }
}
