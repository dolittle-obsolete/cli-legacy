var fs = require('fs-extra');
const path = require('path');

class folderHandler
{
    static CopyDirectory(source, destination)
    {
        fs.copySync(source, destination);
    }

    static Rename(file, toName)
    {
        fs.renameSync(file, toName);
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

    static SearchRecursive(dir, pattern) {
        var results = [];

        fs.readdirSync(dir).forEach(function (dirInner) {
            dirInner = path.resolve(dir, dirInner);
            var stat = fs.statSync(dirInner);

            if (stat.isDirectory()) {
                results = results.concat(folderHandler.SearchRecursive(dirInner, pattern));
            }

            if (stat.isFile() && dirInner.endsWith(pattern)) {
                results.push(dirInner);
            }
        });

        return results;
    };
}

module.exports = folderHandler;