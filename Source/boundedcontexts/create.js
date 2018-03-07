#!/usr/bin/env node
const args = require("args");
const folderHandler = require("../folderHandler");
const boilerPlates = require("../boilerPlates");
const menuHandler = require("./menuHandler");

args
    .example("dolittle create boundedcontext <name>", "Creates and registers a bounded context with the given name");

var boundedcontextName = "";

const flags = args.parse(process.argv);
if (args.sub.length == 0) args.showHelp();
if (args.sub.length == 1) {
    boundedcontextName = args.sub[0];

    boilerPlates.getBoilerPlatesForLanguage("csharp").then(boilerPlates => {
        menuHandler.DisplayBoilerplateSelection(boilerPlates).then((selectedBoilerplate) => {
            var projectFolder = folderHandler.CreateBoundedContextFolder(boundedcontextName);
            boilerPlates.generateProjectFrom(selectedBoilerplate, projectFolder);
        });
    });
}