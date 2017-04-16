import {DataFormat, isInlineData, isNamedData, isUrlData} from '../../data';
import {contains, hash} from '../../util';
import {VgData} from '../../vega.schema';
import {Model} from './../model';
import {DataFlowNode} from './dataflow';

export class SourceNode extends DataFlowNode {
  private _data: Partial<VgData>;

  private _name: string;

  constructor(model: Model) {
    super();

    const data = model.data || {name: 'source'};

    if (isInlineData(data)) {
      this._data = {
        values: data.values,
        format: {type: 'json'}
      };
    } else if (isUrlData(data)) {
      // Extract extension from URL using snippet from
      // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
      let defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
      if (!contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
        defaultExtension = 'json';
      }
      const dataFormat = data.format || {};

      // For backward compatibility for former `data.formatType` property
      const formatType: DataFormat = dataFormat.type || data['formatType'];
      const {property, feature, mesh} = dataFormat;

      const format = {
        type: formatType ? formatType : defaultExtension,
        ...(property ? {property} : {}),
        ...(feature ? {feature} : {}),
        ...(mesh ? {mesh} : {}),
      };

      this._data = {
        url: data.url,
        format
      };
    } else if (isNamedData(data)) {
      this._name = data.name;
      this._data = {};
    }
  }

  get data() {
    return this._data;
  }

  public hasName(): boolean {
    return !!this._name;
  }

  get dataName() {
    return this._name;
  }

  set dataName(name: string) {
    this._name = name;
  }

  set parent(parent: DataFlowNode) {
    throw new Error('Source nodes have to be roots.');
  }

  public remove() {
    throw new Error('Source nodes are roots and cannot be removed.');
  }

  /**
   * Return a unique identifir for this data source.
   */
  public hash() {
    if (isInlineData(this._data)) {
      return hash(this._data);
    } else if (isUrlData(this._data)) {
      return `${this._data.url} ${hash(this._data.format)}`;
    } else {
      return this._name;
    }
  }

  public assemble(): VgData {
    return {
      name: this._name,
      ...this._data,
      transform: []
    };
  }
}
