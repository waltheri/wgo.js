var babel = require('rollup-plugin-babel');
var es2015Rollup = require('babel-preset-es2015-rollup');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		browserify: {
			dist: {
				files: {
					'dist/test.js': ['src/test/ifPlayerTest.js']
				},
				options: {
					transform: [["babelify", {babelrc: false, presets: [es2015Rollup]}]]
				}
			}
		},
		rollup: {
			dist: {
				files: {
					'dist/wgo.js': ['src/WGo.js'],
				},
				options: {
					format: "umd",
					exports: "named",
					moduleName: "WGo",
					plugins: [
						babel({
							exclude: './node_modules/**',
							babelrc: false,
							presets: [es2015Rollup]
						})
					]
				}
			}
		},
		uglify: {
			wgo: {
				files: {
					"dist/wgo.min.js": [ "dist/wgo.js" ]
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					sourceMapName: "dist/wgo.min.map",
					banner: "/*! WGo.js library, MIT license, wgo.waltheri.net */",
				}
			}
		},
		jsdoc: {
			dist: {
				options: {
					configure: "docs-src/conf.json",
					destination: "gh-pages"
				}
			}
		},
		'string-replace': {
			docs: {
				files: {
				  'gh-pages/index.html': 'gh-pages/index.html',
				},
				options: {
					replacements: [
						{
							pattern: '<h1 class="page-title">Home</h1>',
							replacement: ''
						}
					]
				}
			}
		},
		githubPages: {
			target: {
				options: {
					commitMessage: 'Documentation update'
				},
				src: 'gh-pages'
			}
		},
		less: {
			development: {
				options: {
					ieCompat: false,
					sourceMap: true,
				},
				files: {
					"dist/wgo.css": ["styles/wgo.less"] // destination file and source file
				}
      		}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-rollup');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-github-pages');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('test', ['browserify']);
	grunt.registerTask('default', ['rollup', 'uglify']);
	grunt.registerTask('docs-prepare', ['jsdoc', 'string-replace']);
	grunt.registerTask('docs', ['docs-prepare', 'githubPages']);
	grunt.registerTask('styles', ['less']);
};
