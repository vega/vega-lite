import {Data, DataFormatType, isInlineData, isNamedData, isUrlData} from '../../data';
import {contains, keys, omit} from '../../util';
import {VgData} from '../../vega.schema';
import {DataFormat} from './../../data';
import {DataFlowNode} from './dataflow';

export class SourceNode extends DataFlowNode {
  private _data: Partial<VgData>;

  private _name: string;

  constructor(data: Data) {
    super(null); // source cannot have parent

    data = data || {name: 'source'};
    const format = data.format ? {...omit(data.format, ['parse'])} : ({} as DataFormat);

    if (isInlineData(data)) {
      this._data = {values: data.values};
    } else if (isUrlData(data)) {
      this._data = {url: data.url};

      if (!format.type) {
        // Extract extension from URL using snippet from
        // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
        let defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
        if (!contains(['json', 'csv', 'tsv', 'dsv', 'topojson'], defaultExtension)) {
          defaultExtension = 'json';
        }

        // defaultExtension has type string but we ensure that it is DataFormatType above
        format.type = defaultExtension as DataFormatType;
      }
    } else if (isNamedData(data)) {
      this._data = {};
    }

    // any dataset can be named
    if (data.name) {
      this._name = data.name;
    }

    if (format && keys(format).length > 0) {
      this._data.format = format;
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

  public hash(): string | number {
    throw new Error('Cannot hash sources');
  }

  public assemble(): VgData {
    return {
      name: this._name,
      ...this._data,
      transform: []
    };
  }
}
