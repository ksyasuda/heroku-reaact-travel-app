import React from 'react';
import classes from './Loc.module.css';

const loc = (props) => {
	// loc.innerHTML = `<p><strong>Latitude:</strong> <span id="lat" className={classes.Lat}>${item.lat}</span> <strong>|</strong> <strong>Longitude:</Strong> <span className={classes.Lng} id="lon">${item.lng}</span>`;
	return (
		<p className={classes.Container}>
			<strong>Latitude:</strong>  <span id="lat" className={classes.Lat}>{props.lat}</span> <strong>|</strong> <strong>Longitude:</strong> <span className={classes.Lng} id="lon">{props.lng}</span>
		</p>
	);
};

export default loc;