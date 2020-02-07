export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] | PartialRecursive<T[P]>;
};

/**
 * Helper function for merging default config with provided config.
 *
 * @param defaults
 * @param config
 */
export default function makeConfig<T>(defaults: T, config: PartialRecursive<T>): T {
  const mergedConfig: any = {};
  const defaultKeys = Object.keys(defaults);
  defaultKeys.forEach((key) => {
    if (typeof (config as any)[key] === 'object' && !Array.isArray((config as any)[key])) {
      mergedConfig[key] = makeConfig((defaults as any)[key], (config as any)[key]);
    } else if ((config as any)[key] !== undefined) {
      mergedConfig[key] = (config as any)[key];
    } else {
      mergedConfig[key] = (defaults as any)[key];
    }
  });

  Object.keys(config).forEach((key) => {
    if (defaultKeys.indexOf(key) === -1) {
      mergedConfig[key] = (config as any)[key];
    }
  });

  return mergedConfig;
}
