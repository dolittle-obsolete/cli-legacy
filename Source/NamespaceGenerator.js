
const folderHandler = require("./folderHandler");
const path = require("path");

class NamespaceGenerator {
    constructor() {
        
    }

    generateNamespace() {
        var csprojPath = this.findClosestCSProjectFile('./');
        var domain = this.findDomain(csprojPath);
        var domainModules = this.findModulePath(csprojPath);
        var ns = `${domain}${domainModules}`;
        
        return ns;
    }


    findClosestCSProjectFile(dir)
    {
        var results = folderHandler.SearchRecursive(dir, '.csproj');
        if(results != null)
        {
            return results[results.length-1]; // recrusive method gets the closest elements last 
        }
        else {
            return null;
        }
    }

    findDomain(dir)
    {
        var dirNames = dir.split(path.sep);
        var currentDir = dirNames[dirNames.length-2];
        return currentDir;
    }

    findModulePath(dir)
    {
        dir = path.dirname(dir);

        var currentPath = path.resolve('./');
        currentPath = currentPath + '/MyModule/MyFeature'; // test path..
        var modulesPath = currentPath.substring(dir.length);
        var modules = modulesPath.split(path.sep);
        var nsAppend = '';

        var index = 0;
        modules.forEach((element) => {
            if(index == modules.length-1)
                nsAppend += `${element}`;
            else if(index == 0)
                nsAppend += `.${element}`;
            else
                nsAppend += `${element}.`;
            index++;
        });
        return nsAppend;
    }
}

const namespaceGenerator = new NamespaceGenerator();
module.exports = namespaceGenerator;