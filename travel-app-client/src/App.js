import React, {Component} from 'react';
import './App.css';
import MyMap from './containers/MyMap/MyMap';
import {BrowserRouter} from 'react-router-dom';
import {Link, Route, Switch} from 'react-router-dom';
import AllLocations from './containers/AllLocations/AllLocations'
// import Button from './components/UI/Button/Button';


class App extends Component {
	state = {
		useDarkMode: false,
	}

	render() {
		let style = {
			'color':'green',
			'textDecoration':'none',
			'fontWeight':'bold',
		}
		return (
			<BrowserRouter>
				<header>
					<nav>
						<div id="navbar">
							<ul>
								<li><Link onClick={this.loadingHandler} style={style} to="/">Travel Locations</Link></li>
								<li><Link style={style} to="/all-locations">All Locations</Link></li>
								<li id="titlebar"><h2 style={{'textAlign':'center', 'display':'inline', 'float':'inline-start', 'position':'relative', 'left': '-16%'}}>React Travel App</h2></li>
							</ul>
						</div>
					</nav>
				</header>
				<div id="container" className="App">
					<Switch>
						<Route path="/all-locations" component={AllLocations} />
						<Route path="/" component={MyMap}/>
					</Switch>
					{/* <MyMap /> */}
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
