import React, { Component } from "react"
import * as ReactLeaflet from "react-leaflet"
import axios from "axios"
// import Button from '../../components/UI/Button/Button';
import Button from "@material-ui/core/Button"
import classes from "./AllLocations.module.css"
import { Redirect } from "react-router-dom"
import Spinner from "../../components/UI/Spinner/Spinner"
import Name from "../../components/Name/Name"
import Dates from "../../components/Dates/Dates"
import Loc from "../../components/Loc/Loc"
import Location from "../Location/Location"

const { Map: LeafletMap, TileLayer, Marker, Popup, FeatureGroup } = ReactLeaflet

class AllLocations extends Component {
	state = {
		lat: 37,
		lng: -100,
		markers: [],
		places: new Map(),
		markerGroup: [],
		weather: null,
		popup: false,
		redirect: false,
		nodes: [],
		loading: null,
		spinner: false,
		locations: [],
		dropdown: [],
	}

	popup = async (lat, lng) => {
		let message = this.state.weather
		let loading = this.state.loading
		loading = (
			<Popup
				position={[lat, lng]}
				onOpen={this.loadingHandler}
				onClose={this.finishLoadingHandler}
			>
				{<Spinner />}
			</Popup>
		)
		this.setState({ loading: loading, spinner: true })
		const response = await axios.get(`/weather/${lat},${lng}`)
		// console.log(response);
		let temp = response.data.current.feels_like
		let weather = response.data.current.weather[0].description
		message = `The temperature is currently ${temp} with ${weather}`
		this.setState({
			weather: message,
			popup: true,
			loading: null,
			spinner: false,
		})
	}

	popupCloseHandler = () => {
		if (this.state.weather !== null && this.state.weather !== undefined) {
			let message = this.state.weather
			message = null
			this.setState({ weather: message, popup: false })
		}
	}

	setMarkers = () => {
		let ctr = 1
		let markers = [...this.state.markers]
		let group = [...this.state.markerGroup]
		let lat, lng
		for (let elt of markers) {
			;[lat, lng] = elt
			let marker = (
				<Marker position={[lat, lng]} key={ctr++}>
					<Popup onOpen={event => this.popup(event)}>A popup</Popup>
				</Marker>
			)
			group.push(marker)
		}
		this.setState({ markerGroup: group, popup: true })
		// console.log('markers set');
		// console.log(this.state.markerGroup);
	}

	popupLinkHandler = event => {
		event.preventDefault()
		console.log("popup")
		console.log(event.target)
		let temp = event.target.children[0].children[0].innerText.substr(0, 1)
		// console.log(parseInt(temp, 10));
		let marker = this.state.markers[temp - 1]
		//! find a way to set a popup from the click`
		// this.popup(parseFloat(marker[0], 10), parseFloat(marker[1], 10));
		// console.log(this.state.markerGroup)
	}

	componentDidMount = () => {
		// this.addEventListener();
		// console.log('All-locations MOUNT');
		let url = `/loc`
		axios.get(url).then(response => {
			// console.log('response', response);
			if (response.data.length < 1) return
			// console.log('right after the get call');
			let data = response.data
			// console.log(response);
			let lat, lng, locName, place_id, time, shortName
			let counter = 1
			let markers = [...this.state.markers]
			let nodes = [...this.state.nodes]
			let locations = [...this.state.locations]
			let dropdown = [...this.state.dropdown]
			for (let item of data) {
				// console.log('item', item);
				lat = item.lat
				lng = item.lng
				locName = item.locName
				place_id = item.place_id
				time = item.time
				shortName = item.shortName
				let places = this.state.places
				// let root = document.createElement('div');
				// let loc = document.createElement('div');
				// let date = document.createElement('div');
				// let br = document.createElement('div');
				// let name = document.createElement('div');
				// let ctr = document.createElement('div');
				// loc.innerHTML = `<p><strong>Latitude:</strong> <span id="lat" className={classes.Lat}>${item.lat}</span> <strong>|</strong> <strong>Longitude:</Strong> <span className={classes.Lng} id="lon">${item.lng}</span>`;
				let locs = <Loc lat={lat} lng={lng} />
				let namee = (
					<Name
						clicked={event => this.popupLinkHandler(event)}
						counter={counter}
						locName={locName}
					/>
				)
				// name.innerHTML = `<h1><strong><span id="counter">${counter++}.</span></strong>  ${locName}</h1>`;
				// name = <Name clicked={this.popupLinkHandler} counter={counter++} locName={locName}/>
				// br.innerHTML = '<br/>';
				const dateStr = new Date(time).toLocaleString()
				let temp = dateStr.split(",")
				const day = temp[0]
				const timee = temp[1]
				const newStr = `${timee} on ${day}`
				let datee = <Dates time={timee} day={day} />
				// let datee = <Dates str={newStr}/>;
				// date.innerHTML = `<p><strong>${newStr}</strong></p>`
				// loc.className = classes.Location;
				// name.className = classes.Name;
				// date.className = classes.Date;
				// root.className = classes.root;
				// root.id = item.shortName;
				// root.append(name, date, br, loc, br);
				// nodes.push(root);
				// document.body.append(root);
				let l = (
					<Location
						key={counter}
						Datee={datee}
						Loc={locs}
						Name={namee}
					/>
				)
				locations.push(l)
				let latlng = [lat, lng]
				let elt = `${counter++}.  ${shortName}`
				dropdown.push(elt)
				// let marker = (
				// 	<Marker position={[lat,lng]} key={time}>
				// 		<Popup onOpen={(event) => this.popup(event)}>
				// 		</Popup>
				// 	</Marker>
				// );
				markers.push(latlng)
			}
			this.setState({
				markers: markers,
				locations: locations,
				dropdown: dropdown,
			})
			// this.setMarkers();
			// this.setGroup();
		})
		// console.log(this.state.markers, this.state.nodes);
	}

	componentWillUnmount = () => {
		// console.log('[componentWillUnmount] start');
		//* clears the text elements from the dom
		let x = document.getElementsByClassName("all-locations")
		let ctr = 0
		// let markers = this.state.markers;
		//! might be orphaning nodes here and need to recursively or iteratively remove all nodes in the chain
		let markers = [...this.state.markers]
		for (let i = 0; i < markers.length; ++i) {
			markers.pop()
		}
		while (x[ctr]) {
			// console.log(x);
			x[ctr].parentNode.removeChild(x[ctr])
		}
		this.setState({ markers: markers })
		// console.log('[componentWillUnmount] end');
	}

	onViewportChangedHandler = viewport => {
		if (this.state.popup) return
		// console.log(viewport);
		let lat = this.state.lat
		let lng = this.state.lng
		let zoom = this.state.zoom
		lat = viewport.center[0]
		lng = viewport.center[1]
		zoom = viewport.zoom
		this.setState({ lat: lat, lng: lng, zoom: zoom })
	}

	onRemoveDataHandler = async () => {
		if (this.state.markers.length < 1) return
		const response = await axios.post("/remove-all", {})
		console.log(response)
		// document.location.reload();
		// console.log(this.state.redirect)
		this.setState({ redirect: true })
	}

	onRemoveEltHandler = async () => {
		if (this.state.markers.length < 1) return
		let stuff = document.getElementById("select-num")
		let num = parseInt(stuff.value, 10)
		// console.log('num', num);
		// console.log(stuff.value);
		const data = { entryNum: num }
		const response = await axios.post(`/remove-elt`, data)
		console.log(response)
		// this.props.history.push('/');
		// document.location.reload(true);
		this.setState({ redirect: true })
	}

	render() {
		// console.log(this.state.markerGroup);
		let ctr = 1
		let counter = 1
		return (
			<div id='map-container'>
				<h2>All Locations</h2>
				{this.state.redirect ? <Redirect to='/' exact /> : null}
				<LeafletMap
					id='map'
					onViewportChanged={viewport =>
						this.onViewportChangedHandler(viewport)
					}
					worldCopyJump={true}
					center={[this.state.lat, this.state.lng]}
					zoom={3}
					style={{
						width: "80%",
						position: "relative",
						left: "10%",
						border: "1px solid hotpink",
					}}
				>
					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
					/>
					{this.state.markers.length > 0
						? this.state.markers.map(marker => {
								{
									/* console.log(this.state.markers.length); */
								}
								{
									/* console.log(this.state.markers, this.state.nodes); */
								}
								return (
									<Marker
										position={[marker[0], marker[1]]}
										key={ctr++}
									>
										<Popup
											onClose={this.popupCloseHandler}
											onOpen={() =>
												this.popup(marker[0], marker[1])
											}
										>
											{this.state.spinner
												? this.state.loading
												: this.state.weather}
										</Popup>
									</Marker>
								)
						  })
						: null}
				</LeafletMap>
				<form className={classes.Form}>
					<Button
						color='primary'
						variant='contained'
						className={classes.Button}
						disabled={false}
						style={{
							position: "relative",
							height: "40px",
							width: "45%",
							left: "9px",
							color: "#e6761c",
							fontWeight: "bold",
							marginRight: "5px",
							marginTop: "10px",
							padding: "5px",
						}}
						id='delete'
						onClick={this.onRemoveDataHandler}
					>
						Delete all Data
					</Button>
					<Button
						color='primary'
						variant='contained'
						className={classes.Button}
						onClick={this.onRemoveEltHandler}
						type='button'
						style={{
							color: "#e6761c",
							fontWeight: "bold",
							marginTop: "10px",
							padding: "5px",
						}}
					>
						Delete Entry By Number
					</Button>
					<br />
					<select
						id='select-num'
						name='select-num'
						className={classes.Select}
					>
						{this.state.dropdown.length > 0
							? this.state.dropdown.map(elt => {
									{
										/* console.log(elt); */
									}
									let temp = elt.split(".")
									let val = parseInt(temp[0], 10)
									return (
										<option
											key={val}
											className={classes.Option}
											name='select'
											value={val++}
										>
											{elt}
										</option>
									)
									{
										/* return (<option key={num} className={classes.Option} name="select" value={inum}>{`${num} ${name}`}</option>); */
									}
							  })
							: null}
					</select>
				</form>
				{this.state.locations}
			</div>
		)
	}
}

export default AllLocations
