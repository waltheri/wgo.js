import babel from "rollup-plugin-babel";
import es2015Rollup from "babel-preset-es2015-rollup";
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'es6/WGo.js',
	dest: 'dist/wgo.js',
	format: "umd",
	exports: "named",
	moduleName: "WGo",
	sourceMap: true,
	plugins: [
		babel({
			exclude: './node_modules/**',
			babelrc: false,
			presets: [es2015Rollup]
		}),
		nodeResolve(),
		commonjs()
	]
}