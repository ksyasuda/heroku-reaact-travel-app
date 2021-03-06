import React, { Component } from "react"
import * as ReactLeaflet from "react-leaflet"
// import Button from "../../components/UI/Button/Button"
import Button from "@material-ui/core/Button"
import Success from "../../components/Success/Success"
import axios from "axios"
import Spinner from "../../components/UI/Spinner/Spinner"
import classes from "./MyMap.module.css"

const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet

class MyMap extends Component {
	constructor() {
		super()
		this.state = {
			lat: 37,
			lng: -100,
			zoom: 3,
			markers: [],
			counter: 1,
			locName: null,
			shorName: null,
			place_id: null,
			success: null,
			uploading: false,
			opacity: 1,
		}
	}
	// state = {
	// 	lat: null,
	// 	lng: null,
	// 	zoom: null
	// }

	getLocation = () => {
		if ("geolocation" in navigator) {
			// console.log('geolocation available');
			navigator.geolocation.getCurrentPosition(async position => {
				let lat = position.coords.latitude.toFixed(4)
				let lng = position.coords.longitude.toFixed(4)
				document.getElementById("lat").innerText = lat
				document.getElementById("lng").innerText = lng
				// [lat, lon] = [37.636845, -118.986252]; //Mammoth Mtn
				let geocodingUrl = `geocode-location/${lat},${lng}`
				// console.log(geocodingUrl);
				let loading = this.state.loading
				loading = (
					<Popup
						className={classes.Popup}
						position={[lat, lng]}
						onOpen={this.loadingHandler}
						onClose={this.finishLoadingHandler}
					>
						{<Spinner />}
					</Popup>
				)
				this.setState({ loading: loading })
				console.log("getting location")
				const response = await axios.get(geocodingUrl)
				console.log(response)
				let nice
				if (response.data.results.length === 0) {
					nice = response.data.plus_code.compound_code
				} else {
					nice = response.data.results[0].formatted_address
				}
				console.log("location found", nice)
				this.setState({ loading: null })
				// console.log(response.data.results[0].formatted_address);
				// console.log(response);
				const address = nice
				// console.log(response.data.results[0].address_components);
				// const shortName = response.data.results[0].address_components[0].long_name;
				let temp = address.split(",")
				let shortName
				//! street, location, state/zip, country
				if (temp.length === 4) {
					shortName = temp[1] //location
				}
				//! location, state/zip, country
				else if (temp.length < 4) {
					shortName = temp[0]
				}
				const id =
					response.data.results[0].place_id ||
					response.data.plus_code.global_code
				// console.log(lat, lng);
				this.setState({
					lat: lat,
					lng: lng,
					locName: address,
					place_id: id,
					shortName: shortName,
				})
				setTimeout(() => {
					// console.log('setting state in getLocation()');
					if (this.state.markers.length < 1) this.setMarker()
					else this.moveMarker()
				}, 1)
			})
		} else {
			console.log("geolocation not available")
		}
	}

	setMarker = () => {
		let position = [this.state.lat, this.state.lng]
		let x = <Marker position={position} key={this.state.counter} />
		let markers = [...this.state.markers]
		markers.push(x)
		this.setState({ markers: markers })
	}

	moveMarker = () => {
		let position = [this.state.lat, this.state.lng]
		let x = <Marker position={position} key={this.state.counter} />
		let markers = [this.state.markers]
		markers.pop()
		markers.push(x)
		this.setState({ markers: markers })
	}

	setLocation = (lat, lng, name, id, shortName) => {
		this.setState({
			lat: lat,
			lng: lng,
			locName: name,
			place_id: id,
			shortName: shortName,
		})
		if (this.state.markers.length < 1) {
			this.setMarker()
		} else {
			this.moveMarker()
		}
	}

	onSearchHandler = async () => {
		let data = document.getElementById("searchbox")
		// console.log(data.value);
		let nice = data.value.split(" ")
		// console.log(nice);
		let address = nice[0]
		for (let i = 1; i < nice.length; ++i) {
			address += "+" + nice[i]
		}
		// console.log(address);
		let url = `geocode-address/${address}`
		let loading = this.state.loading
		loading = (
			<Popup
				className={classes.Popup}
				position={[this.state.lat, this.state.lng]}
				onOpen={this.loadingHandler}
				onClose={this.finishLoadingHandler}
			>
				{<Spinner />}
			</Popup>
		)
		this.setState({ loading: loading })
		const response = await axios.get(url)
		this.setState({ loading: null })
		// console.log(response);
		let lat, lng, name, place_id, shortName
		if (response.data) {
			lat = response.data.results[0].geometry.location.lat
			lng = response.data.results[0].geometry.location.lng
			name = response.data.results[0].formatted_address
			place_id = response.data.results[0].place_id
			console.log(response.data.results)
			let temp = name.split(",")
			//! street, location, state/zip, country
			if (temp.length === 4) {
				shortName = temp[1] //location
			}
			//! location, state/zip, country
			else if (temp.length < 4) {
				shortName = temp[0]
			}
			// shortName = response.data.results[0].address_components[0].long_name;
			this.setLocation(lat, lng, name, place_id, shortName)
		}
	}

	clearState = () => {
		let markers = [this.state.markers]
		let id = this.state.place_id
		id = null
		let name = this.state.locName
		name = null
		let c = this.state.counter
		c = 1
		for (let i = 0; i < markers.length; ++i) {
			markers.pop()
		}
		this.setState({
			place_id: id,
			locName: name,
			counter: c,
			markers: markers,
		})
		// console.log('State cleared');
	}

	onSendHandler = async () => {
		if (this.state.markers.length < 1) return
		let lat = this.state.lat
		let lng = this.state.lng
		const time = Date.now()
		const locName = this.state.locName
		const place_id = this.state.place_id
		const entryNum = this.state.counter
		const shortName = this.state.shortName
		const data = { locName, shortName, place_id, lat, lng, time, entryNum }
		console.log("fetching")
		let loading = this.state.loading
		loading = (
			<Popup
				className={classes.Popup}
				position={[lat, lng]}
				onOpen={this.loadingHandler}
				onClose={this.finishLoadingHandler}
			>
				{<Spinner />}
			</Popup>
		)
		this.setState({ loading: loading })
		const response = await axios.post("/api", data)
		console.log(response)
		this.clearState()
		let success = this.state.success
		// success = <Success />;
		success = <Spinner />
		this.setState({
			success: success,
			counter: this.state.counter + 1,
			loading: null,
		})
		setTimeout(() => {
			let s = this.state.success
			s = null
			this.setState({ success: s })
		}, 1000)
	}

	onZoomHandler = () => {
		if (this.state.markers.length < 1) return
		let zoom = this.state.zoom
		zoom = 12
		this.setState({ zoom: zoom })
	}

	render() {
		let style = {
			color: "#e6761c",
			fontWeight: "bold",
			padding: "10px",
			marginTop: "15px",
			marginLeft: "10px",
		}
		// const position = [this.state.lat, this.state.lng];
		return (
			<div>
				<h2 style={{ color: "rgb(189, 140, 72)" }}>
					Find/Search Locations
				</h2>
				<LeafletMap
					center={[this.state.lat, this.state.lng]}
					zoom={this.state.zoom}
					style={{
						width: "80%",
						position: "relative",
						left: "10%",
						border: "1px solid hotpink",
					}}
				>
					<TileLayer
						opacity={this.state.opacity}
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
					/>
					{/* <Marker position={position}>
				<Popup>
					NICE
				</Popup>
				</Marker> */}
					{this.state.loading}
					{this.state.markers}
				</LeafletMap>
				{/* {this.state.success} */}
				<Button
					color='primary'
					variant='contained'
					onClick={this.getLocation}
					className={classes.Buttons}
					style={style}
				>
					Find Location
				</Button>
				<Button
					color='primary'
					variant='contained'
					onClick={this.onSendHandler}
					className={classes.Buttons}
					style={style}
				>
					Send It!
				</Button>
				<Button
					color='primary'
					variant='contained'
					onClick={this.onZoomHandler}
					className={classes.Buttons}
					style={style}
				>
					Zoom In
				</Button>
				<h2 style={{ color: "rgb(189, 140, 72)" }}>
					Or Search For A Location Below
				</h2>
				<form
					id='searchForm'
					type='text'
					onSubmit={this.onSearchHandler}
				>
					<input
						type='text'
						style={{ width: "20%" }}
						id='searchbox'
						name='serach'
					/>
					<br />
					<Button
						onClick={this.onSearchHandler}
						variant='contained'
						id='send'
						color='primary'
						style={{ marginTop: "10px", color: "#e6761c" }}
					>
						Search
					</Button>
				</form>
				<p
					style={{
						fontWeight: "bold",
						fontSize: "larger",
						color: "rgb(132, 134, 115)",
					}}
				>
					Latitude: <span id='lat'>{this.state.lat}</span>
				</p>
				<p
					style={{
						fontWeight: "bold",
						fontSize: "larger",
						color: "rgb(132, 134, 115)",
					}}
				>
					Longitude: <span id='lng'>{this.state.lng}</span>
				</p>
			</div>
		)
	}
}

export default MyMap
