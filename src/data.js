import {hasProperty} from './util.js';
export function isUrlData(data) {
  return hasProperty(data, 'url');
}
export function isInlineData(data) {
  return hasProperty(data, 'values');
}
export function isNamedData(data) {
  return hasProperty(data, 'name') && !isUrlData(data) && !isInlineData(data) && !isGenerator(data);
}
export function isGenerator(data) {
  return data && (isSequenceGenerator(data) || isSphereGenerator(data) || isGraticuleGenerator(data));
}
export function isSequenceGenerator(data) {
  return hasProperty(data, 'sequence');
}
export function isSphereGenerator(data) {
  return hasProperty(data, 'sphere');
}
export function isGraticuleGenerator(data) {
  return hasProperty(data, 'graticule');
}
export var DataSourceType;
(function (DataSourceType) {
  DataSourceType[(DataSourceType['Raw'] = 0)] = 'Raw';
  /** Main data source for marks */
  DataSourceType[(DataSourceType['Main'] = 1)] = 'Main';
  DataSourceType[(DataSourceType['Row'] = 2)] = 'Row';
  DataSourceType[(DataSourceType['Column'] = 3)] = 'Column';
  DataSourceType[(DataSourceType['Lookup'] = 4)] = 'Lookup';
  /** Pre-filter-invalid data source for scale domains */
  DataSourceType[(DataSourceType['PreFilterInvalid'] = 5)] = 'PreFilterInvalid';
  /** Post-filter-invalid data source for scale domains */
  DataSourceType[(DataSourceType['PostFilterInvalid'] = 6)] = 'PostFilterInvalid';
})(DataSourceType || (DataSourceType = {}));
//# sourceMappingURL=data.js.map
