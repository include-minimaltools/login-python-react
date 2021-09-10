import React from 'react';
import Home from './components/Home';
import Login from './components/Login';

import {
	BrowserRouter as Router,
	Route,
	Switch
} from "react-router-dom";



function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Login} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/home" component={Home} />
			</Switch>
		</Router>
	)

}

export default App;