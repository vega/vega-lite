export interface StackConfig {
  offset?: string;
}

export const stackConfig = {
  type: ['boolean', 'object'],
  default: {},
  description: 'Enable stacking (for bar and area marks only).',
  properties: {
    offset: {
      type: 'string',
      enum: ['zero', 'center', 'normalize']
      // TODO(#620) refer to Vega spec once it doesn't throw error
      // enum: vgStackSchema.properties.offset.oneOf[0].enum
    }
  }
};
