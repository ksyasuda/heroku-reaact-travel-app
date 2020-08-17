import React from 'react';
import classes from './Name.module.css';

const name = (props) => {
	return (
		<h1>
			<button className={classes.Button} onClick={props.clicked}>
				<strong><span id="counter">{props.counter}.</span></strong>  {props.locName}
			</button>
		</h1>
	);
};

export default name;
// name.innerHTML = `<h1><button className={classes.Names} onClick={this.popupLinkHandler}><strong><span id="counter">${counter++}.</span></strong>  ${locName}</button></h1>`;