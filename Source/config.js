const folderHandler = require("./folderHandler");

function makeSureFoldersExists(config) {
    folderHandler.MakeDirIfNotExists(config.rootFolder); 
    folderHandler.MakeDirIfNotExists(config.boilerPlatesFolder);
    folderHandler.MakeDirIfNotExists(config.fileTemplatesFolder); 
}
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}

const _rootFolder = new WeakMap();

class Config {
    constructor() {
        _rootFolder.set(this, `${getUserHome()}/.dolittle`);
        makeSureFoldersExists(this);
    }

    get rootFolder() { return _rootFolder.get(this); }
    get boilerPlatesFolder() { return `${this.rootFolder}/boilerplates`; }
    get fileTemplatesFolder() { return `${this.rootFolder}/fileTemplates`; }
}

const config = new Config();

module.exports = config;