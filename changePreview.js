var Atem = require('atem') // Load the atem module

var myAtemDevice = new Atem("208.180.224.82") // Create a new Atem instace with an IP address
myAtemDevice.connect() // manually connect to the atem


console.log( process.argv[2] );
myAtemDevice.setPreview(process.argv[2]);
