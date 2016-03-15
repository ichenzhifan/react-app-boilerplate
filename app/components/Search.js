import React, {Component} from 'react';

class Search extends Component{
	constructor(){
		super(...arguments);

		this.state = {
			searchTerm: 'react'
		};
	}

	onChangeHandle(event){
		this.setState({
			searchTerm: event.target.value
		});
	}

	render(){
		return (
			<div>
				Search Term: 
				<input type='search' 
					value={this.state.searchTerm} 
					onChange={this.onChangeHandle.bind(this)}/>
			</div>
		);
	}
}

export default Search;