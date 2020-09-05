import React from "react"
import classes from "./Loc.module.css"

const loc = props => {
	// loc.innerHTML = `<p><strong>Latitude:</strong> <span id="lat" className={classes.Lat}>${item.lat}</span> <strong>|</strong> <strong>Longitude:</Strong> <span className={classes.Lng} id="lon">${item.lng}</span>`;
	return (
		<p className={classes.Container}>
			<span style={{ color: "rgb(189, 140, 72)" }}>
				<strong>Latitude:</strong>
			</span>{" "}
			<span id='lat' className={classes.Lat}>
				{props.lat}
			</span>{" "}
			<strong>|</strong>{" "}
			<span style={{ color: "rgb(189, 140, 72)" }}>
				<strong>Longitude:</strong>
			</span>{" "}
			<span className={classes.Lng} id='lon'>
				{props.lng}
			</span>
		</p>
	)
}

export default loc
