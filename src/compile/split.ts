/**
 * Generic classs for storing properties that are explicitly specified and implicitly determined by the compiler.
 */


export class Split<T extends Object> {
  constructor(public readonly explicit: T = {} as T, public readonly implicit: T = {} as T) {}

  public combine(keys: (keyof T)[] = []): T {
    const base = keys.reduce((b, key) => {
      const value = this.get(key);
      if (value) {
        b[key] = value;
      }
      return b;
    }, {} as Partial<T>);

    // FIXME remove "as any".
    // Add "as any" to avoid an error "Spread types may only be created from object types".
    return {
      ...base as any,
      ...this.explicit as any, // Explicit properties comes first
      ...this.implicit as any
    };
  }

  public get<K extends keyof T>(key: K): T[K] {
    // Explicit has higher precedence
    return this.explicit[key] !== undefined ? this.explicit[key] : this.implicit[key];
  }

  public getWithType<K extends keyof T>(key: K): {explicit: boolean, value: T[K]} {
    // Explicit has higher precedence
    if (this.explicit[key] !== undefined) {
      return {explicit: true, value: this.explicit[key]};
    } else if (this.implicit[key] !== undefined) {
      return {explicit: false, value: this.implicit[key]};
    }
    return {explicit: null, value: null};
  }

  public set<K extends keyof T>(key: K, value: T[K], explicit: boolean) {
    this[explicit ? 'explicit' : 'implicit'][key] = value;
    if (explicit) {
      delete this.implicit[key];
    }
    return this;
  }

  public copyKeyFrom<S, K extends keyof (T|S)>(key: K, s: Split<S>) {
    // Explicit has higher precedence
    if (s.explicit[key] !== undefined) {
      this.set(key, s.explicit[key], true);
    } else if (s.implicit[key] !== undefined) {
      this.set(key, s.implicit[key], false);
    }
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
