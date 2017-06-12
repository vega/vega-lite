/**
 * Generic classs for storing properties that are explicitly specified and implicitly determined by the compiler.
 */


export class Split<T extends Object> {
  constructor(public readonly explicit: T = {} as T, public readonly implicit: T = {} as T) {}

  public combine() {
    // FIXME remove "as any".
    // Add "as any" to avoid an error "Spread types may only be created from object types".

    return {
      ...this.implicit as any,
      ...this.explicit as any
    };
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this.implicit[key] !== undefined ? this.implicit[key] : this.explicit[key];
  }

  public set<K extends keyof T>(key: K, value: T[K], explicit: boolean) {
    this[explicit ? 'explicit' : 'implicit'][key] = value;
  }

  public extend(mixins: T, explicit: boolean) {
    return new Split<T>(
      explicit ? {
        ...this.explicit as any,
        ...mixins as any
      } : this.explicit,
      explicit ? this.implicit : {
        ...this.implicit as any,
        ...mixins as any
      }
    );
  }
}
