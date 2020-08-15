import Container, { Condition } from './Container';
declare const _default: {
    minWidth(width: number): (container: Container) => boolean;
    minHeight(height: number): (container: Container) => boolean;
    maxWidth(width: number): (container: Container) => boolean;
    maxHeight(height: number): (container: Container) => boolean;
    and(...conditions: Condition[]): (container: Container) => boolean;
    or(...conditions: Condition[]): (container: Container) => boolean;
};
export default _default;
