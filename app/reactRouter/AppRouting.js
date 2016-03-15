import React, {Component} from 'react';

// import some router component
import {Router, Route, Link} from 'react-router';

export default class AppRouting extends Component{
	// constructor(){
	// 	super(...arguments);

	// 	this.state = {
	// 		route: window.location.hash.substr(1)
	// 	};
	// }

	// componentDidMount(){
	// 	window.addEventListener('hashchange', ()=>{
	// 		this.setState({
	// 			route: window.location.hash.substr(1)
	// 		});
	// 	});
	// }

	render(){
		// let Child;

		// switch (this.state.route) {
		// 	case '/about':
		// 		Child = About;
		// 		break;
		// 	case '/repro':
		// 		Child = Repro;
		// 		break;
		// 	default:
		// 		Child = Home;
		// 		break;
		// }

		return (
			<div>
				<header>App Basic Routing</header>
				<ul>
					<li><Link to='/home' activeClassName='active'>Home</Link></li>
					<li><Link to='/repro' activeClassName='active'>Repro</Link></li>
					<li><Link to='/about' activeClassName='active'>About</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
}