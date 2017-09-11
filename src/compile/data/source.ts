import {Data, DataFormat, DataFormatType, isInlineData, isNamedData, isUrlData} from '../../data';
import {contains, duplicate, hash, keys} from '../../util';
import {VgData} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

let counter = 0;

export class SourceNode extends DataFlowNode {
  private _data: Partial<VgData>;

  private _name: string;

  private _id: number;

  constructor(data: Data) {
    super();

    this._id = counter++;

    data = data || {name: 'source'};

    if (isInlineData(data)) {
      this._data = {values: data.values};
    } else if (isUrlData(data)) {
      this._data = {url: data.url};

      if (!data.format) {
        data.format = {};
      }

      if (!data.format || !data.format.type) {
        // Extract extension from URL using snippet from
        // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
        let defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
        if (!contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
          defaultExtension = 'json';
        }

        // defaultExtension has type string but we ensure that it is DataFormatType above
        data.format.type = defaultExtension as DataFormatType;
      }
    } else if (isNamedData(data)) {
      this._name = data.name;
      this._data = {};
    }

    if (!isNamedData(data)) {
      const {parse = null, ...format} = {
        // https://github.com/vega/vega-parser/pull/60
        type: 'json',
        ...data.format || {}
      };

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

  /**
   * Return a unique identifier for this data source.
   */
  public hash() {
    if (isInlineData(this._data)) {
      // We want to avoid hashes of very large dataset. We will not merge large embedded datasets.
      if (this._data.values.length > 1000) {
        return hash([this._data.format, this._id]);
      }
      return hash(this._data);
    } else if (isUrlData(this._data)) {
      return hash([this._data.url, this._data.format]);
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
