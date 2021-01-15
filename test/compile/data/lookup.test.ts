import {AncestorParse} from '../../../src/compile/data';
import {LookupNode} from '../../../src/compile/data/lookup';
import {parseTransformArray} from '../../../src/compile/data/parse';
import * as log from '../../../src/log';
import {parseUnitModel} from '../../util';
import {PlaceholderDataFlowNode} from './util';

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
    expect((t as LookupNode).assemble()).toEqual({
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

    expect(lookup.assemble()).toEqual({
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

    expect(lookup.assemble()).toEqual({
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

      expect(localLogger.warns[0]).toEqual(log.message.NO_FIELDS_NEEDS_AS);
    })
  );

  // Selection lookups are more fully tested in test/compile/selection/parse.test.ts
  it('should throw error for unknown selection', () => {
    expect(() => {
      const model = parseUnitModel({
        data: {url: 'data/lookup_groups.csv'},
        transform: [
          {
            lookup: 'person',
            from: {
              param: 'foobar',
              key: 'person'
            }
          }
        ],
        mark: 'bar',
        encoding: {}
      });

      parseTransformArray(null, model, new AncestorParse());
    }).toThrow();
  });

  describe('dependentFields', () => {
    it('should return proper dependent fields', () => {
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
      expect(lookup.dependentFields()).toEqual(new Set(['person']));
    });
  });

  describe('producedFields', () => {
    it('should return proper produced fields', () => {
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
      expect(lookup.producedFields()).toEqual(new Set([]));
    });

    it('should return proper produced fields with fields', () => {
      const lookup = new LookupNode(
        null,
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name',
            fields: ['foo', 'bar']
          }
        },
        'lookup_0'
      );
      expect(lookup.producedFields()).toEqual(new Set(['foo', 'bar']));
    });

    it('should return proper produced fields with fields and as', () => {
      const lookup = new LookupNode(
        null,
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name',
            fields: ['foo', 'bar']
          },
          as: ['f1', 'f2']
        },
        'lookup_0'
      );
      expect(lookup.producedFields()).toEqual(new Set(['f1', 'f2']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const lookup = new LookupNode(
        null,
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name'
          },
          as: 'lookedup'
        },
        'lookup_0'
      );
      lookup.assemble();

      expect(lookup.hash()).toEqual(
        'Lookup {"secondary":"lookup_0","transform":{"as":"lookedup","from":{"data":{"url":"data/lookup_people.csv"},"key":"name"},"lookup":"person"}}'
      );
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const lookup = new LookupNode(
        parent,
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name'
          }
        },
        null
      );
      expect(lookup.clone().parent).toBeNull();
    });
  });
});
