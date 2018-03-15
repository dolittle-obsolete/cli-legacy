var fs = require('fs-extra');
const Handlebars = require("handlebars");

class interpolationEngine
{
    static InterpolateFileWithContext(file, context)
    {
        let promise = new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }

                var template = Handlebars.compile(data);
                var result = template(context);

                fs.writeFile(file, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });

                resolve();
            });
        });
        return promise;
    }
}

module.exports = interpolationEngine;