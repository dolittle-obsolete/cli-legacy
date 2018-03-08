#!/usr/bin/env node
const args = require("args");
const folderHandler = require("../folderHandler");
const boilerPlates = require("../BoilerPlates");
const menuHandler = require("../menuHandler");

args
    .example("dolittle create boundedcontext <name>", "Creates and registers a bounded context with the given name");

var boundedcontextName = "";

const flags = args.parse(process.argv);
if (args.sub.length == 0) args.showHelp();
if (args.sub.length == 1) {
    boundedcontextName = args.sub[0];

    console.log('Loading boilerplates..');
    menuHandler.DisplayLanguageSelection().then((selectedLanguage) => {
        console.log(selectedLanguage);
        boilerPlates.getBoilerPlatesForLanguage(selectedLanguage).then(boilerPlatesSelection => {
            menuHandler.DisplayBoilerplateSelection(boilerPlatesSelection).then((selectedBoilerplate) => {

                console.log(`Creating ${boundedcontextName}`);

                let boilerplateFolderName = boilerPlates.getBoilerPlateByName(selectedBoilerplate, 'csharp').realName;
                
                var projectFolder = folderHandler.CreateBoundedContextFolder(boundedcontextName);
                boilerPlates.generateProjectFrom(boilerplateFolderName, projectFolder);
                
                console.log(`${boundedcontextName} created successfully`);
            });
        });
    });
}