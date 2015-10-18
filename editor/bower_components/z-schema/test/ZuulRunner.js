/*global jasmine*/

require("./spec/BasicSpec");
require("./spec/JsonSchemaTestSuiteSpec");
require("./spec/MultipleInstancesSpec");
require("./spec/ZSchemaTestSuiteSpec");

var env = jasmine.getEnv();
env.execute();
