#!/usr/bin/env node
let args = require("args");
var readlineSync = require('readline-sync');
const menuHandler = require("../menuHandler");
const boilerPlates = require("../BoilerPlates");
const fileTemplates = require("../FileTemplates");
const namespaceGenerator = require("../NamespaceGenerator");
const context = require("../context");

args
    .command("dolittle add command <name>", "Creates a new command named <name>");

const flags = args.parse(process.argv);

if( args.sub.length == 0 ) args.showHelp();
if (args.sub.length == 1) {
    context.name = args.sub[0];
    context.namespace = namespaceGenerator.generateNamespace();

    // found CS proj? We then know its a C# project. args option to override detected language

    // _template.js )rename from template.js inside the filetemplate. When copying files, remove the _ onces!

    console.log('Loading boilerplates..');
    menuHandler.DisplayLanguageSelection().then((selectedLanguage) => {
        menuHandler.DisplayNamespaceSelection(context.namespace).then((namespaceSelection) => {
            if(namespaceSelection != context.namespace)
            {   
                context.namespace = readlineSync.question('Please enter the namespace: ');
            }

            boilerPlates.getBoilerPlatesForLanguage(selectedLanguage).then(() => {
                fileTemplates.addCommand(context.name);
                console.log(context.name + ' created');
            });
        });
    });
}
