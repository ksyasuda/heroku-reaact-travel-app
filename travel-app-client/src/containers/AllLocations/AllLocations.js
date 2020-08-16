import React, { Component } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import axios from 'axios';


const { Map: LeafletMap, TileLayer, Marker, Popup, FeatureGroup } = ReactLeaflet

class AllLocations extends Component {
	state = {
		lat: 37,
		lng: -100,
		markers: [],
		places: new Map(),
		markerGroup: [],
		weather: null
	}

	setGroup = () => {
		let markers = [...this.state.markers]
		this.setState({markerGroup:(<FeatureGroup>{markers}</FeatureGroup>)});
	}

	popup = async (lat, lng) => {
		let message = this.state.weather;
		const response = await axios.get(`/weather/${lat},${lng}`);
		// console.log(response);
		let temp = response.data.current.feels_like;
		let weather = response.data.current.weather[0].description;
		let l = this.state.lat;
		let lg = this.state.lng;
		l = lat;
		lg = lng;
		message = `The temperature is currently ${temp} with ${weather}`;
		this.setState({weather:message});
	}

	setMarkers = ()  => {
		let ctr = 1;
		let markers = [...this.state.markers];
		let group = [...this.state.markerGroup];
		let lat, lng;
		for(let elt of markers) {
			[lat,lng] = elt;
			let marker = (
				<Marker position={[lat,lng]} key={ctr++}>
					<Popup onOpen={(event) => this.popup(event)}>
						A popup
					</Popup>
				</Marker>
			);
			group.push(marker);
		}
		this.setState({markerGroup:group});
		console.log('markers set');
		console.log(this.state.markerGroup);
	}
	

	componentDidMount() {
			// this.addEventListener();
			console.log('All-locations MOUNT');
			let url = `/loc`;
			axios.get(url).then(response => {
				console.log('right after the get call');
				console.log(response);
				let data = response.data;
				// console.log(response);
				let lat, lng, locName, place_id, time;
				let counter = 1;
				let markers = [...this.state.markers];
				for(let item of data) {
					lat = item.lat;
					lng = item.lng;
					locName = item.locName;
					place_id = item.place_id;
					time = item.time;
					let places = this.state.places;
					// console.log(places);
					if(!places.has(place_id)) {
						places.set(place_id, locName);
						this.setState({places:places});
					}
					// else {
					// 	console.log('DUPLICATES!');
					// 	const data = {place_id: item.place_id}
					// 	const options = {
					// 		method: 'POST',
					// 		body: JSON.stringify(data),
					// 		headers: {
					// 			'Content-Type': 'application/json'
					// 		}
					// 	};
					// 	axios.post('/remove', data).then(res => {
					// 		console.log(res);
					// 	});
					// }
					let root = document.createElement('div');
					let loc = document.createElement('div');
					let date = document.createElement('div');
					let br = document.createElement('div');
					let name = document.createElement('div');
					loc.innerHTML = `<p><strong>Latitude:</strong> <span id="lat">${item.lat}</span> <strong>|</strong> <strong>Longitude</Strong> <span id="lon">${item.lng}</span>`;
					name.innerHTML = `<h1><strong>${counter++}.</strong>  ${locName}</h1>`;
					br.innerHTML = '<br/>';
					const dateStr = new Date(time).toLocaleString();
					date.innerHTML = `<p><strong>${dateStr}</strong></p>`
					loc.id = 'location';
					date.id = 'date';
					root.className = 'all-locations';
					root.append(name, date, br, loc, br);
					document.body.append(root);
					let latlng = [lat, lng];
					// let marker = (
					// 	<Marker position={[lat,lng]} key={time}>
					// 		<Popup onOpen={(event) => this.popup(event)}>
					// 		</Popup>
					// 	</Marker>
					// );
					markers.push(latlng);
				}
				this.setState({markers:markers});
				// this.setMarkers();
				// this.setGroup();
				});
			console.log(this.state.markers);
	}

	componentWillUnmount = () => {
		console.log('[componentWillUnmount] start');
		//* clears the text elements from the dom
		let x = document.getElementsByClassName('all-locations');
		let ctr = 0;
		// let markers = this.state.markers;
		//! might be orphaning nodes here and need to recursively or iteratively remove all nodes in the chain
		let markers = [...this.state.markers];
		for(let i = 0; i < markers.length; ++i) {
			markers.pop();
		}
		while(x[ctr]) {
			// console.log(x);
			x[ctr].parentNode.removeChild(x[ctr]);
		}
		this.setState({markers:markers});
		console.log(this.state.markers);
		console.log('[componentWillUnmount] end');
	}
	
	popupCloseHandler = () => {
		if(this.state.weather !== null && (this.state.weather !== undefined)) {
			let message = this.state.weather;
			message = null;
			this.setState({weather:message});
		}
	}

	onViewportChanged = viewport => {
		// console.log(viewport);
		let lat = this.state.lat;
		let lng = this.state.lng;
		let zoom = this.state.zoom;
		lat = viewport.center[0];
		lng = viewport.center[1];
		zoom = viewport.zoom;
		this.setState({lat:lat,lng:lng,zoom:zoom});
	}
	
	render() {
		// console.log(this.state.markerGroup);
		let ctr = 1;
		return (
			<div id="map-container">
				<h2>All Locations</h2>
				<LeafletMap onViewportChanged={(viewport) => this.onViewportChanged(viewport)} worldCopyJump={true} center={[this.state.lat, this.state.lng]} zoom={3} style={{'width':'80%', 'position':'relative', 'left':'10%', 'border':'1px solid hotpink'}}>
					<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
					/>
					{/* <Marker position={position}>
					<Popup>
						NICE
					</Popup>
					</Marker> */}
					{this.state.markers.map(marker => {
						{/* console.log(marker); */}
						return (
							<Marker position={[marker[0], marker[1]]} key={ctr++}>
								<Popup onClose={this.popupCloseHandler} onOpen={() => this.popup(marker[0], marker[1])}>
									{this.state.weather}
								</Popup>
							</Marker>
						)
					})}
				</LeafletMap>
			</div>
		);
	};
};

export default AllLocations;
