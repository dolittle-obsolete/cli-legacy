var fs = require('fs');

class folderHandler
{
    constructor(){

    }

    static MakeDir(folderName)
    {
        var dir = folderName;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}

module.exports = folderHandler;