module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		browserify: {
			dist: {
				files: {
					'dist/wgo.js': ['index.js']
				},
				options: {
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
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['browserify', 'uglify']);
};
