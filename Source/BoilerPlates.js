var fs = require('fs');
var url = require('url');
var http = require('http');
var https = require('https');

const folderHandler = require("./folderHandler");

class BoilerPlates
{
    constructor() {
        this.self = this;
        this.downloadFileTest = function(s, d){
            this.downloadFile(s,d);
        }
    }


    getBoilerplateURLs(callback) {
        var availableBoilerplates = [];
        
        var options = {
            host: 'api.github.com',
            path: '/orgs/dolittle-boilerplates/repos',
            headers: {'User-Agent': 'request'}
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

                        for(var i = 0; i < this.data.length; i++){
                            //console.log(this.data[i].name);
                            availableBoilerplates[i] = this.data[i].name;
                        }
                    } catch (e) {
                        console.log('Error parsing JSON');
                    }

                    callback(availableBoilerplates, that.self);
                } else {
                    console.log('Status:', res.statusCode);
                }
            });
        }).on('error', function (err) {
            console.log('Error:', err);
        });
    }

    downloadFile(downloadURL, destination) {
        //console.log(url.parse(downloadURL).host);

        var host = url.parse(downloadURL).host;
        var path = url.parse(downloadURL).pathname.substr(1);
        //console.log(url.parse(downloadURL).path);


        var options = {
            host: host, //'github.com',
            path: path,//'dolittle-boilerplates/DotNET.Basic/archive/master.zip',
            headers: {'Content-Type' : 'application/zip'}
        };

        var filename = url.parse(downloadURL).pathname.split('/').pop();
        var file = fs.createWriteStream(destination + filename);

        console.log('Starting to download ' + downloadURL + ' to ' + destination);
        https.get(options, function(res) {
            res.on('data', function(chunk) {
                console.log('Writing to ' + destination);
                file.write(chunk);
            }).on('end', function() {
                file.end();
                console.log('Downloaded ' + filename + ' to ' + destination);
            });
        });
    }

    makeDolittleFolder() {
        folderHandler.MakeDir('./.dolittle'); // add ~ instead of . - do I need proper permissions for this to work?
        folderHandler.MakeDir('./.dolittle/boilerplates/'); // use constant, how?
    }

    downloadAllBoilerplateFiles(boilerplates, that) {
        for(var i = 0; i < boilerplates.length; i++)
        {
            var dlUrl = 'http://github.com/dolittle-boilerplates/' + boilerplates[i] + '/archive/master.zip';
            console.log(dlUrl);
            //that.downloadFile(dlUrl, './.dolittle/boilerplates/');
            that.downloadFileTest(dlUrl, './.dolittle/boilerplates/');
        }
    }

    downloadAllBoilerplates() {
        this.makeDolittleFolder();
        
        // get boilerplates download URLs
        this.getBoilerplateURLs(this.downloadAllBoilerplateFiles, this);
    }
}

module.exports = BoilerPlates;
