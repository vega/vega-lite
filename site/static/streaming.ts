import * as vega from 'vega';
import embed from 'vega-embed';

export function runStreamingExample(eleId: string) {
  const vlSpec = {
    '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
    'data': {'name': 'table'},
    'width': 400,
    'mark': 'line',
    'encoding': {
      'x': {'field': 'x', 'type': 'quantitative', 'scale': {'zero': false}},
      'y': {'field': 'y', 'type': 'quantitative'},
      'color': {'field': 'category', 'type': 'nominal'}
    }
  };

  function cb(err: any, res: any) {
    /**
     * Generates a new tuple with random walk.
     */
    function newGenerator() {
      let counter = -1;
      let previousY = [5,5,5,5];
      return () => {
        counter++;
        const newVals = previousY.map((v, category) => ({
          x: counter,
          y: v + Math.round(Math.random() * 10 - category * 3),
          category
        }));
        previousY = newVals.map((v)=> v.y);
        return newVals;
      };
    }

    const valueGenerator = newGenerator();

    let minimumX = -100;
    window.setInterval(() => {
      minimumX++;
      const changeSet = vega.changeset().insert(valueGenerator()).remove((t: any) => t.x < minimumX);
      res.view.change('table', changeSet).run();
    }, 600);
  }

  embed(eleId, vlSpec, {}, cb);

}
