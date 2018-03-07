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

    getBoilerPlateByName(name) {

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
                        populateFromLocalBoilerPlates().then(resolve);
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
                    if( fs.statSync(boilerPlatePath).isDirectory ) {
                        let language = this.getLanguageFromName(file);
                        let boilerPlateFile = `${boilerPlatePath}/boilerplate.json`;
                        let name = "<unknown>";
                        let description = "<no description>";
                        if( fs.existsSync(boilerPlateFile) ) {
                            let boilerPlateDetails = JSON.parse(fs.readFileSync(boilerPlateFile).toString());
                            name = boilerPlateDetails.name;
                            description = boilerPlateDetails.description;
                        }
                        let boilerPlate = new BoilerPlate(language, name, description);
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

    /*
        generateBoilerplateProject(projectFolder) {
    
            var localBoilerplates = this.getLocalBoilerplates();
    
            if (localBoilerplates.length == 0) {
                this.getBoilerplateURLs().then((receivedBoilerplates) => {
                    this.loadOnlineBoilerplates(receivedBoilerplates, projectFolder);
                });
            } else {
                this.loadLocalBoilerplates(localBoilerplates, projectFolder);
            }
        }
    
        loadLocalBoilerplates(receivedBoilerplates, projectFolder) {
            console.log("Loading local boilerplates");
            this.selectAndExtractBoilerplate(receivedBoilerplates, projectFolder);
        }
    
        loadOnlineBoilerplates(receivedBoilerplates, projectFolder) {
            console.log("Updating local boilerplates");
            this.downloadAllBoilerplates().then(() => {
                this.selectAndExtractBoilerplate(receivedBoilerplates, projectFolder);
            });
        }
    
        selectAndExtractBoilerplate(receivedBoilerplates, projectFolder) {
            menuHandler.DisplayBoilerplateSelection(receivedBoilerplates).then((selectedBoilerplate) => {
                this.extractBoilerplate(selectedBoilerplate, projectFolder);
                console.log("");
                console.log(`Bounded Context ${projectFolder} created.`);
            });
        }
    
    
    
        extractBoilerplate(boilerplate, toFolder) {
            let zipFile = `${config.boilerPlatesFolder}/${boilerplate}.zip`;
            fs.createReadStream(zipFile)
                .pipe(unzip.Parse())
                .on('entry', function (entry) {
                    let extractFolder = `${boilerplate}-master/Content/`;
    
                    if (entry.path.indexOf(extractFolder) == 0) {
                        let fileName = entry.path.substr(extractFolder.length);
                        let targetPath = toFolder + "/" + fileName;
                        if (entry.type == "Directory") {
                            folderHandler.MakeDirIfNotExists(targetPath);
                            entry.autodrain();
                        } else {
                            entry.pipe(fs.createWriteStream(targetPath));
                        }
                    } else {
                        entry.autodrain();
                    }
                });
        }
        getLocalBoilerplates() {
            var localBoilerplates = [];
    
            fs.readdirSync(config.boilerPlatesFolder).forEach(file => {
                if (!file.startsWith(".")) {
                    localBoilerplates.push(new BoilerPlate(file.substring(0, file.lastIndexOf('.'))));
                }
            });
    
            return localBoilerplates;
        }
    
    
    */

}

const boilerPlates = new BoilerPlates();
module.exports = boilerPlates;