#!/usr/bin/env node
const args = require("args");
const folderHandler = require("../folderHandler");
const boilerPlates = require("../BoilerPlates");
const menuHandler = require("../menuHandler");
const context = require("../context");

args
    .example("dolittle create boundedcontext <name>", "Creates and registers a bounded context with the given name");

const flags = args.parse(process.argv);
if (args.sub.length == 0) args.showHelp();
if (args.sub.length == 1) {
    context.name = args.sub[0];

    console.log('Loading boilerplates..');
    menuHandler.DisplayLanguageSelection().then((selectedLanguage) => {
        console.log(selectedLanguage);
        boilerPlates.getBoilerPlatesForLanguage(selectedLanguage).then(boilerPlatesSelection => {
            menuHandler.DisplayBoilerplateSelection(boilerPlatesSelection).then((selectedBoilerplate) => {

                console.log(`Creating ${context.name}`);

                let boilerplateFolderName = boilerPlates.getBoilerPlateByName(selectedBoilerplate, selectedLanguage).realName;
                
                var projectFolder = folderHandler.CreateBoundedContextFolder(context.name);
                boilerPlates.generateProjectFrom(boilerplateFolderName, projectFolder);
                
                console.log(`${context.name} created successfully`);
            });
        });
    });
}