const folderHandler = require("./folderHandler");

function makeSureFoldersExists(config) {
    folderHandler.MakeDirIfNotExists(config.rootFolder); 
    folderHandler.MakeDirIfNotExists(config.boilerPlatesFolder); 
}

const _rootFolder = new WeakMap();

class Config {
    constructor() {
        _rootFolder.set(this, "./.dolittle");
        makeSureFoldersExists(this);
    }

    get rootFolder() { return _rootFolder.get(this); }
    get boilerPlatesFolder() { return `${this.rootFolder}/boilerplates`; }
}

const config = new Config();

module.exports = config;