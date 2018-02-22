const url = require('url');
const http = require('http');
const https = require('https');
const streams = require("stream");

class Downloader {

    download(source, mimeType, stream) {
        let promise = new Promise((resolve, reject) => {
            let host = url.parse(source).host;
            let path = url.parse(source).pathname;

            let options = {
                host: host,
                path: path,
                headers: {
                    "Content-Type": mimeType,
                    "User-Agent": "request"
                }
            };

            https.get(options, function (res) {
                res.on("data", function (chunk) {
                    if (stream) {
                        stream.write(chunk);
                    }
                }).on("end", function () {
                    if (stream) {
                        stream.end();
                    }
                    resolve();
                });
            });
        });
        return promise;
    }

    downloadText(source, mimetype) {
        let promise = new Promise((resolve, reject) => {
            if (!mimetype) mimetype = "text";

            let stream = new streams.PassThrough();
            let text = "";
            stream.on("data", (chunk) => text += chunk);
            stream.on("end", () => resolve(text));

            this.download(source, mimetype, stream);
        });
        return promise;
    }

    downloadHtml(source) {
        return this.downloadText(source, "text/html");
    }

    downloadJson(source) {
        return this.downloadText(source, "application/json");
    }
}


const downloader = new Downloader();
module.exports = downloader;