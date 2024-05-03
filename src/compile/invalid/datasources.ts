import {MarkInvalidDataMode} from '../../invalid';

import {DataSourceType} from '../../data';
import {normalizeInvalidDataMode} from './normalizeInvalidDataMode';

type PreOrPostFilteringInvalidValues = 'pre-filter' | 'post-filter';

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
  isPath
}: GetDataSourcesForHandlingInvalidValuesProps): DataSourcesForHandlingInvalidValues {
  const normalizedInvalid = normalizeInvalidDataMode(invalid, {isPath});

  switch (normalizedInvalid) {
    case 'filter':
      // Both marks and scales use post-filter data
      return {
        marks: 'post-filter',
        scales: 'post-filter'
      };
    case 'break-paths-keep-domains':
      return {
        // Path-based marks use pre-filter data so we know to skip these invalid points in the path.
        // For non-path based marks, we skip by not showing them at all.
        marks: isPath ? 'pre-filter' : 'post-filter',
        scales: 'pre-filter'
      };
    case 'break-paths':
      // For path marks, the marks will use unfiltered data (and skip points). But we need a separate data sources to feed the domain.
      // For non-path marks, we can use the filtered data for both marks and scales.
      return {
        marks: isPath ? 'pre-filter' : 'post-filter',
        // Unlike 'break-paths-keep-domains', 'break-paths' uses post-filter data to feed scale.
        scales: 'post-filter'
      };
    case 'include':
      return {
        marks: 'pre-filter',
        scales: 'pre-filter'
      };
  }
}

export function getScaleDataSourceForHandlingInvalidValues(
  props: GetDataSourcesForHandlingInvalidValuesProps
): DataSourceType {
  const {marks, scales} = getDataSourcesForHandlingInvalidValues(props);
  if (marks === scales) {
    // If both marks and scales use the same data, there is only the main data source.
    return DataSourceType.Main;
  }
  // If marks and scales use differetnt data, return the pre/post-filter data source accordingly.
  return scales === 'pre-filter' ? DataSourceType.PreFilterInvalid : DataSourceType.PostFilterInvalid;
}
