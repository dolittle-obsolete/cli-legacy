#!/usr/bin/env node

const args = require("args");
const config = require("../config");


args
    .example("dolittle login", "Login to Dolittle Azure AD.");

console.log("[LOGIN]");
console.log(config.rootFolder);
var code = "C2QNWSNPC";
console.log('To sign in, use a web browser to open the page https://aka.ms/devicelogin and enter the code ' + code + ' to authenticate.');

var id_token = 'Set this to what AAD returns'

// https://github.com/AzureAD/passport-azure-ad#5-usage
// https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devquickstarts-webapi-nodejs
// https://docs.microsoft.com/en-us/power-bi/developer/get-azuread-access-token
/*
var @params = new NameValueCollection
{
    //Azure AD will return an authorization code. 
    //See the Redirect class to see how "code" is used to AcquireTokenByAuthorizationCode
    {"response_type", "code"},

    //Client ID is used by the application to identify themselves to the users that they are requesting permissions from. 
    //You get the client id when you register your Azure app.
    {"client_id", Properties.Settings.Default.ClientID},

    //Resource uri to the Power BI resource to be authorized
    // https://analysis.windows.net/powerbi/api
    {"resource", Properties.Settings.Default.PowerBiAPI},

    //After user authenticates, Azure AD will redirect back to the web app
    {"redirect_uri", "http://localhost:13526/Redirect"}
};
*/

/*
dolittle create
command for språket

Lage et repo for conventions for bp filer. Commands, Query, Readmodel etc.
Lage et bounded contect, har et dolittle json fil med språk, som plukkes opp da en tar en file template.

dolittle create command/query/../ <name>, laster ned filen for det, renamer til name.

*/