var Atem = require('atem'); // Load the atem module
	const express = require('express');
	const app = express();
	const WebSocket = require('ws');

var myAtemDevice = new Atem("208.180.224.82"); // Create a new Atem instace with an IP address
myAtemDevice.connect() // manually connect to the atem
var inputs = {};
var ignore = ['3', '4', 'WRX'];

const wss = new WebSocket.Server({
	port: 8080
});

myAtemDevice.on('connectionStateChange', function (state) {
	console.log('state', state);
});

myAtemDevice.on('inputTally', function (index, value) {
	if (ignore.includes(value.abbreviation) || inputs[index] === undefined) {
		return;
	}
	
	value.index = index;
	
	var changed = false;
	if (value.preview && inputs[index].state != 'preview') {
		inputs[index].state = 'preview';
		var outObj = {index: inputs[index]};
		wss.broadcast(JSON.stringify(outObj));
	}
	if (value.program && inputs[index].state != 'program') {
		inputs[index].state = 'program';
		var outObj = {index: inputs[index]};
		wss.broadcast(JSON.stringify(outObj));
	}

	if(!value.preview && !value.program) {
		inputs[index].state = '';
	}
	var outObj = {index: inputs[index]};
	wss.broadcast(JSON.stringify(outObj));
	console.log(inputs[index]);
});

myAtemDevice.on('sourceConfiguration', function (index, value) {
	if (value.videoInterface != 'internal' && ! ignore.includes(value.abbreviation)) {
		value.index = index;
		inputs[index] = value;
	}
	console.log(inputs);
});

app.get('/api', (req, res) => res.jsonp(inputs));
app.use(express.static('public'))
app.listen(3000, () => console.log('Example app listening on port 3000!'));


wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	ws.send(JSON.stringify(inputs));
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
