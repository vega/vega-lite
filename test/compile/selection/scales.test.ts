/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble';
import {Domain} from '../../../src/scale';
import {parseConcatModel, parseRepeatModel} from '../../util';

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
        scale: {
          color: 'independent',
          opacity: 'independent'
        }
      }
    });

    model.parseScale();
    model.parseSelection();

    const scales = assembleScalesForModel(model.children[1]);
    const xscale = scales[0];
    const yscale = scales[1];
    const cscale = scales[2];
    const oscale = scales[3];

    assert.isObject(xscale.domain);
    assert.property(xscale, 'domainRaw');
    assert.propertyVal(xscale.domainRaw, 'signal',
      "vlIntervalDomain(\"brush_store\", \"x\", null)");

    assert.isObject(yscale.domain);
    assert.property(yscale, 'domainRaw');
    assert.deepPropertyVal(yscale.domainRaw, 'signal',
      "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");

    assert.isObject(cscale.domain);
    assert.property(cscale, 'domainRaw');
    assert.propertyVal(cscale.domainRaw, 'signal',
      "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");

    assert.isObject(oscale.domain);
    assert.property(oscale, 'domainRaw');
    assert.propertyVal(oscale.domainRaw, 'signal', 'null');
  });

  it('should bind both scales in diagonal repeated views', function() {
    const model = parseRepeatModel({
      repeat: {
        row: ["Horsepower", "Acceleration"],
        column: ["Miles_per_Gallon", "Acceleration"]
      },
      spec: {
        data: {url: "data/cars.json"},
        mark: "point",
        selection: {
          grid: {
            type: "interval",
            resolve: "global",
            bind: "scales"
          }
        },
        encoding: {
          x: {field: {repeat: "column"}, type: "quantitative"},
          y: {field: {repeat: "row"}, type: "quantitative"},
          color: {field: "Origin", type: "nominal"}
        }
      }
    });

    model.parseScale();
    model.parseSelection();

    const scales = assembleScalesForModel(model.children[3]);
    assert.isTrue(scales.length === 2);
    assert.property(scales[0], 'domainRaw');
    assert.property(scales[1], 'domainRaw');
    assert.propertyVal(scales[0].domainRaw, 'signal', 'grid_Acceleration');
    assert.propertyVal(scales[1].domainRaw, 'signal', 'grid_Acceleration');
  });

  it('should merge domainRaw for layered views', function() {
    const model = parseConcatModel({
      data: {url: "data/sp500.csv"},
      vconcat: [
        {
          layer: [
            {
              mark: "point",
              encoding: {
                x: {
                  field: "date", type: "temporal",
                  scale: {domain: {selection: "brush"}}
                },
                y: {field: "price", type: "quantitative"}
              }
            }
          ]
        },
        {
          mark: "area",
          selection: {
            brush: {type: "interval", encodings: ["x"]}
          },
          encoding: {
            x: {field: "date", type: "temporal"},
            y: {field: "price", type: "quantitative"}
          }
        }
      ]
    });

    model.parseScale();
    model.parseSelection();
    const scales = assembleScalesForModel(model.children[0]);
    assert.property(scales[0], 'domainRaw');
    assert.propertyVal(scales[0].domainRaw, 'signal', 'vlIntervalDomain("brush_store", null, "date")');
  });
});
