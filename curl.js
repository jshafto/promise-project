const commandLineArgs = require('command-line-args');
const fetch = require('node-fetch');
const fs = require('fs');
const fsPromises = fs.promises


const optionDefinitions = [
    //{ name: 'verbose', alias: 'v', type: Boolean },
    { name: 'url', alias: 'u', type: String, multiple: false, defaultOption: true },
    { name: 'output', alias: 'o', type: String, multiple: false, defaultOption: false },
    { name: 'header', alias: 'H', type: String, multiple: true },
    { name: 'agent', alias: 'A', type: String, multiple: false},
    { name: 'referer', alias: 'e', type: String, multiple: false },
    {name: "dump-header", type: Boolean, multiple: false},
    {name: 'data', alias: 'd', type: String, multiple: false}

    //{ name: 'timeout', alias: 't', type: Number }
]
const options = commandLineArgs(optionDefinitions)

// define a headers object

// get the header information if it is passed
// and put it in the object
// pass in the object regardless
let myHeaders = new fetch.Headers();

// myHeaders.append('Content-Type', 'image/jpeg');
// console.log(myHeaders);
let myBody = {};
if (options.data) myBody = options.data;
let myInit = {}
//myInit.headers = {}
if (options.header){
    options.header.forEach(el => {
        // convert it to an object
        // add it to myInit.headers
        arr = el.split(': ');
        // myInit.headers[arr[0]] = arr[1];
        myHeaders.append(arr[0], arr[1]);
    })
}
if (options.agent) {
    myHeaders.append("User-Agent", options.agent)
}
if (options.referer) {
    myHeaders.append("Referer", options.referer)
}
myInit.headers = myHeaders;
myInit.body = myBody;

fetch(options.url, myInit)
    .then(result => {
        if (options['dump-header']) {
            //result.headers.entries().forEach(el=>console.log(el))
            // console.log(Object.keys(result.headers))
            let headerString = [];
            for (let el of result.headers.entries()){
                headerString.push(el.join(": "))
            }
            headerString = headerString.join("\n");
            fsPromises.writeFile("header.txt", `${result.status} ${result.statusText} \n${headerString}`)
                .catch(err => console.log(err.toString()))
        }
        return result.text()
    })
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
