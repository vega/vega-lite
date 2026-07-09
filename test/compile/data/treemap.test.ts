import {TreemapNode, TreemapComponent} from '../../../src/compile/data/treemap.js';
import {PlaceholderDataFlowNode} from './util.js';

const TREEMAP_DEFAULTS: TreemapComponent = {
  hierarchy: {
    key: {field: 'id'},
    parentKey: {field: 'parent'},
  },
  sizeField: 'size',
  method: 'squarify',
  nodes: 'leaves',
  padding: undefined,
  paddingInner: undefined,
  paddingOuter: undefined,
  paddingTop: undefined,
  paddingRight: undefined,
  paddingBottom: undefined,
  paddingLeft: undefined,
  ratio: undefined,
  round: undefined,
};

function makeTreemap(overrides: Partial<TreemapComponent> = {}): TreemapNode {
  return new TreemapNode(null, {...TREEMAP_DEFAULTS, ...overrides});
}

describe('compile/data/treemap', () => {
  describe('assemble', () => {
    it('should assemble stratify + treemap + leaf filter for stratify hierarchy', () => {
      const node = makeTreemap();
      const transforms = node.assemble();

      expect(transforms).toEqual([
        {type: 'stratify', key: 'id', parentKey: 'parent'},
        {type: 'treemap', method: 'squarify', size: [{signal: 'width'}, {signal: 'height'}], field: 'size'},
        {type: 'filter', expr: '!datum.children'},
      ]);
    });

    it('should assemble nest transform for nest hierarchy', () => {
      const node = makeTreemap({
        hierarchy: {nest: [{field: 'category'}, {field: 'subcategory'}]},
      });
      const transforms = node.assemble();

      expect(transforms[0]).toEqual({type: 'nest', keys: ['category', 'subcategory']});
    });

    it('should omit field when sizeField is undefined', () => {
      const node = makeTreemap({sizeField: undefined});
      const transforms = node.assemble();
      const treemapTransform = transforms.find((t: any) => t.type === 'treemap') as any;

      expect(treemapTransform.field).toBeUndefined();
    });

    it('should pass layout properties to the treemap transform', () => {
      const node = makeTreemap({
        method: 'binary',
        padding: 2,
        paddingInner: 1,
        paddingOuter: 3,
        paddingTop: 10,
        paddingRight: 5,
        paddingBottom: 10,
        paddingLeft: 5,
        ratio: 1.5,
        round: true,
      });
      const transforms = node.assemble();
      const treemapTransform = transforms.find((t: any) => t.type === 'treemap') as any;

      expect(treemapTransform.method).toBe('binary');
      expect(treemapTransform.padding).toBe(2);
      expect(treemapTransform.paddingInner).toBe(1);
      expect(treemapTransform.paddingOuter).toBe(3);
      expect(treemapTransform.paddingTop).toBe(10);
      expect(treemapTransform.paddingRight).toBe(5);
      expect(treemapTransform.paddingBottom).toBe(10);
      expect(treemapTransform.paddingLeft).toBe(5);
      expect(treemapTransform.ratio).toBe(1.5);
      expect(treemapTransform.round).toBe(true);
    });

    it('should add internal-node filter when nodes is "internal"', () => {
      const node = makeTreemap({nodes: 'internal'});
      const transforms = node.assemble();
      const filter = transforms.find((t: any) => t.type === 'filter') as any;

      expect(filter).toBeDefined();
      expect(filter.expr).toBe('datum.children');
    });

    it('should not add a filter when nodes is "all"', () => {
      const node = makeTreemap({nodes: 'all'});
      const transforms = node.assemble();
      const filter = transforms.find((t: any) => t.type === 'filter');

      expect(filter).toBeUndefined();
    });
  });

  describe('dependentFields', () => {
    it('should return key and parentKey for stratify hierarchy', () => {
      const node = makeTreemap();
      expect(node.dependentFields()).toEqual(new Set(['id', 'parent', 'size']));
    });

    it('should return grouping fields for nest hierarchy', () => {
      const node = makeTreemap({
        hierarchy: {nest: [{field: 'category'}, {field: 'subcategory'}]},
        sizeField: undefined,
      });
      expect(node.dependentFields()).toEqual(new Set(['category', 'subcategory']));
    });

    it('should not include sizeField when undefined', () => {
      const node = makeTreemap({sizeField: undefined});
      expect(node.dependentFields()).toEqual(new Set(['id', 'parent']));
    });
  });

  describe('producedFields', () => {
    it('should return layout output fields', () => {
      const node = makeTreemap();
      expect(node.producedFields()).toEqual(new Set(['x0', 'y0', 'x1', 'y1', 'depth', 'children']));
    });
  });

  describe('hash', () => {
    it('should generate a hash string', () => {
      const node = makeTreemap();
      expect(node.hash()).toMatch(/^Treemap /);
    });

    it('should produce different hashes for different configs', () => {
      const a = makeTreemap({method: 'squarify'});
      const b = makeTreemap({method: 'binary'});
      expect(a.hash()).not.toBe(b.hash());
    });
  });

  describe('clone', () => {
    it('should clone without parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const node = new TreemapNode(parent, {...TREEMAP_DEFAULTS});
      const clone = node.clone();
      expect(clone.parent).toBeNull();
      expect(clone.assemble()).toEqual(node.assemble());
    });
  });
});
