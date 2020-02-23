export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] | PartialRecursive<T[P]>;
};

/**
 * Helper function for merging default config with provided config.
 *
 * @param defaults
 * @param config
 */
export default function makeConfig<T>(defaults: T, config: PartialRecursive<T> & { [key: string]: any }): T {
  const mergedConfig: any = {};
  const defaultKeys = Object.keys(defaults);
  defaultKeys.forEach((key) => {
    const val = (config as any)[key];
    const defVal = (defaults as any)[key];

    if (val != null && val.constructor === Object && !Array.isArray(val) && defVal != null) {
      mergedConfig[key] = makeConfig(defVal, val);
    } else if (val !== undefined) {
      mergedConfig[key] = val;
    } else {
      mergedConfig[key] = defVal;
    }
  });

  Object.keys(config).forEach((key) => {
    if (defaultKeys.indexOf(key) === -1) {
      mergedConfig[key] = (config as any)[key];
    }
  });

  return mergedConfig;
}
