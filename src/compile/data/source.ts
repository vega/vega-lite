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

    const data = model.data;

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
      const dataFormat: DataFormat = data.format || {};

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
    }
  }

  get data() {
    return this._data;
  }

  public hasName() {
    return this._name;
  }

  set dataName(name: string) {
    this._name = name;
  }

  /**
   * Return a unique identifir for this data source.
   */
  public hash() {
    if (isInlineData(this._data)) {
      return hash(this._data);
    } else if (isUrlData) {
      return `${this._data.url} ${hash(this._data.format)}`;
    } else if (isNamedData) {
      return this._data.name;
    }
    throw new Error('Unsupported source');
  }

  public assemble(): VgData {
    return {
      name: this._name,
      ...this._data,
      transform: []
    };
  }
}
