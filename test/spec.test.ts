/* tslint:disable:quotemark */

import {assert} from 'chai';

import {normalize} from '../src/spec';


describe('normalize()', function () {
  it('should convert single spec with row or column into a composite spec', function() {
    const spec: any = {
      "data": {"url": "data/movies.json"},
      "mark": "point",
      "encoding": {
        "column": {"field": "MPAA_Rating","type": "ordinal"},
        "x": {"field": "Worldwide_Gross","type": "quantitative"},
        "y": {"field": "US_DVD_Sales","type": "quantitative"}
      }
    };

    assert.deepEqual(normalize(spec), {
      "data": {"url": "data/movies.json"},
      "facet": {
        "column": {"field": "MPAA_Rating","type": "ordinal"}
      },
      "spec": {
        "mark": "point",
        "encoding": {
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      }
    });
  });

});
