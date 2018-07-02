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
   * The frame over which the `method` will be applied.
   */
  frame?: (null | number)[];
}
