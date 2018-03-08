const inquirer = require('inquirer');

class menuHandler
{
    static DisplayLanguageSelection()
    {
        let promise = new Promise((resolve, reject) => {
            console.log("");
            inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: 'Select language:',
                choices: function() {
                    var languages = ['csharp'];
                    return languages;
                },
                filter: function(val) {
                    return val;
                }
            }
            ]).then(answers => {
                let selectedLanguage = answers["language"];
                resolve(selectedLanguage);
            });
        });

        return promise;
    }
    static DisplayBoilerplateSelection(boilerplates)
    {
        let promise = new Promise((resolve, reject) => {
            console.log("");
            inquirer.prompt([
            {
                type: 'list',
                name: 'boilerplate',
                message: 'What boilerplate do you want to use?',
                choices: function() {
                    var boilerplatesChoices = [];
                    Object.keys(boilerplates).forEach(element => {
                        boilerplatesChoices.push(element);
                    });
                    return boilerplatesChoices;
                },
                filter: function(val) {
                    return val;
                }
            }
            ]).then(answers => {
                let selectedBoilerPlate = answers["boilerplate"];
                resolve(selectedBoilerPlate);
            });
        });

        return promise;
    }
}

module.exports = menuHandler;