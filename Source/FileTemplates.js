const fs = require("fs");
const url = require('url');
const unzip = require("unzip");
const downloader = require("./downloader");
const config = require("./config");
const cheerio = require("cheerio");
const BoilerPlate = require("./BoilerPlate");
const BoilerPlates = require("./BoilerPlates");
const menuHandler = require("./menuHandler");
const folderHandler = require("./folderHandler");

class FileTemplates {
    constructor() {
        
    }

    getForLanguage(language) {
        
    }
    

    /*
    downloadFileTemplates() {
        let promise = new Promise((resolve, reject) => {
            let destinationPath = `${config.fileTemplatesFolder}/FileTemplates-master.zip`;
            if(!folderHandler.DoesFileExist(destinationPath)) {
                let stream = fs.createWriteStream(destinationPath);
                downloader.download('https://github.com/dolittle-boilerplates/FileTemplates/archive/master.zip', "application/zip", stream).then(resolve());
            } else {
                resolve();
            }
        });
        return promise;
    }

    extractFile(name, toFolder, type)
    {
        let promise = new Promise((resolve, reject) => {
        var pathToExtractedFile = "";

        let zipFile = `${config.fileTemplatesFolder}/FileTemplates-master.zip`;
        fs.createReadStream(zipFile)
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
                let extractFolder = 'FileTemplates-master/Content/CSharp';

                if( entry.path.indexOf(extractFolder) == 0 ) {
                    let fileName = entry.path.substr(extractFolder.length+1);
                    let targetPath = toFolder+"/"+fileName;
                    if( entry.type == "Directory") {
                        folderHandler.MakeDirIfNotExists(targetPath);
                        entry.autodrain();
                    } else {
                        if(fileName === type)
                        {
                            entry.pipe(fs.createWriteStream(targetPath));
                            resolve(targetPath)
                        }
                    } 
                } else {
                    entry.autodrain();
                }
            });
        
        });
        return promise;
    }

    setFileName(file, toName){
        folderHandler.Rename(file, toName);
    }

    setClassAndNamespace(file, className, namespaceName){
        let promise = new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/%name%/g, className);
                result = result.replace(/%namespace%/g, namespaceName);

                fs.writeFile(file, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });

                resolve();
            });
        });
        return promise;
    }

    createCommand(name, toFolder){
        var fileName = `${name}Command.cs`;
        if(!folderHandler.DoesFileExist(`./${fileName}`)) {
            console.log(`Creating ${name}Command`);
            
            this.extractFile(name, toFolder, "Command").then((path) => {
                this.setClassAndNamespace(path, `${name}Command`, 'NamespaceTest').then(() => {
                    this.setFileName(path, fileName);

                    console.log(`${name}Command created in ${fileName}`);
                });
            });
        } else {
            console.log('Command already exists');
        }
    }
    */
}

const fileTemplates = new FileTemplates();
module.exports = fileTemplates;