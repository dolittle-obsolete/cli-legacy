const fs = require('fs');

const config = require("./config");
const folderHandler = require("./folderHandler");
const context = require("./context");
const interpolationEngine = require("./interpolationEngine");

class FileTemplates {
    constructor() {
        
    }

    getForLanguage(language) {
        
    }

    addCommand(command)
    {
        var commandFolder = `${command}Command`;
        folderHandler.MakeDirIfNotExists(commandFolder);
        var src = `${config.boilerPlatesFolder}/FileTemplates/Content/CSharp/Command`;
        folderHandler.CopyDirectory(src, commandFolder);

        fs.readdirSync(commandFolder).forEach(file => {
            if(file.includes('{{name}}'))
            {
                var newFileName = file.replace(/{{name}}/g, command);
                folderHandler.Rename(`${commandFolder}/${file}`, `${commandFolder}/${newFileName}`);
                interpolationEngine.InterpolateFileWithContext(`${commandFolder}/${newFileName}`, context);
            }
        });
    }
}

const fileTemplates = new FileTemplates();
module.exports = fileTemplates;