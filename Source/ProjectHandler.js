
const folderHandler = require("./folderHandler");
const path = require("path");

class ProjectHandler {
    constructor() {
        this.csprojFound = false;
        this.csprojPath = null;
    }

    isCSProjFileFound()
    {
        return this.csprojFound;
    }
    getCSProjPath()
    {
        return this.csprojPath;
    }

    doesCSProjFileExist()
    {
        if(!this.isCSProjFileFound())
        {
            this.findCSProjFile();
        }
        return this.isCSProjFileFound();
    }

    findCSProjFile()
    {
        var csprojPath = null;
        var currentSearchPath = './';
        csprojPath = this.findClosestCSProjectFile(currentSearchPath);
        var tries = 10;
        while(csprojPath == null && tries > 0)
        {
            currentSearchPath += '../';
            csprojPath = this.findClosestCSProjectFile(currentSearchPath);
            tries--;
        }
        if(csprojPath != null)
        {
            this.csprojFound = true;
            this.csprojPath = csprojPath;
        }
        return csprojPath;
    }

    generateNamespace() {
        var csprojPath = null; 
        if(!this.isCSProjFileFound())
        {
            csprojPath = this.findCSProjFile();
        } else csprojPath = this.getCSProjPath();

        if(csprojPath == null)
            return this.findDomain(path.resolve('./')); // Set root namespace to current director
        
        this.csprojFound = true;

        var root = this.findRootNamespaceInCSProjFile(csprojPath);

        if(root == null)
            root = this.findDomain(csprojPath);

        var domainModules = this.findModulePath(csprojPath);
        var ns = `${root}${domainModules}`;
        
        return ns;
    }

    findRootNamespaceInCSProjFile(file)
    {
        var fs = require('fs');
        var csprojContent = fs.readFileSync(file, "utf8");

        var xpath = require('xpath'), dom = require('xmldom').DOMParser;
 
        var xml = "<book><title>Harry Potter</title></book>";
        var doc = new dom().parseFromString(csprojContent);
        var nodes = xpath.select("//RootNamespace", doc);

        if(nodes[0] != undefined)
        {
            return nodes[0].firstChild.data;
        }

        return null;
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
        currentPath = currentPath;
        var modulesSubPath = currentPath.substring(dir.length);
        var modules = modulesSubPath.split(path.sep);
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

const projecthandler = new ProjectHandler();
module.exports = projecthandler;