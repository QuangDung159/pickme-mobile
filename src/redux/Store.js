const { createStore } = require('redux');
const { default: RootReducer } = require('./reducers/RootReducer');

const store = createStore(RootReducer);
store.subscribe(() => {
    console.log('STORE UPDATED: ', store.getState());
});

export default store;
