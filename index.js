var fs = require('fs');
var path = require('path');
var Filter = require('broccoli-filter');

module.exports = GlobalizeFilter;

GlobalizeFilter.prototype = Object.create(Filter.prototype);
GlobalizeFilter.prototype.constructor = GlobalizeFilter;

function GlobalizeFilter(inputTree, options) {
  if (!(this instanceof GlobalizeFilter)) {
    return new GlobalizeFilter(inputTree, options);
  }
  this.inputTree = inputTree;
  this.namespace = options.namespace;
  this.moduleName = options.moduleName;
}

GlobalizeFilter.prototype.extensions = ['js'];
GlobalizeFilter.prototype.targetExtension = 'js';

GlobalizeFilter.prototype.processString = function (fileContents, filePath) {
  var loaderPath = path.resolve(__dirname, 'bower_components/loader.js/loader.js');
  var loaderContents = fs.readFileSync(loaderPath);
  var buffer = [];

  buffer.push("(function(global) {\n");

  buffer.push("/* Begin microloader */\n");
  buffer.push(loaderContents);
  buffer.push("/* End microloader */\n");

  buffer.push("/* Begin concatenated AMD modules */\n");
  buffer.push(fileContents);
  buffer.push("/* End concatenated AMD modules */\n");

  buffer.push("global." + this.namespace + " = require('" + this.moduleName + "');\n");
  buffer.push("})( (function() { return this; })() );\n");

  return buffer.join("");
};
