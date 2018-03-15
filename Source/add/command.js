#!/usr/bin/env node
let args = require("args");
var readlineSync = require('readline-sync');
const menuHandler = require("../menuHandler");
const boilerPlates = require("../BoilerPlates");
const fileTemplates = require("../FileTemplates");
const projectHandler = require("../ProjectHandler");
const context = require("../context");

args
    .option('language', 'Override detected language')
    .command("dolittle add command <name>", "Creates a new command named <name>");

const flags = args.parse(process.argv);


var detectedLanguage = null;
if (flags.language) {
    console.log(`Setting language: ${flags.language}`)
    detectedLanguage = flags.language;
}

if( args.sub.length == 0 ) args.showHelp();
if (args.sub.length == 1) {
    context.name = args.sub[0];

    // Detect if we are working on a CSharp project
    if(projectHandler.doesCSProjFileExist() && detectedLanguage == null)
    {
        console.log('C# project detected');
        detectedLanguage = 'csharp';
    }

    if(detectedLanguage == null)
    {
        menuHandler.DisplayLanguageSelection().then((selectedLanguage) => {
            addCommand(selectedLanguage);
        });
    } else {
        addCommand(detectedLanguage);
    }
}

function addCommand(language)
{
    if(language == 'csharp')
    {
        context.namespace = projectHandler.generateNamespace();

        menuHandler.DisplayNamespaceSelection(context.namespace).then((namespaceSelection) => {
            if(namespaceSelection != context.namespace)
            {   
                context.namespace = readlineSync.question('Please enter the namespace: ');
            }
    
            console.log('Checking for ' + language + ' boilerplate');
            boilerPlates.getBoilerPlatesForLanguage(language).then(() => {
                console.log('Creating ' + context.name);
                fileTemplates.addCSCommand(context.name);
                console.log(context.name + ' created');
            });
        });
    }
}
