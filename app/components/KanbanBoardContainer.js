import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill';
import assign from 'object-assign';
import update from 'react-addons-update';

import { throttle } from './utils';

class KanbanBoardContainer extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            cards: []
        };

        this.API_HEADERS = {
            'Content-Type': 'application/json'
        };

        this.updateCardStatus = throttle(this.updateCardStatus.bind(this), 500);
        this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 500);
    }

    addCard(card) {
        let prevState = this.state;

        if (card.id === null) {
            let card = assign({}, card, { id: Date.now() });
        }

        let nextState = update(this.state.cards, { $push: [card] });

        this.setState({ cards: nextState });

        // Call the API to add the card on the server
        // fetch(`${API_URL}/cards`, {
        //         method: 'post',
        //         headers: API_HEADERS,
        //         body: JSON.stringify(card)
        //     }).then((response) => {
        //         if (response.ok) {
        //             return response.json();
        //         } else {
        //             throw new Error('Server response wasn\'t ok');
        //         }
        //     }).then((responseData) => {
        //         card.id = responseData.id;
        //         this.setState({ cards: nextState });
        //     })
        //     .catch((error) => {
        //         // rollback
        //         this.setState(prevState);
        //     });
    }

    updateCard(card) {
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((c) => c.id === card.id);

        // using the $set command, we will change the whole card.
        let nextState = update(this.state.cards, {
            [cardIndex]: { $set: card }
        });

        this.setState({cards: nextState});

        // Call the API to update the card on the server
        // fetch(`${API_URL}/cards/${card.id}`, {
        //     method:'put',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(card)
        // }).then(response =>{
        //     if(!response.ok){
        //         throw new Error('Server response was\'t ok');
        //     }
        // }).catch(error=>{
        //     this.setState(prevState);
        // });
    }

    updateCardStatus(cardId, status) {
        let cardIndex = this.state.cards.findIndex(card => card.id === cardId)

        let card = this.state.cards[cardIndex];

        if (card.status !== status) {
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: { $set: status }
                    }
                }
            }));
        }
    }

    updateCardPosition(cardId, afterId) {
        if (cardId !== afterId) {
            let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
            let card = this.state.cards[cardIndex];

            // find the index of the card the user is hovering over
            let afterIndex = this.state.cards.findIndex(card => card.id === afterId);

            // use splice to remove the card and reinsert it a the new index
            this.setState(update(this.state, {
                cards: {
                    $splice: [
                        [cardIndex, 1],
                        [afterIndex, 0, card]
                    ]
                }
            }));
        }
    }

    addTask(cardId, taskName) {
        // keep a reference to the old state and revert it back in case of problems
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex(card => card.id === cardId);

        let newTask = { id: Date.now(), name: taskName, done: false };

        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    $push: [newTask]
                }
            }
        });

        this.setState({ cards: nextState });

        // Call the API to add the task on the server
        // fetch(`${API_URL}/cards/${cardId}/tasks`, {
        //         method: 'post',
        //         headers: API_HEADERS,
        //         body: JSON.stringify(newTask)
        //     })
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         // When the server returns the definitive ID
        //         // used for the new Task on the server, update it on React
        //         newTask.id = responseData.id
        //         this.setState({ cards: nextState });
        //     }).catch(error=>{
        //      console.error('fetch error', error);
        //      this.setState(prevState);
        // });
    }


    deleteTask(cardId, taskId, taskIndex) {
        // keep a reference to the old state and revert it back in case of problems
        let prevState = this.state;

        // es6: findIndex
        // implemented by 'babel-polyfill'
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        // create a new object without the task.
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    $splice: [
                        [taskIndex, 1]
                    ]
                }
            }
        });

        // set the component state to the mutated object.
        this.setState({ cards: nextState });

        // Call the API to remove the task on the server
        // fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
        //     method: 'delete',
        //     headers: API_HEADERS
        // }).catch(error =>{
        //     console.error('fetch error', error);
        //     this.setState(prevState);
        // });
    }

    toggleTask(cardId, taskId, taskIndex) {
        // keep a reference to the old state and revert it back in case of problems
        let prevState = this.state;

        // find the index of card
        let cardIndex = this.state.cards.findIndex(card => card.id === cardId);

        let newDoneValue;

        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {
                            $apply: (done) => {
                                newDoneValue = !done;
                                return newDoneValue;
                            }
                        }
                    }
                }
            }
        });

        this.setState({ cards: nextState });

        // Call the API to toggle the task on the server
        // fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
        //     method: 'put',
        //     headers: this.API_HEADERS,
        //     body: JSON.stringify({ done: newDoneValue })
        // }).catch(error=>{
        //      console.error('fetch error', error);
        //      this.setState(prevState);
        // });
    }

    componentDidMount() {
        fetch('./data.json', this.API_HEADERS)
            .then(response => response.json())
            .then(json => {
                this.setState({ cards: json });
            });
    }

    render() {
        return ( < KanbanBoard cards = { this.state.cards }
            taskCallbacks = {
                {
                    add: this.addTask.bind(this),
                    delete: this.deleteTask.bind(this),
                    toggle: this.toggleTask.bind(this)
                }
            }
            cardCallbacks = {
                {
                    addCard: this.addCard.bind(this),
                    updateCard: this.updateCard.bind(this),
                    updateStatus: this.updateCardStatus,
                    updatePosition: this.updateCardPosition
                }
            }
            />
        );
    }
}

export default KanbanBoardContainer;
