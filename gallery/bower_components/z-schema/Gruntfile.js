/*global require,module*/

var remapify = require("remapify");
var path = require("path");

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: ".",
                    dest: "src/schemas/",
                    src: ["./json-schema/draft-04/*"],
                    rename: function (dest, src) {
                        return dest + path.basename(src) + ".json";
                    }
                }]
            }
        },
        lineending: {
            dist: {
                options: {
                    eol: "lf",
                    overwrite: true
                },
                files: {
                    "": [
                        "Gruntfile.js",
                        "bin/**/*",
                        "src/**/*.js",
                        "test/**/*.js"
                    ]
                }
            }
        },
        jshint: {
            all: ["*.js", "bin/**/*", "src/**/*.js", "test/spec/**/*.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        jscs: {
            src: ["*.js", "src/**/*.js", "test/spec/**/*.js"],
            options: {
                config: ".jscs.json"
            }
        },
        "jasmine_node": {
            src: [
                "src/**/*.js"
            ],
            options: {
                coverage: {}
            }
        },
        browserify: {
            src: {
                src: ["src/**/*.js"],
                dest: "dist/ZSchema-browser.js",
                options: {
                    preBundleCB: function (b) {
                        b.plugin(remapify, [
                            {
                                src: "src/ZSchema.js",
                                expose: "ZSchema"
                            }
                        ]);
                    },
                    browserifyOptions: {
                        standalone: "ZSchema"
                    }
                }
            },
            test: {
                src: ["test/spec/**/*.js"],
                dest: "dist/ZSchema-browser-test.js"
            }
        },
        jasmine: {
            src: "dist/ZSchema-browser.js",
            options: {
                specs: "dist/ZSchema-browser-test.js"
            }
        },
        uglify: {
            src: {
                files: {
                    "dist/ZSchema-browser-min.js": ["dist/ZSchema-browser.js"]
                },
                options: {
                    sourceMap: true
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-lineending");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-jasmine-node");
    grunt.loadNpmTasks("grunt-jasmine-node-coverage");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Default task(s).
    grunt.registerTask("lint", ["jshint", "jscs"]);
    grunt.registerTask("default", ["copy", "lineending", "jshint", "jscs", "jasmine_node", "browserify", "jasmine", "uglify"]);
    grunt.registerTask("test", ["jasmine_node"]);

};
