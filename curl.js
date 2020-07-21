const commandLineArgs = require('command-line-args');
const fetch = require('node-fetch');


const optionDefinitions = [
    //{ name: 'verbose', alias: 'v', type: Boolean },
    { name: 'url', alias: 'u', type: String, multiple: false, defaultOption: true },
    { name: 'output', alias: 'o', type: String, multiple: true, defaultOption: false }
    //{ name: 'timeout', alias: 't', type: Number }
]
const options = commandLineArgs(optionDefinitions)
// console.log(options);
// if (options.output) console.log(options.output);
fetch(options.url)
    .then(result => result.text())
    .then(result => console.log(result))
    .catch(err => console.log(err))
