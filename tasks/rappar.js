/*
 * grunt-rappar
 * https://github.com/netbek/grunt-rappar
 *
 * Copyright (c) 2015 Hein Bekker
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var Applause = require('applause');

module.exports = function (grunt) {

	grunt.registerMultiTask('rappar', 'Grunt plugin to convert SVG to Raphaël instructions.', function () {
		var options = this.options({
			prefix: '',
			suffix: ''
		});

		var done = this.async();
		var rapparPath = path.resolve(__dirname, 'rappar/rappar.js');
		var jobs = [];

		this.files.forEach(function (f) {
			var cwd = '';
			var opts = {};

			if (f.cwd) {
				cwd = opts.cwd = f.cwd;
			}

			var destPath = path.resolve(f.dest);
			var files = grunt.file.expand(opts, f.src);

			files.forEach(function (file) {
				var basename = path.basename(file);
				var extname = path.extname(file);
				var filename = path.basename(file, extname);
				var applause = Applause.create({
					patterns: [{
							json: {
								filename: filename
							}
						}]
				});

				jobs.push({
					src: path.resolve(cwd + file),
					dest: destPath + '/' + basename.replace(/\.svg$/i, '.js'),
					prefix: applause.replace(options.prefix) || options.prefix,
					suffix: applause.replace(options.suffix) || options.suffix
				});
			});
		});

		var total = jobs.length;

		function async(job, callback) {
			grunt.util.spawn({
				cmd: 'node',
				args: [
					rapparPath,
					job.src,
					job.prefix,
					job.suffix
				]
			},
			function (err, result, code) {
				if (err) {
					callback(err);
				}
				else {
					grunt.file.write(job.dest, result.stdout);
					callback(job.dest);
				}
			});
		}

		function final() {
			grunt.log.writeln('Conversion complete (' + total + ' ' + (total === 1 ? 'file' : 'files') + ').');
			done();
		}

		var results = [];

		function series(job) {
			if (job) {
				async(job, function (result) {
					results.push(result);
					return series(jobs.shift());
				});
			}
			else {
				return final();
			}
		}

		series(jobs.shift());
	});

};
