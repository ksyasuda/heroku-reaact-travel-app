import React from 'react';
import classes from './Location.module.css';
// import Name from '../../components/Name/Name';
// import Loc from '../../components/Loc/Loc';
// import Date from '../../components/Date/Date';

const location = (props) => {
	return (
		<div className={classes.Root}>
			{props.Name}
			{props.Datee}
			{props.Loc}
		</div>
	);
};

export default location;