module.exports = function (grunt) {
	var minName, conName, name, i, concat = {}, minified = {};
	var json = grunt.file.readJSON('files.json');

	for (name in json.js) {
		minName = 'dist/modules/' + name + '.min.js';
		conName = 'dist/modules/' + name + '.js';

		minified[minName] = json.js[name];
		concat[conName] = json.js[name];
		for (i in json.all.before) {
			minified[minName].unshift(json.all.before[i]);
			concat[conName].unshift(json.all.before[i]);
		}
	}

	minName = 'dist/thunbolt.min.js';
	conName = 'dist/thunbolt.js';
	minified[minName] = [];
	concat[conName] = [];

	for (i in json.all.before) {
		minified[minName].unshift(json.all.before[i]);
		concat[conName].unshift(json.all.before[i]);
	}

	for (name in json.js) {
		for (i in json.js[name]) {
			minified[minName].push(json.js[name][i]);
			concat[conName].push(json.js[name][i]);
		}
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				mangle: false,
				sourceMap: false
			},
			compiling: {
				files: minified
			}
		},

		concat: {
			options: {
				separator: "\n"
			},
			compiling: {
				files: concat
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify', 'concat']);

};
