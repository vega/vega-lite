import {SignalRef} from 'vega';
import {isObject} from 'vega-util';
import {Config} from '../config';
import {Encoding, normalizeEncoding} from '../encoding';
import {ExprRef} from '../expr';
import {AreaConfig, isMarkDef, LineConfig, GeoshapeConfig, Mark, MarkConfig, MarkDef} from '../mark';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec';
import {isUnitSpec} from '../spec/unit';
import {stack} from '../stack';
import {keys, omit, pick} from '../util';
import {NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams} from './base';

type UnitSpecWithPathOverlay = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'line' | 'area' | 'rule' | 'trail'>>;

function dropLineAndPointAndTile(markDef: MarkDef): MarkDef | Mark {
  const {point: _point, line: _line, tile: _tile, ...mark} = markDef;

  return keys(mark).length > 1 ? mark : mark.type;
}

function dropLineAndPointAndTileFromConfig(config: Config<SignalRef>) {
  for (const mark of ['line', 'area', 'rule', 'trail', 'geoshape'] as const) {
    if (config[mark]) {
      config = {
        ...config,
        // TODO: remove as any
        [mark]: omit(config[mark], ['point', 'line', 'tile'] as any)
      };
    }
  }
  return config;
}

function getPointOverlay(
  markDef: MarkDef,
  markConfig: LineConfig<ExprRef | SignalRef> = {},
  encoding: Encoding<string>
): MarkConfig<ExprRef | SignalRef> {
  if (markDef.point === 'transparent') {
    return {opacity: 0};
  } else if (markDef.point) {
    // truthy : true or object
    return isObject(markDef.point) ? markDef.point : {};
  } else if (markDef.point !== undefined) {
    // false or null
    return null;
  } else {
    // undefined (not disabled)
    if (markConfig.point || encoding.shape) {
      // enable point overlay if config[mark].point is truthy or if encoding.shape is provided
      return isObject(markConfig.point) ? markConfig.point : {};
    }
    // markDef.point is defined as falsy
    return undefined;
  }
}

function getTileOverlay(
  markDef: MarkDef,
  markConfig: GeoshapeConfig<ExprRef | SignalRef> = {}
): MarkConfig<ExprRef | SignalRef> {
  if (markDef.tile) {
    return isObject(markDef.tile) ? markDef.tile : {};
  } else if (markDef.tile !== undefined) {
    // false or null
    return null;
  } else {
    // undefined (not disabled)
    if (markConfig.tile) {
      // enable tile overlay if config[mark].tile is truthy
      return isObject(markConfig.tile) ? markConfig.tile : {};
    }
    // markDef.tile is defined as falsy
    return undefined;
  }
}

function getLineOverlay(
  markDef: MarkDef,
  markConfig: AreaConfig<ExprRef | SignalRef> = {}
): MarkConfig<ExprRef | SignalRef> {
  if (markDef.line) {
    // true or object
    return markDef.line === true ? {} : markDef.line;
  } else if (markDef.line !== undefined) {
    // false or null
    return null;
  } else {
    // undefined (not disabled)
    if (markConfig.line) {
      // enable line overlay if config[mark].line is truthy
      return markConfig.line === true ? {} : markConfig.line;
    }
    // markDef.point is defined as falsy
    return undefined;
  }
}

export class PathOverlayNormalizer implements NonFacetUnitNormalizer<UnitSpecWithPathOverlay> {
  public name = 'path-overlay';

  public hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithPathOverlay {
    if (isUnitSpec(spec)) {
      const {mark, encoding} = spec;
      const markDef = isMarkDef(mark) ? mark : {type: mark};
      switch (markDef.type) {
        case 'line':
        case 'rule':
        case 'trail':
          return !!getPointOverlay(markDef, config[markDef.type], encoding);
        case 'geoshape':
          return !!getTileOverlay(markDef, config[markDef.type]);
        case 'area':
          return (
            // false / null are also included as we want to remove the properties
            !!getPointOverlay(markDef, config[markDef.type], encoding) ||
            !!getLineOverlay(markDef, config[markDef.type])
          );
      }
    }
    return false;
  }

  public run(spec: UnitSpecWithPathOverlay, normParams: NormalizerParams, normalize: NormalizeLayerOrUnit) {
    const {config} = normParams;
    const {params, projection, mark, name, encoding: e, ...outerSpec} = spec;

    // Encoding can be undefined
    const enc = e === undefined ? {} : e;
    // Need to call normalizeEncoding because we need the inferred types to correctly determine stack
    const encoding = normalizeEncoding(enc, config);

    const markDef: MarkDef = isMarkDef(mark) ? mark : {type: mark};

    const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
    const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);
    const tileOverlay = getTileOverlay(markDef, config[markDef.type]);

    const layer: NormalizedUnitSpec[] = [
      {
        name,
        ...(params ? {params} : {}),
        mark: dropLineAndPointAndTile({
          // TODO: extract this 0.7 to be shared with default opacity for point/tick/...
          ...(markDef.type === 'area' && markDef.opacity === undefined && markDef.fillOpacity === undefined
            ? {opacity: 0.7}
            : {}),
          ...markDef
        }),
        // drop shape from encoding as this might be used to trigger point overlay
        encoding: omit(encoding, ['shape'])
      }
    ];

    // FIXME: determine rules for applying selections.

    // Need to copy stack config to overlayed layer
    const stackProps = stack(markDef, encoding);

    let overlayEncoding = encoding;
    if (stackProps) {
      const {fieldChannel: stackFieldChannel, offset} = stackProps;
      overlayEncoding = {
        ...encoding,
        [stackFieldChannel]: {
          ...encoding[stackFieldChannel],
          ...(offset ? {stack: offset} : {})
        }
      };
    }

    // overlay line layer should be on the edge of area but passing y2/x2 makes
    // it as "rule" mark so that it draws unwanted vertical/horizontal lines.
    // point overlay also should not have y2/x2 as it does not support.
    overlayEncoding = omit(overlayEncoding, ['y2', 'x2']);

    if (lineOverlay) {
      layer.push({
        ...(projection ? {projection} : {}),
        mark: {
          type: 'line',
          ...pick(markDef, ['clip', 'interpolate', 'tension', 'tooltip']),
          ...lineOverlay
        },
        encoding: overlayEncoding
      });
    }
    if (pointOverlay) {
      layer.push({
        ...(projection ? {projection} : {}),
        mark: {
          type: 'point',
          opacity: 1,
          filled: true,
          ...pick(markDef, ['clip', 'tooltip']),
          ...pointOverlay
        },
        encoding: overlayEncoding
      });
    }
    if (tileOverlay) {
      layer.push({
        ...(projection ? {projection} : {}),
        mark: {
          type: 'image',
          clip: true,
          height: {expr: 'tile_size'},
          width: {expr: 'tile_size'},
          ...tileOverlay
        },
        encoding: {
          url: {field: 'url', type: 'nominal'},
          x: {field: 'x', scale: null, type: 'quantitative'},
          y: {field: 'y', scale: null, type: 'quantitative'}
        },
        data: {
          sequence: {
            start: 0,
            stop: 4,
            as: 'a'
          },
          name: 'tile_list'
        },
        transform: [
          {calculate: 'sequence(0, 4)', as: 'b'},
          {flatten: ['b']},
          {
            calculate:
              "base_tile_url + zoom_ceil + '/' + (datum.a + dii_floor + tiles_count) % tiles_count + '/' + ((datum.b + djj_floor)) + '.png'",
            as: 'url'
          },
          {
            calculate: '(datum.a * tile_size + dx) + tile_size / 2',
            as: 'x'
          },
          {
            calculate: '(datum.b * tile_size + dy) + tile_size / 2',
            as: 'y'
          }
        ]
      });
    }

    return normalize(
      {
        ...outerSpec,
        layer,
        ...(tileOverlay
          ? {
              params: [
                {
                  name: 'base_tile_size',
                  value: 256
                },
                {
                  name: 'base_tile_url',
                  value: 'https://tile.openstreetmap.org/'
                },
                {
                  name: 'tx',
                  value: 'width / 2'
                },
                {
                  name: 'ty',
                  value: 'height / 2'
                },
                {
                  name: 'zoom_level',
                  value: 2.75
                },
                {
                  name: 'zoom_ceil',
                  expr: 'ceil(zoom_level)'
                },
                {
                  name: 'rotate_longitude',
                  value: 5.9025
                },
                {
                  name: 'center_latitude',
                  value: 52.56
                },
                {
                  name: 'tiles_count',
                  expr: 'pow(2, zoom_level)'
                },
                {
                  name: 'tile_size',
                  expr: 'base_tile_size * pow(2, zoom_level - zoom_ceil)'
                },
                {
                  name: 'base_point',
                  expr: "invert('projection', [0, 0])"
                },
                {
                  name: 'dii',
                  expr: '(base_point[0] + 180) / 360 * tiles_count'
                },
                {
                  name: 'dii_floor',
                  expr: 'floor(dii)'
                },
                {
                  name: 'dx',
                  expr: '(dii_floor - dii) * tile_size'
                },
                {
                  name: 'djj',
                  expr: '(1 - log(tan(base_point[1] * PI / 180) + 1 / cos(base_point[1] * PI / 180)) / PI) / 2 * tiles_count'
                },
                {
                  name: 'djj_floor',
                  expr: 'floor(djj)'
                },
                {
                  name: 'dy',
                  expr: 'round(djj_floor - djj) * tile_size'
                }
              ]
            }
          : {})
      },
      {
        ...normParams,
        config: dropLineAndPointAndTileFromConfig(config)
      }
    );
  }
}
