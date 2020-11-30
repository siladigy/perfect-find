import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from './authReducer';
import addProjectReducer from './addProjectReducer';
import allProjectsReducer from './allProjectsReducer';
import projectDetailReducer from './projectDetailReducer';
import messagesReducer from './messagesReducer';
import contactsReducer from './contactsReducer';
import thunkMiddleware from "redux-thunk";
import { firebaseReducer } from 'react-redux-firebase'
import { getFirebase } from 'react-redux-firebase'
 
let reducers  = combineReducers({
    auth: authReducer,
    addProject: addProjectReducer,
    allProjects: allProjectsReducer,
    projectDetail: projectDetailReducer,
    messages: messagesReducer,
    contacts: contactsReducer
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

window.store = store; 

export default store;