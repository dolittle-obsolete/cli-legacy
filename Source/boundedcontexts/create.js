#!/usr/bin/env node
const args = require("args");


const boilerPlates = require("../boilerPlates");

args
    .example("dolittle boundedcontext create <name>", "Creates and registers a bounded context with the given name");

const flags = args.parse(process.argv);
if (args.sub.length == 0) args.showHelp();

boilerPlates.downloadAllBoilerplates();

console.log("End of create");