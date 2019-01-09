/* tslint:disable:quotemark */
import { fieldDefs } from '../src/spec';
describe('fieldDefs()', () => {
    it('should get all non-duplicate fieldDefs from an encoding', () => {
        const spec = {
            data: { url: 'data/cars.json' },
            mark: 'point',
            encoding: {
                x: { field: 'Horsepower', type: 'quantitative' },
                y: { field: 'Miles_per_Gallon', type: 'quantitative' }
            }
        };
        expect(fieldDefs(spec)).toEqual(expect.arrayContaining([
            { field: 'Horsepower', type: 'quantitative' },
            { field: 'Miles_per_Gallon', type: 'quantitative' }
        ]));
    });
    it('should get all non-duplicate fieldDefs from all layer in a LayerSpec', () => {
        const layerSpec = {
            data: { url: 'data/stocks.csv', format: { type: 'csv' } },
            layer: [
                {
                    description: "Google's stock price over time.",
                    mark: 'line',
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' }
                    }
                },
                {
                    description: "Google's stock price over time.",
                    mark: 'point',
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' },
                        color: { field: 'symbol', type: 'nominal' }
                    },
                    config: { mark: { filled: true } }
                }
            ]
        };
        expect(fieldDefs(layerSpec)).toEqual(expect.arrayContaining([
            { field: 'date', type: 'temporal' },
            { field: 'price', type: 'quantitative' },
            { field: 'symbol', type: 'nominal' }
        ]));
    });
    it('should get all non-duplicate fieldDefs from all layer in a LayerSpec (merging duplicate fields with different scale types)', () => {
        const layerSpec = {
            data: { url: 'data/stocks.csv', format: { type: 'csv' } },
            layer: [
                {
                    description: "Google's stock price over time.",
                    mark: 'line',
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' }
                    }
                },
                {
                    description: "Google's stock price over time.",
                    mark: 'point',
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' },
                        color: { field: 'date', type: 'temporal', scale: { type: 'pow' } }
                    },
                    config: { mark: { filled: true } }
                }
            ]
        };
        expect(fieldDefs(layerSpec)).toEqual(expect.arrayContaining([{ field: 'date', type: 'temporal' }, { field: 'price', type: 'quantitative' }]));
    });
    it('should get all non-duplicate fieldDefs from facet and layer in a FacetSpec', () => {
        const facetSpec = {
            data: { url: 'data/movies.json' },
            facet: { row: { field: 'MPAA_Rating', type: 'ordinal' } },
            spec: {
                mark: 'point',
                encoding: {
                    x: { field: 'Worldwide_Gross', type: 'quantitative' },
                    y: { field: 'US_DVD_Sales', type: 'quantitative' }
                }
            }
        };
        expect(fieldDefs(facetSpec)).toEqual(expect.arrayContaining([
            { field: 'MPAA_Rating', type: 'ordinal' },
            { field: 'Worldwide_Gross', type: 'quantitative' },
            { field: 'US_DVD_Sales', type: 'quantitative' }
        ]));
    });
});
//# sourceMappingURL=spec.test.js.map