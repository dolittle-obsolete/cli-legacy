#!/usr/bin/env node
let args = require("args");
const fileTemplates = require("../fileTemplates");

args
    .command("dolittle create command <name>", "Creates a new command named <name>");

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();
if (args.sub.length == 1) {
    var commandName = args.sub[0];
    
    fileTemplates.downloadFileTemplates().then(() => {
        fileTemplates.createCommand(commandName, '.');
    });
    
}