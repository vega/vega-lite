import {WordcloudTransform as VgWordcloudTransform} from 'vega';
import {WordcloudTransform} from '../../transform.js';
import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';

const WC_DEFAULT_OUTPUT = ['x', 'y', 'font', 'fontSize', 'fontStyle', 'fontWeight', 'angle'] as const;

export class WordcloudTransformNode extends DataFlowNode {
  public clone() {
    return new WordcloudTransformNode(null, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private transform: WordcloudTransform,
  ) {
    super(parent);
    this.transform = duplicate(transform);
    if (!this.transform.as) {
      this.transform.as = [...WC_DEFAULT_OUTPUT] as [string, string, string, string, string, string, string];
    }
  }

  public dependentFields() {
    const fields = new Set([this.transform.wordcloud]);
    const {fontSize, rotate} = this.transform;
    if (typeof fontSize === 'object' && 'field' in fontSize) {
      fields.add((fontSize as {field: string}).field);
    }
    if (typeof rotate === 'object' && 'field' in rotate) {
      fields.add((rotate as {field: string}).field);
    }
    return fields;
  }

  public producedFields() {
    return new Set(this.transform.as);
  }

  public hash() {
    return `WordcloudTransform ${hash(this.transform)}`;
  }

  public assemble(): VgWordcloudTransform {
    const {wordcloud, size, fontSize, rotate, as, ...rest} = this.transform;

    const vgFontSize =
      fontSize !== undefined
        ? typeof fontSize === 'object' && 'field' in fontSize
          ? {field: (fontSize as {field: string}).field}
          : (fontSize as any)
        : undefined;

    const vgRotate =
      rotate !== undefined
        ? typeof rotate === 'object' && 'field' in rotate
          ? {field: (rotate as {field: string}).field}
          : (rotate as any)
        : undefined;

    const vgSize: any = size ?? [{signal: 'width'}, {signal: 'height'}];

    return {
      type: 'wordcloud',
      text: {field: wordcloud},
      size: vgSize,
      ...(vgFontSize !== undefined ? {fontSize: vgFontSize} : {}),
      ...(vgRotate !== undefined ? {rotate: vgRotate} : {}),
      as: as as any,
      ...(rest as any),
    } as VgWordcloudTransform;
  }
}
