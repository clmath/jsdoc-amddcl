module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		exec = require("child_process").exec;

	grunt.registerMultiTask("jsdoc-amddcl", "Run JSDoc", function () {
		var done = this.async();
		var options = this.options();

		options.dest && grunt.file.mkdir(path.dirname(options.dest));

		if (options.paths && !process.env.JSDOC_MODULE_PATHS) {
			process.env.JSDOC_MODULE_PATHS = JSON.stringify(options.paths);
		}
		if (options.imports && !process.env.JSDOC_IMPORT_ROOTS) {
			process.env.JSDOC_IMPORT_ROOTS = options.imports.join(path.delimiter);
		}
		if (options.packagePathFormat) {
			process.env.JSDOC_PACKAGE_PATH_FORMAT = options.packagePathFormat;
		}
		if (options.includeEventsInTOC) {
			process.env.INCLUDE_EVENTS_IN_TOC = options.includeEventsInTOC;
		}

		var args = [
			JSON.stringify(path.resolve(path.dirname(module.filename), "../node_modules/jsdoc/jsdoc.js")),
			"-c",
			"./node_modules/jsdoc-amddcl/conf.json"
		];
		options.args && args.push.apply(args, options.args.map(function (arg) {
			return JSON.stringify(arg);
		}));
		args.push.apply(args, options.src.map(function (file) {
			return JSON.stringify(file);
		}));

		var command = ["node"].concat(args).concat(options.dest ? ["> " + JSON.stringify(options.dest)] : []).join(" ");
		grunt.log.writeln(command);

		exec(command, function (err, stdout, stderr) {
			stdout && grunt.log.writeln(stdout);
			stderr && grunt.log.error(stderr);
			delete process.env.JSDOC_MODULE_PATHS;
			delete process.env.JSDOC_IMPORT_ROOTS;
			if (err) {
				grunt.log.error(err);
				done(err);
			} else {
				done();
			}
		});
	});
};
