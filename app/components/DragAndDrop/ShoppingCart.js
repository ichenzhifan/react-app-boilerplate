import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import constants from './constants';

// ShoppingCart DND spec
// 	'A plain object implementing the drop target specification'
// 	DropTarget Methods(All optional)
// 		- drop: called when a compatible item is dropped.
// 		- hover: called when an item is hovered over the component
// 		- canDrop: use it to specify whether the drop target is able to accept the item.
// 	
const ShoppingCartSpec = {
    drop() {
        return {
            name: 'ShoppingCart'
        };
    }
}

/**
 * ShoppingCart DropTarget - collect
 * @param  {object} connect An instance of DropTargetConnector, You use it to assign the drop target role to a DOM node.
 * @param  {object} monitor An instance of DropTargetMonitor, You use it to connect state from the React DnD to props
 *
 * Available functions to get state include:
 *  - canDrop()
 *  - isOver() 
 *  - didDrop()
 */
let collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

class ShoppingCart extends Component {

    render() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;

        let bgc = '#fff';

        if (isActive) {
            bgc = '#f7f7bd';
        } else if (canDrop) {
            bgc = '#f7f7f7';
        }

        const style = {
            backgroundColor: bgc
        };

        return connectDropTarget( < div className = 'shopping-cart'
            style = { style } > {
                isActive ? 'Hummmm, snack!' : 'Drag here to order'
            } < /div>
        );
    }
}

ShoppingCart.propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
};

// Notice that that the type parameter for the DropTarget higher-order wrapper refers to the type of drag
// sources that can be dragged to this component (in your case, ‘snack’).
export default DropTarget(constants.SNACK, ShoppingCartSpec, collect)(ShoppingCart);
