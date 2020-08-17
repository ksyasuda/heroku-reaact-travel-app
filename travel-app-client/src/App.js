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
								<li className="chrome"><Link onClick={this.loadingHandler} style={style} to="/">Travel Locations</Link></li>
								<li className="chrome"><Link style={style} to="/all-locations">All Locations</Link></li>
								<li className="chrome" id="titlebar"><h2 className="chrome-title">React Travel App</h2></li>
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
