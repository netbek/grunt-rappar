/*
 * grunt-rappar
 * https://github.com/netbek/grunt-rappar
 *
 * Copyright (c) 2015 Hein Bekker
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var fs = require('fs');

exports.rappar = {
	test1: function (test) {
		fs.stat('test/files/dest/icon-0001-home.js', function (err, stats) {
			test.ok(err === null && stats.isFile(), 'JS "icon-0001-home.js" should exist');
			test.done();
		});
	}
};
