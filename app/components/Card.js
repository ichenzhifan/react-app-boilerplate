import React, { Component, PropTypes } from 'react';
import CheckList from './CheckList';
import marked from 'marked';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Link} from 'react-router';

// drag
import { DragSource, DropTarget } from 'react-dnd';
import constants from './constants';

const cardDragSpec = {
    beginDrag(props) {
        return {
            id: props.id
        };
    },

    endDrag(props){
    	// save the change to server.
    	//props.cardCallbacks.persistCardDrag(props.id, props.status);
    }
};

const cardDropSpec = {
	hover(props, monitor){
		const draggedId = monitor.getItem().id;
		props.cardCallbacks.updatePosition(draggedId, props.id);
	}
};

let collectDrag = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource()
    };
};

let collectDrop = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget()
	};
};

class Card extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            showDetails: true
        };

        //this.toggleCardHandler = this.toggleCardHandler.bind(this);
    }

    toggleCardHandler(e) {
        this.setState({ showDetails: !this.state.showDetails });
    }

    createMarkup() {
        return {
            __html: marked(this.props.description)
        };
    }

    render() {
    	const {connectDragSource, connectDropTarget} = this.props;

        let sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        };

        let cardDetail;
        if (this.state.showDetails) {
            cardDetail = ( < div className = "card-details" >
                < div > < /div>						 < CheckList cardId = { this.props.id }
                tasks = { this.props.tasks }
                taskCallbacks = { this.props.taskCallbacks }
                /> < /div>
            );
        }

        return connectDropTarget(connectDragSource( < div className = 'card' >
            <div style = { sideColor }/> 
            <div className='card-edit'>
                <Link to={'/edit/' + this.props.id}>&#9998;</Link>
            </div>
            { /*Apply different style for cared opened/closed*/ } 
            <div className = { this.state.showDetails ? 'card-title card-title-is-open' : 'card-title' }
                onClick = { this.toggleCardHandler.bind(this) }> { this.props.title } </div>            
                	<ReactCSSTransitionGroup transitionName = 'toggle'
    			            transitionEnterTimeout = { 250 }
    			            transitionLeaveTimeout = { 250 } >
    			          { cardDetail } 
    		        </ReactCSSTransitionGroup>	           
            </div>
        ));
    }
}

Card.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
};

const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(Card);
const dragDropHighOrderCard = DropTarget(constants.CARD, cardDropSpec, collectDrop)(dragHighOrderCard);

export default dragDropHighOrderCard;
