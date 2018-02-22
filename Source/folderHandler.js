var fs = require('fs');

class folderHandler
{
    static MakeDirIfNotExists(folderName)
    {
        var dir = folderName;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }

    static CreateBoundedContextFolder(boundedcontextName)
    {
        let projectFolder = `../../${boundedcontextName}`
        folderHandler.MakeDirIfNotExists(projectFolder);
        return projectFolder;
    }
}

module.exports = folderHandler;