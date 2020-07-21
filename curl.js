const commandLineArgs = require('command-line-args');
const fetch = require('node-fetch');
const fs = require('fs');
const fsPromises = fs.promises


const optionDefinitions = [
    //{ name: 'verbose', alias: 'v', type: Boolean },
    { name: 'url', alias: 'u', type: String, multiple: false, defaultOption: true },
    { name: 'output', alias: 'o', type: String, multiple: false, defaultOption: false }
    //{ name: 'timeout', alias: 't', type: Number }
]
const options = commandLineArgs(optionDefinitions)
// console.log(options);
// if (options.output) console.log(options.output);
fetch(options.url)
    .then(result => result.text())
    .then(result => {
        if(options.output){
            fsPromises.writeFile(options.output, result)
                .catch(err => console.log(err.toString()))
        } else {
            console.log(result)
        }
    })
    .catch(err => {
        // console.log(`could not resolve host: ${options.url}`)
        //console.log(err.fileName, err.lineNumber, err.message)
        console.log(err.toString())

    })
