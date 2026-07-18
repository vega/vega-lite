import {MarkInvalidDataMode} from '../../invalid.js';

import {DataSourceType} from '../../data.js';
import {normalizeInvalidDataMode} from './normalizeInvalidDataMode.js';

type PreOrPostFilteringInvalidValues = 'include-invalid-values' | 'exclude-invalid-values';

export interface DataSourcesForHandlingInvalidValues {
  marks: PreOrPostFilteringInvalidValues;
  scales: PreOrPostFilteringInvalidValues;
}
interface GetDataSourcesForHandlingInvalidValuesProps {
  invalid: MarkInvalidDataMode | null | undefined;
  isPath: boolean;
}

export function getDataSourcesForHandlingInvalidValues({
  invalid,
  isPath,
}: GetDataSourcesForHandlingInvalidValuesProps): DataSourcesForHandlingInvalidValues {
  const normalizedInvalid = normalizeInvalidDataMode(invalid, {isPath});

  switch (normalizedInvalid) {
    case 'filter':
      // Both marks and scales use post-filter data
      return {
        marks: 'exclude-invalid-values',
        scales: 'exclude-invalid-values',
      };
    case 'break-paths-show-domains':
      return {
        // Path-based marks use pre-filter data so we know to skip these invalid points in the path.
        // For non-path based marks, we skip by not showing them at all.
        marks: isPath ? 'include-invalid-values' : 'exclude-invalid-values',
        scales: 'include-invalid-values',
      };
    case 'break-paths-filter-domains':
      // For path marks, the marks will use unfiltered data (and skip points). But we need a separate data sources to feed the domain.
      // For non-path marks, we can use the filtered data for both marks and scales.
      return {
        marks: isPath ? 'include-invalid-values' : 'exclude-invalid-values',
        // Unlike 'break-paths-show-domains', 'break-paths-filter-domains' uses post-filter data to feed scale.
        scales: 'exclude-invalid-values',
      };
    case 'show':
      return {
        marks: 'include-invalid-values',
        scales: 'include-invalid-values',
      };
  }
}

export function getScaleDataSourceForHandlingInvalidValues(
  props: GetDataSourcesForHandlingInvalidValuesProps,
): DataSourceType {
  const {marks, scales} = getDataSourcesForHandlingInvalidValues(props);
  if (marks === scales) {
    // If both marks and scales use the same data, there is only the main data source.
    return DataSourceType.Main;
  }
  // If marks and scales use differetnt data, return the pre/post-filter data source accordingly.
  return scales === 'include-invalid-values' ? DataSourceType.PreFilterInvalid : DataSourceType.PostFilterInvalid;
}
