const express = require('express');
const functions = require('firebase-functions')
const Datastore = require('nedb');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors')({origin: true});
const app = express();
require('dotenv').config();


app.use(cors);


const db = new Datastore('places.db');
db.loadDatabase();

// app.use(express.static('public'));
// app.use(express.json({limit: '1mb'}));

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/', function(req, res) {
// 	  res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

//  let port = process.env.PORT || 5001;
//  app.listen(port, () => {
//  	console.log('listening on port: 5001 (hol up)');
//  	// console.log(process.env.PORT)
//  });

	// exports.api = functions.https.onRequest((req, res) => {
	// 	console.log(req.data);
	// })


app.get('/loc', (request, response) => {
	console.log('api request for data');
	db.find({}, (err, data) => {
		// console.log(data);
		if(err) {
			console.log(err);
			response.end();
			return;
		}
		response.json(data);
	})
	response.send('no data found');
});


app.get('/geocode-location/:lat,:lng', async (request, response) => {
	let lat = request.params.lat;
	let lng = request.params.lng;
	let key = process.env.API_KEY;
	const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=locality&key=${key}`
	// const res = await fetch(geocodingUrl);
	// const json = await res.json();
	const res = await fetch(geocodingUrl);
	const json = await res.json();
	console.log(json);
	// response.json(json);
	response.send(json);
});

app.post('/remove', (request, response) => {
	const data = request.body;
	console.log(data);
	db.remove(data, {});
	response.json({
		status: `Removed the thing: ${data.place_id} successfully`
	});
});



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
	// console.log(data);
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
exports.api = functions.https.onRequest(app);
// exports.geocode_location = functions.https.onRequest(app);
// exports.geocode_address = functions.https.onRequest(app);
// exports.remove = functions.https.onRequest(app);