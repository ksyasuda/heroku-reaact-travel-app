import React, { Component } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import Button from '../../components/UI/Button/Button';
import Success from '../../components/Success/Success';
import axios from 'axios';

const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet

class MyMap extends Component {
	constructor() {
		super();
		this.state = {
			lat: 37,
			lng: -100,
			zoom: 3,
			markers: [],
			counter: 1,
			locName: null,
			place_id: null,
			success: null
		};
	}
	// state = {
	// 	lat: null,
	// 	lng: null,
	// 	zoom: null
	// }

	findMe = () => {
		this.getLocation();
		this.setMarker();
	}

	getLocation = () => {
		if ('geolocation' in navigator) {
			// console.log('geolocation available');
			navigator.geolocation.getCurrentPosition(async position => {
				let lat = position.coords.latitude.toFixed(4);
				let lng = position.coords.longitude.toFixed(4);
				document.getElementById('lat').innerText = lat;
				document.getElementById('lng').innerText = lng;
				 // [lat, lon] = [37.636845, -118.986252]; //Mammoth Mtn
				let geocodingUrl = `geocode-location/${lat},${lng}`;
				console.log(geocodingUrl);
				const response = await axios.get(geocodingUrl);
				// console.log(response.data.results[0].formatted_address);
				console.log(response);
				const address = response.data.results[0].formatted_address;
				const id = response.data.results[0].place_id;
				// console.log(lat, lng);
				this.setState({lat:lat,lng:lng,locName:address, place_id: id});
				setTimeout(() => {
					// console.log('setting state in getLocation()');
					if(this.state.markers.length < 1)
						this.setMarker();
					else 
						this.moveMarker();
				}, 1);
			})
		} else {
			console.log('geolocation not available');
		}
	}

	setMarker = () => {
		let position = [this.state.lat, this.state.lng];
		let x = (
			<Marker position={position} key={this.state.counter} />
		);
		let markers = [...this.state.markers];
		markers.push(x);
		this.setState({markers:markers, counter: this.state.counter + 1});
	}

	moveMarker = () => {
		let position = [this.state.lat, this.state.lng];
		let x = <Marker position={position} key={this.state.counter} />
		let markers = [this.state.markers];
		markers.pop();
		markers.push(x);
		this.setState({markers:markers, counter: this.state.counter + 1});
	}
	

	setLocation = (lat, lng, name, id) => {
		this.setState({lat:lat,lng:lng,locName:name,place_id:id});
		if(this.state.markers.length < 1) {
			this.setMarker();
		} else {
			this.moveMarker();
		}
	}

	onSearchHandler = async () => {
			let data = document.getElementById('searchbox');
			// console.log(data.value);
			let nice = data.value.split(' ');
			// console.log(nice);
			let address = nice[0];
			for(let i = 1; i < nice.length; ++i) {
				address += '+' + nice[i];
			}
			// console.log(address);
			let url = `geocode-address/${address}`;
			const response = await axios.get(url);
			// console.log(response);
			let lat, lng, name, place_id;
			if(response.data) {
				lat = response.data.results[0].geometry.location.lat;
				lng = response.data.results[0].geometry.location.lng;
				name = response.data.results[0].formatted_address;
				place_id = response.data.results[0].place_id;
				this.setLocation(lat, lng, name, place_id);
			} 	
	}

	clearState = () => {
		let markers = [this.state.markers];
		let id = this.state.place_id;
		id = null;
		let name = this.state.locName;
		name = null;
		let c = this.state.counter;
		c = 1;
		for(let i = 0; i < markers.length; ++i) {
			markers.pop();
		}
		this.setState({place_id:id,locName:name,counter:c,markers:markers});
		// console.log('State cleared');
	}

	onSendHandler = async () => {
			if(this.state.markers.length < 1) return;
			let lat = this.state.lat;
			let lng = this.state.lng;
            const time = Date.now();
            const locName = this.state.locName;
            const place_id = this.state.place_id;
            const data = {locName, place_id, lat, lng, time};
            console.log('fetching');
			const response = await axios.post('/api', data);
			console.log(response);
			this.clearState();
			let success = this.state.success;
			success = <Success />;
			this.setState({success:success});
			setTimeout(() => {
				let s = this.state.success;
				s = null;
				this.setState({success:s});
			}, 1000);
	}

	onZoomHandler = () => {
		if(this.state.markers.length < 1) return;
		let zoom = this.state.zoom;
		zoom = 12;
		this.setState({zoom:zoom});
	}

  render() {
    // const position = [this.state.lat, this.state.lng];
    return (
		<div>
			<h2>Travel Locations</h2>
			{this.state.success}
			<LeafletMap center={[this.state.lat, this.state.lng]}
			zoom={this.state.zoom} style={{'width':'80%', 'position':'relative', 'left':'10%', 'border':'1px solid hotpink'}}>
				<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
				/>
				{/* <Marker position={position}>
				<Popup>
					NICE
				</Popup>
				</Marker> */}
				{this.state.markers}
			</LeafletMap>
			<Button disabled={false} clicked={this.getLocation}>Find Location</Button>
			<Button disabled={false} clicked={this.onSendHandler}>Send It!</Button>
			<Button disabled={false} clicked={this.onZoomHandler}>Zoom
			In</Button>
			<h2>Or Search For A Location Below</h2>
			<form id="searchForm" type="text" onSubmit={this.onSearchHandler}>
            	<input type="text" style={{'width':'20%'}} id="searchbox" name="serach"/>
            	<br/>
            	<button onClick={this.onSearchHandler} type="button" id="send" style={{'marginTop': '10px'}}>Search</button>
        	</form>
			<p style={{'fontWeight':'bold', 'fontSize':'larger'}}>Latitude: <span id="lat">{this.state.lat}</span></p>
			<p style={{'fontWeight':'bold', 'fontSize':'larger'}}>Longitude: <span id="lng">{this.state.lng}</span></p>
		</div>
      

    );
  }
}

export default MyMap;
