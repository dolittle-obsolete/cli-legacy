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
}

module.exports = folderHandler;