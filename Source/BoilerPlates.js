const fs = require("fs");
const url = require('url');
const unzip = require("unzip");
const downloader = require("./downloader");
const config = require("./config");
const cheerio = require("cheerio");
const BoilerPlate = require("./BoilerPlate");
const menuHandler = require("./menuHandler");
const folderHandler = require("./folderHandler");

const _rootFolder = new WeakMap();
const _boilerPlatesPerLanguage = new WeakMap();

class BoilerPlates {

    constructor() {
        _boilerPlatesPerLanguage.set(this, {});
    }

    get boilerPlatesPerLanguage() { return _boilerPlatesPerLanguage.get(this); }

    get hasBoilerPlates() {
        return Object.keys(this.boilerPlatesPerLanguage).length > 0;
    }

    getBoilerPlateByName(name, language) {
        return this.boilerPlatesPerLanguage[language][name];
    }

    getBoilerPlatesForLanguage(language) {
        let promise = new Promise((resolve, reject) => {
            let done = () => resolve(_boilerPlatesPerLanguage.get(this)[language]);
            if (!this.hasBoilerPlates) {
                this.populateBoilerPlates().then(done);
            } else done();
        });
        return promise;
    }

    generateProjectFrom(boilerPlate, projectFolder) {
        var src = `${config.boilerPlatesFolder}/${boilerPlate}/Content/Source`;
        folderHandler.CopyDirectory(src, projectFolder);
    }

    getBoilerplateURLs() {
        let promise = new Promise((resolve, reject) => {
            let uri = "https://api.github.com/orgs/dolittle-boilerplates/repos";
            downloader.downloadJson(uri).then(json => {
                let result = JSON.parse(json);
                let boilerPlates = [];
                result.forEach(item => boilerPlates.push(item.name));
                resolve(boilerPlates);
            });
        });

        return promise;
    }

    getLanguageFromName(boilerPlateName) {
        if (boilerPlateName.toLowerCase() == "filetemplates") return "filetemplates";
        return boilerPlateName.substr(0, boilerPlateName.indexOf(".")).toLowerCase();
    }

    downloadBoilerPlate(boilerPlateName, url) {
        let promise = new Promise((resolve, reject) => {
            let destinationPath = `${config.boilerPlatesFolder}/${boilerPlateName}.zip`;
            let stream = fs.createWriteStream(destinationPath);

            // Unzip - get metadata from JSON file - create BoilerPlate and resolve

            downloader.download(url, "application/zip", stream).then(() => {
                let boilerPlatePath = `${config.boilerPlatesFolder}/`;

                fs.createReadStream(destinationPath)
                    .pipe(unzip.Extract({
                        path: boilerPlatePath
                    })
                        .on("close", () => {
                            fs.renameSync(`${config.boilerPlatesFolder}/${boilerPlateName}-master`, `${config.boilerPlatesFolder}/${boilerPlateName}`);
                            fs.unlinkSync(destinationPath);
                            resolve();
                        }));
            });
        });
        return promise;
    }

    getActualDownloadUrlFrom(source) {
        let promise = new Promise((resolve, reject) => {
            downloader.downloadHtml(source).then(html => {
                let $ = cheerio.load(html);
                let anchorTag = $("a")[0];
                let downloadUrl = anchorTag.attribs.href;
                resolve(downloadUrl);
            });
        });
        return promise;
    }

    downloadAllBoilerplateFiles(boilerplates) {
        let promise = new Promise((resolve, reject) => {
            var index = 0;
            boilerplates.forEach(boilerplate => {
                let source = `http://github.com/dolittle-boilerplates/${boilerplate}/archive/master.zip`;
                this.getActualDownloadUrlFrom(source).then(url => {
                    this.downloadBoilerPlate(boilerplate, url).then(() => {
                        index++;
                        if (index == boilerplates.length)
                            resolve();
                    });
                });
            });
        });
        return promise;
    }
    
    downloadAllBoilerplates() {
        let promise = new Promise((resolve, reject) => {
            this.getBoilerplateURLs().then((boilerPlates) => {
                this.downloadAllBoilerplateFiles(boilerPlates).then(resolve);
            });
        });
        return promise;
    }

    populateBoilerPlates() {
        let promise = new Promise((resolve, reject) => {
            this.populateFromLocalBoilerPlates().then(() => {
                if( !this.hasBoilerPlates ) {
                    this.downloadAllBoilerplates().then(() => {
                        this.populateFromLocalBoilerPlates().then(resolve);
                    });
                } else resolve();
            });
        });
        return promise;
    }

    populateFromLocalBoilerPlates() {
        let promise = new Promise((resolve, reject) => {
            fs.readdir(config.boilerPlatesFolder,(error, files) => {
                files.forEach(file => {

                    let boilerPlatePath = `${config.boilerPlatesFolder}/${file}`;
                    if( fs.statSync(boilerPlatePath).isDirectory && !this.skipFileWithName(file)) {
                        let language = this.getLanguageFromName(file);
                        let boilerPlateFile = `${boilerPlatePath}/boilerplate.js`;
                        
                        let templateDetails = require(boilerPlateFile);

                        let name = templateDetails.name;
                        let description = templateDetails.description;

                        let boilerPlate = new BoilerPlate(language, name, description, file);
                        let boilerPlates = this.boilerPlatesPerLanguage[language] || {};
                        boilerPlates[name] = boilerPlate;
                        this.boilerPlatesPerLanguage[language] = boilerPlates;
                    }
                });

                resolve();
            });
        
        });
        return promise;
    }

    skipFileWithName(name) {
        var skipFile = false;
        if(name == '.DS_Store')
            skipFile = true;
        if(name == 'FileTemplates')
            skipFile = true;

        return skipFile;
    }
}

const boilerPlates = new BoilerPlates();
module.exports = boilerPlates;