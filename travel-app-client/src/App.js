import React, { Component } from "react";
import "./App.css";
import MyMap from "./containers/MyMap/MyMap";
import { BrowserRouter } from "react-router-dom";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import AllLocations from "./containers/AllLocations/AllLocations";
import classes from "./app.module.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import MapIcon from "@material-ui/icons/Map";
import WebIcon from "@material-ui/icons/Web";

class App extends Component {
	state = {
		useDarkMode: false,
		showMenu: false,
		anchorEl: null,
	};

	handleClose = () => {
		console.log("closing menu");
		this.setState({ showMenu: false });
	};

	handleClick = (event) => {
		console.log("handling click");
		this.setState({ showMenu: true, anchorEl: event.currentTarget });
	};

	render() {
		const style = {
			padding: "10px",
			marginTop: "5px",
			marginRight: "15px",
			marginBottom: "5px",
			color: "#e6761c",
			fontWeight: "bold",
		};
		return (
			<BrowserRouter>
				<header>
					<nav>
						<AppBar
							position="static"
							style={{ backgroundColor: "rebeccapurple" }}
						>
							<div className={classes.Container}>
								<h1 className={classes.Title}>
									<Link
										to="/"
										className={classes.Link}
										style={{
											color: "dodgerblue",
											position: "relative",
											top: "26%",
										}}
									>
										Sudacode Travel App
									</Link>
								</h1>
								<Toolbar style={{ height: "15vh" }}>
									<Link
										to="/"
										className={classes.Link}
										style={{
											color: "#e6761c",
											fontWeight: "bold",
										}}
									>
										<Button
											style={style}
											color="primary"
											variant="outlined"
											startIcon={<AddLocationIcon />}
										>
											Search/Locate
										</Button>
									</Link>
									<Link
										className={classes.Link}
										to="/all-locations"
										style={{
											color: "#e6761c",
											fontWeight: "bold",
										}}
									>
										<Button
											style={style}
											color="primary"
											variant="outlined"
											startIcon={<MapIcon />}
										>
											All Locations
										</Button>
									</Link>
									<Button
										style={style}
										color="primary"
										variant="outlined"
										startIcon={<WebIcon />}
										onClick={() => (
											<Redirect to="https://ww.sudacode.com" />
										)}
									>
										<a
											className={classes.ToWebsite}
											style={{
												textDecoration: "none",
												fontWeight: "bold",
												color: "#e6761c",
											}}
											href="https://www.sudacode.com"
										>
											To Website
										</a>
									</Button>
								</Toolbar>
							</div>
						</AppBar>
						{/* <div id='navbar'>
							<ul>
								<li className='chrome'>
									<Link
										onClick={this.loadingHandler}
										style={style}
										to='/'
									>
										Travel Locations
									</Link>
								</li>
								<li className='chrome'>
									<Link style={style} to='/all-locations'>
										All Locations
									</Link>
								</li>
								<li className='chrome' id='titlebar'>
									<h2 className='chrome-title'>
										React Travel App
									</h2>
								</li>
								<li className='website'>
									<a
										style={{
											textDecoration: "none",
											color: "green",
											fontWeight: "bold",
											fontSize: "regular",
										}}
										// href="http://localhost:8000"
										href='https://website-966f5.web.app/'
									>
										Go to Website
									</a>
								</li>
							</ul>
						</div> */}
					</nav>
				</header>
				<div id="container" className="App">
					<Switch>
						<Route path="/all-locations" component={AllLocations} />
						{/* <Route
							path="/website"
							component={() => {
								window.location = "http://localhost:8000";
								return null;
							}}
						/> */}
						<Route path="/" component={MyMap} />
					</Switch>
					{/* <MyMap /> */}
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
