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

    addCSCommand(command)
    {
        var commandFolder = `${command}`;
        folderHandler.MakeDirIfNotExists(commandFolder);
        var src = `${config.boilerPlatesFolder}/FileTemplates/Content/CSharp/Command`;
        folderHandler.CopyDirectory(src, commandFolder);

        fs.readdirSync(commandFolder).forEach(file => {
            if(file.charAt(0) == '_')
            {
                var deleteFile =`${commandFolder}/${file}`;
                fs.unlinkSync(deleteFile);
            }

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