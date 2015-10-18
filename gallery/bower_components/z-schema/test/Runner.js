/*global jasmine, jasmineReporters*/
var env = jasmine.getEnv();
var reporter = new jasmineReporters.TapReporter();
env.addReporter(reporter);
env.execute();
