#!/usr/bin/env node

let args = require("args");

args
    .command("add-cluster", "Add cluster")
    .command("remove-cluster", "Remove cluster")
    .command("use-cluster", "Use cluster")
    .command("current-cluster", "Current cluster")
    .command("view", "View configuration");

const flags = args.parse(process.argv);
if( args.sub.length == 0 ) args.showHelp();