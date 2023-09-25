// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'WGo',
    sourcemap: true,
  },
  plugins: [typescript()],
};
