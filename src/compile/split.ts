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

  public getWithExplicit<K extends keyof T>(key: K): Explicit<T[K]> {
    // Explicit has higher precedence
    if (this.explicit[key] !== undefined) {
      return {explicit: true, value: this.explicit[key]};
    } else if (this.implicit[key] !== undefined) {
      return {explicit: false, value: this.implicit[key]};
    }
    return {explicit: false, value: undefined};
  }

  public setWithExplicit<K extends keyof T>(key: K, value: Explicit<T[K]>) {
    if (value.value !== undefined) {
      this.set(key, value.value, value.explicit);
    }
  }

  public set<K extends keyof T>(key: K, value: T[K], explicit: boolean) {
    this[explicit ? 'explicit' : 'implicit'][key] = value;
    if (explicit) {
      delete this.implicit[key];
    }
    return this;
  }

  public copyKeyFromSplit<S, K extends keyof (T|S)>(key: K, s: Split<S>) {
    // Explicit has higher precedence
    if (s.explicit[key] !== undefined) {
      this.set(key, s.explicit[key], true);
    } else if (s.implicit[key] !== undefined) {
      this.set(key, s.implicit[key], false);
    }
  }
  public copyKeyFromObject<S, K extends keyof (T|S)>(key: K, s: S) {
    // Explicit has higher precedence
    if (s[key] !== undefined) {
      this.set(key, s[key], true);
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

export interface Explicit<T> {
  explicit: boolean;
  value: T;
}


export function makeExplicit<T>(value: T): Explicit<T> {
  return {
    explicit: true,
    value
  };
}

export function makeImplicit<T>(value: T): Explicit<T> {
  return {
    explicit: false,
    value
  };
}

export function mergeValuesWithExplicit<T>(
    v1: Explicit<T>, v2: Explicit<T>,
    compare: (v1: T, v2: T) => number = () => 0
  ) {
  if (v1 === undefined || v1.value === undefined) {
    // For first run
    return v2;
  }

  if (v1.explicit && !v2.explicit) {
    return v1;
  } else if (v2.explicit && !v1.explicit) {
    return v2;
  } else {

    const diff = compare(v1.value, v2.value);
    if (diff > 0) {
      return v1;
    } else if (diff < 0) {
      return v2;
    } else {
      // FIXME more warning
      // If equal score, prefer v1.
      return v1;
    }
  }
}
