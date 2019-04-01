import { isInlineData, isNamedData, isUrlData } from '../../data';
import { contains, keys, omit } from '../../util';
import { DataFlowNode } from './dataflow';
export class SourceNode extends DataFlowNode {
    constructor(data) {
        super(null); // source cannot have parent
        data = data || { name: 'source' };
        const format = data.format ? Object.assign({}, omit(data.format, ['parse'])) : {};
        if (isInlineData(data)) {
            this._data = { values: data.values };
        }
        else if (isUrlData(data)) {
            this._data = { url: data.url };
            if (!format.type) {
                // Extract extension from URL using snippet from
                // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
                let defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
                if (!contains(['json', 'csv', 'tsv', 'dsv', 'topojson'], defaultExtension)) {
                    defaultExtension = 'json';
                }
                // defaultExtension has type string but we ensure that it is DataFormatType above
                format.type = defaultExtension;
            }
        }
        else if (isNamedData(data)) {
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
    hasName() {
        return !!this._name;
    }
    get dataName() {
        return this._name;
    }
    set dataName(name) {
        this._name = name;
    }
    set parent(parent) {
        throw new Error('Source nodes have to be roots.');
    }
    remove() {
        throw new Error('Source nodes are roots and cannot be removed.');
    }
    hash() {
        throw new Error('Cannot hash sources');
    }
    assemble() {
        return Object.assign({ name: this._name }, this._data, { transform: [] });
    }
}
//# sourceMappingURL=source.js.map