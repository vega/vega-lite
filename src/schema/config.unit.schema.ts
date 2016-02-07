export interface UnitConfig {
  width?: number;
  height?: number;
}

export const unitConfig = {
  type: 'object',
  properties: {
    width: {
      type: 'integer',
      default: 200
    },
    height: {
      type: 'integer',
      default: 200
    }
  }
};
