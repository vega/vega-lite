"use strict";

var _           = require("lodash"),
    fs          = require("fs"),
    path        = require("path"),
    Benchmark   = require("benchmark"),
    Mustache    = require("mustache");

var Tester = {
    start: process.hrtime(),
    validators: [],
    results: []
};

Tester.registerValidator = function (obj) {
    obj.testsPassed = 0;
    obj.testsFailed = 0;
    obj.timesFastest = 0;
    this.validators.push(obj);
};

Tester.isExcluded = function (name) {
    var retval = true,
        grep = null;
    process.argv.forEach(function (val, index, arr) {
        if (val === "--grep") {
            grep = arr[index + 1];
            if (name.indexOf(grep) !== -1) {
                retval = false;
            }
        }
    });
    return grep ? retval : false;
};

Tester.runOne = function (testName, testJson, testSchema, expectedResult) {
    if (this.isExcluded(testName)) {
        return;
    }

    var suite = new Benchmark.Suite();
    var fails = {};

    this.validators.forEach(function (validatorObject) {
        var json = _.cloneDeep(testJson);
        var schema = _.cloneDeep(testSchema);

        // setup instance
        var instance = validatorObject.setup();
        // verify that validator really works
        var givenResult;
        try {
            givenResult = validatorObject.test(instance, json, schema);
        } catch (e) {
            fails[validatorObject.name] = e;
            givenResult = e;
        }
        if (givenResult !== expectedResult) {
            console.warn(validatorObject.name + " failed the test " + testName);
            validatorObject.testsFailed += 1;
            if (!fails[validatorObject.name]) {
                fails[validatorObject.name] = "expected was " + expectedResult + " but validator returned " + givenResult;
            }
        } else {
            // add it to benchmark
            suite.add(validatorObject.name + "#" + testName, function () {
                validatorObject.test(instance, json, schema);
            });
            validatorObject.testsPassed += 1;
        }
    });

    suite
        // add listeners
        .on("cycle", function (event) {
            console.log(String(event.target));
        })
        .on("complete", function () {
            console.log("Fastest is " + this.filter("fastest").pluck("name"));
        })
        // run sync
        .run({
            "async": false
        });

    console.log("-");

    var fastest = 0;
    var fastestValidator = null;
    var suiteResult = {
        name: testName,
        results: []
    };
    this.validators.forEach(function (validatorObject) {
        var ops;
        var results = _.find(suite, function (obj) {
            return validatorObject.name === obj.name.substring(0, obj.name.indexOf("#"));
        });
        if (results) {
            ops = parseInt(results.hz, 10);
            suiteResult.results.push({
                hz: ops
            });
        } else {
            ops = -1;
            suiteResult.results.push({
                hz: ops,
                failed: true,
                title: fails[validatorObject.name].toString()
            });
        }
        if (ops > fastest) {
            fastest = ops;
            fastestValidator = validatorObject;
        }
    });
    if (fastestValidator) { // if all fail, no-one is the fastest
        fastestValidator.timesFastest += 1;
    }
    suiteResult.results.forEach(function (result) {
        if (result.hz === fastest) {
            result.fastest = true;
        }
        result.percentage = parseInt(result.hz / fastest * 100, 10);
        if (Number.isNaN(result.percentage)) { result.percentage = 0; }
    });
    this.results.push(suiteResult);
};

Tester.runFileContent = function (json, options) {
    json.forEach(function (testSuite) {
        testSuite.tests.forEach(function (test) {
            var testName = [testSuite.description, test.description].join(", ");
            if (options.excludeTests.indexOf(testName) !== -1) {
                console.log("skipping test " + testName);
            } else {
                this.runOne(testName, test.data, testSuite.schema, test.valid);
            }
        }, this);
    }, this);
};

Tester.runFile = function (filename) {
    var content = JSON.parse(fs.readFileSync(filename).toString());
    this.runFileContent(content);
};

function mergeObjects(dest, src) {
    for (var key in src) {
        if (!dest[key]) {
            dest[key] = src[key];
        } else {
            throw new Error("Object merge failed on key: " + key);
        }
    }
}

function readDirToObject(dirpath, prefix) {
    var obj = {};
    prefix = prefix || "";
    var files = fs.readdirSync(dirpath);
    files.forEach(function (fileName) {
        var stats = fs.statSync(dirpath + fileName);
        if (stats.isDirectory()) {
            var o = readDirToObject(dirpath + fileName + "/", fileName + "/");
            mergeObjects(obj, o);
        } else {
            var fileContents = fs.readFileSync(dirpath + fileName, "utf8");
            var json = JSON.parse(fileContents);
            obj[prefix + fileName] = json;
        }
    });
    return obj;
}

Tester.runDirectory = function (directory, options) {
    var files = readDirToObject(directory);
    for (var fileName in files) {
        if (options.excludeFiles.indexOf(fileName) !== -1) {
            console.log("skipping file " + fileName);
        } else {
            Tester.runFileContent(files[fileName], options);
        }
    }
};

Tester.saveResults = function (filename, templateName) {
    this.end = process.hrtime();
    var totalTimeInMinutes = ((this.end[0] - this.start[0]) / 60);
    totalTimeInMinutes = parseInt(totalTimeInMinutes * 100, 10) / 100;
    var currentDate = new Date().toLocaleDateString();

    filename = [__dirname, filename].join(path.sep);

    var template = fs.readFileSync([__dirname, templateName].join(path.sep)).toString();
    var html = Mustache.render(template, {
        validators: this.validators,
        results: this.results,
        currentDate: currentDate,
        totalTime: totalTimeInMinutes
    });

    fs.writeFileSync(filename, html);
    console.log(filename + " created on " + currentDate + " in " + totalTimeInMinutes + " minutes");
};

module.exports = Tester;
