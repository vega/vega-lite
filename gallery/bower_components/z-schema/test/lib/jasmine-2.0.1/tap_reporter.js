(function(global) {
    var UNDEFINED,
        exportObject;

    if (typeof module !== "undefined" && module.exports) {
        exportObject = exports;
    } else {
        exportObject = global.jasmineReporters = global.jasmineReporters || {};
    }

    function trim(str) { return str.replace(/^\s+/, "" ).replace(/\s+$/, "" ); }
    function elapsed(start, end) { return (end - start)/1000; }
    function isFailed(obj) { return obj.status === "failed"; }
    function isSkipped(obj) { return obj.status === "pending"; }
    function extend(dupe, obj) { // performs a shallow copy of all props of `obj` onto `dupe`
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                dupe[prop] = obj[prop];
            }
        }
        return dupe;
    }
    function log(str) {
        var con = global.console || console;
        if (con && con.log) {
            con.log(str);
        }
    }


    /**
     * TAP (http://en.wikipedia.org/wiki/Test_Anything_Protocol) reporter.
     * outputs spec results to the console.
     *
     * Usage:
     *
     * jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());
     */
    exportObject.TapReporter = function() {
        var self = this;
        self.started = false;
        self.finished = false;

        var startTime,
            endTime,
            totalSpecsExecuted = 0,
            totalSpecsSkipped = 0,
            totalSpecsFailed = 0,
            totalSpecsDefined,
            currentSuite = null;

        var __suites = {}, __specs = {};
        function getSuite(suite) {
            __suites[suite.id] = extend(__suites[suite.id] || {}, suite);
            return __suites[suite.id];
        }
        function getSpec(spec) {
            __specs[spec.id] = extend(__specs[spec.id] || {}, spec);
            return __specs[spec.id];
        }

        self.jasmineStarted = function(summary) {
            self.started = true;
            totalSpecsDefined = summary && summary.totalSpecsDefined || NaN;
            startTime = exportObject.startTime = new Date();
        };
        self.suiteStarted = function(suite) {
            suite = getSuite(suite);
            currentSuite = suite;
        };
        self.specStarted = function(spec) {
            spec = getSpec(spec);
            totalSpecsExecuted++;
            spec._suite = currentSuite;
        };
        self.specDone = function(spec) {
            spec = getSpec(spec);
            var resultStr = 'ok ' + totalSpecsExecuted + ' - ' + spec._suite.description + ' : ' + spec.description;
            var failedStr = '';
            if (isFailed(spec)) {
                totalSpecsFailed++;
                resultStr = 'not ' + resultStr;
                for (var i = 0, failure; i < spec.failedExpectations.length; i++) {
                    failure = spec.failedExpectations[i];
                    failedStr += '\n  ' + trim(failure.message);
                    if (failure.stack && failure.stack !== failure.message) {
                        failedStr += '\n  === STACK TRACE ===';
                        failedStr += '\n  ' + failure.stack;
                        failedStr += '\n  === END STACK TRACE ===';
                    }
                }
            }
            if (isSkipped(spec)) {
                totalSpecsSkipped++;
                resultStr += ' # SKIP disabled by xit or similar';
            }
            log(resultStr);
        };
        self.suiteDone = function(suite) {
            suite = getSuite(suite);
        };
        self.jasmineDone = function() {
            endTime = new Date();
            var dur = elapsed(startTime, endTime),
                totalSpecs = totalSpecsDefined || totalSpecsExecuted,
                disabledSpecs = totalSpecs - totalSpecsExecuted;

            if (totalSpecsExecuted === 0) {
                log('1..0 # All tests disabled');
            } else {
                log('1..' + totalSpecsExecuted);
            }
            var diagStr = '#';
            diagStr = '# ' + totalSpecs + ' spec' + (totalSpecs === 1 ? '' : 's');
            diagStr += ', ' + totalSpecsFailed + ' failure' + (totalSpecsFailed === 1 ? '' : 's');
            diagStr += ', ' + totalSpecsSkipped + ' skipped';
            diagStr += ', ' + disabledSpecs + ' disabled';
            diagStr += ' in ' + dur + 's.';
            log(diagStr);
            log('# NOTE: disabled specs are usually a result of xdescribe.');

            self.finished = true;
            // this is so phantomjs-testrunner.js can tell if we're done executing
            exportObject.endTime = endTime;
        };
    };
})(this);
