import Container, { Condition } from './Container';

export default {
  minWidth(width: number) {
    return (container: Container) => container.element.offsetWidth >= width;
  },
  minHeight(height: number) {
    return (container: Container) => container.element.offsetHeight >= height;
  },
  maxWidth(width: number) {
    return (container: Container) => container.element.offsetWidth <= width;
  },
  maxHeight(height: number) {
    return (container: Container) => container.element.offsetHeight <= height;
  },
  and(...conditions: Condition[]) {
    return (container: Container) => conditions.every(c => c(container));
  },
  or(...conditions: Condition[]) {
    return (container: Container) => conditions.some(c => c(container));
  },
};
