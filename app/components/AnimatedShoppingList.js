import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import update from 'react-addons-update';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class AnimatedShoppingList extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            items: [
                { id: 1, name: 'milk' },
                { id: 2, name: 'yoyo' },
                { id: 3, name: 'juice' }
            ]
        };
    }

    handleChange(ev) {
        if (ev.key === 'Enter') {
            let newItem = {
                id: Date.now(),
                name: ev.target.value
            };

            ev.target.value = '';

            let nextState = update(this.state.items, { $push: [newItem] });
           
            this.setState({items: nextState});
        }
    }

    handleRemove(i) {
        let nextState = update(this.state.items, {
            $splice: [
                [i, 1]
            ]
        });
       
        this.setState({items: nextState});
    }

    render(){
    	let shoppingItems = this.state.items.map((item, i) => {
    		return (
    			<div key={item.id}
    				className='item'
    				onClick={this.handleRemove.bind(this, i)}>{item.name}</div>
    		);
    	});
    	return (
    		<div>
    			<ReactCSSTransitionGroup transitionName='example'
    									 transitionEnterTimeout={300}
    									 transitionLeaveTimeout={300}
    									 transitionAppear={true}
    									 transitionAppearTimeout={300}>
    				{shoppingItems}
    			</ReactCSSTransitionGroup>
    			
    			<input type='text' value={this.state.newItem} onKeyDown={this.handleChange.bind(this)} />    			
    		</div>
    	);
    }
}

export default AnimatedShoppingList;