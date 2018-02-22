#!/usr/bin/env node
const args = require("args");
const boilerPlates = require("../boilerPlates");

args
    .example("dolittle update", "Updates all local boilerplates.");

console.log("[DOWNLOADING]");
boilerPlates.downloadAllBoilerplates().then(console.log("done. soon."));