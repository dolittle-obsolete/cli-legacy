# cli

Command Line Interface for working with the Dolittle Platform

## Building

```shell
$ git clone https://github.com/dolittle-platform/cli.git
$ cd cli/Source
$ npm install
$ npm link
```

## Adding a sub command

Add a file for the command in the right place. This file will be a node "binary".
On top of the new JavaScript file add the following:

```shell
#!/usr/bin/env node
```

Then you need to change the files attributes so that it is an executable:

```shell
$ chmod +x <file>
```

The file should now be possible to run by typing `./<file.js>`.
To hook this up, the `args` node package is looking by convention from the commands being setup. 
So for instance the following command:

```javascript
let args = require("args");

args
  .command("create", "Create a Dolittle artifact");
```

will map to a node "binary" called `dolittle-create`.
This is configured in the `packages.json` file:

```json
{
    "bin": {
        "dolittle-create": "create/create.js"
    }
}
```

When you've got all this setup, you simply run `npm link` to get it linked.


