/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleScale} from '../../../src/compile/scale/assemble';
import {Domain} from '../../../src/scale';
import {parseConcatModel} from '../../util';

describe('Selection + Scales', function() {
  it('assembles domainRaw from selection parameter', function() {
    const model = parseConcatModel({
      vconcat: [
        {
          mark: "area",
          selection: {
            brush: {type: "interval", encodings: ["x"]},
            brush2: {type: "multi", fields: ["price"], resolve: "intersect"}
          },
          encoding: {
            x: {field: "date", type: "temporal"},
            y: {field: "price", type: "quantitative"}
          }
        },
        {
          selection: {
            brush3: {type: "interval"}
          },
          mark: "area",
          encoding: {
            x: {
              field: "date", type: "temporal",
              scale: {domain: {selection: "brush", encoding: "x"}}
            },
            y: {
              field: "price", type: "quantitative",
              scale: {domain: {selection: "brush2", field: "price"}}
            },
            color: {
              field: "symbol", type: "nominal",
              scale: {domain: {selection: "brush2"} as Domain}
            },
            opacity: {
              field: "symbol", type: "nominal",
              scale: {domain: {selection: "brush3"} as Domain}
            }
          }
        }
      ],
      resolve: {
        color: {scale: 'independent'},
        opacity: {scale: 'independent'}
      }
    });

    model.parseScale();
    model.parseSelection();

    const scales = assembleScale(model.children[1]);
    const xscale = scales[0];
    const yscale = scales[1];
    const cscale = scales[2];
    const oscale = scales[3];

    assert.isObject(xscale.domain);
    assert.property(xscale, 'domainRaw');
    assert.propertyVal(xscale.domainRaw, 'signal',
      "vlIntervalDomain(\"brush_store\", \"x\", null, \"union\", \"all\")");

    assert.isObject(yscale.domain);
    assert.property(yscale, 'domainRaw');
    assert.deepPropertyVal(yscale.domainRaw, 'signal',
      "vlPointDomain(\"brush2_store\", null, \"price\", \"intersect\", \"all\")");

    assert.isObject(cscale.domain);
    assert.property(cscale, 'domainRaw');
    assert.propertyVal(cscale.domainRaw, 'signal',
      "vlPointDomain(\"brush2_store\", null, \"price\", \"intersect\", \"all\")");

    assert.isObject(oscale.domain);
    assert.property(oscale, 'domainRaw');
    assert.propertyVal(oscale.domainRaw, 'signal', 'null');
  });
});
