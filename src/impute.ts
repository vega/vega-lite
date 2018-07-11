import {ImputeSequence} from './transform';
import {ImputeMethods} from './vega.schema';

export interface ImputeParams {
  /**
   * The imputation method to use for the field value of imputed data objects.
   * One of `value`, `mean`, `median`, `max` or `min`.
   *
   * __Default value:__  `"value"`
   */
  method?: ImputeMethods;

  /**
   * The field value to use when the imputation `method` is `"value"`.
   */
  value?: any;

  /**
   * An optional array of key values that should be considered for imputation.
   * If provided, this array will be used in addition to the key values observed within the input data.
   */
  keyvals?: any[] | ImputeSequence;

  /**
   * The frame over which the `method` will be applied.
   */
  frame?: (null | number)[];
}
