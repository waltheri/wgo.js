export default function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 1000000000).toString(36)}`;
}
