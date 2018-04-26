/* tslint:disable:quotemark */
import {assert} from 'chai';
import {normalize} from '../../src/compositemark/index';
import {defaultConfig} from '../../src/config';
import {Encoding} from '../../src/encoding';
import {GenericUnitSpec} from '../../src/spec';

describe("normalizeCallout", () => {
  const inputSpec: GenericUnitSpec<Encoding<any>, any> = {
    description: "A scatterplot showing horsepower and miles per gallons for various cars.",
    data: {
      url: "data/cars.json"
    },
    transform: [
      {filter: "datum.Horsepower == 132"}
    ],
    mark: {
      type: "callout"
    },
    encoding: {
      x: {
        field: "Horsepower",
        type: "quantitative"
      },
      y: {
        field: "Miles_per_Gallon",
        type: "quantitative"
      },
      text: {
        field: "Name",
        type: "nominal"
      }
    }
  };

  const normalizedSpec: any = normalize(inputSpec, defaultConfig);

  it("should produce two layers, one for label and one for line", () => {
    assert.equal(normalizedSpec.layer.length, 2);
  });

  it("description should stay the same", () => {
    assert.equal(normalizedSpec.description, inputSpec.description);
  });

  it("data should stay the same ", () => {
    assert.equal(normalizedSpec.data, inputSpec.data);
  });

  it("transform should be the same", () => {
    assert.equal(normalizedSpec.transform, inputSpec.transform);
  });

  it("callout line should have correct xOffset", () => {
    assert.approximately(normalizedSpec.layer[0].mark.xOffset, 0, 0.001);
  });

  it("callout line should have correct x2Offset", () => {
    // default line length = 30
    assert.approximately(normalizedSpec.layer[0].mark.x2Offset, Math.sqrt(450), 0.001);
  });

  it("callout line should have correct yOffset", () => {
    assert.approximately(normalizedSpec.layer[0].mark.yOffset, 0, 0.001);
  });

  it("callout line should have correct y2Offset", () => {
    assert.approximately(normalizedSpec.layer[0].mark.y2Offset, -Math.sqrt(450), 0.001);
  });

  it("callout label should have correct xOffset", () => {
    // default line length = 30, label offset = 2
    assert.approximately(normalizedSpec.layer[1].mark.xOffset, Math.sqrt(512), 0.001);
  });

  it("callout label should have correct yOffset", () => {
    assert.approximately(normalizedSpec.layer[1].mark.yOffset, -Math.sqrt(512), 0.001);
  });

  it("callout label encoding should stay the same", () => {
    assert.deepEqual(normalizedSpec.layer[1].encoding, inputSpec.encoding);
  });

  it("callout line encoding should have x2 and y2 channel", () => {
    assert.deepEqual(normalizedSpec.layer[0].encoding.x, inputSpec.encoding.x);
    assert.deepEqual(normalizedSpec.layer[0].encoding.x2, inputSpec.encoding.x);
    assert.deepEqual(normalizedSpec.layer[0].encoding.y, inputSpec.encoding.y);
    assert.deepEqual(normalizedSpec.layer[0].encoding.y2, inputSpec.encoding.y);
  });

  it("callout line should have style callout-line", () => {
    assert.equal(normalizedSpec.layer[0].mark.style, "callout-line");
  });

  it("callout label should have style callout-label", () => {
    assert.equal(normalizedSpec.layer[1].mark.style, "callout-label");
  });
});

