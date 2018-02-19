#!/usr/bin/env node
let args = require("args");

args
    .command("list", "List all applications")
    ;

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();
