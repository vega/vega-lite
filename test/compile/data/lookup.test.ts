import {assert} from 'chai';
import {AncestorParse} from '../../../src/compile/data';
import {LookupNode} from '../../../src/compile/data/lookup';
import {parseTransformArray} from '../../../src/compile/data/parse';
import * as log from '../../../src/log';
import {VgLookupTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/data/lookup', () => {
  it('should parse lookup from array', () => {
    const model = parseUnitModel({
      data: {url: 'data/lookup_groups.csv'},
      transform: [
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name',
            fields: ['age', 'height']
          }
        }
      ],
      mark: 'bar',
      encoding: {}
    });

    const t = parseTransformArray(null, model, new AncestorParse());
    assert.deepEqual<VgLookupTransform>((t as LookupNode).assemble(), {
      type: 'lookup',
      from: 'lookup_0',
      key: 'name',
      fields: ['person'],
      values: ['age', 'height']
    });
  });

  it('should create node for flat lookup', () => {
    const lookup = new LookupNode(
      null,
      {
        lookup: 'person',
        from: {
          data: {url: 'data/lookup_people.csv'},
          key: 'name',
          fields: ['age', 'height']
        }
      },
      'lookup_0'
    );

    assert.deepEqual<VgLookupTransform>(lookup.assemble(), {
      type: 'lookup',
      from: 'lookup_0',
      key: 'name',
      fields: ['person'],
      values: ['age', 'height']
    });
  });

  it('should create node for nested lookup', () => {
    const lookup = new LookupNode(
      null,
      {
        lookup: 'person',
        from: {
          data: {url: 'data/lookup_people.csv'},
          key: 'name'
        },
        as: 'foo'
      },
      'lookup_0'
    );

    assert.deepEqual<VgLookupTransform>(lookup.assemble(), {
      type: 'lookup',
      from: 'lookup_0',
      key: 'name',
      fields: ['person'],
      as: ['foo']
    });
  });

  it(
    'should warn if fields are not specified and as is missing',
    log.wrap(localLogger => {
      const lookup = new LookupNode(
        null,
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name'
          }
        },
        'lookup_0'
      );
      lookup.assemble();

      assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
    })
  );
  it('should generate the correct hash', () => {
    const lookup = new LookupNode(
      null,
      {
        lookup: 'person',
        from: {
          data: {url: 'data/lookup_people.csv'},
          key: 'name'
        }
      },
      'lookup_0'
    );
    lookup.assemble();

    assert.equal(lookup.hash(), 'Lookup -848385244');
  });
});
