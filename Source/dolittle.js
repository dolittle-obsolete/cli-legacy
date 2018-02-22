#!/usr/bin/env node
// https://www.alexkras.com/compile-node-js-to-native-binaries/
// https://www.npmjs.com/package/args
let args = require("args");

args
  //.option('port', 'The port on which the app will be running', 3000)
  //.option('reload', 'Enable/disable livereloading')
  .command("config", "Work with the configuration of Dolittle CLI")
  .command("create", "Create a Dolittle artifact")
  .command("update", "Updates all local boilerplates")
  .command("applications", "Work with applications")
  .command("boundedcontexts", "Work with bounded contexts")
  ;

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();

//if (flags.port) {
    //console.log(`I'll be running on port ${flags.port}`)
//}