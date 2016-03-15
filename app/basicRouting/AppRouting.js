import React, {Component} from 'react';


import About from './About';
import Home from './Home';
import Repro from './Repro';

export default class AppRouting extends Component{
	constructor(){
		super(...arguments);

		this.state = {
			route: window.location.hash.substr(1)
		};
	}

	componentDidMount(){
		window.addEventListener('hashchange', ()=>{
			this.setState({
				route: window.location.hash.substr(1)
			});
		});
	}

	render(){
		let Child;

		switch (this.state.route) {
			case '/about':
				Child = About;
				break;
			case '/repro':
				Child = Repro;
				break;
			default:
				Child = Home;
				break;
		}

		return (
			<div>
				<header>App Basic Routing</header>
				<ul>
					<li><a href='#/home'>Home</a></li>
					<li><a href='#/repro'>Repro</a></li>
					<li><a href='#/about'>About</a></li>
				</ul>
				<Child />
			</div>
		);
	}
}