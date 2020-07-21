const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const fetch = require('node-fetch');
const fs = require('fs');
const fsPromises = fs.promises;

// set up flags
const optionDefinitions = [
    {
        name: 'url',
        alias: 'u',
        type: String,
        multiple: false,
        defaultOption: true,
        description: 'url to make request'
    },
    {
        name: 'output',
        alias: 'o',
        type: String,
        multiple: false,
        defaultOption: false,
        description: 'Write output to <file> instead of stdout.'
    },
    {
        name: 'header',
        alias: 'H',
        type: String,
        multiple: true,
        description: 'Extra header to include in the request when sending HTTP to a server.'
    },
    {
        name: 'agent',
        alias: 'A',
        type: String,
        multiple: false,
        description: 'Specify the User-Agent string to send to the HTTP server.'
    },
    {
        name: 'referer',
        alias: 'e',
        type: String,
        multiple: false,
        description: 'Sends the "Referrer Page" information to the HTTP server.'
    },
    {
        name: "dump-header",
        alias: 'D',
        type: Boolean,
        multiple: false,
        description: 'Write the received protocol headers to the specified file.'
    },
    {
        name: 'data',
        alias: 'd',
        type: String,
        multiple: false,
        description: 'Sends the specified data in a POST request to the HTTP server.'
    },
    {
        name: 'request',
        alias: 'X',
        type: String,
        multiple: false,
        description: 'Specifies a custom request method to use when communicating with the HTTP server.'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description:  'Lists all current command line options with a short description.'
    }

]

const options = commandLineArgs(optionDefinitions)

if (options.help) {
    // use command-line-usage package to display options
    const usage = commandLineUsage([
        {
            header: 'Curl Clone',
            content: 'A tool to transfer data to or from a server.'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        }

        ])
        console.log(usage)
} else {

// define a headers object
let myHeaders = new fetch.Headers();
// define a body object
let myBody = {};
// init object is the second, optional parameter for fetch
// by manipulating this object, we can change our request
let myInit = {};

// data flag allows us to pass in data that will be the body
// of our request
// for that to make sense, we also have to change the method to POST
if (options.data) {
    myInit.method = "POST"
    // data will be passed in as a string
    myBody = options.data;
}

// header flag lets the user pass in strings with key value pairs
// representing any of the various header options
// e.g. "Content-Type: text/plain"
if (options.header){
    options.header.forEach(el => {
        // append each argument passed to the header flag
        // to header object
        arr = el.split(': ');
        myHeaders.append(arr[0], arr[1]);
    })
}
// agent flag sets the User-Agent header value
if (options.agent) {
    myHeaders.append("User-Agent", options.agent)
}
// referer flag sets the User-Agent header value
if (options.referer) {
    myHeaders.append("Referer", options.referer)
}
// store the myBody object and myHeaders object in the
// single object that is passed with the fetch
myInit.headers = myHeaders;
myInit.body = myBody;
// if the request flag is set, change the method to the one
// specified with the flag
if (options.request) {
    myInit.method = options.request
}

// a single fetch call is made to handle all cases
fetch(options.url, myInit)
    .then(result => {
        // if the dump-header flag is set, get all the data
        // from the response object (result)
        if (options['dump-header']) {
            let headerString = [];
            for (let el of result.headers.entries()){
                headerString.push(el.join(": "))
            }
            headerString = headerString.join("\n");
            // asynchronously write a header file
            fsPromises.writeFile("header.txt", `${result.status} ${result.statusText} \n${headerString}`)
                .catch(err => console.log(err.toString()))
        }
        // return the body of the request as a string
        return result.text()
    })
    .then(result => {
        if(options.output){
            // if the output flag is set, output the text to a
            // user-specified file
            fsPromises.writeFile(options.output, result)
                .catch(err => console.log(err.toString()))
        } else {
            // if the output flag is not set,
            // output text from website to console
            console.log(result);
        }
    })
    .catch(err => {
        // catch any errors and console log them
        console.log(err.toString())

    })

}
