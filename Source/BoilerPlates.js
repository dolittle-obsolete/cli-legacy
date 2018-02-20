const fs = require("fs");
const url = require('url');
const downloader = require("./downloader");
const config = require("./config");
const cheerio = require("cheerio");
const BoilerPlate = require("./BoilerPlate");

const _rootFolder = new WeakMap();

class BoilerPlates {
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
            downloader.download(boilerPlate.url, "application/zip", stream);
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
        boilerplates.forEach(boilerplate => {
            let source = `http://github.com/dolittle-boilerplates/${boilerplate.name}/archive/master.zip`;
            this.getActualDownloadUrlFrom(source).then(source => {
                boilerplate.url = source;
                this.downloadBoilerPlate(boilerplate);
            });
        });
    }

    downloadAllBoilerplates() {
        this.getBoilerplateURLs().then((boilerPlates) => this.downloadAllBoilerplateFiles(boilerPlates));
    }
}

const boilerPlates = new BoilerPlates();
module.exports = boilerPlates;