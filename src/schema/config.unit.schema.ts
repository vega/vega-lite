export interface UnitConfig {
  width?: number;
  height?: number;
}

export const defaultUnitConfig: UnitConfig = {
  width: 200,
  height: 200
};

export const unitConfig = {
  type: 'object',
  properties: {
    width: {
      type: 'integer'
    },
    height: {
      type: 'integer'
    }
  }
};
