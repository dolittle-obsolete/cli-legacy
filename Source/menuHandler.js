const inquirer = require('inquirer');

class menuHandler
{
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
                    var l = Object.keys(boilerplates).length;
                    
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
                let boilerplateToExtract = answers["boilerplate"];
                resolve(boilerplateToExtract);
            });
        });

        return promise;
    }
}

module.exports = menuHandler;