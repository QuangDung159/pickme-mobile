import logger from 'redux-logger';

const { createStore, applyMiddleware } = require('redux');
const { default: RootReducer } = require('./reducers/RootReducer');

const store = createStore(RootReducer, applyMiddleware(logger));

export default store;
