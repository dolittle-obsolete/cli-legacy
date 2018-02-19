#!/usr/bin/env node
let args = require("args");

args
    .example("dolittle boundedcontext create <name>","Creates and registers a bounded context with the given name");

const flags = args.parse(process.argv);
if( args.sub.length == 0 ) args.showHelp();

console.log("Hello world");