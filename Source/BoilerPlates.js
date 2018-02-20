var fs = require('fs');
var url = require('url');
var http = require('http');
var https = require('https');

const folderHandler = require("./folderHandler");
const cheerio = require("cheerio");

class BoilerPlates {
    constructor() {
    }

    getBoilerplateURLs() {
        let promise = new Promise((resolve, reject) => {
            var availableBoilerplates = [];

            var options = {
                host: 'api.github.com',
                path: '/orgs/dolittle-boilerplates/repos',
                headers: { 'User-Agent': 'request' }
            };

            var that = this;

            https.get(options, function (res) {
                var json = '';
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    if (res.statusCode === 200) {
                        try {
                            this.data = JSON.parse(json);
                            //console.log(json);

                            for (var i = 0; i < this.data.length; i++) {
                                //console.log(this.data[i].name);
                                availableBoilerplates[i] = this.data[i].name;
                            }
                        } catch (e) {
                            console.log('Error parsing JSON');
                        }

                        resolve(availableBoilerplates);
                    } else {
                        console.log('Status:', res.statusCode);
                        reject(res);
                    }
                });
            }).on('error', function (err) {
                reject(err);
                console.log('Error:', err);
            });
        });

        return promise;
    }

    downloadFile(downloadURL, destination) {
        //console.log(url.parse(downloadURL).host);

        var host = url.parse(downloadURL).host;
        var path = url.parse(downloadURL).pathname;
        //console.log(url.parse(downloadURL).path);

        var options = {
            host: host, //'github.com',
            path: path,//'dolittle-boilerplates/DotNET.Basic/archive/master.zip',
            headers: { 'Content-Type': 'application/zip' }
        };

        var filename = url.parse(downloadURL).pathname.split('/').pop();
        var file = fs.createWriteStream(destination + filename);

        console.log('Starting to download ' + downloadURL + ' to ' + destination);
        https.get(options, function (res) {
            res.on('data', function (chunk) {
                console.log('Writing to ' + destination);
                file.write(chunk);
            }).on('end', function () {
                file.end();
                console.log('Downloaded ' + filename + ' to ' + destination);
            });
        });
    }

    makeDolittleFolder() {
        folderHandler.MakeDir('./.dolittle'); // add ~ instead of . - do I need proper permissions for this to work?
        folderHandler.MakeDir('./.dolittle/boilerplates/'); // use constant, how?
    }

    getActualDownloadUrlFrom(origin) {
        let promise = new Promise((resolve, reject) => {

            var host = url.parse(origin).host;
            var path = url.parse(origin).pathname;
            var options = {
                host: host,
                path: path,
                headers: { 'Content-Type': 'text/html' }
            };

            let html = "";

            https.get(options, function (res) {
                res.on("data", (chunk) => {
                    html += chunk;
                }).on("end", () => {
                    let $ = cheerio.load(html);
                    let anchorTag = $("a")[0];
                    let downloadUrl = anchorTag.attribs.href;
                    resolve(downloadUrl);
                }).on("error", reject);
            });
        });
        return promise;
    }

    downloadAllBoilerplateFiles(boilerplates) {
        for (var i = 0; i < boilerplates.length; i++) {
            var dlUrl = 'http://github.com/dolittle-boilerplates/' + boilerplates[i] + '/archive/master.zip';
            console.log(dlUrl);

            this.getActualDownloadUrlFrom(dlUrl).then((url) => this.downloadFile(url, "./.dolittle/boilerplates"));
        }
    }

    downloadAllBoilerplates() {
        this.makeDolittleFolder();
        // get boilerplates download URLs
        this.getBoilerplateURLs().then((boilerPlates) => this.downloadAllBoilerplateFiles(boilerPlates));
    }
}

module.exports = BoilerPlates;
