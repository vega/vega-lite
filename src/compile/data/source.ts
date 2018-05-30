import {Data, DataFormatType, isInlineData, isNamedData, isUrlData} from '../../data';
import {contains, hash} from '../../util';
import {VgData} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class SourceNode extends DataFlowNode {
  private _data: Partial<VgData>;

  private _name: string;

  private _hash: string | number;

  constructor(data: Data) {
    super(null);  // source cannot have parent

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
        if (!contains(['json', 'csv', 'tsv', 'dsv', 'topojson'], defaultExtension)) {
          defaultExtension = 'json';
        }

        // defaultExtension has type string but we ensure that it is DataFormatType above
        data.format.type = defaultExtension as DataFormatType;
      }
    } else if (isNamedData(data)) {
      this._data = {};
    }

    // any dataset can be named
    if (data.name) {
      this._name = data.name;
    }

    if (data.format) {
      const {parse = null, ...format} = data.format;
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
      if (!this._hash) {
        // Hashing can be expensive for large inline datasets.
        this._hash = hash(this._data);
      }
      return this._hash;
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
