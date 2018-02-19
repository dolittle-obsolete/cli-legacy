#!/usr/bin/env node
let args = require("args");

args
    .command("application", "Create an application")
    .command("boundedcontext", "Create a boundedcontext")
    ;

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();
