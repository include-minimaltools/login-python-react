import React from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
	return (
		<Router>
			<Switch>
				<Route
					path="/login"
					component={Login}
				/>
				<Route
					path="/home"
					component={Home}
				/>
				<Route
					path="/"
					component={Login}
				/>
			</Switch>
		</Router>
	)

}

export default App