const express = require('express');
const Datastore = require('nedb');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

// app.use(express.static('public'));
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'travel-app-client/build')));
app.use(express.json({limit: '1mb'}));


const db = new Datastore('places.db');
db.loadDatabase();

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/', function(req, res) {
// 	  res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

let port = process.env.PORT || 3005;
app.listen(port, () => {
	console.log('listening on port: 3005 (hol up)');
	// console.log(process.env.PORT)
});


//app.get('/.well-known/acme-challenge/atymyzaDbnuYOusg7SQLspp56ox02OImq5gTFdYb6DU', function(req, res) {
//	res.send('atymyzaDbnuYOusg7SQLspp56ox02OImq5gTFdYb6DU.t2kdkEtJxg6NX0Ht1aAUOwKGpI3Qm4U7F03k5-zsFpU');
//});

app.get('/loc', (request, response) => {
    db.find({}, (err, data) => {
        console.log(data);
        if(err) {
            console.log(err);
            response.end();
            return;
        }
        response.json(data);
    })
});

app.post('/remove', (request, response) => {
	const data = request.body;
	console.log(data);
	db.remove(data, {});
	response.json({
		status: `Removed the thing: ${data.place_id} successfully`
	});
});

app.get('/geocode-location/:lat,:lng', async (request, response) => {
	let lat = request.params.lat;
	let lng = request.params.lng;
	let key = process.env.API_KEY;
	const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=locality&key=${key}`
	const res = await fetch(geocodingUrl);
	const json = await res.json();
	console.log(json);
	response.json(json);
})

app.get('/geocode-address/:address', async (request, response) => {
	let key = process.env.API_KEY;
	let address = request.params.address;
	// console.log(address);
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
	const res = await fetch(url);
	const json = await res.json();
	// console.log(json);
	response.json(json);
});

//* set up enpoint for a this route to 'receive the post'
app.post('/api', (request, response) => {
	const data = request.body;
	console.log(data);
    db.insert(data);
    // console.log(db);
    //! need to 'complete' the request
    response.json({
        status: 'Success! Nice Job!',
        name: data.locName,
        place_id: data.place_id,
        latitude: data.lat,
        longitude: data.lng,
        time: data.time
    });
});


// app.use(express.static(path.join(__dirname, 'build')));

// app.listen(process.env.PORT || 8080);
