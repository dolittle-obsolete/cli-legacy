#!/usr/bin/env node

let args = require("args");

args
    .command("list", "List all bounded contexts for current application")
    ;

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();