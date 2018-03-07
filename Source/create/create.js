#!/usr/bin/env node
let args = require("args");

const boilerPlates = require("../BoilerPlates");
const FileTemplate = require("../FileTemplate");

boilerPlates.downloadAllBoilerplates();

let fileTemplates = [
    new FileTemplate("csharp", "command", "Creates a command", "/something"),
    new FileTemplate("csharp", "query", "Creates a query", "/something"),
    new FileTemplate("csharp", "readmodel", "Creates a read model", "/something")
];

args = args
    .command("application", "Create an application")
    .command("boundedcontext", "Create a boundedcontext");

fileTemplates.forEach(fileTemplate => args = args.command(fileTemplate.name, args.description, (name, subs) => {

}));

const flags = args.parse(process.argv);

if (args.sub.length == 0) args.showHelp();
