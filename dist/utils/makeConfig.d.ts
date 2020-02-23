export declare type PartialRecursive<T> = {
    [P in keyof T]?: T[P] | PartialRecursive<T[P]>;
};
/**
 * Helper function for merging default config with provided config.
 *
 * @param defaults
 * @param config
 */
export default function makeConfig<T>(defaults: T, config: PartialRecursive<T> & {
    [key: string]: any;
}): T;
