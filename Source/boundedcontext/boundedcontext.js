#!/usr/bin/env node

let args = require("args");

args
    .command("create", "Create a bounded context")
    ;

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();