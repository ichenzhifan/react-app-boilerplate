import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class CheckList extends Component{

	checkInputKeyPress(ev){
		if(ev.key === 'Enter'){
			this.props.taskCallbacks.add(this.props.cardId, ev.target.value);
			ev.target.value = '';
		}
	}

	render(){
		let tasks = this.props.tasks.map((task,index) =>
			<li className="checklist-task" key={task.id}>
				<input type="checkbox" defaultChecked={task.done} onChange={
						this.props.taskCallbacks.toggle.bind(this, this.props.cardId, task.id, index)					
				}/>
				{task.name}
				<a href="#" className="checklist-task-remove" onClick={
					this.props.taskCallbacks.delete.bind(this, this.props.cardId, task.id, index)
				}></a>
			</li>
		);

		return (
			<div className="checklist">
				<ul>					
					<ReactCSSTransitionGroup transitionName="task"
											transitionEnterTimeout={250}
											transitionLeaveTimeout={250}
											transitionAppear={false}
											transitionAppearTimeout={250}>
						{tasks}
					</ReactCSSTransitionGroup>							
				</ul>
				<input type='text'
					className='checklist-add-task'
					placeholder='Type then hit Enter to add a task'
					onKeyPress={this.checkInputKeyPress.bind(this)}
					/>
			</div>
		);
	}
}

CheckList.propTypes = {
 cardId: PropTypes.number,
 tasks: PropTypes.arrayOf(PropTypes.object)
};

export default CheckList;