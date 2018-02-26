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

class BoilerPlates {
    getLocalBoilerplates(){
        var localBoilerplates = [];

        fs.readdirSync(config.boilerPlatesFolder).forEach(file => {
            if(!file.startsWith("."))
            {
                localBoilerplates.push(new BoilerPlate( file.substring(0, file.lastIndexOf('.')) ));
            }
        });

        return localBoilerplates;
    }
    getBoilerplateURLs() {
        let promise = new Promise((resolve, reject) => {
            let uri = "https://api.github.com/orgs/dolittle-boilerplates/repos";
            downloader.downloadJson(uri).then(json => {
                let result = JSON.parse(json);
                let boilerPlates = [];
                result.forEach(item => boilerPlates.push(new BoilerPlate(item.name)));
                resolve(boilerPlates);
            });
        });

        return promise;
    }

    downloadBoilerPlate(boilerPlate) {
        let promise = new Promise((resolve, reject) => {
            let destinationPath = `${config.boilerPlatesFolder}/${boilerPlate.name}.zip`;
            let stream = fs.createWriteStream(destinationPath);
            downloader.download(boilerPlate.url, "application/zip", stream).then(resolve());
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
            boilerplates.forEach(boilerplate => {
                let source = `http://github.com/dolittle-boilerplates/${boilerplate.name}/archive/master.zip`;
                this.getActualDownloadUrlFrom(source).then(source => {
                    boilerplate.url = source;
                    this.downloadBoilerPlate(boilerplate).then(resolve);
                });
            });
        });
        return promise;
    }


    extractBoilerplate(boilerplate, toFolder){
        let zipFile = `${config.boilerPlatesFolder}/${boilerplate}.zip`;
        fs.createReadStream(zipFile)
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
                let extractFolder = `${boilerplate}-master/Content/`;

                if( entry.path.indexOf(extractFolder) == 0 ) {
                    let fileName = entry.path.substr(extractFolder.length);
                    let targetPath = toFolder+"/"+fileName;
                    if( entry.type == "Directory") {
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


    downloadAllBoilerplates() {
        let promise = new Promise((resolve, reject) => {
            this.getBoilerplateURLs().then((boilerPlates) => {
                this.downloadAllBoilerplateFiles(boilerPlates).then(resolve);
            });
        });
        return promise;
    }


    loadLocalBoilerplates(receivedBoilerplates, projectFolder)
    {
        console.log("Loading local boilerplates");
        this.selectAndExtractBoilerplate(receivedBoilerplates, projectFolder);
    }

    loadOnlineBoilerplates(receivedBoilerplates, projectFolder)
    {
        console.log("Updating local boilerplates");
        this.downloadAllBoilerplates().then(() => {
            this.selectAndExtractBoilerplate(receivedBoilerplates, projectFolder);
        });
    }

    selectAndExtractBoilerplate(receivedBoilerplates, projectFolder)
    {
        menuHandler.DisplayBoilerplateSelection(receivedBoilerplates).then((selectedBoilerplate) => {
            this.extractBoilerplate(selectedBoilerplate, projectFolder);
            console.log("");
            console.log(`Bounded Context ${projectFolder} created.`);
        });
    }

    generateBoilerplateProject(projectFolder) 
    {
        var localBoilerplates = this.getLocalBoilerplates();
        
        if(localBoilerplates.length == 0)
        {
            this.getBoilerplateURLs().then((receivedBoilerplates) => {
                this.loadOnlineBoilerplates(receivedBoilerplates, projectFolder);
            });
        } else {
            this.loadLocalBoilerplates(localBoilerplates, projectFolder);
        }
    }
}

const boilerPlates = new BoilerPlates();
module.exports = boilerPlates;