var fs = require('fs-extra');

class folderHandler
{
    static CopyDirectory(source, destination)
    {
        fs.copy(source, destination, function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

    static Rename(file, toName)
    {
        fs.rename(file, toName, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    }

    static DoesFileExist(file)
    {
        if (fs.existsSync(file)) {
            return true;
        }
        return false;
    }

    static MakeDirIfNotExists(folderName)
    {
        var dir = folderName;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }

    static CreateBoundedContextFolder(boundedcontextName)
    {
        let projectFolder = `${boundedcontextName}`
        folderHandler.MakeDirIfNotExists(projectFolder);
        return projectFolder;
    }
}

module.exports = folderHandler;