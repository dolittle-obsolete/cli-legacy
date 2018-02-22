#!/usr/bin/env node
const args = require("args");
const folderHandler = require("../folderHandler");
const boilerPlates = require("../boilerPlates");

args
    .example("dolittle boundedcontext create <name>", "Creates and registers a bounded context with the given name");

var boundedcontextName = "";

const flags = args.parse(process.argv);
if (args.sub.length == 0) args.showHelp();
if (args.sub.length == 1) {
    boundedcontextName = args.sub[0];
    
    var projectFolder = folderHandler.CreateBoundedContextFolder(boundedcontextName);
    boilerPlates.generateBoilerplateProject(projectFolder);
}